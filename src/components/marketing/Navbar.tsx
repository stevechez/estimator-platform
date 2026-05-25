'use client';

import Link from 'next/link';

type BuildrailLogoProps = {
	size?: number;
	className?: string;
};

const BuildrailLogo = ({ size = 28, className }: BuildrailLogoProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={`shrink-0 ${className ?? ''}`}
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
		<nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050505]/90 px-4 py-3 backdrop-blur-xl sm:px-6">
			<div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
				<Link
					href="/#top"
					scroll
					className="flex min-w-0 items-center gap-2.5 sm:gap-3"
				>
					<BuildrailLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />

					<span className="min-w-0 truncate text-[1.35rem] font-black tracking-[-0.045em] text-white sm:text-2xl">
						BUILDRAIL
					</span>
				</Link>

				<div className="hidden items-center justify-center gap-10 md:flex">
					<Link
						href="/#memory"
						scroll
						className="text-base font-semibold text-slate-400 transition hover:text-white"
					>
						Memory
					</Link>

					<Link
						href="/#workflow"
						scroll
						className="text-base font-semibold text-slate-400 transition hover:text-white"
					>
						Workflow
					</Link>

					<Link
						href="/#outputs"
						scroll
						className="text-base font-semibold text-slate-400 transition hover:text-white"
					>
						Scope Memory
					</Link>
				</div>

				<div className="flex items-center justify-end gap-4 sm:gap-6">
					<Link
						href="/login"
						className="hidden text-base font-semibold text-slate-300 transition hover:text-white md:inline-flex"
					>
						Sign In
					</Link>

					<Link
						href="/#waitlist"
						scroll
						className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-black text-black shadow-2xl shadow-white/10 transition hover:bg-slate-200 sm:px-6 sm:text-base"
					>
						<span className="sm:hidden">Request</span>
						<span className="hidden sm:inline">Request Trial</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}
