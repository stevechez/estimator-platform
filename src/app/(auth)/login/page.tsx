import { headers, cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string }>;
}) {
	const resolvedSearchParams = await searchParams;

	const signIn = async (formData: FormData) => {
		'use server';

		const email = String(formData.get('email') ?? '')
			.trim()
			.toLowerCase();

		if (!email) {
			return redirect('/login?message=Email is required');
		}

		const cookieStore = await cookies();
		const headersList = await headers();
		const origin = headersList.get('origin');

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
			return redirect('/login?message=Could not authenticate user');
		}

		return redirect('/login?message=Check your email to continue sign in');
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] p-6 text-slate-100 antialiased">
			<div className="w-full max-w-sm space-y-8">
				<div className="space-y-2 text-center">
					<Link
						href="/"
						className="inline-flex text-sm font-semibold text-slate-500 transition hover:text-white"
					>
						BUILDRAIL
					</Link>

					<h1 className="text-2xl font-semibold tracking-tight text-white">
						Sign in to BUILDRAIL
					</h1>

					<p className="text-sm leading-6 text-slate-400">
						Enter your email to receive a secure login link.
					</p>
				</div>

				<form action={signIn} className="space-y-4">
					<input
						name="email"
						type="email"
						placeholder="name@company.com"
						required
						className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
					/>

					<button className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black transition-all duration-200 hover:bg-slate-200">
						Send Magic Link
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</button>

					{resolvedSearchParams?.message && (
						<p className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-300">
							{resolvedSearchParams.message}
						</p>
					)}
				</form>

				<p className="text-center text-xs leading-5 text-slate-600">
					New to BUILDRAIL?{' '}
					<Link href="/#waitlist" className="text-slate-400 hover:text-white">
						Start a 7-Day Field Trial
					</Link>
				</p>
			</div>
		</div>
	);
}
