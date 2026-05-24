import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
	title: 'Privacy Policy | BUILDRAIL',
	description: 'BUILDRAIL privacy policy.',
};

const effectiveDate = 'May 23, 2026';
const contactEmail =
	process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@buildrail.app';

export default function PrivacyPage() {
	return (
		<main className="min-h-screen bg-[#050505] px-5 pb-16 pt-32 text-slate-100 antialiased sm:px-6 sm:pb-24 sm:pt-36">
			<article className="mx-auto max-w-4xl">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-base font-semibold text-slate-500 transition hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to BUILDRAIL
				</Link>

				<header className="mt-12 border-b border-white/[0.08] pb-10">
					<p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
						Privacy Policy
					</p>

					<h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-6xl">
						BUILDRAIL Privacy Policy
					</h1>

					<p className="mt-5 text-base leading-7 text-slate-500">
						Effective date: {effectiveDate}
					</p>
				</header>

				<div className="mt-10 space-y-10 text-base font-normal leading-8 text-slate-300 sm:text-lg sm:leading-9">
					<section className="border-b border-white/[0.06] pb-8">
						<p className="text-slate-400">
							BUILDRAIL helps residential contractors capture walkthrough notes,
							photos, emails, project details, proposal drafts, crew briefings,
							homeowner updates, and reusable scope language. This Privacy
							Policy explains what information we collect, how we use it, and
							how to contact us.
						</p>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							Information we collect
						</h2>

						<p className="mt-4 text-slate-400">
							We may collect the following information:
						</p>

						<ul className="mt-4 list-disc space-y-3 pl-6 text-slate-400">
							<li>Account information, such as your name and email address.</li>
							<li>
								Business information, such as company name, trade, project type,
								and trial request details.
							</li>
							<li>
								Project information you provide, including customer names,
								addresses, field notes, voice transcripts, photos, emails, scope
								details, proposal drafts, and related project memory.
							</li>
							<li>
								Technical information, such as browser, device, usage events,
								error logs, and authentication/session data.
							</li>
						</ul>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							How we use information
						</h2>

						<ul className="mt-4 list-disc space-y-3 pl-6 text-slate-400">
							<li>Provide, operate, and improve BUILDRAIL.</li>
							<li>
								Create project memory and generate contractor-controlled drafts.
							</li>
							<li>
								Support field trials, onboarding, troubleshooting, and account
								access.
							</li>
							<li>
								Protect the product from abuse, unauthorized access, and fraud.
							</li>
							<li>
								Communicate with you about your trial, account, or support
								requests.
							</li>
						</ul>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							AI-generated outputs
						</h2>

						<p className="mt-4 text-slate-400">
							BUILDRAIL may use AI services to process project information you
							provide and generate drafts such as proposal language, crew
							briefings, homeowner updates, and scope suggestions. Outputs are
							drafts and should be reviewed by the contractor before use.
						</p>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							How we share information
						</h2>

						<p className="mt-4 text-slate-400">
							We do not sell your contact information. We may share information
							with service providers that help us operate BUILDRAIL, such as
							hosting, database, authentication, email, storage, analytics, and
							AI processing providers. These providers are used to run the
							product and support your account.
						</p>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							Customer and homeowner information
						</h2>

						<p className="mt-4 text-slate-400">
							You are responsible for ensuring you have permission to upload or
							process homeowner, project, jobsite, or customer information in
							BUILDRAIL. Do not upload sensitive information that is not needed
							for the project workflow.
						</p>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							Data retention
						</h2>

						<p className="mt-4 text-slate-400">
							We retain information for as long as needed to provide BUILDRAIL,
							support your account, comply with legal obligations, resolve
							disputes, and improve the product. You may contact us to request
							deletion of account or project information.
						</p>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							Security
						</h2>

						<p className="mt-4 text-slate-400">
							We use reasonable technical and organizational measures to protect
							information. No system is perfectly secure, and we cannot
							guarantee absolute security.
						</p>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							Your choices
						</h2>

						<p className="mt-4 text-slate-400">
							You may request access, correction, or deletion of your
							information by contacting us. You may also stop using BUILDRAIL at
							any time.
						</p>
					</section>

					<section className="border-b border-white/[0.06] pb-8">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							Changes to this policy
						</h2>

						<p className="mt-4 text-slate-400">
							We may update this Privacy Policy from time to time. If we make
							material changes, we will update the effective date or provide
							notice where appropriate.
						</p>
					</section>

					<section className="pb-4">
						<h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
							Contact
						</h2>

						<p className="mt-4 text-slate-400">
							Questions? Contact us at{' '}
							<a
								href={`mailto:${contactEmail}`}
								className="font-semibold text-white underline decoration-white/20 underline-offset-4 transition hover:text-amber-300"
							>
								{contactEmail}
							</a>
							.
						</p>
					</section>
				</div>
			</article>
		</main>
	);
}
