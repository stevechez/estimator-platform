'use client';

import { Brain, ClipboardList, FileText, Users } from 'lucide-react';
import { ReactNode } from 'react';

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
		<h3 className="mb-2 font-[var(--font-display)] text-lg font-black tracking-[-0.03em] text-white">
			{title}
		</h3>
		<p className="text-normal leading-6 text-slate-500">{body}</p>
	</div>
);

export default function MemorySection() {
	return (
		// MEMORY SECTION
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
	);
}
