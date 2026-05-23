"use client";

import { useState } from "react";
import { Search, Loader2, Clock, Mail, Mic, MessageSquare, ChevronRight } from "lucide-react";
import { askProjectBrain } from "@/actions/askProjectBrain";

interface MemorySource {
  id: string;
  content: string;
  source_type: string;
  created_at: string;
  metadata: any;
}

export default function ProjectBrainUI({ projectId }: { projectId: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<MemorySource[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer(null);
    setSources([]);

    const result = await askProjectBrain({ projectId, question: query });

    if (result.success) {
      setAnswer(result.answer || "No answer generated.");
      setSources(result.sources || []);
    } else {
      setAnswer("Failed to connect to the project memory. Please try again.");
    }

    setLoading(false);
  };

  // Helper to pick the right icon based on how the memory was ingested
  const getSourceIcon = (type: string) => {
    switch (type) {
      case "voice_note": return <Mic className="w-4 h-4 text-blue-500" />;
      case "email_forward": return <Mail className="w-4 h-4 text-purple-500" />;
      case "user_text": return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      default: return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[80vh] font-sans">
      
      {/* 1. THE SEARCH BAR (Superhuman Style) */}
      <div className="shrink-0 mb-8">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            {loading ? (
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
            ) : (
              <Search className="w-6 h-6 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
            )}
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-6 py-5 bg-white border border-zinc-200 rounded-2xl shadow-sm text-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            placeholder="Ask anything about this project... (e.g., 'Did they approve the electrical overage?')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </form>
      </div>

      {/* 2. THE RESULTS AREA */}
      <div className="flex-1 overflow-y-auto space-y-8 pb-12">
        
        {/* State: Empty / Waiting */}
        {!loading && !answer && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4 opacity-50">
            <Search className="w-12 h-12 stroke-[1.5]" />
            <p className="text-sm font-medium tracking-wide">AI Project Memory is ready.</p>
          </div>
        )}

        {/* State: AI Answer & Sources */}
        {answer && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* The Synthesized Answer */}
            <div className="p-8 bg-zinc-900 text-white rounded-3xl shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Project Intelligence</h3>
              <p className="text-lg leading-relaxed text-zinc-100">{answer}</p>
            </div>

            {/* The Source Citations (Memory Cards) */}
            {sources.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-2">Sources Found</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sources.map((source) => (
                    <div 
                      key={source.id} 
                      className="group p-5 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-300 hover:shadow-md transition-all cursor-default"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-zinc-100 transition-colors">
                            {getSourceIcon(source.source_type)}
                          </div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                            {source.source_type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-zinc-400">
                          {new Date(source.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-zinc-700 leading-relaxed line-clamp-3">
                        "{source.content}"
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-semibold text-blue-500">View Full Record</span>
                        <ChevronRight className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
