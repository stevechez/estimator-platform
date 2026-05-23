"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderGit2,
  Layers,
  Sliders,
  LogOut,
  ShieldCheck,
  User,
  Code2,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  // Define your sidebar links with active states
  const navigationItems = [
    {
      name: "Lead Registry",
      href: "/dashboard/leads",
      icon: Layers,
    },
    {
      name: "Embed Widgets",
      href: "/dashboard/embed",
      icon: Code2,
    },
    {
      name: "Pricing Controls",
      href: "/dashboard/settings",
      icon: Sliders,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* 1. FIXED DARK SIDEBAR */}
      <aside className="w-64 bg-[#070a13] border-r border-slate-900 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
        {/* Top Branding Section */}
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-wider block">
                BUILDRAIL
              </span>
              <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">
                Operations
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all ${
                    isActive
                      ? "bg-slate-900 border border-slate-800 text-white shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Controls Section */}
        <div className="p-4 border-t border-slate-900 space-y-2 bg-[#05070d]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate max-w-[140px]">
              <p className="text-xs font-bold text-slate-300 truncate">
                Contractor Admin
              </p>
              <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-tight flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Active
                Session
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-all border border-transparent"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* 2. DYNAMIC CONTENT INNER CONTAINER */}
      <main className="flex-1 pl-64 bg-slate-950 min-h-screen">
        <div className="w-full h-full">{children}</div>
      </main>
    </div>
  );
}
