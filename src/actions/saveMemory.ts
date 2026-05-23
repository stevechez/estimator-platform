"use server";

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Supabase (Use the Service Role key here to bypass RLS since this is a secure Server Action, 
// or use your standard Next.js auth-aware Supabase client if you have one configured)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface SaveMemoryParams {
  projectId: string; // The UUID of the job/house
  content: string; // The raw text (transcript, email body, etc.)
  sourceType: "voice_note" | "email_forward" | "system_auto" | "user_text";
  metadata?: Record<string, any>; // Flexible JSON object for extra context
}

export async function saveProjectMemory({ 
  projectId, 
  content, 
  sourceType, 
  metadata = {} 
}: SaveMemoryParams) {
  try {
    // 1. Convert the text into a mathematical vector
    // We use 'text-embedding-3-small' because it is OpenAI's newest, fastest, and cheapest embedding model
    // It defaults to exactly 1536 dimensions, perfectly matching our database schema.
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
      encoding_format: "float",
    });

    const embedding = embeddingResponse.data[0].embedding;

    // 2. Save everything to Supabase
    const { data, error } = await supabase
      .from("project_memories")
      .insert({
        project_id: projectId,
        content: content,
        embedding: embedding,
        source_type: sourceType,
        metadata: metadata,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(error.message);
    }

    return { success: true, memoryId: data.id };

  } catch (error) {
    console.error("Failed to save project memory:", error);
    return { success: false, error: "Failed to vectorize and store memory." };
  }
}
