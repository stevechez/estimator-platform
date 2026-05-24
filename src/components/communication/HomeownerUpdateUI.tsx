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
		setCopied(false);

		try {
			const result = await draftHomeownerUpdate(projectId);

			if (result.success && result.draft) {
				setDraft(result.draft);
			} else {
				setError(result.error || 'Could not generate homeowner update.');
			}
		} catch (err) {
			console.error('Homeowner update failed:', err);
			setError('Could not generate homeowner update.');
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = async () => {
		if (!draft) return;

		try {
			await navigator.clipboard.writeText(draft);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Copy failed:', err);
			setError('Could not copy update. Please select the text manually.');
		}
	};

	return (
		<div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white font-sans shadow-sm">
			<div className="flex flex-col gap-4 border-b border-zinc-100 bg-zinc-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
						<MessageSquare className="h-5 w-5 text-blue-500" />
						Homeowner Update
					</h2>
					<p className="mt-1 text-sm leading-6 text-zinc-500">
						Turn recent project memory into a polished client message.
					</p>
				</div>

				<button
					type="button"
					onClick={handleGenerate}
					disabled={loading}
					className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
				>
					<Sparkles className="h-4 w-4" />
					{loading ? 'Drafting...' : 'Generate Update'}
				</button>
			</div>

			<div className="space-y-4 p-6">
				<p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
					Generated updates are temporary until copied or saved elsewhere.
					Review before sending to a homeowner.
				</p>

				{error && (
					<div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
						<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
						<p>{error}</p>
					</div>
				)}

				<textarea
					className="h-56 w-full resize-y rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-base leading-relaxed text-zinc-800 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
					placeholder={
						loading
							? 'Translating field logs into a homeowner update...'
							: "Click 'Generate Update' to draft a message based on recent project activity..."
					}
					value={draft}
					onChange={e => {
						setDraft(e.target.value);
						setCopied(false);
					}}
					disabled={loading}
				/>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs leading-5 text-zinc-500">
						Edit the message before sending. BUILDRAIL does not send this
						automatically.
					</p>

					<button
						type="button"
						onClick={handleCopy}
						disabled={!draft || loading}
						className={[
							'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50',
							copied
								? 'bg-emerald-500 text-white'
								: 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
						].join(' ')}
					>
						{copied ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)}
						{copied ? 'Copied!' : 'Copy Update'}
					</button>
				</div>
			</div>
		</div>
	);
}
