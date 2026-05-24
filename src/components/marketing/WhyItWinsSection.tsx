'use client';

import { Brain, Home, Check, Wrench, ArrowRight, Zap } from 'lucide-react';

export default function WhyItWinsSection() {
	return (
		// WHY IT WINS SECTION
		<section className="relative z-10 overflow-hidden border-t border-white/[0.03] px-5 py-20 sm:px-6 sm:py-32">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,0.08),transparent_42%)]" />

			<div className="relative mx-auto max-w-6xl">
				<div className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
					<div>
						<p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
							Why it wins
						</p>

						<h2 className="font-[var(--font-display)] text-4xl font-black leading-[0.95] tracking-[-0.035em] text-white md:text-6xl">
							Your walkthrough is not just a note.
							<br />
							<span className="bg-gradient-to-r from-[#FFE0A3] via-[#F59E0B] to-[#EA580C] bg-clip-text text-transparent">
								It is the raw material for every follow-up.
							</span>
						</h2>
					</div>

					<p className="max-w-xl text-lg font-light leading-8 text-slate-400 lg:justify-self-end">
						Most tools capture information and leave you to organize it later.
						BUILDRAIL turns field intelligence into the documents, updates, and
						briefings your business needs next.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
					<div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0A0A0A]/80 p-7 shadow-2xl shadow-black/20">
						<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-400/10 to-transparent" />

						<div className="relative">
							<div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/20">
								<Brain className="h-6 w-6" />
							</div>

							<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-600">
								From scattered details
							</p>

							<h3 className="mb-5 font-[var(--font-display)] text-3xl font-black leading-[0.98] tracking-[-0.04em] text-white">
								The job details finally have somewhere to live.
							</h3>

							<p className="text-sm leading-7 text-slate-400">
								Voice notes, photos, forwarded emails, homeowner preferences,
								hidden conditions, crew constraints, and scope decisions all
								become part of the same project brain.
							</p>

							<div className="mt-8 space-y-3">
								{[
									'Voice notes from the walkthrough',
									'Photos and site conditions',
									'Forwarded homeowner emails',
									'Scope decisions and exclusions',
								].map(item => (
									<div
										key={item}
										className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-slate-300"
									>
										<div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
											<Check className="h-3.5 w-3.5" />
										</div>
										{item}
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						{[
							{
								title: 'Homeowner-ready communication',
								body: 'Send cleaner updates without re-explaining the job from scratch.',
								kicker: 'Client trust',
								icon: <Home className="h-5 w-5" />,
								accent: 'blue',
							},
							{
								title: 'Crew-ready details',
								body: 'Convert memory into briefings with room-by-room scope, risks, access notes, and dependencies.',
								kicker: 'Jobsite clarity',
								icon: <Wrench className="h-5 w-5" />,
								accent: 'emerald',
							},
							{
								title: 'Faster proposal follow-up',
								body: 'Get from site visit to editable proposal draft faster, while keeping pricing contractor-controlled.',
								kicker: 'Speed to send',
								icon: <Zap className="h-5 w-5" />,
								accent: 'amber',
							},
							{
								title: 'Company memory',
								body: 'Stop losing job intelligence in texts, emails, notebooks, and one person’s head.',
								kicker: 'Operational memory',
								icon: <Brain className="h-5 w-5" />,
								accent: 'purple',
							},
						].map(item => {
							const accentClasses = {
								blue: {
									icon: 'bg-blue-500/10 text-blue-300 ring-blue-400/20',
									glow: 'from-blue-500/15',
									kicker: 'text-blue-300',
								},
								emerald: {
									icon: 'bg-emerald-400/10 text-emerald-300 ring-emerald-300/20',
									glow: 'from-emerald-400/15',
									kicker: 'text-emerald-300',
								},
								amber: {
									icon: 'bg-amber-400/10 text-amber-300 ring-amber-300/20',
									glow: 'from-amber-400/15',
									kicker: 'text-amber-300',
								},
								purple: {
									icon: 'bg-purple-400/10 text-purple-300 ring-purple-300/20',
									glow: 'from-purple-400/15',
									kicker: 'text-purple-300',
								},
							}[item.accent as 'blue' | 'emerald' | 'amber' | 'purple'];

							return (
								<div
									key={item.title}
									className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0A0A0A]/80 p-6 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.035]"
								>
									<div
										className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${accentClasses.glow} to-transparent opacity-0 transition duration-300 group-hover:opacity-100`}
									/>

									<div className="relative mb-7 flex items-center justify-between">
										<div
											className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${accentClasses.icon}`}
										>
											{item.icon}
										</div>

										<ArrowRight className="h-4 w-4 text-white/15 transition group-hover:translate-x-1 group-hover:text-white/35" />
									</div>

									<div className="relative">
										<p
											className={`mb-3 font-mono text-[11px] uppercase tracking-[0.22em] ${accentClasses.kicker}`}
										>
											{item.kicker}
										</p>

										<h3 className="mb-4 font-[var(--font-display)] text-2xl font-black leading-[1] tracking-[-0.035em] text-white">
											{item.title}
										</h3>

										<p className="text-sm leading-7 text-slate-400">
											{item.body}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
