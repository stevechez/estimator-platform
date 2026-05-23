'use client';

import { useState } from 'react';
import { analyzeEstimateScope } from '@/actions/scopecheck';
import GapAnalysisReport from '@/components/scopecheck/GapAnalysisReport';
import { ScopeGapAnalysis } from '@/lib/scopecheck/schema';

type ScopeCheckResult = { error: string } | Record<string, unknown>;

export default function ScopeCheckSandbox() {
	const [estimateText, setEstimateText] = useState(
		'Master Bath Remodel:\nDemo existing tile floor, tub, and vanity.\nInstall new 60-inch double vanity.\nInstall new freestanding tub.\nTile shower walls and floor.\nInstall new shower fixtures.\nTotal Labor: $4,500.\nMaterials: $3,200.',
	);

	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<ScopeGapAnalysis | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleAnalyze = async () => {
		setLoading(true);
		setResult(null);
		setError(null); // <-- Clear previous errors

		const response = await analyzeEstimateScope(estimateText);

		if (response.success) {
			setResult(response.data);
		} else {
			setError(response.error || 'An unknown error occurred.'); // <-- Set the explicit error state
		}

		setLoading(false);
	};

	return (
		<div className="max-w-5xl mx-auto p-8 space-y-8 font-sans">
			<div>
				<h1 className="text-3xl font-bold text-zinc-900">
					ScopeCheck Brain Test
				</h1>
				<p className="text-zinc-500 mt-2">
					Paste a draft estimate below to see what the AI catches.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{/* INPUT COLUMN */}
				<div className="space-y-4">
					<label className="block text-sm font-semibold text-zinc-700">
						Raw Estimate Text
					</label>
					<textarea
						className="w-full h-64 p-4 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
						value={estimateText}
						onChange={e => setEstimateText(e.target.value)}
					/>
					<button
						onClick={handleAnalyze}
						disabled={loading}
						className="w-full py-3 px-4 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
					>
						{loading ? (
							<span className="animate-pulse">Analyzing Scope Gaps...</span>
						) : (
							'Run Analysis'
						)}
					</button>
				</div>

				{/* OUTPUT COLUMN */}
				<div className="space-y-4">
					<label className="block text-sm font-semibold text-zinc-700">
						AI Analysis
					</label>
					<div className="w-full min-h-[500px]">
						{loading ? (
							<div className="text-zinc-500 font-mono text-sm animate-pulse p-4 bg-zinc-50 rounded-lg">
								{/* // Connecting to GPT-4o ScopeCheck Engine... */}
							</div>
						) : result ? (
							<GapAnalysisReport data={result} />
						) : (
							<div className="text-zinc-400 font-medium text-sm p-8 text-center border-2 border-dashed border-zinc-200 rounded-xl">
								Paste an estimate on the left to see the hidden margin risks.
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
