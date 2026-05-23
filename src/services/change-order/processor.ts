import { OpenAI } from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Define the explicit shape the AI MUST return
const ChangeOrderSchema = z.object({
	scope_summary: z
		.string()
		.describe(
			'Clear, technical description of the additional work for the contract.',
		),
	labor_cost_delta: z
		.number()
		.describe('Estimated labor cost increase in USD.'),
	material_cost_delta: z
		.number()
		.describe('Estimated materials cost increase in USD.'),
	homeowner_explanation: z
		.string()
		.describe(
			'A polite, professional explanation written for the homeowner explaining WHY this change happened (e.g., structural necessity, code compliance, or user preference).',
		),
});

interface ProcessChangeOrderInput {
	transcript: string;
	imageUrl?: string;
}

export async function generateChangeOrderData({
	transcript,
	imageUrl,
}: ProcessChangeOrderInput) {
	// Construct content dynamically based on whether an image exists
	const messages: any[] = [
		{
			role: 'system',
			content: `You are an expert construction project manager and estimator. 
      Analyze the contractor's raw input (voice transcript and/or jobsite photo) and generate a professional, line-item change order. 
      Be realistic with material and labor costs based on regional standards if specific numbers aren't mentioned.`,
		},
		{
			role: 'user',
			content: [
				{ type: 'text', text: `Contractor Raw Input: "${transcript}"` },
			],
		},
	];

	// If a photo was uploaded, pass it natively to the vision model
	if (imageUrl) {
		messages[1].content.push({
			type: 'image_url',
			image_url: { url: imageUrl },
		});
	}

	const response = await openai.beta.chat.completions.parse({
		model: 'gpt-4o', // Vision + High Reasoning capability
		messages: messages,
		response_format: zodResponseFormat(ChangeOrderSchema, 'change_order'),
	});

	return response.choices[0].message.parsed;
}
