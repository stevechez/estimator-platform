// app/(dashboard)/dashboard/page.tsx
"use client";

import Link from "next/link";
import {
  Users,
  TrendingUp,
  Layers,
  Code2,
  ArrowUpRight,
  Sparkles,
  Building2,
} from "lucide-react";

export default function DashboardOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8 max-w-7xl mx-auto pt-24">
      {/* WELCOME BANNER HEADER FRAME */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
            Operational Command
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Workspace Overview
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-950/40 border border-blue-900/40 rounded-xl text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Systems Online
        </div>
      </div>

      {/* THREE-COLUMN HIGH-LEVEL KPI METRIC CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Volume */}
        <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Pipeline Pipeline Value
              </p>
              <h3 className="text-3xl font-black text-white">$165,150</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-900/40 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold tracking-wide mt-4 flex items-center gap-1">
            +24.5%{" "}
            <span className="text-slate-600 font-medium">
              vs target window parameters
            </span>
          </p>
        </div>

        {/* Card 2: Active Leads */}
        <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Captured Lead Rows
              </p>
              <h3 className="text-3xl font-black text-white">5 Active</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-900/40 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide mt-4">
            100% budget qualified via{" "}
            <span className="text-blue-400 font-bold">Squeeze Wall</span>
          </p>
        </div>

        {/* Card 3: Embedded Instances */}
        <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Deployments Active
              </p>
              <h3 className="text-3xl font-black text-white">2 Domains</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-900/40 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold tracking-wide mt-4">
            Framework script operational checks passing
          </p>
        </div>
      </div>

      {/* LOWER NAVIGATION SPLIT ACTIONS */}
      <div className="grid md:grid-cols-2 gap-6 pt-2">
        {/* Action Panel A: Jump straight to active table metrics */}
        <Link href="/dashboard/leads" className="group outline-none">
          <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all cursor-pointer h-full flex flex-col justify-between group-hover:bg-slate-900/30">
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                Leads Terminal Vault
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Inspect high-fidelity incoming submissions, process automated
                computer vision payloads, and trace homeowner specifications.
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest block mt-6">
              Open leads database →
            </span>
          </div>
        </Link>

        {/* Action Panel B: Grab deploy code updates */}
        <Link href="/dashboard/settings/embed" className="group outline-none">
          <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all cursor-pointer h-full flex flex-col justify-between group-hover:bg-slate-900/30">
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                Deploy Embed Widget
                <Code2 className="w-4 h-4 text-slate-600" />
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Reconfigure white-label brand hex colors, toggle vertical
                estimation frameworks, and sync copy-paste HTML iframe tokens
                instantly.
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest block mt-6">
              Open deployment panel →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
