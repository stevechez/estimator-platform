import { createBrowserClient } from '@supabase/ssr';
import { createClient as createRawClient } from '@supabase/supabase-js';

// 1. Existing Browser Client (For UI / Frontend Components)
export const createClient = () =>
	createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

// 2. NEW Admin Client (For Autopilot Background Workers & Webhooks)
// WARNING: Only use this on the server. Never expose the SERVICE_ROLE_KEY to the frontend.
export const createAdminClient = () =>
	createRawClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!, // Add this to your .env.local / .env files
		{
			auth: {
				persistSession: false, // Background tasks don't need to persist a login session
				autoRefreshToken: false,
			},
		},
	);
