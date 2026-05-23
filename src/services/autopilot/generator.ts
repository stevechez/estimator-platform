import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export interface EstimateContext {
	clientName: string;
	contractorName: string;
	companyName: string;
	projectType: string;
	totalAmount: number;
	keyHighlights: string[]; // e.g., ['Quartz counters', 'Hardwood floors']
	stepNumber: number;
	channel: 'sms' | 'email';
}

export async function generateAutopilotMessage(context: EstimateContext) {
	const systemPrompt = `
    You are an expert sales assistant for a residential contractor.
    Draft a follow-up message to a homeowner about a recent estimate.
    
    RULES:
    1. Tone: Professional, brief, friendly, contractor-focused. No corporate fluff.
    2. Write like a busy contractor texting/emailing from their truck. Keep it punchy.
    3. Use the key highlights to show you remember their specific job.
    4. NEVER sound desperate or like automated marketing spam.
    5. If SMS, keep under 160 characters. No subject lines for SMS.
  `;

	// Helper to give the AI a sense of time/urgency based on the step
	const timingContext =
		context.stepNumber === 1
			? '24 hours after sending (Confirming receipt)'
			: context.stepNumber === 2
				? '3 days later (Checking for questions)'
				: '7+ days later (Polite final check-in or offering a call)';

	const userPrompt = `
    Job Details:
    - Client: ${context.clientName}
    - Contractor: ${context.contractorName} from ${context.companyName}
    - Project: ${context.projectType}
    - Cost: $${context.totalAmount.toLocaleString()}
    - Highlights: ${context.keyHighlights.join(', ')}
    - Timing: Step ${context.stepNumber} - ${timingContext}
    - Channel: ${context.channel.toUpperCase()}
  `;

	const response = await openai.chat.completions.create({
		model: 'gpt-4o', // Fastest model for text reasoning
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt },
		],
		response_format: {
			type: 'json_schema',
			json_schema: {
				name: 'follow_up_payload',
				strict: true,
				schema: {
					type: 'object',
					properties: {
						subjectLine: {
							type: 'string',
							description: 'Catchy and short if Email. Empty string if SMS.',
						},
						messageBody: {
							type: 'string',
							description: 'The personalized text or email body.',
						},
						aiReasoning: {
							type: 'string',
							description:
								'1-sentence explanation of the angle chosen for the UI.',
						},
					},
					required: ['subjectLine', 'messageBody', 'aiReasoning'],
					additionalProperties: false,
				},
			},
		},
	});

	// Since we enforce strict JSON, we can safely parse this directly
	return JSON.parse(response.choices[0].message.content!);
}
