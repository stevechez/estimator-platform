'use client';

import { useState, useRef } from 'react';
import {
	Camera,
	Upload,
	Loader2,
	AlertTriangle,
	CheckCircle2,
	Tags,
	Eye,
} from 'lucide-react';
import { analyzeJobsitePhoto } from '@/actions/analyzeJobsitePhoto';
import { saveProjectMemory } from '@/actions/saveMemory'; // Reusing your Phase 2 function!

interface PhotoIntelligence {
	room_classification: string;
	materials_spotted: string[];
	visible_issues: string[];
	stage_of_completion: string;
	search_tags: string[];
}

export default function SmartPhotoCapture({
	projectId,
}: {
	projectId: string;
}) {
	const [photoUrl, setPhotoUrl] = useState<string | null>(null);
	const [intelligence, setIntelligence] = useState<PhotoIntelligence | null>(
		null,
	);
	const [status, setStatus] = useState<
		'idle' | 'analyzing' | 'saving' | 'success' | 'error'
	>('idle');

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [rawFile, setRawFile] = useState<File | null>(null);

	const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Show preview instantly
		setPhotoUrl(URL.createObjectURL(file));
		setRawFile(file);
		setStatus('analyzing');
		setIntelligence(null);

		// Run AI Vision
		const formData = new FormData();
		formData.append('photo', file);

		const result = await analyzeJobsitePhoto(formData);

		if (result.success) {
			setIntelligence(result.data);
			setStatus('idle');
		} else {
			setStatus('error');
		}
	};

	const handleSaveToMemory = async () => {
		if (!intelligence) return;
		setStatus('saving');

		// Format the AI's JSON into a highly searchable text string
		const searchableContent = `
      [Photo Captured] 
      Location: ${intelligence.room_classification}. 
      Stage: ${intelligence.stage_of_completion}.
      Materials in photo: ${intelligence.materials_spotted.join(', ')}.
      Issues flagged: ${intelligence.visible_issues.length > 0 ? intelligence.visible_issues.join(', ') : 'None detected'}.
      Keywords: ${intelligence.search_tags.join(', ')}.
    `;

		// Save directly to the vector database we built yesterday
		const saveResult = await saveProjectMemory({
			projectId,
			content: searchableContent,
			sourceType: 'system_auto', // Can also add 'photo_upload' if you update the schema
			metadata: { has_photo: true }, // In production, upload the photo to Supabase Storage and save the URL here
		});

		if (saveResult.success) {
			setStatus('success');
			setTimeout(() => {
				setPhotoUrl(null);
				setIntelligence(null);
				setStatus('idle');
			}, 3000);
		} else {
			setStatus('error');
		}
	};

	return (
		<div className="w-full max-w-md mx-auto bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden font-sans">
			{/* Hidden File Input (Triggers Native Camera on Mobile) */}
			<input
				type="file"
				accept="image/*"
				capture="environment" // Forces the rear-facing camera on phones
				ref={fileInputRef}
				onChange={handlePhotoSelect}
				className="hidden"
			/>

			{/* Header / Empty State */}
			{!photoUrl ? (
				<div
					onClick={() => fileInputRef.current?.click()}
					className="p-12 flex flex-col items-center justify-center text-zinc-400 cursor-pointer hover:bg-zinc-50 transition-colors border-b border-zinc-100"
				>
					<div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
						<Camera className="w-8 h-8" />
					</div>
					<h3 className="text-lg font-bold text-zinc-900 mb-1">
						Capture Jobsite Intel
					</h3>
					<p className="text-sm font-medium text-center">
						Tap to open camera or upload a photo for AI analysis.
					</p>
				</div>
			) : (
				<div className="relative">
					<img
						src={photoUrl}
						alt="Jobsite"
						className="w-full h-64 object-cover"
					/>
					{status === 'analyzing' && (
						<div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
							<Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-400" />
							<p className="font-bold tracking-wide animate-pulse">
								Running Visual Intel...
							</p>
						</div>
					)}
				</div>
			)}

			{/* Intelligence Results Dashboard */}
			{intelligence && (
				<div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<div className="flex items-start justify-between border-b border-zinc-100 pb-4">
						<div>
							<p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
								Location Detected
							</p>
							<h4 className="text-xl font-black text-zinc-900">
								{intelligence.room_classification}
							</h4>
							<p className="text-sm text-zinc-500 mt-0.5">
								{intelligence.stage_of_completion}
							</p>
						</div>
					</div>

					{intelligence.visible_issues.length > 0 && (
						<div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
							<h5 className="text-xs font-bold text-red-800 uppercase flex items-center gap-2 mb-2">
								<AlertTriangle className="w-4 h-4" /> Risks Detected
							</h5>
							<ul className="space-y-1">
								{intelligence.visible_issues.map((issue, i) => (
									<li
										key={i}
										className="text-sm text-red-900 font-medium flex items-start gap-2"
									>
										<span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
										{issue}
									</li>
								))}
							</ul>
						</div>
					)}

					<div className="grid grid-cols-2 gap-4">
						<div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
							<h5 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1.5 mb-2">
								<Eye className="w-3.5 h-3.5" /> Materials
							</h5>
							<ul className="text-sm text-zinc-700 space-y-1 font-medium">
								{intelligence.materials_spotted.map((m, i) => (
									<li key={i}>{m}</li>
								))}
							</ul>
						</div>
						<div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
							<h5 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1.5 mb-2">
								<Tags className="w-3.5 h-3.5" /> Auto-Tags
							</h5>
							<div className="flex flex-wrap gap-1.5">
								{intelligence.search_tags.map((tag, i) => (
									<span
										key={i}
										className="text-[10px] uppercase font-bold bg-zinc-200 text-zinc-600 px-2 py-1 rounded-md"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</div>

					<button
						onClick={handleSaveToMemory}
						disabled={status === 'saving' || status === 'success'}
						className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
							status === 'success'
								? 'bg-emerald-500 text-white'
								: 'bg-zinc-900 hover:bg-zinc-800 text-white'
						}`}
					>
						{status === 'saving' ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" /> Vectorizing...
							</>
						) : status === 'success' ? (
							<>
								<CheckCircle2 className="w-4 h-4" /> Saved to Memory
							</>
						) : (
							<>
								<Upload className="w-4 h-4" /> Save to Project Memory
							</>
						)}
					</button>
				</div>
			)}
		</div>
	);
}
