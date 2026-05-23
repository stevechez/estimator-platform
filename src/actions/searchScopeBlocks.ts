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

export type ScopeBlockMatch = {
	id: string;
	user_id: string;
	title: string;
	body: string;
	project_type: string | null;
	trade: string | null;
	room: string | null;
	tags: string[] | null;
	source_project_id: string | null;
	source_memory_id: string | null;
	usage_count: number;
	created_at: string;
	similarity: number;
};

export async function searchScopeBlocks({
	userId,
	query,
	matchCount = 8,
}: {
	userId: string;
	query: string;
	matchCount?: number;
}) {
	try {
		const cleanedQuery = query.trim();

		if (!userId) {
			return {
				success: false,
				error: 'Missing user id.',
				scopeBlocks: [] as ScopeBlockMatch[],
			};
		}

		if (!cleanedQuery) {
			return {
				success: false,
				error: 'Missing search query.',
				scopeBlocks: [] as ScopeBlockMatch[],
			};
		}

		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: cleanedQuery,
			encoding_format: 'float',
		});

		const queryEmbedding = embeddingResponse.data[0]?.embedding;

		if (!queryEmbedding) {
			return {
				success: false,
				error: 'Failed to generate query embedding.',
				scopeBlocks: [] as ScopeBlockMatch[],
			};
		}

		const { data, error } = await supabase.rpc('match_scope_blocks', {
			query_embedding: queryEmbedding,
			match_user_id: userId,
			match_count: matchCount,
		});

		if (error) {
			console.error('Scope block search failed:', error);

			return {
				success: false,
				error: error.message,
				scopeBlocks: [] as ScopeBlockMatch[],
			};
		}

		return {
			success: true,
			scopeBlocks: (data ?? []) as ScopeBlockMatch[],
		};
	} catch (error) {
		console.error('Scope block search failed:', error);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to search scope blocks.',
			scopeBlocks: [] as ScopeBlockMatch[],
		};
	}
}
