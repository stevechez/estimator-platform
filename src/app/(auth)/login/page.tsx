import { headers, cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ message: string }>; // 1. Update the type to Promise
}) {
	// 2. Await the searchParams before the return statement
	const resolvedSearchParams = await searchParams;

	const signIn = async (formData: FormData) => {
		'use server';
		const email = formData.get('email') as string;

		// Await headers and cookies (Next.js 15 fix from earlier)
		const cookieStore = await cookies();
		const headersList = await headers();

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll() {
						return cookieStore.getAll();
					},
					setAll(cookiesToSet) {
						try {
							cookiesToSet.forEach(({ name, value, options }) => {
								cookieStore.set(name, value, options);
							});
						} catch (error) {}
					},
				},
			},
		);

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				// Update this line to point to the callback route, and pass /dashboard as the 'next' destination
				emailRedirectTo: `${headersList.get('origin')}/auth/callback?next=/dashboard`,
			},
		});
		if (error) {
			return redirect('/login?message=Could not authenticate user');
		}
		return redirect('/login?message=Check email to continue sign in');
	};

	return (
		<div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center p-6 antialiased">
			<div className="w-full max-w-sm space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-2xl font-semibold text-white tracking-tight">
						Sign in to BUILDRAIL
					</h1>
					<p className="text-sm text-slate-400">
						Enter your email to receive a secure login link.
					</p>
				</div>

				<form action={signIn} className="space-y-4">
					<input
						name="email"
						placeholder="name@company.com"
						required
						className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
					/>
					<button className="w-full group inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-xl font-medium transition-all duration-200">
						Send Magic Link
						<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
					</button>

					{/* 3. Use the awaited search params here */}
					{resolvedSearchParams?.message && (
						<p className="mt-4 p-4 bg-white/5 text-slate-300 text-sm text-center rounded-xl border border-white/10">
							{resolvedSearchParams.message}
						</p>
					)}
				</form>
			</div>
		</div>
	);
}
