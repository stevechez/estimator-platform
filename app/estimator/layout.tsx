// app/dashboard/layout.tsx
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Users,
  Code2,
  Sliders,
  LogOut,
} from "lucide-react";

export const metadata = {
  title: "Workspace | BUILDRAIL Dashboard",
  description: "Manage pre-scoped contractor leads and deployment metrics.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex antialiased selection:bg-blue-500 selection:text-white">
      {/* PERSISTENT SIDEBAR ARCHITECTURE */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0 hidden md:flex">
        <div className="flex flex-col">
          {/* System Brand Frame */}
          <div className="h-16 flex items-center px-6 border-b border-slate-900/60">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/20">
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-black tracking-[0.25em] text-white uppercase">
                BUILDRAIL
              </span>
            </Link>
          </div>

          {/* Navigation Array */}
          <nav className="p-4 space-y-1.5 pt-6 text-sm font-semibold tracking-wide text-slate-400">
            {[
              { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
              {
                label: "Qualified Leads",
                href: "/dashboard/leads",
                icon: Users,
              },
              {
                label: "Embed Snippet",
                href: "/dashboard/settings/embed",
                icon: Code2,
              },
              {
                label: "Price Controls",
                href: "/dashboard/settings/pricing",
                icon: Sliders,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}>
                  <span className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all cursor-pointer group">
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Identity Exit Frame */}
        <div className="p-4 border-t border-slate-900/60 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="flex flex-col">
            <span className="text-slate-300 font-bold truncate max-w-[140px]">
              Test Contractor
            </span>
            <span className="text-[10px] text-blue-400 font-semibold tracking-widest mt-0.5">
              Pro Tier
            </span>
          </div>
          <Link href="/">
            <span
              className="p-2 hover:bg-slate-900 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </aside>

      {/* WORKSPACE CONTENT CANVAS */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile Navbar Fallback */}
        <header className="h-14 md:hidden border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 px-6 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Building2 className="w-3 text-white" />
            </div>
            <span className="text-[10px] font-black tracking-widest text-white uppercase">
              BUILDRAIL
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/50 border border-blue-900/40 px-2 py-0.5 rounded-md">
            PRO
          </span>
        </header>

        {/* Dynamic Nested Route Delivery Viewport */}
        <div className="flex-1 bg-slate-950 relative overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
