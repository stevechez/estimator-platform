'use client';

import { useState } from 'react';
import {
	Activity,
	MessageSquare,
	HardHat,
	AlertTriangle,
	ChevronRight,
	MoreHorizontal,
	FolderOpen,
} from 'lucide-react';

// 1. Import the actual components
import VoiceDumpButton from '@/components/memory/VoiceDumpButton';
import ProjectBrainUI from '@/components/memory/ProjectBrainUI';
import HomeownerUpdateUI from '@/components/communication/HomeownerUpdateUI';
import CrewBriefingUI from '@/components/operational/CrewBriefingUI';

// Note: Assuming you saved your ScopeCheckSandbox as a default export in the app directory.
// If your path is different, update this import to point to where you saved it.
import ScopeCheckSandbox from '@/app/scopecheck/page';

export default function ProjectDashboard() {
	const [activeTab, setActiveTab] = useState<
		'memory' | 'homeowner' | 'crew' | 'scope'
	>('memory');

	// 2. Add your real Supabase Project UUID here
	const TEST_PROJECT_ID = 'PASTE-YOUR-COPIED-UUID-HERE';

	const project = {
		name: 'The Miller Custom Build',
		address: '442 Oceanview Dr, Aptos, CA',
		status: 'Active Execution',
		contractValue: '$185,000',
		daysActive: 24,
	};

	return (
		<div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
			<header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shadow-inner">
							<FolderOpen className="w-6 h-6 text-white" strokeWidth={1.5} />
						</div>
						<div>
							<h1 className="text-xl font-black text-zinc-900 tracking-tight">
								{project.name}
							</h1>
							<p className="text-sm font-medium text-zinc-500">
								{project.address}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-6">
						<div className="text-right hidden md:block">
							<p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
								Contract Value
							</p>
							<p className="text-lg font-black text-zinc-900">
								{project.contractValue}
							</p>
						</div>
						<div className="h-8 w-px bg-zinc-200 hidden md:block"></div>
						<div className="text-right hidden md:block">
							<p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
								Timeline
							</p>
							<p className="text-lg font-black text-emerald-600">
								Day {project.daysActive}
							</p>
						</div>
						<button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
							<MoreHorizontal className="w-5 h-5" />
						</button>
					</div>
				</div>
			</header>

			<div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 px-6 py-8">
				<aside className="w-full md:w-64 shrink-0 space-y-6">
					<div className="p-4 bg-zinc-900 rounded-2xl text-white shadow-lg">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
								Status
							</span>
							<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
						</div>
						<p className="font-semibold">{project.status}</p>
					</div>

					<nav className="space-y-1">
						<h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-3 mb-3">
							Project Intelligence
						</h3>

						<button
							onClick={() => setActiveTab('memory')}
							className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
								activeTab === 'memory'
									? 'bg-white border-zinc-200 shadow-sm text-blue-600'
									: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border-transparent'
							} border`}
						>
							<div className="flex items-center gap-3">
								<Activity className="w-4 h-4" />
								Project Memory
							</div>
							{activeTab === 'memory' && <ChevronRight className="w-4 h-4" />}
						</button>

						<button
							onClick={() => setActiveTab('homeowner')}
							className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
								activeTab === 'homeowner'
									? 'bg-white border-zinc-200 shadow-sm text-blue-600'
									: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border-transparent'
							} border`}
						>
							<div className="flex items-center gap-3">
								<MessageSquare className="w-4 h-4" />
								Client Updates
							</div>
							{activeTab === 'homeowner' && (
								<ChevronRight className="w-4 h-4" />
							)}
						</button>

						<button
							onClick={() => setActiveTab('crew')}
							className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
								activeTab === 'crew'
									? 'bg-white border-zinc-200 shadow-sm text-blue-600'
									: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border-transparent'
							} border`}
						>
							<div className="flex items-center gap-3">
								<HardHat className="w-4 h-4" />
								Crew Briefing
							</div>
							{activeTab === 'crew' && <ChevronRight className="w-4 h-4" />}
						</button>

						<button
							onClick={() => setActiveTab('scope')}
							className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
								activeTab === 'scope'
									? 'bg-white border-zinc-200 shadow-sm text-blue-600'
									: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border-transparent'
							} border`}
						>
							<div className="flex items-center gap-3">
								<AlertTriangle className="w-4 h-4" />
								Scope Analysis
							</div>
							{activeTab === 'scope' && <ChevronRight className="w-4 h-4" />}
						</button>
					</nav>
				</aside>

				<main className="flex-1 min-h-[600px]">
					{/* 3. Mount the real components and pass the ID */}
					{activeTab === 'memory' && (
						<div className="h-full animate-in fade-in duration-300">
							<ProjectBrainUI projectId={TEST_PROJECT_ID} />
						</div>
					)}

					{activeTab === 'homeowner' && (
						<div className="h-full animate-in fade-in duration-300 pt-4">
							<HomeownerUpdateUI projectId={TEST_PROJECT_ID} />
						</div>
					)}

					{activeTab === 'crew' && (
						<div className="h-full animate-in fade-in duration-300 pt-4">
							<CrewBriefingUI projectId={TEST_PROJECT_ID} />
						</div>
					)}

					{activeTab === 'scope' && (
						<div className="h-full animate-in fade-in duration-300 bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
							{/* Mounts the full Scope Sandbox inside the dashboard card */}
							<ScopeCheckSandbox />
						</div>
					)}
				</main>
			</div>

			{/* 4. Pass the ID to the Voice Dump Button */}
			<VoiceDumpButton projectId="170b0286-a958-4eb0-9863-a1e20a9ee125" />
		</div>
	);
}
