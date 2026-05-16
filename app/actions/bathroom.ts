"use server";

import OpenAI from "openai";

// Uses your OpenAI key from .env.local
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBathroom(images: string[]) {
  try {
    // We map over the array of base64 strings and format them for GPT-4o
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
              text: `Analyze these bathroom photos for a remodel estimate. 
              Return a strict JSON object with these keys:
              - "roomType": Must be exactly "Powder", "Full", or "Primary".
              - "vanityType": String description (e.g., "Double Vanity").
              - "showerType": String description (e.g., "Tub/Shower Combo").
              - "hasWindows": Boolean.
              - "layoutChangeLikely": Boolean (True if it looks like they want to move a wall or convert a tub to a walk-in shower).
              - "sqFtEstimate": Integer.
              - "confidence": Integer 1-100.`,
            },
            // Spread the array of images directly into the message content
            ...imageContent,
          ],
        },
      ],
      // Forces the AI to return clean JSON without markdown backticks
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No analysis returned from OpenAI.");

    return { success: true, data: JSON.parse(content) };
  } catch (error: any) {
    console.error("Bathroom Vision Error:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze bathroom.",
    };
  }
}
