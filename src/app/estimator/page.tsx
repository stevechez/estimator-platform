"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CarFront,
  Bath,
  Utensils,
  ArrowRight,
  Sparkles,
  Zap,
  Thermometer,
  Wrench,
  Hammer,
} from "lucide-react";

const estimators = [
  {
    title: "Roof Replacement",
    description: "3D satellite geometry and local material pricing.",
    href: "/estimator/roof",
    icon: Home,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "group-hover:border-blue-500",
  },
  {
    title: "Kitchen Remodel",
    description: "Vision AI scans cabinets, layouts, and appliances.",
    href: "/estimator/kitchen",
    icon: Utensils,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "group-hover:border-emerald-500",
  },
  {
    title: "Bathroom Remodel",
    description: "Multi-photo analysis for wet-area and vanity scoping.",
    href: "/estimator/bathroom",
    icon: Bath,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "group-hover:border-cyan-500",
  },
  {
    title: "Garage Doors",
    description: "Instant door counting and style recognition.",
    href: "/estimator/garage",
    icon: CarFront,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "group-hover:border-indigo-500",
  },
  {
    title: "Electrical & EV Charger",
    description:
      "Calculate home load headroom and size main panel infrastructure upgrades.",
    href: "/estimator/electrical",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "group-hover:border-amber-500",
  },
  {
    title: "HVAC Upgrade",
    description:
      "Calculate equipment tonnage sizing and projected SEER utility energy savings.",
    href: "/estimator/hvac",
    icon: Thermometer,
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "group-hover:border-sky-500",
  },
  {
    title: "Plumbing Diagnostics",
    description:
      "Instant cost estimates for mainline repairs, water heaters, and drain clearing.",
    href: "/estimator/plumbing",
    icon: Wrench,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "group-hover:border-blue-500",
  },
  {
    title: "General Contractor Sheet",
    description:
      "Generate transparent project line-item cost breakdowns, overhead, and margins.",
    href: "/estimator/general-contractor",
    icon: Hammer,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "group-hover:border-amber-500",
  },
];

export default function EstimatorHub() {
  const pathname = usePathname();

  // DYNAMIC ACTION: If the user is on the /demo route, lock pricing across cards
  const isDemoMode = pathname.startsWith("/demo");

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hub Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3 h-3 text-blue-500" />
            {isDemoMode
              ? "Sandbox Interactive Preview"
              : "BUILDRAIL Engine Workspace"}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {isDemoMode ? "Explore Our AI Estimators" : "Select an Estimator"}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {isDemoMode
              ? "Test drive our live tools. Select a vertical below to see how our instant vision parsing extraction works in real time."
              : "Choose a project type below. Our AI will analyze your property and generate a localized, multi-tier estimate in seconds."}
          </p>
        </div>

        {/* Estimator Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {estimators.map((tool) => {
            const Icon = tool.icon;

            // DYNAMIC ACTION: Append search params to force demo configuration parameters down
            const destinationHref = isDemoMode
              ? `${tool.href}?demo=true`
              : tool.href;

            return (
              <Link
                key={tool.title}
                href={destinationHref}
                className="group outline-none"
              >
                <div
                  className={`p-8 bg-white border-2 border-slate-200 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl ${tool.border} flex flex-col h-full`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.bg} ${tool.color}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-colors">
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {tool.title}
                  </h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
