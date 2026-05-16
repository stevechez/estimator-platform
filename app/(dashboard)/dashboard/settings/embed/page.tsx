"use client";

import { useState } from "react";
import {
  Code2,
  Copy,
  CheckCircle2,
  Paintbrush,
  LayoutTemplate,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";

// Mocking the active user session. In production, get this from Supabase Auth!
const MOCK_TENANT_ID = "clx9102";

const TRADE_VERTICALS = [
  { id: "roof", label: "Roof Replacement" },
  { id: "kitchen", label: "Kitchen Remodel" },
  { id: "bathroom", label: "Bathroom Remodel" },
  { id: "garage", label: "Garage Doors" },
  { id: "hvac", label: "HVAC Upgrade" },
  { id: "electrical", label: "Electrical Service" },
  { id: "plumbing", label: "Plumbing Diagnostics" },
];

const BRAND_COLORS = [
  { name: "Blue", hex: "2563eb", bg: "bg-blue-600", ring: "ring-blue-600" },
  {
    name: "Emerald",
    hex: "059669",
    bg: "bg-emerald-600",
    ring: "ring-emerald-600",
  },
  { name: "Amber", hex: "d97706", bg: "bg-amber-600", ring: "ring-amber-600" },
  { name: "Red", hex: "dc2626", bg: "bg-red-600", ring: "ring-red-600" },
  { name: "Slate", hex: "475569", bg: "bg-slate-600", ring: "ring-slate-600" },
  {
    name: "Midnight",
    hex: "0f172a",
    bg: "bg-slate-900",
    ring: "ring-slate-500",
  },
];

export default function EmbedGeneratorPage() {
  const [selectedTrade, setSelectedTrade] = useState(TRADE_VERTICALS[0].id);
  const [selectedColor, setSelectedColor] = useState(BRAND_COLORS[0]);
  const [copied, setCopied] = useState(false);

  // Dynamically generate the iframe string based on contractor selections
  const generateIframeCode = () => {
    return `<iframe 
  src="https://buildrail.com/embed/${MOCK_TENANT_ID}/${selectedTrade}?theme=${selectedColor.hex}" 
  id="buildrail-engine"
  style="width: 100%; min-height: 750px; border: none; border-radius: 16px; overflow: hidden;"
  loading="lazy"
></iframe>`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateIframeCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8 max-w-6xl mx-auto pt-24">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-900 pb-6">
        <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
          Workspace Infrastructure
        </p>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Widget Deployment Hub
        </h1>
        <p className="text-sm text-slate-400 font-medium max-w-2xl mt-2 leading-relaxed">
          Configure your lead capture engine and drop it onto any website. The
          embedded widget automatically inherits your custom pricing matrices
          and routes captured leads instantly to your dashboard.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CONFIGURATION CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
          {/* Trade Selection */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900/50 flex items-center justify-center text-blue-400">
                <LayoutTemplate className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight">
                  Active Trade Framework
                </h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Select Vertical to Deploy
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {TRADE_VERTICALS.map((trade) => (
                <label
                  key={trade.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedTrade === trade.id
                      ? "bg-blue-600/10 border-blue-500/50 text-blue-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="trade"
                    value={trade.id}
                    checked={selectedTrade === trade.id}
                    onChange={(e) => setSelectedTrade(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedTrade === trade.id
                        ? "border-blue-500"
                        : "border-slate-600"
                    }`}
                  >
                    {selectedTrade === trade.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-bold">{trade.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-900/50 flex items-center justify-center text-purple-400">
                <Paintbrush className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight">
                  Brand Accent Color
                </h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Match your website theme
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {BRAND_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center transition-all ${
                    selectedColor.hex === color.hex
                      ? `ring-4 ring-offset-4 ring-offset-slate-950 ${color.ring} scale-110`
                      : "hover:scale-110 shadow-lg shadow-black/50"
                  }`}
                  title={color.name}
                >
                  {selectedColor.hex === color.hex && (
                    <CheckCircle2 className="w-5 h-5 text-white/90" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CODE GENERATOR & PREVIEW */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Your Embed Snippet
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Ready to deploy to production.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Code Editor Box */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative z-10 flex-1">
              {/* Mac-style Window header */}
              <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-4 text-xs font-mono text-slate-500">
                  index.html
                </span>
              </div>

              <div className="p-6 overflow-x-auto">
                <pre className="text-sm font-mono leading-loose">
                  <span className="text-pink-400">&lt;iframe</span>
                  <br />
                  <span className="text-blue-300"> src=</span>
                  <span className="text-green-300">
                    "https://buildrail.com/embed/{MOCK_TENANT_ID}/
                    {selectedTrade}?theme={selectedColor.hex}"
                  </span>
                  <br />
                  <span className="text-blue-300"> id=</span>
                  <span className="text-green-300">"buildrail-engine"</span>
                  <br />
                  <span className="text-blue-300"> style=</span>
                  <span className="text-green-300">
                    "width: 100%; min-height: 750px; border: none;
                    border-radius: 16px; overflow: hidden;"
                  </span>
                  <br />
                  <span className="text-blue-300"> loading=</span>
                  <span className="text-green-300">"lazy"</span>
                  <br />
                  <span className="text-pink-400">&gt;&lt;/iframe&gt;</span>
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 relative z-10">
              <button
                onClick={handleCopyCode}
                className={`flex-1 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  copied
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Code Copied to
                    Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" /> Copy Snippet
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 relative z-10">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure 256-bit SSL encrypted iframe tunnel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
