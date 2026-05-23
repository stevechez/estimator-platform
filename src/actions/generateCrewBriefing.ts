'use server';

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function generateCrewBriefing(projectId: string) {
	try {
		// Fetch a deep history for the project to capture walkthroughs and changes
		const { data: memories, error } = await supabase
			.from('project_memories')
			.select('content, source_type, created_at')
			.eq('project_id', projectId)
			.order('created_at', { ascending: false })
			.limit(30);

		if (error) throw new Error(error.message);

		if (!memories || memories.length === 0) {
			return {
				success: false,
				error: 'No project history found to generate a briefing.',
			};
		}

		const formattedHistory = memories
			.reverse()
			.map(m => `[${new Date(m.created_at).toLocaleDateString()}] ${m.content}`)
			.join('\n');

		const chatResponse = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `You are a hardened, highly organized Construction Superintendent. 
          Your job is to read the raw project notes and generate a structured "Crew Flight Briefing" for the guys doing the actual labor.
          
          Rules:
          1. Be incredibly concise. Bullet points only. The crew is reading this on a phone.
          2. Strip out pricing and financials. The crew doesn't need to know the margins.
          3. Emphasize "Critical Alerts" (e.g., fragile items, hidden damage, hard deadlines).
          4. Emphasize "Homeowner Rules" (e.g., parking restrictions, pets, bathroom access).
          
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
                "materials_provided": ["Delta fixtures (in garage)"]
              }
            ]
          }`,
				},
				{
					role: 'user',
					content: `Here is the project history. Generate the crew briefing:\n\n${formattedHistory}`,
				},
			],
			response_format: { type: 'json_object' },
		});

		const parsedData = JSON.parse(
			chatResponse.choices[0].message.content || '{}',
		);

		return { success: true, data: parsedData };
	} catch (error) {
		console.error('Crew Briefing Generation Failed:', error);
		return { success: false, error: 'Failed to generate crew briefing.' };
	}
}
