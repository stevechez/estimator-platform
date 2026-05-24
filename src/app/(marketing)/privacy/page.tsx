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
		<main className="min-h-screen bg-[#050505] px-6 py-12 text-slate-100 antialiased">
			<article className="mx-auto max-w-3xl">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to BUILDRAIL
				</Link>

				<div className="mt-12 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8">
					<p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
						Privacy Policy
					</p>

					<h1 className="text-4xl font-black tracking-[-0.04em] text-white">
						BUILDRAIL Privacy Policy
					</h1>

					<p className="mt-3 text-sm text-slate-500">
						Effective date: {effectiveDate}
					</p>

					<div className="prose prose-invert prose-slate mt-8 max-w-none prose-p:leading-7 prose-li:leading-7">
						<p>
							BUILDRAIL helps residential contractors capture walkthrough notes,
							photos, emails, project details, proposal drafts, crew briefings,
							homeowner updates, and reusable scope language. This Privacy
							Policy explains what information we collect, how we use it, and
							how to contact us.
						</p>

						<h2>Information we collect</h2>
						<p>We may collect the following information:</p>
						<ul>
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

						<h2>How we use information</h2>
						<p>We use information to:</p>
						<ul>
							<li>Provide, operate, and improve BUILDRAIL.</li>
							<li>
								Create project memory and generate contractor-controlled
								outputs.
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

						<h2>AI-generated outputs</h2>
						<p>
							BUILDRAIL may use AI services to process project information you
							provide and generate drafts such as proposal language, crew
							briefings, homeowner updates, and scope suggestions. Outputs are
							drafts and should be reviewed by the contractor before use.
						</p>

						<h2>How we share information</h2>
						<p>
							We do not sell your contact information. We may share information
							with service providers that help us operate BUILDRAIL, such as
							hosting, database, authentication, email, storage, analytics, and
							AI processing providers. These providers are used to run the
							product and support your account.
						</p>

						<h2>Customer and homeowner information</h2>
						<p>
							You are responsible for ensuring you have permission to upload or
							process homeowner, project, jobsite, or customer information in
							BUILDRAIL. Do not upload sensitive information that is not needed
							for the project workflow.
						</p>

						<h2>Data retention</h2>
						<p>
							We retain information for as long as needed to provide BUILDRAIL,
							support your account, comply with legal obligations, resolve
							disputes, and improve the product. You may contact us to request
							deletion of account or project information.
						</p>

						<h2>Security</h2>
						<p>
							We use reasonable technical and organizational measures to protect
							information. No system is perfectly secure, and we cannot
							guarantee absolute security.
						</p>

						<h2>Your choices</h2>
						<p>
							You may request access, correction, or deletion of your
							information by contacting us. You may also stop using BUILDRAIL at
							any time.
						</p>

						<h2>Changes to this policy</h2>
						<p>
							We may update this Privacy Policy from time to time. If we make
							material changes, we will update the effective date or provide
							notice where appropriate.
						</p>

						<h2>Contact</h2>
						<p>
							Questions? Contact us at{' '}
							<a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
						</p>
					</div>
				</div>
			</article>
		</main>
	);
}
