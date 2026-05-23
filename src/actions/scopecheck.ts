'use server';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeEstimateScope(rawEstimateText: string) {
	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `You are a cynical, highly experienced 30-year General Contractor and Estimator. 
          Your job is to read a draft estimate and find the hidden "scope gaps"—the dependencies, prep work, disposal, permits, and finishing touches that younger contractors always forget to charge for.
          
          Rules:
          1. Look for dependencies (e.g., If drywall is removed, is paint blending included? If a toilet is moved, is flange repair included?).
          2. Look for logistical misses (Dumpster fees, port-a-johns, site protection, dust control).
          3. Be ruthlessly protective of the contractor's profit margin.
          4. Only flag items that are highly likely to be required based on the provided text.

          You MUST respond in pure JSON matching this exact structure:
          {
            "risk_score": 8,
            "confidence_level": "high",
            "missing_items": [
              {
                "category": "Demolition",
                "item_name": "Dumpster/Disposal Fee",
                "trigger_item": "Demo existing tile floor",
                "estimated_cost_impact": "$400 - $600",
                "severity": "moderate"
              }
            ],
            "suggested_exclusions": ["Does not include repairing hidden water damage"]
          }`,
				},
				{
					role: 'user',
					content: `Here is the draft estimate. Analyze it for gaps:\n\n${rawEstimateText}`,
				},
			],
			response_format: { type: 'json_object' }, // This forces guaranteed JSON output on older SDKs
		});

		// Manually parse the JSON string returned by OpenAI
		const parsedData = JSON.parse(response.choices[0].message.content || '{}');

		return { success: true, data: parsedData };
	} catch (error) {
		console.error('ScopeCheck Analysis Failed:', error);
		return { success: false, error: 'Failed to analyze estimate.' };
	}
}
