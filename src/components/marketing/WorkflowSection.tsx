'use client';

import { Brain, FileText, Mic, Repeat } from 'lucide-react';

export default function WorkflowSection() {
	return (
		// WORKFLOW SECTION
		<section
			id="workflow"
			className="relative z-10 overflow-hidden border-t border-white/[0.03] px-5 py-20 sm:px-6 sm:py-32"
		>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_45%)]" />

			<div className="relative mx-auto max-w-6xl">
				<div className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
					<div>
						<p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-400">
							Workflow
						</p>

						<h2 className="font-[var(--font-display)] text-4xl font-black leading-[0.95] tracking-[-0.035em] text-white md:text-6xl">
							Capture the walkthrough.
							<br />
							<span className="bg-gradient-to-r from-[#AFC2EE] via-[#8EA7DA] to-[#5F76A6] bg-clip-text text-transparent">
								Ship the follow-up.
							</span>
						</h2>
					</div>

					<p className="max-w-xl text-lg font-light leading-8 text-slate-400 lg:justify-self-end">
						BUILDRAIL turns one messy site visit into the outputs contractors
						actually need: project memory, proposal language, crew notes,
						homeowner updates, and reusable scope blocks.
					</p>
				</div>

				<div className="relative">
					<div className="absolute left-6 top-8 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-blue-500/40 via-amber-400/35 to-emerald-400/30 lg:block" />

					<div className="grid gap-5 lg:grid-cols-4">
						{[
							{
								step: '01',
								label: 'Field input',
								title: 'Capture',
								body: 'Walk the job like normal. Talk through the scope, snap photos, and forward the homeowner emails that matter.',
								output: 'Voice • Photos • Email',
								icon: <Mic className="h-5 w-5" />,
								accent: 'blue',
							},
							{
								step: '02',
								label: 'Project brain',
								title: 'Remember',
								body: 'BUILDRAIL organizes the facts, risks, preferences, decisions, and hidden conditions into searchable project memory.',
								output: 'Structured job context',
								icon: <Brain className="h-5 w-5" />,
								accent: 'amber',
							},
							{
								step: '03',
								label: 'Useful output',
								title: 'Draft',
								body: 'Generate editable proposal language, crew briefings, and homeowner updates from the same source of truth.',
								output: 'Proposal • Crew • Client',
								icon: <FileText className="h-5 w-5" />,
								accent: 'purple',
							},
							{
								step: '04',
								label: 'Compounding memory',
								title: 'Reuse',
								body: 'Save your best edited scope language so the next bathroom, kitchen, or remodel starts smarter than the last.',
								output: 'Scope library improves',
								icon: <Repeat className="h-5 w-5" />,
								accent: 'emerald',
							},
						].map(item => {
							const accentClasses = {
								blue: {
									icon: 'bg-blue-500/10 text-blue-300 ring-blue-400/20',
									step: 'text-blue-300',
									glow: 'from-blue-500/15',
								},
								amber: {
									icon: 'bg-amber-400/10 text-amber-300 ring-amber-300/20',
									step: 'text-amber-300',
									glow: 'from-amber-400/15',
								},
								purple: {
									icon: 'bg-purple-400/10 text-purple-300 ring-purple-300/20',
									step: 'text-purple-300',
									glow: 'from-purple-400/15',
								},
								emerald: {
									icon: 'bg-emerald-400/10 text-emerald-300 ring-emerald-300/20',
									step: 'text-emerald-300',
									glow: 'from-emerald-400/15',
								},
							}[item.accent as 'blue' | 'amber' | 'purple' | 'emerald'];

							return (
								<div
									key={item.step}
									className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0A0A0A]/80 p-6 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.035]"
								>
									<div
										className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${accentClasses.glow} to-transparent opacity-0 transition duration-300 group-hover:opacity-100`}
									/>

									<div className="relative mb-8 flex items-start justify-between">
										<div
											className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${accentClasses.icon}`}
										>
											{item.icon}
										</div>

										<div
											className={`font-[var(--font-display)] text-5xl font-black leading-none tracking-[-0.05em] ${accentClasses.step} opacity-20 transition group-hover:opacity-40`}
										>
											{item.step}
										</div>
									</div>

									<div className="relative">
										<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-600">
											{item.label}
										</p>

										<h3 className="mb-4 font-[var(--font-display)] text-2xl font-black tracking-[-0.035em] text-white">
											{item.title}
										</h3>

										<p className="min-h-[120px] text-sm leading-6 text-slate-400">
											{item.body}
										</p>

										<div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-slate-300">
											{item.output}
										</div>
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
