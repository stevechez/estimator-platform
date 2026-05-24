import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
	title: 'Terms of Service | BUILDRAIL',
	description: 'BUILDRAIL terms of service.',
};

const effectiveDate = 'May 23, 2026';
const contactEmail =
	process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@buildrail.app';

export default function TermsPage() {
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
						Terms of Service
					</p>

					<h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-6xl">
						BUILDRAIL Terms of Service
					</h1>

					<p className="mt-5 text-base leading-7 text-slate-500">
						Effective date: May 23, 2026
					</p>
				</header>

				<div className="mt-10 space-y-10 text-base font-normal leading-8 text-slate-300 sm:text-lg sm:leading-9">
					<div className="mt-8 space-y-7 text-base font-normal leading-8 text-slate-300">
						<p>
							These Terms of Service govern your use of BUILDRAIL. By using
							BUILDRAIL, you agree to these Terms. If you do not agree, do not
							use the product.
						</p>

						<h2>What BUILDRAIL does</h2>
						<p>
							BUILDRAIL helps residential contractors capture walkthrough notes,
							photos, emails, project details, and jobsite context, then
							generate draft proposal language, crew briefings, homeowner
							updates, and reusable scope memory.
						</p>

						<h2>Drafts, not professional advice</h2>
						<p>
							BUILDRAIL generates drafts and organizational support. You are
							responsible for reviewing, editing, approving, pricing, sending,
							and relying on any output. BUILDRAIL does not replace your
							professional judgment, estimating process, contract review, legal
							review, code compliance review, or customer approval process.
						</p>

						<h2>No automatic pricing authority</h2>
						<p>
							BUILDRAIL is not an autonomous pricing engine. Any prices,
							quantities, allowances, assumptions, or scope terms should be
							reviewed and approved by you before being shared or relied upon.
						</p>

						<h2>Your responsibilities</h2>
						<ul>
							<li>Use BUILDRAIL only for lawful business purposes.</li>
							<li>Provide accurate information when using the product.</li>
							<li>Review all generated drafts before using or sending them.</li>
							<li>
								Obtain any required permissions before uploading customer,
								homeowner, project, jobsite, photo, email, or third-party
								information.
							</li>
							<li>
								Do not upload information you are not authorized to process or
								store.
							</li>
						</ul>

						<h2>Accounts and access</h2>
						<p>
							You are responsible for keeping your login access secure and for
							activity under your account. During private beta or field trials,
							BUILDRAIL workspaces may be manually activated, limited, modified,
							or revoked.
						</p>

						<h2>Acceptable use</h2>
						<p>You may not use BUILDRAIL to:</p>
						<ul>
							<li>Break the law or violate another person’s rights.</li>
							<li>Upload malicious code or interfere with the service.</li>
							<li>Attempt to access another user’s data or workspace.</li>
							<li>
								Misrepresent AI-generated drafts as independently verified
								facts.
							</li>
							<li>
								Use the product in a way that creates safety, legal, or
								financial risk without human review.
							</li>
						</ul>

						<h2>Third-party services</h2>
						<p>
							BUILDRAIL may rely on third-party providers for hosting,
							authentication, storage, email, analytics, and AI processing. Your
							use of BUILDRAIL may involve those services.
						</p>

						<h2>Availability</h2>
						<p>
							BUILDRAIL is currently in private beta and may change frequently.
							We may add, remove, suspend, or modify features at any time. We do
							not guarantee uninterrupted availability.
						</p>

						<h2>Intellectual property</h2>
						<p>
							BUILDRAIL and its software, design, branding, and product
							experience belong to BUILDRAIL or its licensors. You retain
							responsibility for the project information you provide. Subject to
							these Terms, you may use the drafts generated from your own
							project information for your business.
						</p>

						<h2>Disclaimers</h2>
						<p>
							BUILDRAIL is provided “as is” and “as available.” To the maximum
							extent permitted by law, we disclaim warranties of
							merchantability, fitness for a particular purpose,
							non-infringement, and accuracy.
						</p>

						<h2>Limitation of liability</h2>
						<p>
							To the maximum extent permitted by law, BUILDRAIL will not be
							liable for indirect, incidental, special, consequential,
							exemplary, or punitive damages, or for lost profits, lost revenue,
							lost data, project losses, pricing errors, contract disputes, or
							business interruption.
						</p>

						<h2>Termination</h2>
						<p>
							We may suspend or terminate access if you violate these Terms,
							misuse the product, create risk for the service or others, or if
							the private beta or field trial changes.
						</p>

						<h2>Changes to these Terms</h2>
						<p>
							We may update these Terms from time to time. Continued use of
							BUILDRAIL after updates means you accept the updated Terms.
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
