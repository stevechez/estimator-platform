import { Check } from 'lucide-react';
import { WaitlistForm } from '@/components/WaitlistForm';

const trialBenefits = [
	'Faster follow-up',
	'Cleaner scope',
	'Smarter every job',
];

export default function TrialSection() {
	return (
		<section
			id="waitlist"
			className="relative z-10 px-4 py-14 sm:px-6 sm:py-24 lg:py-32"
		>
			<div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
				<div className="space-y-8">
					<div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.035] px-5 py-3 text-sm font-black text-slate-300 shadow-2xl shadow-black/20">
						<span className="relative flex h-5 w-5 items-center justify-center">
							<span className="absolute h-2 w-2 rounded-full bg-amber-400" />
							<span className="absolute h-4 w-4 animate-ping rounded-full bg-amber-400/30" />
						</span>
						7-day field trial
					</div>

					<div>
						<p className="text-sm font-black uppercase tracking-[0.32em] text-amber-300">
							Build your project brain
						</p>

						<h2 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
							Try BUILDRAIL on a real walkthrough.
							<span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-orange-600 bg-clip-text text-transparent">
								See what it remembers.
							</span>
						</h2>

						<p className="mt-8 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
							Request a 7-day field trial and use BUILDRAIL on an actual
							residential job. Capture the walkthrough, draft the follow-up, and
							decide if project memory belongs in your workflow.
						</p>
					</div>

					<div className="hidden gap-4 sm:grid sm:grid-cols-3">
						{trialBenefits.map(benefit => (
							<div
								key={benefit}
								className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-4"
							>
								<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
									<Check className="h-4 w-4" />
								</span>
								<span className="text-base font-bold leading-5 text-slate-300">
									{benefit}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="rounded-[1.5rem] border border-amber-300/[0.12] bg-gradient-to-b from-amber-300/[0.06] to-white/[0.025] p-1.5 shadow-2xl shadow-black/30 sm:rounded-[2rem] sm:p-2">
					<div className="rounded-[1.15rem] border border-white/[0.06] bg-[#070707] p-5 sm:rounded-[1.55rem] sm:p-8">
						<p className="text-sm font-black uppercase tracking-[0.32em] text-amber-300">
							Request Trial
						</p>

						<h3 className="mt-4 text-2xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
							Create your 7-day field trial workspace.
						</h3>

						<p className="mt-4 text-base leading-7 text-slate-400 sm:mt-5">
							Use BUILDRAIL on a real walkthrough. No fake waitlist. No long
							onboarding sequence. Just a focused trial of the workflow.
						</p>

						<div className="mt-8">
							<WaitlistForm />
						</div>

						<div className="mt-6 rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-400/[0.12] via-emerald-300/[0.06] to-amber-300/[0.08] p-5 shadow-2xl shadow-emerald-950/20">
							<div className="flex items-start gap-3">
								<span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/25">
									<Check className="h-4 w-4" />
								</span>

								<div>
									<p className="text-base font-black leading-6 text-emerald-100">
										No spam. No sold lists. No surprise calls.
									</p>

									<p className="mt-2 text-base leading-7 text-emerald-100/75">
										We do not sell your contact information. Ever. Your trial
										request is for testing BUILDRAIL on your workflow — not
										joining a marketing funnel.
									</p>
								</div>
							</div>
						</div>

						<p className="mt-5 text-center text-sm leading-6 text-slate-500">
							Private beta. Trial workspaces are reviewed and activated
							manually.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
