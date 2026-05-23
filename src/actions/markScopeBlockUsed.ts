'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
	{
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	},
);

export async function markScopeBlockUsed(scopeBlockId: string) {
	if (!scopeBlockId) {
		return { success: false, error: 'Missing scope block id.' };
	}

	const { error } = await supabase.rpc('increment_scope_block_usage', {
		scope_block_id: scopeBlockId,
	});

	if (error) {
		console.error('Failed to mark scope block used:', error);
		return { success: false, error: error.message };
	}

	return { success: true };
}
