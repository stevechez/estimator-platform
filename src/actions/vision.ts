"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeGaragePhoto(
  base64Image: string,
  mimeType: string,
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a professional garage door estimator. Analyze this photo and return a strict JSON object.
              
              Extract these exact keys:
              - "doorCount": Number of garage doors visible (integer).
              - "sizeType": Array of strings, either "Single" or "Double" for each door found.
              - "hasWindows": Boolean, true if ANY of the doors have glass windows.
              - "materialStyle": String, guess the current style (e.g., "Basic Steel", "Wood Carriage").
              - "confidence": Integer from 1-100.
              
              Return ONLY the raw JSON. No markdown backticks.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      // This forces the model to return valid JSON
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("OpenAI returned an empty response.");
    }

    const parsedData = JSON.parse(content);
    return { success: true, data: parsedData };
  } catch (error: any) {
    console.error("OpenAI Vision Error:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze image.",
    };
  }
}
