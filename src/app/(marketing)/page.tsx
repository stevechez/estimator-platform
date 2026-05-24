import Link from 'next/link';
import type { ReactNode } from 'react';
import { Inter_Tight } from 'next/font/google';
import {
	ArrowRight,
	Brain,
	Camera,
	Check,
	ChevronRight,
	ClipboardList,
	FileText,
	Home,
	Mail,
	MessageSquareText,
	Mic,
	PlayCircle,
	Repeat,
	Sparkles,
	Users,
	Wrench,
	Zap,
} from 'lucide-react';
import { WaitlistForm } from '@/components/WaitlistForm';

const displayFont = Inter_Tight({
	subsets: ['latin'],
	weight: ['700', '800', '900'],
	variable: '--font-display',
});

export const metadata = {
	title: 'BUILDRAIL | The Project Brain for Residential Contractors',
	description:
		'BUILDRAIL turns walkthroughs, voice notes, photos, emails, and field details into project memory, proposal drafts, reusable scope language, crew briefings, and homeowner updates.',
};

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

const CaptureCard = ({
	icon,
	title,
	body,
}: {
	icon: ReactNode;
	title: string;
	body: string;
}) => (
	<div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
		<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-slate-200">
			{icon}
		</div>
		<h3 className="mb-2 font-[var(--font-display)] text-base font-black tracking-[-0.03em] text-white">
			{title}
		</h3>
		<p className="text-sm leading-6 text-slate-500">{body}</p>
	</div>
);

