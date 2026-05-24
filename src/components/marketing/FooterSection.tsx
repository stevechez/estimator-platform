'use client';

import { Brain, ChevronRight, Check, PlayCircle } from 'lucide-react';
import Link from 'next/link';

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

export default function FooterSection() {
	return (
		// FOOTER SECTION
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
	);
}
