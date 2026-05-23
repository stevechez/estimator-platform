'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
	Activity,
	MessageSquare,
	HardHat,
	AlertTriangle,
	ChevronRight,
	MoreHorizontal,
	FolderOpen,
} from 'lucide-react';
import Link from 'next/link';

import VoiceDumpButton from '@/components/memory/VoiceDumpButton';
import ProjectBrainUI from '@/components/memory/ProjectBrainUI';
import HomeownerUpdateUI from '@/components/communication/HomeownerUpdateUI';
import CrewBriefingUI from '@/components/operational/CrewBriefingUI';
import ScopeCheckSandbox from '@/app/scopecheck/page';

type ActiveTab = 'memory' | 'homeowner' | 'crew' | 'scope';

const project = {
	name: 'The Miller Custom Build',
	address: '442 Oceanview Dr, Aptos, CA',
	status: 'Active Execution',
	contractValue: '$185,000',
	daysActive: 24,
};

const navItems: Array<{
	id: ActiveTab;
	label: string;
	icon: typeof Activity;
}> = [
	{
		id: 'memory',
		label: 'Project Memory',
		icon: Activity,
	},
	{
		id: 'homeowner',
		label: 'Client Updates',
		icon: MessageSquare,
	},
	{
		id: 'crew',
		label: 'Crew Briefing',
		icon: HardHat,
	},
	{
		id: 'scope',
		label: 'Scope Analysis',
		icon: AlertTriangle,
	},
];

export default function ProjectDashboard() {
	const [activeTab, setActiveTab] = useState<ActiveTab>('crew');
	const params = useParams<{ id: string }>();

	const projectId = params.id;

	return (
		<div className="flex min-h-screen flex-col bg-zinc-50 font-sans">
			<header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
				<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
					<div className="flex items-center gap-4">
						<Link
							href="/dashboard"
							className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 shadow-inner transition hover:bg-zinc-800"
							aria-label="Back to dashboard"
						>
							<FolderOpen className="h-6 w-6 text-white" strokeWidth={1.5} />
						</Link>

						<div>
							<h1 className="text-xl font-black tracking-tight text-zinc-900">
								{project.name}
							</h1>
							<p className="text-sm font-medium text-zinc-500">
								{project.address}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-6">
						<div className="hidden text-right md:block">
							<p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
								Contract Value
							</p>
							<p className="text-lg font-black text-zinc-900">
								{project.contractValue}
							</p>
						</div>

						<div className="hidden h-8 w-px bg-zinc-200 md:block" />

						<div className="hidden text-right md:block">
							<p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
								Timeline
							</p>
							<p className="text-lg font-black text-emerald-600">
								Day {project.daysActive}
							</p>
						</div>

						<button
							type="button"
							className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
							aria-label="Project actions"
						>
							<MoreHorizontal className="h-5 w-5" />
						</button>
					</div>
				</div>
			</header>

			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8 md:flex-row">
				<aside className="w-full shrink-0 space-y-6 md:w-64">
					<div className="rounded-2xl bg-zinc-900 p-4 text-white shadow-lg">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
								Status
							</span>
							<span className="h-2 w-2 rounded-full bg-emerald-500" />
						</div>
						<p className="font-semibold">{project.status}</p>
					</div>

					<nav className="space-y-1">
						<h3 className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
							Project Intelligence
						</h3>

						{navItems.map(item => {
							const Icon = item.icon;
							const isActive = activeTab === item.id;

							return (
								<button
									key={item.id}
									type="button"
									onClick={() => setActiveTab(item.id)}
									className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm font-bold transition-all ${
										isActive
											? 'border-zinc-200 bg-white text-blue-600 shadow-sm'
											: 'border-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
									}`}
								>
									<div className="flex items-center gap-3">
										<Icon className="h-4 w-4" />
										{item.label}
									</div>

									{isActive && <ChevronRight className="h-4 w-4" />}
								</button>
							);
						})}
					</nav>
				</aside>

				<main className="min-h-[600px] flex-1">
					{activeTab === 'memory' && (
						<div className="h-full animate-in fade-in duration-300">
							<ProjectBrainUI projectId={projectId} />
						</div>
					)}

					{activeTab === 'homeowner' && (
						<div className="h-full animate-in fade-in pt-4 duration-300">
							<HomeownerUpdateUI projectId={projectId} />
						</div>
					)}

					{activeTab === 'crew' && (
						<div className="h-full animate-in fade-in pt-4 duration-300">
							<CrewBriefingUI projectId={projectId} />
						</div>
					)}

					{activeTab === 'scope' && (
						<div className="h-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm animate-in fade-in duration-300">
							<ScopeCheckSandbox />
						</div>
					)}
				</main>
			</div>

			<VoiceDumpButton projectId={projectId} />
		</div>
	);
}
