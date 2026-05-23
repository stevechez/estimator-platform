'use client';

import { useRef, useState, useEffect } from 'react';
import {
	AlertTriangle,
	BrainCircuit,
	Camera,
	CheckCircle2,
	ClipboardList,
	Loader2,
	Mic,
	Search,
	ShieldCheck,
	Square,
	UploadCloud,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
	analyzeWalkthroughChunk,
	type WalkthroughAlert,
} from '@/actions/analyzeWalkthrough';
import {
	analyzeJobsitePhoto,
	type JobsitePhotoIntelligence,
} from '@/actions/analyzeJobsitePhoto';
import { saveProjectMemory } from '@/actions/saveMemory';

type CopilotFeedItem =
	| {
			id: string;
			kind: 'alert';
			time: string;
			alert: WalkthroughAlert;
	  }
	| {
			id: string;
			kind: 'event';
			time: string;
			title: string;
			detail: string;
	  };

type CapturedPhoto = {
	url: string;
	intelligence?: JobsitePhotoIntelligence;
};

type SpeechRecognitionResultLike = {
	isFinal: boolean;
	[index: number]: { transcript: string };
};

type SpeechRecognitionEventLike = {
	resultIndex: number;
	results: {
		length: number;
		[index: number]: SpeechRecognitionResultLike;
	};
};

type SpeechRecognitionLike = {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	onresult: ((event: SpeechRecognitionEventLike) => void) | null;
	onerror: (() => void) | null;
	onend: (() => void) | null;
	start: () => void;
	stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
	interface Window {
		SpeechRecognition?: SpeechRecognitionConstructor;
		webkitSpeechRecognition?: SpeechRecognitionConstructor;
	}
}

const tradeOptions = [
	'General remodel',
	'Kitchen',
	'Bathroom',
	'Flooring',
	'Roofing',
	'Painting',
	'Addition',
	'Exterior',
];

const alertStyles = {
	risk: {
		icon: AlertTriangle,
		label: 'Risk',
		className: 'border-red-500/20 bg-red-500/10 text-red-200',
		iconClassName: 'text-red-300',
	},
	missing_question: {
		icon: Search,
		label: 'Question',
		className: 'border-blue-500/20 bg-blue-500/10 text-blue-100',
		iconClassName: 'text-blue-300',
	},
	scope_dependency: {
		icon: ClipboardList,
		label: 'Dependency',
		className: 'border-amber-500/20 bg-amber-500/10 text-amber-100',
		iconClassName: 'text-amber-300',
	},
	margin_protection: {
		icon: ShieldCheck,
		label: 'Margin',
		className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100',
		iconClassName: 'text-emerald-300',
	},
};

