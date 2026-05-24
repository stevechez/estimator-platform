import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';

export const metadata = {
	title: 'Contact | BUILDRAIL',
	description:
		'Contact BUILDRAIL about field trials, support, and product questions.',
};

const contactEmail =
	process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@buildrail.app';

export default function ContactPage() {
	return (
		<main className="min-h-screen bg-[#050505] px-6 py-12 text-slate-100 antialiased">
			<div className="mx-auto max-w-3xl">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to BUILDRAIL
				</Link>

				<div className="mt-12 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 shadow-2xl shadow-black/20">
					<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
						<MessageSquare className="h-6 w-6" />
					</div>

					<h1 className="text-4xl font-black tracking-[-0.04em] text-white">
						Contact BUILDRAIL
					</h1>

					<p className="mt-4 text-base leading-7 text-slate-400">
						Have a question about the 7-day field trial, product fit, support,
						or your BUILDRAIL workspace? Send us a note.
					</p>

					<div className="mt-8 rounded-2xl border border-white/[0.06] bg-[#0A0A0A] p-5">
						<p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-600">
							Email
						</p>

						<a
							href={`mailto:${contactEmail}`}
							className="mt-3 inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:text-amber-300"
						>
							<Mail className="h-5 w-5 text-amber-300" />
							{contactEmail}
						</a>
					</div>

					<div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
						<p className="font-semibold text-emerald-100">
							No spam. No sold lists. No surprise calls.
						</p>
						<p className="mt-2 text-sm leading-6 text-emerald-100/70">
							If you contact BUILDRAIL, we use your message to respond to you
							and support your trial or account. We do not sell your contact
							information.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
