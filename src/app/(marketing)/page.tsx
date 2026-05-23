import Link from 'next/link';
import {
	Mic,
	Camera,
	LayoutList,
	PlayCircle,
	Check,
	ChevronRight,
	Zap,
	FileText,
	Settings2,
	ShieldCheck,
} from 'lucide-react';
import { WaitlistForm } from '@/components/WaitlistForm';

export const metadata = {
	title: 'BUILDRAIL | The AI Estimating OS for Contractors',
	description:
		'Estimate the job before you leave the driveway. The field-first operating system for residential contractors.',
};

// Scalable SVG Logo
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

export default function GlobalLandingPage() {
	return (
		<div className="min-h-screen bg-[#050505] text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200 font-sans overflow-hidden">
			{/* Cinematic Background Glows */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full" />
				<div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 blur-[120px] rounded-full" />
			</div>

			{/* --- TOP NAVIGATION --- */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/[0.04] px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-3">
						<BuildrailLogo />
						<span className="text-lg font-bold tracking-tight text-white mt-0.5">
							BUILDRAIL
						</span>
					</div>

					<div className="hidden md:flex items-center gap-8">
						<Link
							href="#platform"
							className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
						>
							Platform
						</Link>
						<Link
							href="#workflow"
							className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
						>
							Workflow
						</Link>
					</div>

					<div className="flex items-center gap-4">
						<Link
							href="#waitlist"
							className="hidden sm:flex text-sm font-medium text-slate-300 hover:text-white transition-colors"
						>
							Sign In
						</Link>
						<Link
							href="#waitlist"
							className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-all active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
						>
							Request Early Access
						</Link>
					</div>
				</div>
			</nav>

			{/* --- HERO SECTION --- */}
			<header className="relative max-w-7xl mx-auto pt-48 pb-20 px-6 text-center z-10">
				<div className="space-y-8 max-w-4xl mx-auto">
					<div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-full text-xs font-medium tracking-wide text-slate-300">
						<Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
						<span>The AI Estimating OS for Residential Contractors</span>
					</div>

					<h1 className="text-6xl sm:text-7xl md:text-8xl font-medium tracking-tighter leading-[1.05] text-white">
						Estimate the job <br className="hidden md:block" />
						<span className="text-slate-500">
							before you leave the driveway.
						</span>
					</h1>

					<p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-light">
						Walk the site, speak naturally, and let BUILDRAIL generate your
						structured scope and proposal draft instantly. Stop spending your
						evenings rewriting notes.
					</p>

					<div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
						<Link
							href="#waitlist"
							className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-xl font-medium transition-all hover:bg-slate-200"
						>
							Request Early Access
							<ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
						</Link>
						<button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all font-medium text-white">
							<PlayCircle className="w-4 h-4 text-slate-400" />
							Watch the Workflow
						</button>
					</div>
				</div>

				{/* Objection Killer Strip */}
				<div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-500 font-medium">
					<div className="flex items-center gap-2">
						<Check className="w-4 h-4 text-emerald-500" /> You control the final
						pricing
					</div>
					<div className="flex items-center gap-2">
						<Check className="w-4 h-4 text-emerald-500" /> Fully editable scope
						outputs
					</div>
					<div className="flex items-center gap-2">
						<Check className="w-4 h-4 text-emerald-500" /> Exports clean PDF
						proposals
					</div>
				</div>
			</header>

			{/* --- BELIEVABLE PRODUCT VISUAL (High Fidelity) --- */}
			<section className="relative max-w-6xl mx-auto px-6 pb-32 z-10">
				<div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-2 shadow-2xl overflow-hidden relative">
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

					<div className="grid md:grid-cols-2 bg-[#050505] rounded-xl border border-white/[0.04] overflow-hidden">
						{/* Raw Input Side */}
						<div className="p-8 border-b md:border-b-0 md:border-r border-white/[0.04] bg-[radial-gradient(ellipse_at_top_left,#ffffff03_0%,transparent_80%)]">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
								<span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
									Live Capture
								</span>
							</div>
							<p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
								&quot;Alright, master bath. This is a{' '}
								<span className="text-white font-medium bg-white/10 px-1 rounded">
									full demo to the studs
								</span>
								. We need to pull the fiberglass insert and{' '}
								<span className="text-white font-medium bg-white/10 px-1 rounded">
									move the plumbing
								</span>{' '}
								to the opposite wall for a freestanding tub. Let&apos;s plan for{' '}
								<span className="text-white font-medium bg-white/10 px-1 rounded">
									40 square feet of slate tile
								</span>{' '}
								on the floor...&quot;
							</p>
							<div className="mt-8 flex gap-3">
								<div className="h-16 w-16 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center">
									<Camera className="w-5 h-5 text-slate-600" />
								</div>
								<div className="h-16 w-16 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center">
									<Camera className="w-5 h-5 text-slate-600" />
								</div>
							</div>
						</div>

						{/* Structured Output Side */}
						<div className="p-8 bg-[#0A0A0A]">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-2">
									<LayoutList className="w-4 h-4 text-blue-400" />
									<span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
										AI Structured Scope
									</span>
								</div>
								<span className="text-xs font-mono text-slate-500">
									Master Bathroom
								</span>
							</div>

							<div className="space-y-4">
								<div className="p-4 rounded-lg border border-white/[0.05] bg-white/[0.02]">
									<div className="flex justify-between items-start mb-2">
										<span className="text-sm font-medium text-white">
											Demo & Disposal
										</span>
										<span className="text-sm font-mono text-slate-400">
											$1,200
										</span>
									</div>
									<p className="text-xs text-slate-500">
										Full demo to studs. Remove fiberglass insert.
									</p>
								</div>
								<div className="p-4 rounded-lg border border-white/[0.05] bg-white/[0.02]">
									<div className="flex justify-between items-start mb-2">
										<span className="text-sm font-medium text-white">
											Rough Plumbing
										</span>
										<span className="text-sm font-mono text-slate-400">
											$2,800
										</span>
									</div>
									<p className="text-xs text-slate-500">
										Relocate drain/supply lines for freestanding tub.
									</p>
								</div>
								<div className="p-4 rounded-lg border border-white/[0.05] bg-white/[0.02] border-l-2 border-l-blue-500">
									<div className="flex justify-between items-start mb-2">
										<span className="text-sm font-medium text-white">
											Floor Finishes
										</span>
										<span className="text-sm font-mono text-blue-400">
											40 sq ft
										</span>
									</div>
									<p className="text-xs text-slate-500">
										Material: Slate Tile. Install over floated subfloor.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- WHY BUILDRAIL WINS (Differentiator) --- */}
			<section
				id="platform"
				className="py-32 px-6 bg-[#050505] border-t border-white/[0.02]"
			>
				<div className="max-w-6xl mx-auto">
					<div className="mb-16 max-w-2xl">
						<h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
							Not a note app. <br />
							Not a generic AI wrapper.
						</h2>
						<p className="text-lg text-slate-400 font-light">
							Built from the ground up to understand contractor operations,
							residential terminology, and the realities of estimating from a
							truck.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						<div className="p-8 rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
							<Mic className="w-6 h-6 text-slate-300 mb-6" />
							<h3 className="text-lg font-medium text-white mb-3">
								Understands The Trade
							</h3>
							<p className="text-sm text-slate-400 leading-relaxed font-light">
								It knows the difference between a &quot;load-bearing
								header&quot; and a &quot;soffit.&quot; It structures &quot;LVL
								install&quot; correctly without you having to spell it out.
							</p>
						</div>
						<div className="p-8 rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
							<Settings2 className="w-6 h-6 text-slate-300 mb-6" />
							<h3 className="text-lg font-medium text-white mb-3">
								Field-First UX
							</h3>
							<p className="text-sm text-slate-400 leading-relaxed font-light">
								Large tap targets. Voice dominant. Designed to be used with one
								hand while you hold a flashlight or tape measure in the other.
							</p>
						</div>
						<div className="p-8 rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
							<ShieldCheck className="w-6 h-6 text-slate-300 mb-6" />
							<h3 className="text-lg font-medium text-white mb-3">
								Estimating Intelligence
							</h3>
							<p className="text-sm text-slate-400 leading-relaxed font-light">
								It doesn&apos;t just transcribe; it groups labor and materials
								into logical phases, flagging missing items before you leave the
								site.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* --- CINEMATIC WORKFLOW --- */}
			<section
				id="workflow"
				className="py-32 px-6 border-t border-white/[0.02] relative overflow-hidden"
			>
				<div className="max-w-4xl mx-auto space-y-32">
					<div className="flex flex-col md:flex-row gap-12 items-center">
						<div className="flex-1 space-y-6">
							<div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
								01. On The Jobsite
							</div>
							<h3 className="text-3xl font-medium text-white tracking-tight">
								Estimating at the speed of conversation.
							</h3>
							<p className="text-slate-400 font-light text-lg">
								Walk the property as you normally would. Talk through the scope,
								take photos, and point out issues. BUILDRAIL captures the raw
								intelligence of your site visit.
							</p>
						</div>
						<div className="flex-1 w-full aspect-square rounded-2xl bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/[0.05] flex items-center justify-center relative shadow-2xl">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
							<Mic className="w-16 h-16 text-blue-500/80 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
						</div>
					</div>

					<div className="flex flex-col md:flex-row-reverse gap-12 items-center">
						<div className="flex-1 space-y-6">
							<div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
								02. In The Truck
							</div>
							<h3 className="text-3xl font-medium text-white tracking-tight">
								From rambling notes to structured scope.
							</h3>
							<p className="text-slate-400 font-light text-lg">
								Before you even start the engine, your messy voice notes are
								automatically categorized into demo, rough-in, finishes, and
								specific room details.
							</p>
						</div>
						<div className="flex-1 w-full aspect-square rounded-2xl bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/[0.05] flex items-center justify-center relative shadow-2xl">
							<LayoutList className="w-16 h-16 text-slate-300" />
						</div>
					</div>

					<div className="flex flex-col md:flex-row gap-12 items-center">
						<div className="flex-1 space-y-6">
							<div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
								03. Same Day
							</div>
							<h3 className="text-3xl font-medium text-white tracking-tight">
								Send the proposal. Win the job.
							</h3>
							<p className="text-slate-400 font-light text-lg">
								Review the AI-generated draft, tweak your pricing, and export a
								clean PDF. The fastest contractors win the job. You just became
								the fastest.
							</p>
						</div>
						<div className="flex-1 w-full aspect-square rounded-2xl bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/[0.05] flex items-center justify-center relative shadow-2xl">
							<FileText className="w-16 h-16 text-amber-500/80 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
						</div>
					</div>
				</div>
			</section>

			{/* --- FINAL CTA --- */}
			<section
				id="waitlist"
				className="py-32 px-6 border-t border-white/[0.02] relative"
			>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
				<div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
					<BuildrailLogo />
					<h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight">
						The fastest contractors win the job.
					</h2>
					<p className="text-slate-400 text-lg font-light">
						Join the elite group of residential contractors upgrading to a
						field-first operating system. Limited early access available.
					</p>

					<div className="pt-8">
						{/* We use your actual WaitlistForm component here. Assuming it is styled to match. */}
						<WaitlistForm />
					</div>
				</div>
			</section>

			{/* --- MINIMAL FOOTER --- */}
			<footer className="border-t border-white/[0.04] py-10 px-6 bg-[#050505]">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium tracking-wide text-slate-400">
							BUILDRAIL © {new Date().getFullYear()}
						</span>
					</div>

					<div className="flex gap-8 text-sm text-slate-500 font-medium">
						<a className="hover:text-white transition-colors" href="#">
							Privacy
						</a>
						<a className="hover:text-white transition-colors" href="#">
							Terms
						</a>
						<a className="hover:text-white transition-colors" href="#">
							Contact
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
