import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The prompt that forces the AI to act as a structured organizer, not a pricing engine.
const SYSTEM_PROMPT = `
You are an expert construction estimator assistant. 
Your job is to take a raw, messy, spoken transcript from a contractor walking a job site and organize it into a structured JSON object.

DO NOT invent pricing. DO NOT invent measurements that were not spoken.
Group items logically by Room or Phase (e.g., Demolition, Kitchen, Master Bath).

You MUST return a JSON object with EXACTLY this structure:
{
  "ai_summary": [
    {
      "category": "String (e.g., Demolition, Kitchen, Plumbing)",
      "items": ["String", "String"]
    }
  ],
  "estimate_draft": [
    {
      "section": "String (e.g., Rough-in, Finishes)",
      "line_items": [
        { "name": "String", "quantity": "String (if spoken, else 'TBD')", "notes": "String" }
      ]
    }
  ],
  "proposal_summary": "A 2-3 sentence professional summary written to the homeowner explaining the overall scope of work discussed."
}
`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get("audio") as Blob;
    const projectId = formData.get("projectId") as string;

    if (!audioBlob || !projectId) {
      return NextResponse.json({ error: "Missing audio or project ID" }, { status: 400 });
    }

    // 1. Authenticate the request
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Convert Blob to File for OpenAI Whisper
    const file = new File([audioBlob], "walkthrough.webm", { type: "audio/webm" });

    // 3. Transcribe Audio (Whisper)
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });
    const transcriptText = transcription.text;

    // 4. Structure Scope (GPT-4o)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: transcriptText },
      ],
    });

    const structuredData = JSON.parse(completion.choices[0].message.content || "{}");

    // 5. Save to Supabase
    const { error: dbError } = await supabase
      .from("walkthrough_sessions")
      .update({
        transcript: transcriptText,
        ai_summary: structuredData.ai_summary,
        estimate_draft: structuredData.estimate_draft,
        proposal_summary: structuredData.proposal_summary,
      })
      .eq("project_id", projectId);

    if (dbError) throw new Error(dbError.message);

    // Return success to the frontend so it can redirect
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Processing error:", error);
    return NextResponse.json({ error: error.message || "Failed to process walkthrough" }, { status: 500 });
  }
}
