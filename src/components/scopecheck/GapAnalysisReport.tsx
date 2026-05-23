"use client";

import { useState } from "react";
import { AlertTriangle, ShieldAlert, Copy, Check, Info, AlertCircle } from "lucide-react";

// Mirroring the schema type here for the props
export interface GapAnalysisReportProps {
  data: {
    risk_score: number;
    confidence_level: "low" | "medium" | "high";
    missing_items: Array<{
      category: string;
      item_name: string;
      trigger_item: string;
      estimated_cost_impact: string;
      severity: "critical" | "moderate" | "minor";
    }>;
    suggested_exclusions: string[];
  };
}

export default function GapAnalysisReport({ data }: GapAnalysisReportProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Helper to color-code the master risk score
  const getRiskColor = (score: number) => {
    if (score >= 8) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 5) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  };

  // Helper to style individual item severity badges
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "moderate":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "minor":
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER: The Margin Risk Overview */}
      <div className={`p-6 border rounded-2xl flex items-center justify-between ${getRiskColor(data.risk_score)}`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm">
            <ShieldAlert className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Scope Risk: {data.risk_score}/10</h2>
            <p className="text-sm font-medium opacity-80">
              {data.risk_score >= 8 ? "High probability of margin erosion." : 
               data.risk_score >= 5 ? "Moderate risk of unbilled scope." : 
               "Solid estimate. Minor gaps detected."}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Items Flagged</p>
          <p className="text-3xl font-black">{data.missing_items.length}</p>
        </div>
      </div>

      {/* MISSING ITEMS LIST */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 px-1">Detected Scope Gaps</h3>
        
        {data.missing_items.map((item, idx) => {
          const uniqueId = `item-${idx}`;
          const copyText = `${item.item_name} (Triggered by: ${item.trigger_item})`;

          return (
            <div key={uniqueId} className="group p-5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 hover:shadow-md transition-all">
              <div className="flex justify-between items-start gap-4">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSeverityBadge(item.severity)}`}>
                      {item.severity}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-zinc-900">{item.item_name}</h4>
                  
                  <div className="flex items-start gap-2 text-sm text-zinc-500 mt-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                    <p>Because you included <span className="font-medium text-zinc-700">"{item.trigger_item}"</span></p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-medium text-zinc-400 uppercase">Est. Impact</p>
                    <p className="text-lg font-black text-zinc-800">{item.estimated_cost_impact}</p>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(copyText, uniqueId)}
                    className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
                  >
                    {copiedItem === uniqueId ? (
                      <><Check className="w-4 h-4 text-emerald-500" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Add to Estimate</>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* SUGGESTED EXCLUSIONS */}
      {data.suggested_exclusions.length > 0 && (
        <div className="mt-8 p-6 border border-zinc-200 bg-zinc-50 rounded-2xl">
          <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            Recommended Legal Exclusions
          </h3>
          <ul className="space-y-2">
            {data.suggested_exclusions.map((exclusion, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm text-zinc-600 bg-white border border-zinc-200 p-3 rounded-lg">
                <span>{exclusion}</span>
                <button
                  onClick={() => handleCopy(exclusion, `excl-${idx}`)}
                  className="text-zinc-400 hover:text-zinc-900 p-1"
                  title="Copy exclusion"
                >
                  {copiedItem === `excl-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
