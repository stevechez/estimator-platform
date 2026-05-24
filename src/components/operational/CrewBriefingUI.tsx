'use client';

import { useMemo, useState } from 'react';
import {
	AlertTriangle,
	HardHat,
	Info,
	CheckSquare,
	Wrench,
	Package,
	Copy,
	Check,
	AlertCircle,
	Sparkles,
} from 'lucide-react';
import { generateCrewBriefing } from '@/actions/generateCrewBriefing';

interface RoomScope {
	room_name: string;
	demolition_notes: string[];
	installation_tasks: string[];
	materials_provided: string[];
}

interface CrewBriefingData {
	project_overview: string;
	critical_alerts: string[];
	homeowner_rules: string[];
	room_by_room: RoomScope[];
}

function formatCrewBriefingForCopy(briefing: CrewBriefingData) {
	const lines: string[] = [];

	lines.push('FIELD OPS BRIEFING');
	lines.push('');
	lines.push('PROJECT OVERVIEW');
	lines.push(briefing.project_overview || 'No project overview provided.');
	lines.push('');

	if (briefing.critical_alerts.length > 0) {
		lines.push('CRITICAL FIELD ALERTS');
		briefing.critical_alerts.forEach(alert => {
			lines.push(`- ${alert}`);
		});
		lines.push('');
	}

	if (briefing.homeowner_rules.length > 0) {
		lines.push('HOMEOWNER RULES');
		briefing.homeowner_rules.forEach(rule => {
			lines.push(`- ${rule}`);
		});
		lines.push('');
	}

	if (briefing.room_by_room.length > 0) {
		lines.push('ROOM-BY-ROOM SCOPE');

		briefing.room_by_room.forEach(room => {
			lines.push('');
			lines.push(room.room_name.toUpperCase());

			if (room.demolition_notes.length > 0) {
				lines.push('Demo & Prep:');
				room.demolition_notes.forEach(note => {
					lines.push(`- ${note}`);
				});
			}

			if (room.installation_tasks.length > 0) {
				lines.push('Execution:');
				room.installation_tasks.forEach(task => {
					lines.push(`- ${task}`);
				});
			}

			if (room.materials_provided.length > 0) {
				lines.push('Materials on Site:');
				room.materials_provided.forEach(material => {
					lines.push(`- ${material}`);
				});
			}
		});
	}

	return lines.join('\n');
}

export default function CrewBriefingUI({ projectId }: { projectId: string }) {
	const [loading, setLoading] = useState(false);
	const [briefing, setBriefing] = useState<CrewBriefingData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const copyText = useMemo(() => {
		if (!briefing) return '';
		return formatCrewBriefingForCopy(briefing);
	}, [briefing]);

	const handleGenerate = async () => {
		setLoading(true);
		setError(null);
		setBriefing(null);
		setCopied(false);

		try {
			const result = await generateCrewBriefing(projectId);

			if (result.success && result.data) {
				setBriefing(result.data);
			} else {
				setError(result.error || 'Could not generate briefing.');
			}
		} catch (err) {
			console.error('Crew briefing failed:', err);
			setError('Could not generate briefing.');
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = async () => {
		if (!copyText) return;

		try {
			await navigator.clipboard.writeText(copyText);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Copy failed:', err);
			setError('Could not copy briefing. Please select the text manually.');
		}
	};

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6 pb-12 font-sans">
			<div className="rounded-2xl bg-zinc-950 p-6 text-white shadow-lg">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="flex items-center gap-2 text-xl font-bold">
							<HardHat className="h-6 w-6 text-yellow-500" />
							Field Ops Briefing
						</h2>
						<p className="mt-1 text-sm leading-6 text-zinc-400">
							Generate a crew-ready handoff from project memory.
						</p>
					</div>

					<button
						type="button"
						onClick={handleGenerate}
						disabled={loading}
						className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-zinc-950 transition-all hover:bg-yellow-400 disabled:opacity-50"
					>
						<Sparkles className="h-4 w-4" />
						{loading ? 'Synthesizing...' : 'Generate Briefing'}
					</button>
				</div>

				<p className="mt-4 text-xs leading-5 text-zinc-500">
					Generated briefings are temporary until copied or saved elsewhere.
				</p>
			</div>

			{error && (
				<div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
					<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
					<p>{error}</p>
				</div>
			)}

			{briefing && (
				<div className="animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500">
					<div className="flex justify-end">
						<button
							type="button"
							onClick={handleCopy}
							className={[
								'flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold shadow-sm transition-all',
								copied
									? 'border-emerald-200 bg-emerald-500 text-white'
									: 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
							].join(' ')}
						>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
							{copied ? 'Copied!' : 'Copy Briefing'}
						</button>
					</div>

					<div className="rounded-2xl border border-zinc-200 bg-white p-6">
						<h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
							The Mission
						</h3>
						<p className="text-lg font-medium leading-relaxed text-zinc-800">
							{briefing.project_overview}
						</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						{briefing.critical_alerts.length > 0 && (
							<div className="rounded-2xl border border-red-200 bg-red-50 p-5">
								<h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-red-800">
									<AlertTriangle className="h-5 w-5 text-red-600" />
									Critical Field Alerts
								</h3>
								<ul className="space-y-3">
									{briefing.critical_alerts.map((alert, idx) => (
										<li
											key={`${alert}-${idx}`}
											className="flex items-start gap-2 text-sm font-medium text-red-900"
										>
											<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
											{alert}
										</li>
									))}
								</ul>
							</div>
						)}

						{briefing.homeowner_rules.length > 0 && (
							<div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
								<h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-blue-800">
									<Info className="h-5 w-5 text-blue-600" />
									Homeowner Rules
								</h3>
								<ul className="space-y-3">
									{briefing.homeowner_rules.map((rule, idx) => (
										<li
											key={`${rule}-${idx}`}
											className="flex items-start gap-2 text-sm font-medium text-blue-900"
										>
											<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
											{rule}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					<div className="space-y-4">
						<h3 className="mt-4 px-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
							Room-by-Room Scope
						</h3>

						{briefing.room_by_room.map((room, idx) => (
							<div
								key={`${room.room_name}-${idx}`}
								className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
							>
								<div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
									<h4 className="text-lg font-black text-zinc-900">
										{room.room_name}
									</h4>
								</div>

								<div className="space-y-6 p-5">
									{room.demolition_notes.length > 0 && (
										<div>
											<h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-amber-600">
												<Wrench className="h-3.5 w-3.5" />
												Demo & Prep
											</h5>
											<ul className="space-y-2">
												{room.demolition_notes.map((note, i) => (
													<li
														key={`${note}-${i}`}
														className="flex items-start gap-2 text-sm text-zinc-700"
													>
														<CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300" />
														{note}
													</li>
												))}
											</ul>
										</div>
									)}

									{room.installation_tasks.length > 0 && (
										<div>
											<h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-600">
												<HardHat className="h-3.5 w-3.5" />
												Execution
											</h5>
											<ul className="space-y-2">
												{room.installation_tasks.map((task, i) => (
													<li
														key={`${task}-${i}`}
														className="flex items-start gap-2 text-sm font-medium text-zinc-700"
													>
														<CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300" />
														{task}
													</li>
												))}
											</ul>
										</div>
									)}

									{room.materials_provided.length > 0 && (
										<div>
											<h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-blue-600">
												<Package className="h-3.5 w-3.5" />
												Materials on Site
											</h5>
											<ul className="space-y-2 text-sm italic text-zinc-600">
												{room.materials_provided.map((material, i) => (
													<li key={`${material}-${i}`}>• {material}</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
