import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get('code');

	// The 'next' param lets us dynamically route the user after login
	const next = searchParams.get('next') ?? '/dashboard';

	if (code) {
		const cookieStore = await cookies(); // Next.js 15 async cookies

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
						} catch (error) {
							// The setAll method was called from a Server Component.
							// This can be ignored if you have middleware refreshing sessions.
						}
					},
				},
			},
		);

		// Exchange the code for a session cookie
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return NextResponse.redirect(`${origin}${next}`);
		} else {
			console.error('Auth callback error:', error.message);
		}
	}

	// If there's an error or no code, send them back to login
	return NextResponse.redirect(
		`${origin}/login?message=Could not verify your login link`,
	);
}
