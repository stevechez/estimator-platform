'use server';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeJobsitePhoto(formData: FormData) {
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
					content: `You are a Senior Construction Superintendent. Analyze this jobsite photo.
          Your job is to extract structured intelligence from this image so it can be searched later.
          
          You MUST respond in pure JSON matching this exact structure:
          {
            "room_classification": "e.g., Master Bathroom, Kitchen, Exterior",
            "materials_spotted": ["e.g., PEX piping", "Kerdi board", "Quartz"],
            "visible_issues": ["e.g., Water stain near baseboard", "Uncapped wires"],
            "stage_of_completion": "e.g., Rough framing, Drywall prep, Final finish",
            "search_tags": ["e.g., plumbing", "shower", "leak risk"]
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

		return { success: true, data: parsedData };
	} catch (error) {
		console.error('Photo Intelligence Failed:', error);
		return { success: false, error: 'Failed to analyze photo.' };
	}
}
