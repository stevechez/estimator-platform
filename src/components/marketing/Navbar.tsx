'use client';

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

export default function Navbar() {
	return (
		// Navbar
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
						href="http://localhost:3000/#memory"
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
						Request Trial
					</Link>
				</div>
			</div>
		</nav>
	);
}
