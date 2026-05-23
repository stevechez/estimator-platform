'use server';

import OpenAI from 'openai';
import { searchProjectMemories } from '@/actions/searchProjectMemories';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function draftHomeownerUpdate(projectId: string) {
	try {
		const memorySearch = await searchProjectMemories({
			projectId,
			query:
				'homeowner update recent progress completed work next steps schedule delays approvals customer-friendly Friday update',
			matchCount: 15,
		});

		if (!memorySearch.success) {
			return {
				success: false,
				error: memorySearch.error,
			};
		}

		if (!memorySearch.memories || memorySearch.memories.length === 0) {
			return {
				success: false,
				error:
					'No searchable project memories found yet. New memories may need embeddings before they can be used.',
			};
		}

		const formattedHistory = memorySearch.memories
			.sort(
				(a, b) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
			)
			.map(
				m =>
					`[${new Date(m.created_at).toLocaleDateString()}] (${m.source_type}, relevance ${Number(
						m.similarity,
					).toFixed(2)}): ${m.content}`,
			)
			.join('\n');

		const chatResponse = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `You are the executive client liaison for a premium residential contractor. 
Your job is to read the contractor's raw, messy field logs and generate a warm, professional Friday update text message to send to the homeowner.

Rules:
1. Tone: Warm, reassuring, highly competent, and polite.
2. Strip out all harsh contractor jargon.
3. Format: A 3-to-4 sentence text message block.
4. Content: Briefly summarize what was accomplished, state what is happening next, and wish them a good weekend.
5. DO NOT mention that this is an AI message. DO NOT use emojis. Write it exactly as the contractor should text it.`,
				},
				{
					role: 'user',
					content: `Here are the most relevant project memories. Draft the homeowner update:\n\n${formattedHistory}`,
				},
			],
		});

		const draft = chatResponse.choices[0]?.message?.content?.trim();

		if (!draft) {
			return {
				success: false,
				error: 'Failed to generate update.',
			};
		}

		return {
			success: true,
			draft,
			memoriesUsed: memorySearch.memories,
		};
	} catch (error) {
		console.error('Homeowner Draft Failed:', error);

		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to generate update.',
		};
	}
}
