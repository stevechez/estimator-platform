"use client";

import { useState } from "react";
import { saveProjectMemory } from "@/actions/saveMemory";

export default function TestMemoryIngestion() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // A dummy UUID for testing purposes. 
  // In production, this comes from your active project context.
  const TEST_PROJECT_ID = "11111111-1111-1111-1111-111111111111"; 

  const handleTestSubmit = async () => {
    if (!content.trim()) return;
    
    setStatus("loading");
    
    const result = await saveProjectMemory({
      projectId: TEST_PROJECT_ID,
      content: content,
      sourceType: "user_text",
      metadata: { test_run: true, user: "Steve" }
    });

    if (result.success) {
      setStatus("success");
      setContent(""); // Clear it for the next test
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
      <h3 className="text-white font-semibold">Test Project Memory</h3>
      
      <textarea 
        className="w-full h-32 p-3 bg-zinc-900 text-white border border-zinc-700 rounded-lg text-sm focus:ring-blue-500 focus:outline-none"
        placeholder="Type a test memory here... (e.g., 'Homeowner approved the matte black fixtures today.')"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button 
        onClick={handleTestSubmit}
        disabled={status === "loading"}
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "Vectorizing & Saving..." : 
         status === "success" ? "Saved to Memory!" : 
         "Save to Database"}
      </button>

      {status === "error" && (
        <p className="text-red-400 text-xs">Failed to save. Check terminal logs.</p>
      )}
    </div>
  );
}
