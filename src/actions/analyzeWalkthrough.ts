'use server';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeWalkthroughChunk(transcriptChunk: string) {
	try {
		const chatResponse = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `You are a Senior Estimator acting as a real-time copilot during a construction walkthrough.
          Read the latest snippet of conversation between the contractor and the homeowner.
          Identify any hidden scope risks, missing questions, or margin-killers that the contractor needs to address BEFORE leaving the house.
          
          Only flag critical omissions (e.g., hidden damage, who pays for materials, permit risks, demolition haul-away).
          If the chunk is just casual conversation or perfectly clear scope, return an empty array.
          
          You MUST respond in pure JSON matching this structure:
          {
            "alerts": [
              {
                "type": "risk" | "missing_question" | "upsell",
                "message": "The short, punchy prompt to show the contractor."
              }
            ]
          }`,
				},
				{
					role: 'user',
					content: `Analyze this recent conversation chunk:\n\n"${transcriptChunk}"`,
				},
			],
			response_format: { type: 'json_object' },
		});

		const parsedData = JSON.parse(
			chatResponse.choices[0].message.content || '{}',
		);
		return { success: true, alerts: parsedData.alerts || [] };
	} catch (error) {
		console.error('Copilot Analysis Failed:', error);
		return { success: false, error: 'Failed to analyze chunk.' };
	}
}
