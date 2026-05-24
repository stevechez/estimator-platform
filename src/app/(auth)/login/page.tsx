import { headers, cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
	ArrowRight,
	CheckCircle2,
	AlertCircle,
	ShieldCheck,
} from 'lucide-react';

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string; type?: string }>;
}) {
	const resolvedSearchParams = await searchParams;

	const signIn = async (formData: FormData) => {
		'use server';

		const email = String(formData.get('email') ?? '')
			.trim()
			.toLowerCase();

		if (!email) {
			return redirect('/login?message=Email is required&type=error');
		}

		const cookieStore = await cookies();
		const headersList = await headers();

		const origin =
			headersList.get('origin') ||
			process.env.NEXT_PUBLIC_SITE_URL ||
			'http://localhost:3000';

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll() {
						return cookieStore.getAll();
					},
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					},
				},
			},
		);

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
			},
		});

		if (error) {
			console.error('Login error:', error);

			return redirect(
				'/login?message=Could not send login link. Please try again.&type=error',
			);
		}

		return redirect(
			'/login?message=Magic link sent. Check your email to continue.&type=success',
		);
	};

	const message = resolvedSearchParams?.message;
	const messageType =
		resolvedSearchParams?.type === 'error' ? 'error' : 'success';

	return (
		<main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#050505] px-5 py-10 text-slate-100 antialiased">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute left-1/2 top-[-20%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-900/20 blur-[120px]" />
				<div className="absolute bottom-[-20%] right-[-10%] h-[360px] w-[360px] rounded-full bg-amber-700/10 blur-[120px]" />
			</div>

			<div className="relative w-full max-w-md">
				<div className="mb-8 text-center">
					<Link
						href="/#top"
						className="inline-flex items-center gap-2 text-sm font-black tracking-[0.18em] text-slate-500 transition hover:text-white"
					>
						BUILDRAIL
					</Link>
				</div>

				<div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.035] p-2 shadow-2xl shadow-black/30">
					<div className="rounded-[1.5rem] border border-white/[0.05] bg-[#0A0A0A] p-6 sm:p-8">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/20">
							<ShieldCheck className="h-6 w-6" />
						</div>

						<div className="space-y-3 text-center">
							<h1 className="text-3xl font-black tracking-[-0.04em] text-white">
								Sign in to BUILDRAIL
							</h1>

							<p className="mx-auto max-w-sm text-base leading-6 text-slate-300">
								Enter your email and we’ll send a secure login link. No password
								required.
							</p>
						</div>

						<form action={signIn} className="mt-8 space-y-4">
							<input
								name="email"
								type="email"
								placeholder="name@company.com"
								required
								className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-base text-white placeholder:text-slate-600 transition-all focus:border-blue-400/50 focus:bg-white/[0.07] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
							/>

							<button className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-black text-black transition-all duration-200 hover:bg-slate-200 active:scale-[0.99]">
								Send Magic Link
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</button>
						</form>

						{message && (
							<div className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
								<div
									className={[
										'flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-md',
										messageType === 'error'
											? 'border-red-400/30 bg-red-500/15 text-red-100'
											: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
									].join(' ')}
								>
									{messageType === 'error' ? (
										<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
									) : (
										<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
									)}
									<p>{message}</p>
								</div>
							</div>
						)}

						<div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
							<p className="text-center text-sm leading-5 text-slate-300">
								New to BUILDRAIL?{' '}
								<Link
									href="/#waitlist"
									className="font-semibold text-slate-300 transition hover:text-white"
								>
									Request a 7-Day Field Trial
								</Link>
							</p>
						</div>
					</div>
				</div>

				<p className="mx-auto mt-6 max-w-sm text-center text-base leading-5 text-slate-400">
					Magic links may take a minute to arrive. Check spam or promotions if
					you do not see it.
				</p>
			</div>
		</main>
	);
}
