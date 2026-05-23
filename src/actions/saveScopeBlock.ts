'use server';

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

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

export type SaveScopeBlockParams = {
	userId: string;
	title: string;
	body: string;
	projectType?: string;
	trade?: string;
	room?: string;
	tags?: string[];
	sourceProjectId?: string;
	sourceMemoryId?: string;
};

export async function saveScopeBlock({
	userId,
	title,
	body,
	projectType,
	trade,
	room,
	tags = [],
	sourceProjectId,
	sourceMemoryId,
}: SaveScopeBlockParams) {
	try {
		const cleanedTitle = title.trim();
		const cleanedBody = body.trim();

		if (!userId) {
			return { success: false, error: 'Missing user id.' };
		}

		if (!cleanedTitle || !cleanedBody) {
			return { success: false, error: 'Missing scope block title or body.' };
		}

		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: `${cleanedTitle}\n\n${cleanedBody}\n\nTags: ${tags.join(', ')}`,
			encoding_format: 'float',
		});

		const embedding = embeddingResponse.data[0]?.embedding;

		if (!embedding) {
			return { success: false, error: 'Failed to generate embedding.' };
		}

		const { data, error } = await supabase
			.from('scope_blocks')
			.insert({
				user_id: userId,
				title: cleanedTitle,
				body: cleanedBody,
				project_type: projectType,
				trade,
				room,
				tags,
				source_project_id: sourceProjectId,
				source_memory_id: sourceMemoryId,
				embedding,
			})
			.select('id')
			.single();

		if (error) {
			console.error('Save scope block failed:', error);
			return { success: false, error: error.message };
		}

		return {
			success: true,
			scopeBlockId: data.id as string,
		};
	} catch (error) {
		console.error('Save scope block failed:', error);

		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to save scope block.',
		};
	}
}
