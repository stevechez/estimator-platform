"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Code2,
  Copy,
  CheckCircle2,
  Home,
  Utensils,
  CarFront,
  Zap,
  Droplet,
  LayoutTemplate,
} from "lucide-react";

export default function EmbedHubPage() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [activeTrade, setActiveTrade] = useState("roof");
  const [copied, setCopied] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setTenantId(user.id);
      }
    }
    getUser();
  }, [supabase]);

  // The base URL where your app is currently hosted
  // In production, this will automatically read your live Vercel domain
  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://yourdomain.com";
  };

  const generateIframeCode = () => {
    const url = `${getBaseUrl()}/estimator/${activeTrade}?tenant=${tenantId}`;
    return `<iframe src="${url}" width="100%" height="800" frameborder="0" style="border:none; border-radius: 16px; overflow:hidden; background: transparent;"></iframe>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateIframeCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trades = [
    { id: "roof", name: "Roofing Estimator", icon: Home },
    { id: "kitchen", name: "Kitchen Remodel", icon: Utensils },
    { id: "garage", name: "Garage & Additions", icon: CarFront },
    { id: "electrical", name: "Electrical Services", icon: Zap },
    { id: "plumbing", name: "Plumbing Infrastructure", icon: Droplet },
  ];

  if (!tenantId) return null; // Wait for auth to resolve

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-900/80 pb-6">
        <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
          Deployment Center
        </p>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-3">
          <Code2 className="w-8 h-8 text-slate-400" /> Widget Embed Hub
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Deploy your algorithmic estimators to your own website. Select a
          trade, copy the HTML snippet, and paste it directly into your site
          builder (WordPress, Wix, Webflow, etc.).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Trade Selector */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
            Select Widget Type
          </h2>
          <div className="space-y-2">
            {trades.map((trade) => {
              const Icon = trade.icon;
              const isActive = activeTrade === trade.id;
              return (
                <button
                  key={trade.id}
                  onClick={() => setActiveTrade(trade.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-blue-600/10 border-blue-500/50 text-blue-400 border"
                      : "bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {trade.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Code Generator */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/60 p-6 md:p-8 rounded-2xl backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-blue-400" /> HTML iFrame
                Snippet
              </h2>
              <button
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied to Clipboard!" : "Copy Snippet"}
              </button>
            </div>

            <div className="bg-[#0a0f1c] border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
              <pre className="text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                <code>{generateIframeCode()}</code>
              </pre>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-300 block mb-1">
                Developer Note:
              </span>
              This iframe operates securely over HTTPS and automatically
              isolates consumer data to your specific organizational{" "}
              <code>tenant_id</code>. It is responsive out-of-the-box and will
              automatically scale to fit mobile screens.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
