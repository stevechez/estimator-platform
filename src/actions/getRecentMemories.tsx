'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function getRecentMemories(projectId: string) {
	try {
		const { data, error } = await supabase
			.from('project_memories')
			.select('id, content, source_type, created_at, metadata')
			.eq('project_id', projectId)
			.order('created_at', { ascending: false })
			.limit(6);

		if (error) throw new Error(error.message);

		return { success: true, memories: data || [] };
	} catch (error) {
		console.error('Failed to fetch recent memories:', error);
		return { success: false, memories: [] };
	}
}
