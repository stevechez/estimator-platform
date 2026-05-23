import { createClient as createRawClient } from '@supabase/supabase-js';

// Server-only admin client for background workers, server actions, and webhooks.
// Never import this module from Client Components.
export const createAdminClient = () =>
	createRawClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				persistSession: false,
				autoRefreshToken: false,
			},
		},
	);
