import { createBrowserClient } from '@supabase/ssr';

// 1. Existing Browser Client (For UI / Frontend Components)
export const createClient = () =>
	createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
