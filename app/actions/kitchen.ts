"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeKitchen(images: string[]) {
  try {
    const imageContent = images.map((base64) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:image/jpeg;base64,${base64}`,
      },
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze these kitchen photos for a remodel estimate. 
              Return a strict JSON object with these keys:
              - "layoutType": "Galley", "L-Shape", "U-Shape", or "Open Concept with Island".
              - "hasIsland": Boolean.
              - "cabinetVolume": "Small", "Medium", or "Large".
              - "applianceGrade": "Standard" (freestanding) or "Luxury" (built-in, paneled, professional grade).
              - "layoutChangeLikely": Boolean (True if it looks like walls are being removed or islands added/moved).
              - "confidence": Integer 1-100.`,
            },
            ...imageContent,
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No analysis returned from OpenAI.");

    return { success: true, data: JSON.parse(content) };
  } catch (error: any) {
    console.error("Kitchen Vision Error:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze kitchen.",
    };
  }
}
