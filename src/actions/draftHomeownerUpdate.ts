'use server';

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function draftHomeownerUpdate(projectId: string) {
	try {
		// 1. Fetch the 15 most recent memories for this project
		const { data: recentMemories, error } = await supabase
			.from('project_memories')
			.select('content, source_type, created_at')
			.eq('project_id', projectId)
			.order('created_at', { ascending: false })
			.limit(15);

		if (error) throw new Error(error.message);

		if (!recentMemories || recentMemories.length === 0) {
			return {
				success: false,
				error: 'No recent activity logged for this project.',
			};
		}

		// 2. Format the timeline for the AI
		const formattedHistory = recentMemories
			.reverse() // Reverse so the AI reads it in chronological order
			.map(
				m =>
					`[${new Date(m.created_at).toLocaleDateString()}] (${m.source_type}): ${m.content}`,
			)
			.join('\n');

		// 3. The "Translation" Prompt
		const chatResponse = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `You are the executive client liaison for a premium residential contractor. 
          Your job is to read the contractor's raw, messy field logs and generate a warm, professional Friday update text message to send to the homeowner.
          
          Rules:
          1. Tone: Warm, reassuring, highly competent, and polite. 
          2. Strip out all harsh contractor jargon (e.g., change "ripped out the rotted subfloor" to "addressed some hidden subfloor repairs").
          3. Format: A 3-to-4 sentence text message block.
          4. Content: Briefly summarize what was accomplished, state what is happening next week, and wish them a good weekend.
          5. DO NOT mention that this is an AI message. DO NOT use emojis. Write it exactly as the contractor should text it.`,
				},
				{
					role: 'user',
					content: `Here are the recent logs. Draft the homeowner update:\n\n${formattedHistory}`,
				},
			],
		});

		return {
			success: true,
			draft: chatResponse.choices[0].message.content,
		};
	} catch (error) {
		console.error('Homeowner Draft Failed:', error);
		return { success: false, error: 'Failed to generate update.' };
	}
}
