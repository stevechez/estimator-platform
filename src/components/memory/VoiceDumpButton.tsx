'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Loader2, Check } from 'lucide-react';
import { transcribeAudio } from '@/actions/transcribeAudio';
import { saveProjectMemory } from '@/actions/saveMemory';

export default function VoiceDumpButton({ projectId }: { projectId: string }) {
	const [status, setStatus] = useState<
		'idle' | 'recording' | 'processing' | 'success' | 'error'
	>('idle');
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			// Request microphone access
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = event => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				setStatus('processing');

				// Combine chunks into a single audio Blob
				// Note: Different browsers output different mime types. Whisper handles webm and mp4 perfectly.
				const audioBlob = new Blob(audioChunksRef.current, {
					type: 'audio/webm',
				});
				const file = new File([audioBlob], 'voice_dump.webm', {
					type: 'audio/webm',
				});

				// 1. Transcribe the Audio
				const formData = new FormData();
				formData.append('audio', file);

				const transcriptResult = await transcribeAudio(formData);

				if (!transcriptResult.success || !transcriptResult.text) {
					setStatus('error');
					setTimeout(() => setStatus('idle'), 3000);
					return;
				}

				// 2. Save it straight into the AI Project Memory vector database
				const saveResult = await saveProjectMemory({
					projectId: projectId,
					content: transcriptResult.text,
					sourceType: 'voice_note',
					metadata: { device: 'mobile_browser' },
				});

				if (saveResult.success) {
					setStatus('success');
				} else {
					setStatus('error');
				}

				// Cleanup the stream so the red dot disappears from the browser tab
				stream.getTracks().forEach(track => track.stop());
				setTimeout(() => setStatus('idle'), 3000);
			};

			mediaRecorder.start();
			setStatus('recording');
		} catch (err) {
			console.error('Microphone access denied or failed', err);
			setStatus('error');
			setTimeout(() => setStatus('idle'), 3000);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && status === 'recording') {
			mediaRecorderRef.current.stop();
		}
	};

	return (
		<div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 font-sans">
			{/* Dynamic Status Tooltip */}
			{status !== 'idle' && (
				<div
					className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 ${
						status === 'recording'
							? 'bg-red-500 text-white animate-pulse'
							: status === 'processing'
								? 'bg-zinc-900 text-white flex items-center gap-2'
								: status === 'success'
									? 'bg-emerald-500 text-white flex items-center gap-2'
									: 'bg-red-100 text-red-600 border border-red-200'
					}`}
				>
					{status === 'recording' && 'Recording Field Notes...'}
					{status === 'processing' && (
						<>
							<Loader2 className="w-4 h-4 animate-spin" /> Saving to Memory...
						</>
					)}
					{status === 'success' && (
						<>
							<Check className="w-4 h-4" /> Logged to Project
						</>
					)}
					{status === 'error' && 'Error saving memory. Try again.'}
				</div>
			)}

			{/* The Big Red Button */}
			<button
				onClick={status === 'recording' ? stopRecording : startRecording}
				disabled={status === 'processing' || status === 'success'}
				className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 ${
					status === 'recording'
						? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-500/30'
						: status === 'processing'
							? 'bg-zinc-400 cursor-not-allowed'
							: 'bg-zinc-900 hover:bg-zinc-800'
				}`}
			>
				{status === 'recording' ? (
					<Square className="w-6 h-6 text-white fill-current" />
				) : (
					<Mic className="w-7 h-7 text-white" />
				)}
			</button>
		</div>
	);
}
