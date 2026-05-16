"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900/80 header-glow">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO FRAME */}
        <Link href="/">
          <span className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black tracking-[0.25em] text-white uppercase group-hover:text-slate-200 transition-colors">
              BUILDRAIL
            </span>
          </span>
        </Link>

        {/* CENTER LINKS */}
        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#trades" className="hover:text-white transition-colors">
            Trades
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors text-slate-600"
          >
            Docs
          </a>
        </div>

        {/* AUTH ACTION BUTTONS */}
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <Link href="/login">
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer py-2">
              Sign In
            </span>
          </Link>
          <Link href="/estimator">
            <span className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xl">
              Live Demo
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
