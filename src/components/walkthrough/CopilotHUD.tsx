'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Mic, MicOff, AlertTriangle, HelpCircle, Sparkles } from 'lucide-react';
import { analyzeWalkthroughChunk } from '@/actions/analyzeWalkthrough';

type CopilotAlert = {
	type: 'risk' | 'question' | 'upsell' | 'note';
	title: string;
	message: string;
	priority?: 'low' | 'medium' | 'high';
};

type CopilotHUDProps = {
	projectId: string;
};

const CHUNK_WORD_TARGET = 45;

function getSpeechRecognitionConstructor() {
	if (typeof window === 'undefined') return null;

	return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

type BackendWalkthroughAlert = {
	type: 'risk' | 'missing_question' | 'scope_dependency' | 'margin_protection';
	message: string;
	severity?: 'low' | 'medium' | 'high';
	suggested_action?: string;
};

function normalizeWalkthroughAlert(
	alert: BackendWalkthroughAlert,
): CopilotAlert {
	const typeMap: Record<BackendWalkthroughAlert['type'], CopilotAlert['type']> =
		{
			risk: 'risk',
			missing_question: 'question',
			scope_dependency: 'note',
			margin_protection: 'risk',
		};

	const titleMap: Record<BackendWalkthroughAlert['type'], string> = {
		risk: 'Potential Risk',
		missing_question: 'Missing Question',
		scope_dependency: 'Scope Dependency',
		margin_protection: 'Margin Protection',
	};

	const message = alert.suggested_action
		? `${alert.message} Suggested action: ${alert.suggested_action}`
		: alert.message;

	return {
		type: typeMap[alert.type],
		title: titleMap[alert.type],
		message,
		priority: alert.severity,
	};
}

function getAlertIcon(type: CopilotAlert['type']) {
	if (type === 'risk') return <AlertTriangle className="h-4 w-4" />;
	if (type === 'question') return <HelpCircle className="h-4 w-4" />;
	return <Sparkles className="h-4 w-4" />;
}

export default function CopilotHUD({ projectId }: CopilotHUDProps) {
	const [isListening, setIsListening] = useState(false);
	const [isSupported, setIsSupported] = useState(true);
	const [liveTranscript, setLiveTranscript] = useState('');
	const [finalTranscript, setFinalTranscript] = useState('');
	const [alerts, setAlerts] = useState<CopilotAlert[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const chunkBufferRef = useRef('');
	const shouldRestartRef = useRef(false);

	useEffect(() => {
		const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();

		if (!SpeechRecognitionConstructor) {
			window.setTimeout(() => {
				setIsSupported(false);
				setError('Speech recognition is not supported in this browser.');
			}, 0);

			return;
		}

		const recognition = new SpeechRecognitionConstructor();

		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'en-US';

		recognition.onstart = () => {
			setIsListening(true);
			setError(null);
		};

		recognition.onerror = event => {
			console.error('Speech recognition error:', event.error, event.message);

			if (event.error === 'not-allowed') {
				setError('Microphone permission was denied.');
				shouldRestartRef.current = false;
				setIsListening(false);
				return;
			}

			setError(`Speech recognition error: ${event.error}`);
		};

		recognition.onend = () => {
			setIsListening(false);

			if (shouldRestartRef.current) {
				try {
					recognition.start();
				} catch {
					// Ignore duplicate start errors.
				}
			}
		};

		recognition.onresult = event => {
			let interim = '';
			let newlyFinal = '';

			for (let i = event.resultIndex; i < event.results.length; i += 1) {
				const result = event.results[i];
				const transcript = result[0]?.transcript ?? '';

				if (result.isFinal) {
					newlyFinal += `${transcript} `;
				} else {
					interim += transcript;
				}
			}

			if (interim) {
				setLiveTranscript(interim.trim());
			}

			if (!newlyFinal.trim()) return;

			const finalText = newlyFinal.trim();

			setFinalTranscript(current => `${current} ${finalText}`.trim());

			chunkBufferRef.current = `${chunkBufferRef.current} ${finalText}`.trim();

			const wordCount = chunkBufferRef.current
				.split(/\s+/)
				.filter(Boolean).length;

			if (wordCount >= CHUNK_WORD_TARGET) {
				const chunk = chunkBufferRef.current;
				chunkBufferRef.current = '';
				analyzeChunk(chunk);
			}
		};

		recognitionRef.current = recognition;

		return () => {
			shouldRestartRef.current = false;
			recognition.abort();
			recognitionRef.current = null;
		};
	}, [projectId]);

	function analyzeChunk(chunk: string) {
		startTransition(async () => {
			try {
				const result = await analyzeWalkthroughChunk(chunk);

				if (!result?.success) {
					console.error('Walkthrough analysis failed:', result);
					return;
				}

				if (!Array.isArray(result.alerts) || result.alerts.length === 0) {
					return;
				}

				const newAlerts = result.alerts.map(normalizeWalkthroughAlert);

				setAlerts(current => [...newAlerts, ...current].slice(0, 12));
			} catch (err) {
				console.error('Failed to analyze walkthrough chunk:', err);
			}
		});
	}

	function startListening() {
		if (!recognitionRef.current) return;

		shouldRestartRef.current = true;
		setError(null);

		try {
			recognitionRef.current.start();
		} catch {
			// start() throws if recognition is already active.
		}
	}

	function stopListening() {
		shouldRestartRef.current = false;

		if (chunkBufferRef.current.trim()) {
			const finalChunk = chunkBufferRef.current.trim();
			chunkBufferRef.current = '';
			analyzeChunk(finalChunk);
		}

		recognitionRef.current?.stop();
		setIsListening(false);
		setLiveTranscript('');
	}

	if (!isSupported) {
		return (
			<div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
				<p className="font-semibold">Live Copilot unavailable</p>
				<p className="mt-1 text-sm">
					This browser does not expose SpeechRecognition. Use the existing
					audio-to-Whisper path as the fallback.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-2xl bg-zinc-950 p-4 text-white shadow-xl">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-wide text-zinc-400">
						Live Walkthrough Copilot
					</p>
					<h2 className="text-xl font-semibold">
						{isListening ? 'Listening for risks' : 'Ready to listen'}
					</h2>
				</div>

				<button
					type="button"
					onClick={isListening ? stopListening : startListening}
					className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
				>
					{isListening ? (
						<>
							<MicOff className="h-4 w-4" />
							Stop
						</>
					) : (
						<>
							<Mic className="h-4 w-4" />
							Start
						</>
					)}
				</button>
			</div>

			{error && (
				<div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
					{error}
				</div>
			)}

			<div className="mt-4 rounded-xl bg-zinc-900 p-3">
				<p className="text-xs uppercase tracking-wide text-zinc-500">
					Transcript ticker
				</p>
				<p className="mt-2 min-h-12 text-sm leading-6 text-zinc-200">
					{liveTranscript ||
						finalTranscript.slice(-240) ||
						'Start speaking during the walkthrough. The copilot will watch for margin risks, missing questions, and upsell opportunities.'}
				</p>
			</div>

			<div className="mt-4 flex items-center justify-between">
				<p className="text-sm font-semibold text-zinc-300">AI Alerts</p>
				{isPending && (
					<p className="text-xs text-zinc-500">Analyzing latest chunk...</p>
				)}
			</div>

			<div className="mt-3 space-y-3">
				{alerts.length === 0 ? (
					<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
						No risks detected yet.
					</div>
				) : (
					alerts.map((alert, index) => (
						<div
							key={`${alert.title}-${index}`}
							className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
						>
							<div className="flex items-center gap-2 text-sm font-semibold">
								{getAlertIcon(alert.type)}
								<span>{alert.title}</span>
								{alert.priority && (
									<span className="ml-auto rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
										{alert.priority}
									</span>
								)}
							</div>
							<p className="mt-2 text-sm leading-6 text-zinc-300">
								{alert.message}
							</p>
						</div>
					))
				)}
			</div>
		</div>
	);
}
