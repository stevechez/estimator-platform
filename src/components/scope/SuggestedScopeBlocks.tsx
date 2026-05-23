'use client';

import { useEffect, useState, useTransition } from 'react';
import { ClipboardList, Copy, Loader2, PlusCircle } from 'lucide-react';
import {
	searchScopeBlocks,
	type ScopeBlockMatch,
} from '@/actions/searchScopeBlocks';
import { markScopeBlockUsed } from '@/actions/markScopeBlockUsed';

type SuggestedScopeBlocksProps = {
	userId: string;
	query: string;
	onInsert?: (scopeBlock: ScopeBlockMatch) => void;
};

export default function SuggestedScopeBlocks({
	userId,
	query,
	onInsert,
}: SuggestedScopeBlocksProps) {
	const [scopeBlocks, setScopeBlocks] = useState<ScopeBlockMatch[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (!userId || !query.trim()) return;

		startTransition(async () => {
			const result = await searchScopeBlocks({
				userId,
				query,
				matchCount: 6,
			});

			if (!result.success) {
				setError(result.error ?? 'Failed to search scope blocks.');
				setScopeBlocks([]);
				return;
			}

			setError(null);
			setScopeBlocks(result.scopeBlocks);
		});
	}, [userId, query]);

	async function handleCopy(block: ScopeBlockMatch) {
		await navigator.clipboard.writeText(block.body);
		setCopiedId(block.id);
		setTimeout(() => setCopiedId(null), 1500);
	}

	async function handleInsert(block: ScopeBlockMatch) {
		onInsert?.(block);

		const result = await markScopeBlockUsed(block.id);

		if (!result.success) {
			console.error('Failed to mark scope block used:', result.error);
		}
	}

	return (
		<section className="rounded-2xl border border-white/10 bg-[#111] p-5 shadow-xl">
			<div className="mb-4 flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
						<ClipboardList className="h-5 w-5" />
					</div>

					<div>
						<h2 className="text-sm font-bold text-white">
							Suggested Scope Blocks
						</h2>
						<p className="text-xs text-slate-500">
							Reusable language from your scope memory
						</p>
					</div>
				</div>

				{isPending && (
					<Loader2 className="h-4 w-4 animate-spin text-slate-500" />
				)}
			</div>

			{error && (
				<div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
					{error}
				</div>
			)}

			{!error && scopeBlocks.length === 0 && !isPending && (
				<div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-500">
					No reusable scope blocks found yet. Add a few saved blocks and they
					will appear here when relevant.
				</div>
			)}

			<div className="space-y-3">
				{scopeBlocks.map(block => (
					<div
						key={block.id}
						className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
					>
						<div className="mb-2 flex items-start justify-between gap-3">
							<div className="min-w-0">
								<h3 className="text-sm font-bold text-white">{block.title}</h3>

								<p className="mt-1 text-xs text-slate-500">
									{[block.project_type, block.trade, block.room]
										.filter(Boolean)
										.join(' • ')}
								</p>
							</div>

							<span className="shrink-0 rounded-full bg-white/[0.08] px-2 py-1 text-[11px] font-medium text-slate-400">
								{Number(block.similarity).toFixed(2)}
							</span>
						</div>

						<p className="text-sm leading-6 text-slate-300">{block.body}</p>

						{block.tags && block.tags.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-1.5">
								{block.tags.map(tag => (
									<span
										key={tag}
										className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-slate-400"
									>
										{tag}
									</span>
								))}
							</div>
						)}

						<div className="mt-4 flex gap-2">
							<button
								type="button"
								onClick={() => handleCopy(block)}
								className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.1]"
							>
								<Copy className="h-3.5 w-3.5" />
								{copiedId === block.id ? 'Copied' : 'Copy'}
							</button>

							{onInsert && (
								<button
									type="button"
									onClick={() => handleInsert(block)}
									className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
								>
									<PlusCircle className="h-3.5 w-3.5" />
									Insert
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
