'use server';

import OpenAI from 'openai';
import { searchProjectMemories } from '@/actions/searchProjectMemories';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

function formatMemoryHistory(
	memories: Array<{
		content: string;
		source_type: string;
		created_at: string;
		similarity: number;
	}>,
) {
	return memories
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
}

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

		const formattedHistory = formatMemoryHistory(memorySearch.memories);

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

export async function generateCrewBriefing(projectId: string) {
	try {
		const memorySearch = await searchProjectMemories({
			projectId,
			query:
				'crew briefing room by room tasks jobsite risks homeowner rules materials access schedule dependencies inspection demo install',
			matchCount: 30,
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

		const formattedHistory = formatMemoryHistory(memorySearch.memories);

		const chatResponse = await openai.chat.completions.create({
			model: 'gpt-4o',
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content: `You are a hardened, highly organized Construction Superintendent.
Your job is to read the raw project notes and generate a structured "Crew Flight Briefing" for the crew doing the actual labor.

Rules:
1. Be incredibly concise. Bullet points only. The crew is reading this on a phone.
2. Strip out pricing and financials. The crew does not need to know margins.
3. Emphasize critical alerts such as fragile items, hidden damage, hard deadlines, safety issues, scope gaps, and access constraints.
4. Emphasize homeowner rules such as parking restrictions, pets, bathroom access, noise constraints, and rooms that are off limits.
5. Return pure JSON only.

You MUST respond in pure JSON matching this exact structure:
{
  "project_overview": "2-sentence summary of the job",
  "critical_alerts": ["Alert 1", "Alert 2"],
  "homeowner_rules": ["Rule 1", "Rule 2"],
  "room_by_room": [
    {
      "room_name": "Master Bathroom",
      "demolition_notes": ["Demo tile", "Save vanity"],
      "installation_tasks": ["Install freestanding tub", "Tile to ceiling"],
      "materials_provided": ["Delta fixtures in garage"]
    }
  ]
}`,
				},
				{
					role: 'user',
					content: `Here are the most relevant project memories. Generate the crew briefing:\n\n${formattedHistory}`,
				},
			],
		});

		const rawContent = chatResponse.choices[0]?.message?.content;

		if (!rawContent) {
			return {
				success: false,
				error: 'Failed to generate crew briefing.',
			};
		}

		const parsedData = JSON.parse(rawContent);

		return {
			success: true,
			data: parsedData,
			memoriesUsed: memorySearch.memories,
		};
	} catch (error) {
		console.error('Crew Briefing Generation Failed:', error);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to generate crew briefing.',
		};
	}
}