export default function CaptureWalkthrough() {
	const params = useParams();
	const router = useRouter();
	const projectId = params.projectId as string;

	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [transcript, setTranscript] = useState('');
	const [interimTranscript, setInterimTranscript] = useState('');
	const [tradeType, setTradeType] = useState(tradeOptions[0]);
	const [copilotFeed, setCopilotFeed] = useState<CopilotFeedItem[]>([
		{
			id: 'ready',
			kind: 'event',
			time: 'Ready',
			title: 'Walkthrough copilot standing by',
			detail: 'Start recording, then speak naturally. Prompts appear only when there is scope risk.',
		},
	]);
	const [isAnalyzingCopilot, setIsAnalyzingCopilot] = useState(false);

	const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
	const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
	const [photoStatus, setPhotoStatus] = useState('');

	const fileInputRef = useRef<HTMLInputElement>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
	const audioChunksRef = useRef<BlobPart[]>([]);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const analyzedTranscriptLengthRef = useRef(0);
	const tradeTypeRef = useRef(tradeOptions[0]);

	const nowLabel = () =>
		new Date().toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
		});

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	const addEvent = (title: string, detail: string) => {
		setCopilotFeed(prev => [
			{
				id: crypto.randomUUID(),
				kind: 'event',
				time: nowLabel(),
				title,
				detail,
			},
			...prev,
		]);
	};

	const analyzeLiveTranscript = async (fullTranscript: string) => {
		const nextChunk = fullTranscript
			.slice(analyzedTranscriptLengthRef.current)
			.trim();

		if (nextChunk.length < 80 || isAnalyzingCopilot) return;

		analyzedTranscriptLengthRef.current = fullTranscript.length;
		setIsAnalyzingCopilot(true);

		const result = await analyzeWalkthroughChunk(nextChunk, tradeTypeRef.current);
		const alerts = result.success ? result.alerts : [];

		if (alerts.length > 0) {
			const alertItems: CopilotFeedItem[] = alerts
				.slice(0, 3)
				.map(alert => ({
					id: crypto.randomUUID(),
					kind: 'alert',
					time: nowLabel(),
					alert,
				}));

			setCopilotFeed(prev => [...alertItems, ...prev]);
		}

		setIsAnalyzingCopilot(false);
	};

	const startSpeechRecognition = () => {
		const Recognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!Recognition) {
			addEvent(
				'Live transcript unavailable',
				'This browser does not support live speech recognition. The saved recording can still be processed.',
			);
			return;
		}

		const recognition = new Recognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'en-US';
		recognition.onresult = event => {
			let finalText = '';
			let interimText = '';

			for (let i = event.resultIndex; i < event.results.length; i += 1) {
				const result = event.results[i];
				const spokenText = result[0]?.transcript || '';

				if (result.isFinal) {
					finalText += spokenText;
				} else {
					interimText += spokenText;
				}
			}

			if (finalText) {
				setTranscript(prev => {
					const updated = `${prev} ${finalText}`.trim();
					void analyzeLiveTranscript(updated);
					return updated;
				});
			}

			setInterimTranscript(interimText.trim());
		};
		recognition.onerror = () => {
			addEvent(
				'Live transcript paused',
				'Speech recognition stopped responding. The audio recording is still safe.',
			);
		};
		recognition.onend = () => {
			if (isRecording) {
				try {
					recognition.start();
				} catch {
					// Browser speech engines can throw if restarted too quickly.
				}
			}
		};

		speechRecognitionRef.current = recognition;

		try {
			recognition.start();
		} catch {
			addEvent(
				'Live transcript unavailable',
				'The browser could not start speech recognition. Continue recording normally.',
			);
		}
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);

			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = event => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
				setAudioBlob(blob);
				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorder.start(1000);
			setIsRecording(true);
			addEvent(
				'Recording started',
				`${tradeTypeRef.current} walkthrough intelligence is active.`,
			);
			startSpeechRecognition();

			timerRef.current = setInterval(() => {
				setRecordingTime(prev => prev + 1);
			}, 1000);
		} catch (error) {
			console.error('Error accessing microphone:', error);
			alert('Please allow microphone access to record walkthroughs.');
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			speechRecognitionRef.current?.stop();
			setIsRecording(false);
			setInterimTranscript('');
			addEvent(
				'Recording saved',
				'Review the copilot prompts before generating the estimate draft.',
			);
			if (timerRef.current) clearInterval(timerRef.current);
		}
	};

	const handleProcessWalkthrough = async () => {
		if (!audioBlob) return;
		setIsProcessing(true);

		try {
			if (copilotFeed.some(item => item.kind === 'alert')) {
				await saveProjectMemory({
					projectId,
					content: `Live walkthrough copilot prompts:\n${copilotFeed
						.filter(item => item.kind === 'alert')
						.map(item => {
							const alert = item.alert;
							return `- [${alert.severity}] ${alert.message}${
								alert.suggested_question
									? ` Ask: ${alert.suggested_question}`
									: ''
							}`;
						})
						.join('\n')}`,
					sourceType: 'system_auto',
					metadata: {
						source: 'live_walkthrough_copilot',
						trade_type: tradeTypeRef.current,
					},
				});
			}

			const formData = new FormData();
			formData.append('audio', audioBlob, 'walkthrough.webm');
			formData.append('projectId', projectId);

			const response = await fetch('/api/process-walkthrough', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) throw new Error('Processing failed');
			router.push(`/dashboard/${projectId}/review`);
		} catch (error) {
			console.error('Upload error:', error);
			alert('Failed to process audio. Please try again.');
			setIsProcessing(false);
		}
	};

	const handlePhotoUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploadingPhoto(true);
		setPhotoStatus('Uploading photo');

		try {
			const { data: sessionData } = await supabase
				.from('walkthrough_sessions')
				.select('id')
				.eq('project_id', projectId)
				.single();

			if (!sessionData) throw new Error('Session not found');

			const fileExt = file.name.split('.').pop();
			const fileName = `${projectId}/${crypto.randomUUID()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('project-photos')
				.upload(fileName, file);

			if (uploadError) throw uploadError;

			const {
				data: { publicUrl },
			} = supabase.storage.from('project-photos').getPublicUrl(fileName);

			setPhotoStatus('Reading jobsite conditions');
			const formData = new FormData();
			formData.append('photo', file);
			const intelligenceResult = await analyzeJobsitePhoto(formData);
			const intelligence = intelligenceResult.success
				? intelligenceResult.data
				: undefined;

			const caption = intelligence
				? `${intelligence.room_classification} - ${intelligence.stage_of_completion}`
				: 'Walkthrough Photo';

			const { error: dbError } = await supabase.from('photos').insert([
				{
					walkthrough_id: sessionData.id,
					image_url: publicUrl,
					caption,
				},
			]);

			if (dbError) throw dbError;

			if (intelligence) {
				setPhotoStatus('Saving visual intelligence');
				await saveProjectMemory({
					projectId,
					content: `[Photo Intelligence]
Location: ${intelligence.room_classification}
Stage: ${intelligence.stage_of_completion}
Materials: ${intelligence.materials_spotted.join(', ') || 'None detected'}
Visible issues: ${intelligence.visible_issues.join(', ') || 'None detected'}
Scope implications: ${
						intelligence.scope_implications.join(', ') || 'None detected'
					}
Estimate links: ${intelligence.estimate_links.join(', ') || 'None detected'}
Search tags: ${intelligence.search_tags.join(', ') || 'None detected'}`,
					sourceType: 'system_auto',
					metadata: {
						source: 'smart_photo_intelligence',
						photo_url: publicUrl,
						intelligence,
					},
				});

				addEvent(
					'Photo intelligence added',
					`${intelligence.room_classification}: ${
						intelligence.scope_implications[0] ||
						intelligence.visible_issues[0] ||
						'Tagged and linked to project memory.'
					}`,
				);
			}

			setPhotos(prev => [{ url: publicUrl, intelligence }, ...prev]);
		} catch (error) {
			console.error('Photo upload failed:', error);
			alert(
				"Failed to upload photo. Please verify your Supabase bucket is named 'project-photos' and is public.",
			);
		} finally {
			setIsUploadingPhoto(false);
			setPhotoStatus('');
			event.target.value = '';
		}
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
			speechRecognitionRef.current?.stop();
		};
	}, []);

	return (
		<div className="min-h-[100dvh] bg-[#0A0A0A] text-slate-100 antialiased">
			<header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0A]/90 px-4 py-4 backdrop-blur-md sm:px-6">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
					<Link
						href="/dashboard"
						className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
					>
						<X className="h-4 w-4" />
						Cancel
					</Link>
					<div className="flex items-center gap-3">
						<select
							value={tradeType}
							onChange={event => {
								tradeTypeRef.current = event.target.value;
								setTradeType(event.target.value);
							}}
							className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 outline-none"
						>
							{tradeOptions.map(option => (
								<option key={option} value={option} className="bg-zinc-950">
									{option}
								</option>
							))}
						</select>
						<span className="hidden rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-slate-300 sm:inline">
							Live Walkthrough Copilot
						</span>
					</div>
				</div>
			</header>

			<main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:px-6">
				<section className="space-y-5">
					<div className="rounded-2xl border border-white/5 bg-[#111] p-5">
						<div className="mb-8 flex items-center justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
									Session
								</p>
								<h1 className="mt-1 text-xl font-semibold tracking-tight text-white">
									Capture walkthrough
								</h1>
							</div>
							<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
								<span
									className={`h-2 w-2 rounded-full ${
										isRecording ? 'bg-red-400' : 'bg-slate-500'
									}`}
								/>
								{isRecording ? 'Recording' : 'Idle'}
							</div>
						</div>

						<div className="flex flex-col items-center justify-center space-y-8 py-4">
							<div className="text-center">
								<div
									className={`font-mono text-6xl tracking-tighter transition-colors duration-300 ${
										isRecording ? 'text-red-400' : 'text-white'
									}`}
								>
									{formatTime(recordingTime)}
								</div>
								<p className="mt-2 text-sm text-slate-400">
									{isRecording
										? 'Listening for scope risk'
										: audioBlob
											? 'Recording saved'
											: 'Start the walkthrough when you enter the job'}
								</p>
							</div>

							{!audioBlob && (
								<button
									onClick={isRecording ? stopRecording : startRecording}
									className={`relative flex items-center justify-center rounded-full transition-all duration-300 active:scale-95 ${
										isRecording
											? 'h-32 w-32 border-2 border-red-500 bg-red-500/15 text-red-300'
											: 'h-40 w-40 bg-blue-600 text-white shadow-[0_0_46px_-12px_rgba(37,99,235,0.65)] hover:bg-blue-500'
									}`}
								>
									{isRecording ? (
										<Square className="h-11 w-11 fill-current" />
									) : (
										<Mic className="h-16 w-16" />
									)}
									{isRecording && (
										<div className="absolute inset-0 animate-ping rounded-full border-2 border-red-500 opacity-15" />
									)}
								</button>
							)}

							{audioBlob && !isProcessing && (
								<div className="w-full max-w-sm space-y-3">
									<button
										onClick={handleProcessWalkthrough}
										className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-medium text-black"
									>
										<UploadCloud className="h-5 w-5" />
										Process Walkthrough
									</button>
									<button
										onClick={() => {
											setAudioBlob(null);
											setRecordingTime(0);
											setTranscript('');
											setInterimTranscript('');
											analyzedTranscriptLengthRef.current = 0;
										}}
										className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent px-6 py-4 font-medium text-slate-300 transition hover:bg-white/5"
									>
										Discard and rerecord
									</button>
								</div>
							)}

							{isProcessing && (
								<div className="flex flex-col items-center gap-4 text-blue-300">
									<Loader2 className="h-10 w-10 animate-spin" />
									<p className="font-medium">Structuring scope and memory...</p>
								</div>
							)}
						</div>
					</div>

					<div className="rounded-2xl border border-white/5 bg-[#111] p-4">
						<div className="mb-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Camera className="h-4 w-4 text-slate-400" />
								<p className="text-sm font-medium text-white">
									Smart Photo Intelligence
								</p>
							</div>
							<button
								onClick={() => fileInputRef.current?.click()}
								disabled={isUploadingPhoto}
								className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20 disabled:opacity-50"
							>
								{isUploadingPhoto ? 'Analyzing...' : 'Take Photo'}
							</button>
						</div>
						<input
							type="file"
							accept="image/*"
							capture="environment"
							ref={fileInputRef}
							className="hidden"
							onChange={handlePhotoUpload}
						/>

						{isUploadingPhoto && (
							<div className="mb-3 flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
								<Loader2 className="h-4 w-4 animate-spin text-blue-300" />
								{photoStatus || 'Analyzing photo'}
							</div>
						)}

						{photos.length > 0 ? (
							<div className="flex gap-3 overflow-x-auto pb-1">
								{photos.map(photo => (
									<div
										key={photo.url}
										className="w-36 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
									>
										<img
											src={photo.url}
											alt="Walkthrough"
											className="h-24 w-full object-cover"
										/>
										<div className="space-y-1 p-2">
											<p className="truncate text-xs font-medium text-white">
												{photo.intelligence?.room_classification || 'Photo'}
											</p>
											<p className="line-clamp-2 text-[11px] text-slate-500">
												{photo.intelligence?.scope_implications[0] ||
													photo.intelligence?.visible_issues[0] ||
													'Stored with walkthrough'}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-slate-500">
								Photos will be tagged by room, materials, visible issues, and
								scope implications.
							</p>
						)}
					</div>
				</section>

				<section className="space-y-5">
					<div className="rounded-2xl border border-white/5 bg-[#111]">
						<div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
									<BrainCircuit className="h-5 w-5" />
								</div>
								<div>
									<h2 className="text-sm font-semibold text-white">
										Copilot timeline
									</h2>
									<p className="text-xs text-slate-500">
										Risks, missing questions, and scope dependencies
									</p>
								</div>
							</div>
							{isAnalyzingCopilot && (
								<Loader2 className="h-4 w-4 animate-spin text-blue-300" />
							)}
						</div>

						<div className="max-h-[520px] space-y-3 overflow-y-auto p-4">
							{copilotFeed.map(item => {
								if (item.kind === 'event') {
									return (
										<div
											key={item.id}
											className="rounded-xl border border-white/5 bg-white/[0.025] p-4"
										>
											<div className="mb-1 flex items-center justify-between gap-3">
												<p className="text-sm font-medium text-slate-200">
													{item.title}
												</p>
												<span className="text-[11px] text-slate-600">
													{item.time}
												</span>
											</div>
											<p className="text-sm leading-5 text-slate-500">
												{item.detail}
											</p>
										</div>
									);
								}

								const style = alertStyles[item.alert.type];
								const Icon = style.icon;

								return (
									<div
										key={item.id}
										className={`rounded-xl border p-4 ${style.className}`}
									>
										<div className="mb-3 flex items-center justify-between gap-3">
											<div className="flex items-center gap-2">
												<Icon className={`h-4 w-4 ${style.iconClassName}`} />
												<span className="text-xs font-semibold uppercase tracking-[0.16em]">
													{style.label}
												</span>
											</div>
											<div className="flex items-center gap-2 text-[11px] text-slate-400">
												<span>{item.alert.severity}</span>
												<span>{item.time}</span>
											</div>
										</div>
										<p className="text-sm font-medium leading-5">
											{item.alert.message}
										</p>
										{item.alert.suggested_question && (
											<p className="mt-3 rounded-lg bg-black/20 p-3 text-sm leading-5 text-slate-100">
												{item.alert.suggested_question}
											</p>
										)}
									</div>
								);
							})}
						</div>
					</div>

					<div className="rounded-2xl border border-white/5 bg-[#111] p-5">
						<div className="mb-3 flex items-center justify-between">
							<p className="text-sm font-medium text-white">Live transcript</p>
							{transcript && (
								<CheckCircle2 className="h-4 w-4 text-emerald-300" />
							)}
						</div>
						<div className="min-h-32 rounded-xl border border-white/5 bg-black/20 p-4 text-sm leading-6 text-slate-300">
							{transcript || interimTranscript ? (
								<>
									{transcript}
									{interimTranscript && (
										<span className="text-slate-500"> {interimTranscript}</span>
									)}
								</>
							) : (
								<span className="text-slate-600">
									Live transcript appears here when supported by the browser.
								</span>
							)}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