export default function GlobalLandingPage() {
	return (
		<div
			className={`${displayFont.variable} min-h-screen overflow-hidden bg-[#050505] font-sans text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-100`}
		>
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute left-[-10%] top-[-20%] h-[55%] w-[55%] rounded-full bg-blue-900/20 blur-[130px]" />
				<div className="absolute right-[-10%] top-[10%] h-[45%] w-[45%] rounded-full bg-amber-800/10 blur-[130px]" />
				<div className="absolute bottom-[-25%] left-[25%] h-[45%] w-[45%] rounded-full bg-emerald-900/10 blur-[130px]" />
			</div>

			<nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.05] bg-[#050505]/85 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
					<Link href="/" className="flex min-w-0 items-center gap-3">
						<BuildrailLogo />
						<span className="mt-0.5 text-base font-black tracking-[-0.03em] text-white sm:text-lg">
							BUILDRAIL
						</span>
					</Link>

					<div className="hidden items-center gap-8 md:flex">
						<Link
							href="#memory"
							className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
						>
							Memory
						</Link>

						<Link
							href="#workflow"
							className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
						>
							Workflow
						</Link>

						<Link
							href="#outputs"
							className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
						>
							Scope Memory
						</Link>
					</div>

					<div className="flex shrink-0 items-center gap-3">
						<Link
							href="/login"
							className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white sm:flex"
						>
							Sign In
						</Link>

						<Link
							href="#waitlist"
							className="rounded-xl bg-white px-4 py-3 text-sm font-black text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.35)] transition-all hover:bg-slate-200 active:scale-95 sm:px-4 sm:py-2"
						>
							Start Trial
						</Link>
					</div>
				</div>
			</nav>

			<header className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-44">
				<div className="mx-auto max-w-5xl space-y-8">
					<div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.035] px-3 py-1 text-xs font-medium tracking-wide text-slate-300">
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
						Capture voice, photos, emails, and field notes. BUILDRAIL turns
						messy jobsite context into project memory — then drafts proposals,
						crew briefings, homeowner updates, and reusable scope language.
					</p>

					<div className="mx-auto flex max-w-sm flex-col items-stretch justify-center gap-4 pt-4 sm:max-w-none sm:flex-row sm:items-center">
						<Link
							href="#waitlist"
							className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black tracking-[-0.01em] text-black shadow-[0_0_40px_-16px_rgba(255,255,255,0.75)] transition-all hover:bg-slate-200 active:scale-95 sm:w-auto sm:px-7"
						>
							Start Your 7-Day Field Trial
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

			<section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
				<div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-2 shadow-2xl">
					<div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

					<div className="grid overflow-hidden rounded-2xl border border-white/[0.04] bg-[#050505] lg:grid-cols-[1fr_0.8fr_1fr]">
						<div className="border-b border-white/[0.04] p-7 lg:border-b-0 lg:border-r">
							<div className="mb-6 flex items-center gap-3">
								<div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
								<span className="font-mono text-xs uppercase tracking-widest text-slate-500">
									Raw jobsite chaos
								</span>
							</div>

							<div className="space-y-4">
								<div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
									<div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
										<Mic className="h-3.5 w-3.5" />
										Voice note
									</div>
									<p className="text-sm leading-6 text-slate-300">
										“Master bath. Move shower valve to opposite wall. Homeowner
										wants niche centered. Confirm waterproofing before tile.”
									</p>
								</div>

								<div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
									<div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
										<Mail className="h-3.5 w-3.5" />
										Forwarded email
									</div>
									<p className="text-sm leading-6 text-slate-300">
										“Please include hidden condition language for old plumbing
										behind the shower wall.”
									</p>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="flex h-24 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
										<Camera className="h-5 w-5 text-slate-600" />
									</div>
									<div className="flex h-24 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
										<Camera className="h-5 w-5 text-slate-600" />
									</div>
								</div>
							</div>
						</div>

						<div className="relative flex min-h-[420px] flex-col items-center justify-center border-b border-white/[0.04] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.14),transparent_65%)] p-8 text-center lg:border-b-0 lg:border-r">
							<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-amber-300 shadow-[0_0_60px_-20px_rgba(245,158,11,0.8)]">
								<Brain className="h-10 w-10" />
							</div>

							<p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-300">
								Project Brain
							</p>

							<h2 className="mt-4 font-[var(--font-display)] text-2xl font-black tracking-[-0.035em] text-white">
								Everything becomes searchable project memory.
							</h2>

							<p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
								Facts, preferences, risks, decisions, and scope language stay
								attached to the job — not scattered across texts, emails, notes,
								and memory.
							</p>
						</div>

						<div className="p-7">
							<div className="mb-6 flex items-center gap-3">
								<Sparkles className="h-4 w-4 text-blue-400" />
								<span className="font-mono text-xs uppercase tracking-widest text-blue-400">
									Organized outputs
								</span>
							</div>

							<div className="space-y-3">
								{[
									{
										icon: <FileText className="h-4 w-4 text-blue-400" />,
										title: 'Proposal Draft',
										body: 'Editable homeowner-facing scope pulled from actual job context.',
									},
									{
										icon: <ClipboardList className="h-4 w-4 text-amber-300" />,
										title: 'Suggested Scope Blocks',
										body: 'Reuse your best waterproofing, exclusions, allowance, and rough-in language.',
										highlight: true,
									},
									{
										icon: <Users className="h-4 w-4 text-emerald-400" />,
										title: 'Crew Briefing',
										body: 'What the crew needs to know before work starts.',
									},
									{
										icon: (
											<MessageSquareText className="h-4 w-4 text-purple-400" />
										),
										title: 'Homeowner Update',
										body: 'Clean client communication from the same source of truth.',
									},
								].map(item => (
									<div
										key={item.title}
										className={[
											'rounded-xl border p-4',
											item.highlight
												? 'border-amber-400/20 bg-amber-400/[0.05]'
												: 'border-white/[0.06] bg-white/[0.025]',
										].join(' ')}
									>
										<div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
											{item.icon}
											{item.title}
										</div>
										<p className="text-sm leading-6 text-slate-500">
											{item.body}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section
				id="memory"
				className="relative z-10 border-t border-white/[0.03] px-5 py-20 sm:px-6 sm:py-32"
			>
				<div className="mx-auto max-w-6xl">
					<div className="mx-auto mb-16 max-w-3xl text-center">
						<p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
							The category shift
						</p>
						<h2 className="font-[var(--font-display)] text-4xl font-black leading-[0.95] tracking-[-0.035em] text-white md:text-6xl">
							Not another estimating form.
							<br />
							<span className="bg-gradient-to-r from-[#FFE0A3] via-[#F59E0B] to-[#EA580C] bg-clip-text text-transparent">
								A project clarity system.
							</span>
						</h2>
						<p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-8 text-slate-400">
							Most software starts with a blank form. BUILDRAIL starts with what
							actually happened on the job.
						</p>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<CaptureCard
							icon={<Brain className="h-5 w-5" />}
							title="Project Memory"
							body="Every voice note, email, site detail, homeowner preference, risk, and decision stays attached to the project."
						/>
						<CaptureCard
							icon={<ClipboardList className="h-5 w-5" />}
							title="Scope Memory"
							body="Your best reusable language becomes company memory — waterproofing prep, exclusions, allowances, rough-in notes, and more."
						/>
						<CaptureCard
							icon={<FileText className="h-5 w-5" />}
							title="Proposal Drafts"
							body="Turn walkthrough context into editable homeowner-facing proposal language without rewriting your notes at night."
						/>
						<CaptureCard
							icon={<Users className="h-5 w-5" />}
							title="Crew + Homeowner Updates"
							body="Use the same project memory to prepare the crew and keep homeowners informed with clean, consistent updates."
						/>
					</div>
				</div>
			</section>

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

			<section
				id="outputs"
				className="relative z-10 overflow-hidden border-t border-white/[0.03] px-5 py-20 sm:px-6 sm:py-32"
			>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(16,185,129,0.08),transparent_42%)]" />

				<div className="relative mx-auto max-w-6xl">
					<div className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
						<div>
							<p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-emerald-400">
								Compounding scope memory
							</p>

							<h2 className="font-[var(--font-display)] text-4xl font-black leading-[0.95] tracking-[-0.035em] text-white md:text-6xl">
								Your best scope language
								<br />
								<span className="bg-gradient-to-r from-[#B8F7D4] via-[#6EE7B7] to-[#34D399] bg-clip-text text-transparent">
									should not die in one proposal.
								</span>
							</h2>
						</div>

						<p className="max-w-xl text-lg font-light leading-8 text-slate-400 lg:justify-self-end">
							When you edit a line item into something better, save it back to
							Scope Memory. Next time, BUILDRAIL suggests that language when the
							job calls for it.
						</p>
					</div>

					<div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-stretch">
						<div className="space-y-5">
							<div className="rounded-3xl border border-white/[0.07] bg-[#0A0A0A]/80 p-6 shadow-2xl shadow-black/20">
								<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/20">
									<Repeat className="h-5 w-5" />
								</div>

								<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-600">
									The retention loop
								</p>

								<h3 className="mb-4 font-[var(--font-display)] text-2xl font-black tracking-[-0.035em] text-white">
									Every edited proposal makes the next one faster.
								</h3>

								<p className="text-sm leading-7 text-slate-400">
									Your strongest wording becomes reusable company memory — not
									buried in an old PDF, email thread, or one person’s head.
								</p>
							</div>

							<div className="grid gap-3">
								{[
									'Shower valve relocation',
									'Waterproofing prep',
									'Hidden condition exclusions',
									'Allowance language',
								].map(label => (
									<div
										key={label}
										className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-slate-300"
									>
										<div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
											<Check className="h-3.5 w-3.5" />
										</div>
										{label}
									</div>
								))}
							</div>
						</div>

						<div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-2 shadow-2xl shadow-black/30">
							<div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

							<div className="relative rounded-2xl border border-white/[0.04] bg-[#050505] p-6">
								<div className="mb-6 flex items-start justify-between gap-6">
									<div>
										<p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
											Suggested Scope Blocks
										</p>

										<h3 className="mt-2 font-[var(--font-display)] text-2xl font-black tracking-[-0.035em] text-white">
											Reusable language from your memory
										</h3>

										<p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
											BUILDRAIL surfaces the language most likely to fit the
											current job — then lets you copy, insert, edit, and save
											the improved version.
										</p>
									</div>

									<div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/20 sm:flex">
										<Sparkles className="h-5 w-5" />
									</div>
								</div>

								<div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
									<div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.055] p-5 shadow-[0_0_60px_-30px_rgba(245,158,11,0.8)]">
										<div className="mb-4 flex items-start justify-between gap-3">
											<div>
												<p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-200/70">
													High confidence match
												</p>

												<h4 className="font-[var(--font-display)] text-xl font-black tracking-[-0.03em] text-white">
													Shower Valve Relocation
												</h4>
											</div>

											<span className="shrink-0 rounded-full bg-white/[0.08] px-2 py-1 text-[11px] font-semibold text-slate-300">
												0.94
											</span>
										</div>

										<p className="text-sm leading-7 text-slate-300">
											Relocate shower valve to approved wall location. Includes
											opening wall cavity, adjusting supply lines, setting valve
											at agreed height, and coordinating final trim placement.
										</p>

										<div className="mt-5 flex gap-2">
											<button className="rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.1]">
												Copy
											</button>
											<button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-[0_0_30px_-12px_rgba(37,99,235,0.8)] transition hover:bg-blue-500">
												Insert
											</button>
										</div>
									</div>

									<div className="space-y-4">
										<div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
											<div className="mb-3 flex items-start justify-between gap-3">
												<h4 className="font-[var(--font-display)] text-lg font-black tracking-[-0.03em] text-white">
													Hidden Conditions Exclusion
												</h4>

												<span className="shrink-0 rounded-full bg-white/[0.08] px-2 py-1 text-[11px] font-semibold text-slate-400">
													0.88
												</span>
											</div>

											<p className="text-sm leading-6 text-slate-500">
												Existing concealed plumbing, framing, electrical, rot,
												or structural conditions discovered after opening walls
												are excluded unless specifically listed.
											</p>
										</div>

										<div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
											<div className="mb-3 flex items-start justify-between gap-3">
												<h4 className="font-[var(--font-display)] text-lg font-black tracking-[-0.03em] text-white">
													Waterproofing Prep
												</h4>

												<span className="shrink-0 rounded-full bg-white/[0.08] px-2 py-1 text-[11px] font-semibold text-slate-400">
													0.84
												</span>
											</div>

											<p className="text-sm leading-6 text-slate-500">
												Prepare shower walls for waterproofing system, including
												substrate review, seams, penetrations, and manufacturer
												installation requirements.
											</p>
										</div>
									</div>
								</div>

								<div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
									<div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
										<p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">
											Contractor edits
										</p>
										<p className="text-sm leading-6 text-slate-400">
											Add job-specific details, exclusions, and
											homeowner-approved locations before saving.
										</p>
									</div>

									<div className="hidden text-emerald-300 md:block">
										<ArrowRight className="h-5 w-5" />
									</div>

									<div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.055] p-4">
										<div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
											<Check className="h-4 w-4" />
											Saved as reusable scope block
										</div>
										<p className="mt-2 text-sm leading-6 text-emerald-100/70">
											The improved language is now available for future jobs.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

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
							BUILDRAIL turns field intelligence into the documents, updates,
							and briefings your business needs next.
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
									job. Capture the walkthrough, draft the follow-up, and decide
									if project memory belongs in your workflow.
								</p>

								<div className="mt-8 grid gap-3 sm:grid-cols-3">
									{[
										'Faster follow-up',
										'Cleaner scope',
										'Smarter every job',
									].map(item => (
										<div
											key={item}
											className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-slate-300"
										>
											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
												<Check className="h-3.5 w-3.5" />
											</div>
											{item}
										</div>
									))}
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
											Start trial
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
											We do not sell your contact information. Ever. Your trial
											is for testing BUILDRAIL on your workflow — not joining a
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

			<footer className="relative z-10 overflow-hidden border-t border-white/[0.04] bg-[#050505] px-6 py-12">
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.045),transparent_38%)]" />

				<div className="relative mx-auto max-w-7xl">
					<div className="grid gap-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
						<div>
							<div className="mb-4 flex items-center gap-3">
								<BuildrailLogo />
								<span className="font-[var(--font-display)] text-lg font-black tracking-[-0.03em] text-white">
									BUILDRAIL
								</span>
							</div>

							<p className="max-w-xl text-sm leading-6 text-slate-500">
								The project brain for residential contractors — turning
								walkthroughs, notes, emails, and field details into reusable
								company memory.
							</p>
						</div>

						<div className="flex flex-col gap-4 md:items-end">
							<div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-500">
								<Link
									className="transition-colors hover:text-white"
									href="/privacy"
								>
									Privacy
								</Link>
								<Link
									className="transition-colors hover:text-white"
									href="/terms"
								>
									Terms
								</Link>
								<Link
									className="transition-colors hover:text-white"
									href="#waitlist"
								>
									Contact
								</Link>
							</div>

							<p className="text-sm font-medium text-slate-600">
								© {new Date().getFullYear()} BUILDRAIL. Built for the field.
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
