'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, UploadCloud, Camera } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function CaptureWalkthrough() {
	const params = useParams();
	const router = useRouter();
	const projectId = params.projectId as string;

	// -- Supabase Client --
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

	// -- Audio State --
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	// -- Photo State --
	const [photos, setPhotos] = useState<string[]>([]);
	const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// -- Refs --
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<BlobPart[]>([]);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// -- Timer Formatting --
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	// -- Audio Capture Logic --
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
			setIsRecording(false);
			if (timerRef.current) clearInterval(timerRef.current);
		}
	};

	const handleProcessWalkthrough = async () => {
		if (!audioBlob) return;
		setIsProcessing(true);

		try {
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

	// -- Photo Upload Logic --
	const handlePhotoUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploadingPhoto(true);

		try {
			const { data: sessionData } = await supabase
				.from('walkthrough_sessions')
				.select('id')
				.eq('project_id', projectId)
				.single();

			if (!sessionData) throw new Error('Session not found');

			const fileExt = file.name.split('.').pop();
			const fileName = `${projectId}/${Math.random()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('project-photos')
				.upload(fileName, file);

			if (uploadError) throw uploadError;

			const {
				data: { publicUrl },
			} = supabase.storage.from('project-photos').getPublicUrl(fileName);

			const { error: dbError } = await supabase.from('photos').insert([
				{
					walkthrough_id: sessionData.id,
					image_url: publicUrl,
					caption: 'Walkthrough Photo',
				},
			]);

			if (dbError) throw dbError;

			setPhotos(prev => [...prev, publicUrl]);
		} catch (error) {
			console.error('Photo upload failed:', error);
			alert(
				"Failed to upload photo. Please verify your Supabase bucket is named 'project-photos' and is public.",
			);
		} finally {
			setIsUploadingPhoto(false);
		}
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	return (
		<div className="min-h-[100dvh] bg-[#0A0A0A] text-slate-100 flex flex-col antialiased">
			{/* Top Bar */}
			<header className="p-6 flex justify-between items-center border-b border-white/5">
				<Link
					href="/dashboard"
					className="text-sm text-slate-400 hover:text-white"
				>
					Cancel
				</Link>
				<span className="text-sm font-medium px-3 py-1 bg-white/5 rounded-full text-slate-300">
					Walkthrough Session
				</span>
			</header>

			{/* Main Interaction Area (Restored!) */}
			<main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
				{/* Timer Display */}
				<div className="text-center space-y-2">
					<div
						className={`text-6xl font-mono tracking-tighter transition-colors duration-300 ${isRecording ? 'text-red-500' : 'text-white'}`}
					>
						{formatTime(recordingTime)}
					</div>
					<p className="text-slate-400 text-sm">
						{isRecording
							? 'Recording in progress...'
							: audioBlob
								? 'Recording saved.'
								: 'Tap to start walkthrough'}
					</p>
				</div>

				{/* The Massive Record Button */}
				{!audioBlob && (
					<button
						onClick={isRecording ? stopRecording : startRecording}
						className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-out active:scale-95 ${
							isRecording
								? 'w-32 h-32 bg-red-500/20 text-red-500 border-2 border-red-500 animate-pulse'
								: 'w-40 h-40 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]'
						}`}
					>
						{isRecording ? (
							<Square className="w-12 h-12 fill-current" />
						) : (
							<Mic className="w-16 h-16" />
						)}

						{/* Ripples for recording state */}
						{isRecording && (
							<div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20" />
						)}
					</button>
				)}

				{/* Post-Recording Actions */}
				{audioBlob && !isProcessing && (
					<div className="flex flex-col gap-4 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
						<button
							onClick={handleProcessWalkthrough}
							className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-medium"
						>
							<UploadCloud className="w-5 h-5" />
							Process Walkthrough
						</button>
						<button
							onClick={() => {
								setAudioBlob(null);
								setRecordingTime(0);
							}}
							className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/10 text-slate-300 px-6 py-4 rounded-xl font-medium hover:bg-white/5"
						>
							Discard & Rerecord
						</button>
					</div>
				)}

				{/* Processing State */}
				{isProcessing && (
					<div className="flex flex-col items-center gap-4 text-blue-400">
						<Loader2 className="w-10 h-10 animate-spin" />
						<p className="font-medium animate-pulse">
							AI is structuring your scope...
						</p>
					</div>
				)}
			</main>

			{/* Uploaded Photos Preview Strip */}
			{photos.length > 0 && (
				<div className="w-full px-6 flex gap-3 overflow-x-auto pb-4 pt-8 border-t border-white/5 mt-auto">
					{photos.map((url, i) => (
						<img
							key={i}
							src={url}
							alt="Walkthrough"
							className="w-16 h-16 object-cover rounded-lg border border-white/10 shrink-0"
						/>
					))}
				</div>
			)}

			{/* Real Camera Footer */}
			{!isRecording && !audioBlob && (
				<footer className={`p-6 ${photos.length > 0 ? 'mt-0' : 'mt-auto'}`}>
					{/* Hidden File Input */}
					<input
						type="file"
						accept="image/*"
						capture="environment"
						ref={fileInputRef}
						className="hidden"
						onChange={handlePhotoUpload}
					/>

					<div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
								{isUploadingPhoto ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<Camera className="w-5 h-5" />
								)}
							</div>
							<div className="text-sm">
								<p className="text-white font-medium">Add Photos</p>
								<p className="text-slate-500 text-xs">
									{photos.length > 0
										? `${photos.length} photos added`
										: 'Attach to this walkthrough'}
								</p>
							</div>
						</div>

						<button
							onClick={() => fileInputRef.current?.click()}
							disabled={isUploadingPhoto}
							className="text-blue-400 text-sm font-medium px-4 py-2 bg-blue-400/10 rounded-lg hover:bg-blue-400/20 transition-colors disabled:opacity-50"
						>
							{isUploadingPhoto ? 'Uploading...' : 'Take Photo'}
						</button>
					</div>
				</footer>
			)}
		</div>
	);
}
