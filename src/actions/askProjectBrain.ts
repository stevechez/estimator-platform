"use server";

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Using the Service Role key again for reliable server-side execution
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AskBrainParams {
  projectId: string;
  question: string;
}

export async function askProjectBrain({ projectId, question }: AskBrainParams) {
  try {
    // Step 1: Convert the contractor's question into a vector
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
      encoding_format: "float",
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Step 2: Search the database using your custom SQL function
    const { data: memories, error } = await supabase.rpc("match_project_memories", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5, // 0.5 is a good starting point. Lower it if it misses context, raise it if it pulls garbage.
      match_count: 8,       // Pull the top 8 most relevant memories
      p_project_id: projectId,
    });

    if (error) throw new Error(error.message);

    // If no memories match, we don't even need to wake up GPT-4o
    if (!memories || memories.length === 0) {
      return { 
        success: true, 
        answer: "I don't have any records in the project memory related to that question yet.",
        sources: [] 
      };
    }

    // Step 3: Format the memories into a single string for GPT-4o to read
    const formattedContext = memories.map((m: any) => {
      const date = new Date(m.created_at).toLocaleDateString();
      return `[Date: ${date}] [Source: ${m.source_type}] Content: ${m.content}`;
    }).join("\n\n");

    // Step 4: Have GPT-4o synthesize the answer
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the AI Project Coordinator for a residential construction platform called BUILDRAIL.
          Your job is to answer the contractor's question using ONLY the provided project memories.
          
          Rules:
          1. Be concise, professional, and direct. Contractors are reading this in the field.
          2. If the answer is in the context, provide it and mention the date it was logged.
          3. If the answer is NOT in the context, explicitly say "I do not have a record of that in the project memory." DO NOT guess or hallucinate.
          4. Protect the contractor. Highlight any unresolved risks or pending approvals mentioned in the context.
          
          Here is the project memory context:\n${formattedContext}`
        },
        {
          role: "user",
          content: question
        }
      ],
    });

    // We return the AI's string answer, PLUS the raw memory objects so the UI can build "Source Citations"
    return { 
      success: true, 
      answer: chatResponse.choices[0].message.content,
      sources: memories 
    };

  } catch (error) {
    console.error("Project Brain Failed:", error);
    return { success: false, error: "Failed to search project memory." };
  }
}
