import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { projectId, summary, estimateDraft } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    // 1. Authenticate the request
    const cookieStore = await cookies(); // Next.js 15 syntax
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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Update the specific walkthrough session
    const { error: dbError } = await supabase
      .from("walkthrough_sessions")
      .update({
        proposal_summary: summary,
        estimate_draft: estimateDraft,
      })
      .eq("project_id", projectId);

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save draft" }, 
      { status: 500 }
    );
  }
}
