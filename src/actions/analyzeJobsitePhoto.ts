'use server';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface JobsitePhotoIntelligence {
	room_classification: string;
	materials_spotted: string[];
	visible_issues: string[];
	stage_of_completion: string;
	scope_implications: string[];
	estimate_links: string[];
	search_tags: string[];
	confidence: 'low' | 'medium' | 'high';
}

type AnalyzeJobsitePhotoResult =
	| { success: true; data: JobsitePhotoIntelligence }
	| { success: false; error: string };

export async function analyzeJobsitePhoto(
	formData: FormData,
): Promise<AnalyzeJobsitePhotoResult> {
	try {
		const file = formData.get('photo') as File | null;

		if (!file) {
			return { success: false, error: 'No photo received.' };
		}

		// 1. Convert the file into a Base64 string so OpenAI Vision can read it directly
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64Image = buffer.toString('base64');

		// 2. The Vision Prompt (Structured for JSON Output)
		const chatResponse = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `You are BUILDRAIL's Smart Photo Intelligence engine: a senior residential construction superintendent looking at a jobsite photo.
          Extract practical construction intelligence that can help estimating, search, crew planning, change orders, and project memory.
          Be specific when visible, cautious when uncertain, and never invent hidden conditions that are not visible.
          
          You MUST respond in pure JSON matching this exact structure:
          {
            "room_classification": "e.g., Master Bathroom, Kitchen, Exterior",
            "materials_spotted": ["e.g., PEX piping", "Kerdi board", "Quartz"],
            "visible_issues": ["e.g., Water stain near baseboard", "Uncapped wires"],
            "stage_of_completion": "e.g., Rough framing, Drywall prep, Final finish",
            "scope_implications": ["e.g., Verify whether drywall patching is included"],
            "estimate_links": ["e.g., plumbing", "drywall", "demo"],
            "search_tags": ["e.g., plumbing", "shower", "leak risk"],
            "confidence": "low" | "medium" | "high"
          }`,
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: 'Analyze this photo and provide the structured JSON.',
						},
						{
							type: 'image_url',
							image_url: {
								url: `data:${file.type};base64,${base64Image}`,
							},
						},
					],
				},
			],
			response_format: { type: 'json_object' },
		});

		const parsedData = JSON.parse(
			chatResponse.choices[0].message.content || '{}',
		);

		return { success: true, data: parsedData as JobsitePhotoIntelligence };
	} catch (error) {
		console.error('Photo Intelligence Failed:', error);
		return { success: false, error: 'Failed to analyze photo.' };
	}
}
