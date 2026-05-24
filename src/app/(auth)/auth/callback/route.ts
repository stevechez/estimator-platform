import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get('code');
	const next = requestUrl.searchParams.get('next') || '/dashboard';

	if (!code) {
		return NextResponse.redirect(
			new URL('/login?message=Missing login code', requestUrl.origin),
		);
	}

	const cookieStore = await cookies();

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

	const { error } = await supabase.auth.exchangeCodeForSession(code);

	if (error) {
		console.error('Auth callback error:', error);

		return NextResponse.redirect(
			new URL(
				`/login?message=${encodeURIComponent('Could not verify your login link')}`,
				requestUrl.origin,
			),
		);
	}

	return NextResponse.redirect(new URL(next, requestUrl.origin));
}
