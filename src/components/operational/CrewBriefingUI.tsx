'use client';

import { useState } from 'react';
import {
	AlertTriangle,
	HardHat,
	Info,
	CheckSquare,
	Wrench,
	Package,
	Share,
} from 'lucide-react';
import { generateCrewBriefing } from '@/actions/generateCrewBriefing';

// Type definitions to keep TypeScript happy
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

export default function CrewBriefingUI({ projectId }: { projectId: string }) {
	const [loading, setLoading] = useState(false);
	const [briefing, setBriefing] = useState<CrewBriefingData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleGenerate = async () => {
		setLoading(true);
		setError(null);
		setBriefing(null);

		const result = await generateCrewBriefing(projectId);

		if (result.success) {
			setBriefing(result.data);
		} else {
			setError(result.error || 'Could not generate briefing.');
		}

		setLoading(false);
	};

	return (
		<div className="w-full max-w-3xl mx-auto space-y-6 font-sans pb-12">
			{/* Action Header */}
			<div className="flex items-center justify-between p-6 bg-zinc-950 rounded-2xl text-white shadow-lg">
				<div>
					<h2 className="text-xl font-bold flex items-center gap-2">
						<HardHat className="w-6 h-6 text-yellow-500" />
						Field Ops Briefing
					</h2>
					<p className="text-zinc-400 text-sm mt-1">
						AI-generated handoff from project memory.
					</p>
				</div>
				<button
					onClick={handleGenerate}
					disabled={loading}
					className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 text-sm font-bold rounded-xl disabled:opacity-50 transition-all flex items-center gap-2"
				>
					{loading ? 'Synthesizing...' : 'Generate Briefing'}
				</button>
			</div>

			{error && (
				<div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-200">
					{error}
				</div>
			)}

			{briefing && (
				<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
					{/* Project Overview */}
					<div className="p-6 bg-white border border-zinc-200 rounded-2xl">
						<h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
							The Mission
						</h3>
						<p className="text-zinc-800 text-lg leading-relaxed font-medium">
							{briefing.project_overview}
						</p>
					</div>

					{/* Critical Alerts & Rules Grid */}
					<div className="grid md:grid-cols-2 gap-4">
						{/* Alerts */}
						{briefing.critical_alerts.length > 0 && (
							<div className="p-5 bg-red-50 border border-red-200 rounded-2xl">
								<h3 className="text-sm font-bold text-red-800 flex items-center gap-2 mb-4">
									<AlertTriangle className="w-5 h-5 text-red-600" />
									Critical Field Alerts
								</h3>
								<ul className="space-y-3">
									{briefing.critical_alerts.map((alert, idx) => (
										<li
											key={idx}
											className="flex items-start gap-2 text-red-900 text-sm font-medium"
										>
											<span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
											{alert}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Rules */}
						{briefing.homeowner_rules.length > 0 && (
							<div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl">
								<h3 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-4">
									<Info className="w-5 h-5 text-blue-600" />
									Homeowner Rules
								</h3>
								<ul className="space-y-3">
									{briefing.homeowner_rules.map((rule, idx) => (
										<li
											key={idx}
											className="flex items-start gap-2 text-blue-900 text-sm font-medium"
										>
											<span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
											{rule}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* Room by Room Scope */}
					<div className="space-y-4">
						<h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-2 mt-4">
							Room-by-Room Scope
						</h3>

						{briefing.room_by_room.map((room, idx) => (
							<div
								key={idx}
								className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
							>
								<div className="bg-zinc-50 px-5 py-4 border-b border-zinc-200">
									<h4 className="text-lg font-black text-zinc-900">
										{room.room_name}
									</h4>
								</div>

								<div className="p-5 space-y-6">
									{room.demolition_notes.length > 0 && (
										<div>
											<h5 className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1.5 mb-2">
												<Wrench className="w-3.5 h-3.5" /> Demo & Prep
											</h5>
											<ul className="space-y-2">
												{room.demolition_notes.map((note, i) => (
													<li
														key={i}
														className="flex items-start gap-2 text-sm text-zinc-700"
													>
														<CheckSquare className="w-4 h-4 mt-0.5 text-zinc-300 shrink-0" />{' '}
														{note}
													</li>
												))}
											</ul>
										</div>
									)}

									{room.installation_tasks.length > 0 && (
										<div>
											<h5 className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5 mb-2">
												<HardHat className="w-3.5 h-3.5" /> Execution
											</h5>
											<ul className="space-y-2">
												{room.installation_tasks.map((task, i) => (
													<li
														key={i}
														className="flex items-start gap-2 text-sm text-zinc-700 font-medium"
													>
														<CheckSquare className="w-4 h-4 mt-0.5 text-zinc-300 shrink-0" />{' '}
														{task}
													</li>
												))}
											</ul>
										</div>
									)}

									{room.materials_provided.length > 0 && (
										<div>
											<h5 className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1.5 mb-2">
												<Package className="w-3.5 h-3.5" /> Materials on Site
											</h5>
											<ul className="space-y-2 text-sm text-zinc-600 italic">
												{room.materials_provided.map((mat, i) => (
													<li key={i}>• {mat}</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						))}
					</div>

					<div className="flex justify-center pt-4">
						<button className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 shadow-sm rounded-full text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all">
							<Share className="w-4 h-4" /> Copy Briefing Link for Crew
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
