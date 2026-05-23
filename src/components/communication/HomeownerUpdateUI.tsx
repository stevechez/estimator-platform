'use client';

import { useState } from 'react';
import {
	Sparkles,
	Copy,
	Check,
	MessageSquare,
	AlertCircle,
} from 'lucide-react';
import { draftHomeownerUpdate } from '@/actions/draftHomeownerUpdate';

export default function HomeownerUpdateUI({
	projectId,
}: {
	projectId: string;
}) {
	const [loading, setLoading] = useState(false);
	const [draft, setDraft] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const handleGenerate = async () => {
		setLoading(true);
		setError(null);
		setDraft('');

		const result = await draftHomeownerUpdate(projectId);

		if (result.success && result.draft) {
			setDraft(result.draft);
		} else {
			setError(result.error || 'Could not generate draft.');
		}

		setLoading(false);
	};

	const handleCopy = () => {
		if (!draft) return;
		navigator.clipboard.writeText(draft);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden font-sans">
			{/* Header */}
			<div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
				<div>
					<h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
						<MessageSquare className="w-5 h-5 text-blue-500" />
						Client Update Generator
					</h2>
					<p className="text-sm text-zinc-500 mt-1">
						Turn this week&apos;s field notes into a polished text message.
					</p>
				</div>
				<button
					onClick={handleGenerate}
					disabled={loading}
					className="px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2"
				>
					{loading ? (
						<span className="animate-pulse flex items-center gap-2">
							<Sparkles className="w-4 h-4" /> Drafting...
						</span>
					) : (
						<>
							<Sparkles className="w-4 h-4" /> Generate Update
						</>
					)}
				</button>
			</div>

			{/* Editor Body */}
			<div className="p-6 space-y-4">
				{error && (
					<div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-start gap-2">
						<AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
						<p>{error}</p>
					</div>
				)}

				<div className="relative group">
					<textarea
						className="w-full h-48 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-800 text-lg leading-relaxed focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all resize-none"
						placeholder={
							loading
								? 'Translating field logs into homeowner update...'
								: "Click 'Generate Update' to draft a message based on recent project activity..."
						}
						value={draft}
						onChange={e => setDraft(e.target.value)}
						disabled={loading}
					/>

					{draft && !loading && (
						<div className="absolute bottom-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
							<button
								onClick={handleCopy}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${
									copied
										? 'bg-emerald-500 text-white'
										: 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
								}`}
							>
								{copied ? (
									<Check className="w-4 h-4" />
								) : (
									<Copy className="w-4 h-4" />
								)}
								{copied ? 'Copied!' : 'Copy to Clipboard'}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
