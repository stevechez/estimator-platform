'use client';

import { Brain, ChevronRight, Check, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
	return (
		// HERO SECTION
		<header className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-24">
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.035] px-3 py-1 text-sm font-medium tracking-wide text-slate-300">
					<Brain className="h-3.5 w-3.5 text-amber-400" />
					<span>The project brain for residential contractors</span>
				</div>

				<h1 className="mx-auto max-w-[21rem] text-center font-[var(--font-display)] text-[3rem] font-black leading-[0.92] tracking-[-0.045em] text-white [text-shadow:0_2px_18px_rgba(255,255,255,0.06)] sm:max-w-4xl sm:text-7xl md:text-8xl">
					Walk the job once.
					<br />
					<span className="block bg-gradient-to-r from-[#BFD0FF] via-[#8EA7DA] to-[#5E75A8] bg-clip-text text-transparent">
						BUILDRAIL
					</span>
					<span className="block bg-gradient-to-r from-[#8EA7DA] via-[#7189BA] to-[#4F638F] bg-clip-text text-transparent">
						remembers.
					</span>
				</h1>

				<p className="mx-auto max-w-[21rem] text-base font-light leading-7 text-slate-400 sm:max-w-3xl sm:text-lg sm:leading-8 md:text-xl">
					Capture voice, photos, emails, and field notes. BUILDRAIL turns messy
					jobsite context into project memory — then drafts proposals, crew
					briefings, homeowner updates, and reusable scope language.
				</p>

				<div className="mx-auto flex max-w-sm flex-col items-stretch justify-center gap-4 pt-4 sm:max-w-none sm:flex-row sm:items-center">
					<Link
						href="#waitlist"
						className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black tracking-[-0.01em] text-black shadow-[0_0_40px_-16px_rgba(255,255,255,0.75)] transition-all hover:bg-slate-200 active:scale-95 sm:w-auto sm:px-7"
					>
						Request Your 7-Day Field Trial
						<ChevronRight className="h-4 w-4 text-black transition-transform group-hover:translate-x-0.5" />
					</Link>
					<Link
						href="#workflow"
						className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-7 py-4 text-sm font-bold tracking-[-0.01em] text-white transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] sm:w-auto"
					>
						<PlayCircle className="h-4 w-4 text-slate-400" />
						See the Workflow
					</Link>
				</div>
			</div>

			<div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-semibold text-slate-500">
				<div className="flex items-center gap-2">
					<Check className="h-4 w-4 text-emerald-500" />
					Contractor-controlled pricing
				</div>
				<div className="flex items-center gap-2">
					<Check className="h-4 w-4 text-emerald-500" />
					Editable proposals and updates
				</div>
				<div className="flex items-center gap-2">
					<Check className="h-4 w-4 text-emerald-500" />
					Scope memory improves every job
				</div>
			</div>

			<p className="mx-auto mt-6 max-w-2xl text-xs leading-6 text-slate-600">
				Private beta. Field trial workspaces are currently activated manually
				during our reliability sprint.
			</p>
		</header>
	);
}
