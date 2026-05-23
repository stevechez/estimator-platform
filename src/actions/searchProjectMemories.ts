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

export type MatchedProjectMemory = {
	id: string;
	project_id: string;
	content: string;
	source_type: string;
	metadata: Record<string, unknown> | null;
	created_at: string;
	similarity: number;
};

export async function searchProjectMemories({
	projectId,
	query,
	matchCount = 8,
}: {
	projectId: string;
	query: string;
	matchCount?: number;
}) {
	try {
		const cleanedQuery = query.trim();

		if (!projectId) {
			return {
				success: false,
				error: 'Missing project id.',
				memories: [] as MatchedProjectMemory[],
			};
		}

		if (!cleanedQuery) {
			return {
				success: false,
				error: 'Missing search query.',
				memories: [] as MatchedProjectMemory[],
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
				memories: [] as MatchedProjectMemory[],
			};
		}

		const { data, error } = await supabase.rpc('match_project_memories', {
			query_embedding: queryEmbedding,
			match_project_id: projectId,
			match_count: matchCount,
		});

		if (error) {
			console.error('Vector memory search failed:', error);

			return {
				success: false,
				error: error.message,
				memories: [] as MatchedProjectMemory[],
			};
		}

		return {
			success: true,
			memories: (data ?? []) as MatchedProjectMemory[],
		};
	} catch (error) {
		console.error('Failed to search project memories:', error);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to search project memories.',
			memories: [] as MatchedProjectMemory[],
		};
	}
}
