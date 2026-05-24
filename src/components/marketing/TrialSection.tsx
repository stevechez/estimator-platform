'use client';

import { ArrowRight, ChevronRight, Check, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { WaitlistForm } from '@/components/WaitlistForm';

const BuildrailLogo = () => (
	<svg
		width="28"
		height="28"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="shrink-0"
	>
		<path
			d="M5 14L11 6L18 10L14 18Z"
			stroke="#F59E0B"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M11 6L14 18"
			stroke="#F59E0B"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<circle
			cx="5"
			cy="14"
			r="3"
			fill="#F59E0B"
			stroke="#0A0A0A"
			strokeWidth="1.5"
		/>
		<circle
			cx="11"
			cy="6"
			r="3"
			fill="#F59E0B"
			stroke="#0A0A0A"
			strokeWidth="1.5"
		/>
		<circle
			cx="18"
			cy="10"
			r="3"
			fill="#F59E0B"
			stroke="#0A0A0A"
			strokeWidth="1.5"
		/>
		<circle
			cx="14"
			cy="18"
			r="3"
			fill="#F59E0B"
			stroke="#0A0A0A"
			strokeWidth="1.5"
		/>
	</svg>
);

export default function TrialSection() {
	return (
		// TRIAL SECTION
		<section
			id="waitlist"
			className="relative z-10 overflow-hidden border-t border-white/[0.03] px-5 py-20 sm:px-6 sm:py-32"
		>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_42%)]" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-amber-500/[0.04] to-transparent" />

			<div className="relative mx-auto max-w-6xl">
				<div className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0A0A0A]/80 p-2 shadow-2xl shadow-black/30">
					<div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

					<div className="relative grid gap-10 rounded-[1.5rem] border border-white/[0.04] bg-[#050505] p-8 md:p-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
						<div>
							<div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300">
								<BuildrailLogo />
								<span>7-day field trial</span>
							</div>

							<p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
								Build your project brain
							</p>

							<h2 className="font-[var(--font-display)] text-4xl font-black leading-[0.95] tracking-[-0.035em] text-white md:text-6xl">
								Try BUILDRAIL on a real walkthrough.
								<br />
								<span className="bg-gradient-to-r from-[#FFE0A3] via-[#F59E0B] to-[#EA580C] bg-clip-text text-transparent">
									See what it remembers.
								</span>
							</h2>

							<p className="mt-6 max-w-2xl text-lg font-light leading-8 text-slate-400">
								Start a 7-day trial and use BUILDRAIL on an actual residential
								job. Capture the walkthrough, draft the follow-up, and decide if
								project memory belongs in your workflow.
							</p>

							<div className="mt-8 grid gap-3 sm:grid-cols-3">
								{['Faster follow-up', 'Cleaner scope', 'Smarter every job'].map(
									item => (
										<div
											key={item}
											className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-slate-300"
										>
											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
												<Check className="h-3.5 w-3.5" />
											</div>
											{item}
										</div>
									),
								)}
							</div>

							<Link
								href="#memory"
								className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-white"
							>
								Learn how BUILDRAIL works
								<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
							</Link>
						</div>

						<div className="relative">
							<div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-amber-400/[0.06] blur-2xl" />

							<div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-2xl shadow-black/30">
								<div className="mb-5">
									<p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">
										Request trial
									</p>

									<h3 className="mt-2 font-[var(--font-display)] text-2xl font-black tracking-[-0.035em] text-white">
										Create your 7-day field trial workspace.
									</h3>

									<p className="mt-3 text-sm leading-6 text-slate-500">
										Use BUILDRAIL on a real walkthrough. No fake waitlist. No
										long onboarding sequence. Just a focused trial of the
										workflow.
									</p>
								</div>

								<div className="rounded-2xl border border-white/[0.06] bg-[#050505] p-4">
									<WaitlistForm />
								</div>

								<div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4">
									<div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
										<Check className="h-4 w-4" />
										No spam. No sold lists. No surprise calls.
									</div>
									<p className="mt-2 text-sm leading-6 text-emerald-100/70">
										We do not sell your contact information. Ever. Your trial is
										for testing BUILDRAIL on your workflow — not joining a
										marketing funnel.
									</p>
								</div>

								<p className="mt-4 text-xs leading-5 text-slate-600">
									Private beta. Trial workspaces are currently activated
									manually while we complete the final reliability pass.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
