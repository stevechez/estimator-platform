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

export type ProjectMemorySourceType =
	| 'voice_note'
	| 'email_forward'
	| 'system_auto'
	| 'text_input'
	| 'user_text';

export interface SaveMemoryParams {
	projectId: string;
	content: string;
	sourceType: ProjectMemorySourceType;
	metadata?: Record<string, unknown>;
}

export async function saveProjectMemory({
	projectId,
	content,
	sourceType,
	metadata = {},
}: SaveMemoryParams) {
	try {
		const cleanedContent = content.trim();

		if (!projectId) {
			return {
				success: false,
				error: 'Missing project id.',
			};
		}

		if (!cleanedContent) {
			return {
				success: false,
				error: 'Missing memory content.',
			};
		}

		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: cleanedContent,
			encoding_format: 'float',
		});

		const embedding = embeddingResponse.data[0]?.embedding;

		if (!embedding) {
			return {
				success: false,
				error: 'Failed to generate embedding.',
			};
		}

		const { data, error } = await supabase
			.from('project_memories')
			.insert({
				project_id: projectId,
				content: cleanedContent,
				embedding,
				source_type: sourceType,
				metadata,
			})
			.select('id')
			.single();

		if (error) {
			console.error('Supabase Insert Error:', error);

			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: true,
			memoryId: data.id as string,
		};
	} catch (error) {
		console.error('Failed to save project memory:', error);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to vectorize and store memory.',
		};
	}
}
