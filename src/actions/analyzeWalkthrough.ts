'use server';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface WalkthroughAlert {
	type:
		| 'risk'
		| 'missing_question'
		| 'scope_dependency'
		| 'margin_protection';
	severity: 'low' | 'medium' | 'high';
	message: string;
	trade: string;
	suggested_question?: string;
}

type AnalyzeWalkthroughResult =
	| { success: true; alerts: WalkthroughAlert[] }
	| { success: false; error: string };

export async function analyzeWalkthroughChunk(
	transcriptChunk: string,
	tradeType = 'general remodel',
): Promise<AnalyzeWalkthroughResult> {
	try {
		const chatResponse = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `You are BUILDRAIL's Live Walkthrough Copilot: a senior residential construction estimator riding along during a walkthrough.

The current trade/context is: ${tradeType}.

Listen for missing scope, hidden labor, unclear responsibility, homeowner decisions, sequencing dependencies, exclusions, and margin risks.
Be contractor-native and practical. Surface only prompts that prevent a costly miss before the contractor leaves the site.
Do not sound like a chatbot. Keep each prompt short enough to read on a phone.

Trade-specific examples:
- Kitchen: appliance responsibility, cabinet modifications, countertop templating, backsplash edges, plumbing/electrical moves, flooring transitions.
- Bath: waterproofing method, valve access, tile substrate, glass lead times, venting, fixture responsibility.
- Flooring: subfloor condition, transitions, baseboard handling, furniture moving, leveling, disposal.
- Roofing: decking allowance, flashing, ventilation, gutters, permit, tear-off layers.
- Painting: surface prep, texture matching, color approvals, protection, repairs, access.
- Exterior: rot discovery, access, drainage, siding/trim tie-ins, weather windows.
- Additions: permits, engineering, utilities, inspections, sequencing, temporary protection.

If the chunk is casual, duplicate, or already operationally clear, return an empty alerts array.

You MUST respond in pure JSON matching this structure:
          {
            "alerts": [
              {
                "type": "risk" | "missing_question" | "scope_dependency" | "margin_protection",
                "severity": "low" | "medium" | "high",
                "trade": "The trade or scope area this applies to.",
                "message": "The short, punchy prompt to show the contractor.",
                "suggested_question": "Optional exact question the contractor can ask now."
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
		return {
			success: true,
			alerts: (parsedData.alerts || []) as WalkthroughAlert[],
		};
	} catch (error) {
		console.error('Copilot Analysis Failed:', error);
		return { success: false, error: 'Failed to analyze chunk.' };
	}
}
