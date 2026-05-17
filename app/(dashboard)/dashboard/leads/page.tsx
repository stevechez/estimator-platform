"use client";

import { useState, useEffect, Fragment } from "react";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Cpu,
  Utensils,
  Home,
  Zap,
  Thermometer,
  Wrench,
  Droplet,
  CarFront,
  Loader2,
} from "lucide-react";

// 1. IMPORT YOUR LIVE FETCH ACTION
import { getTenantLeads } from "@/lib/supabase/leads";
import { createBrowserClient } from "@supabase/ssr";

// 2. DYNAMIC TRADE BADGE MAPPER
const getTradeConfig = (trade: string) => {
  const t = trade?.toLowerCase() || "";
  if (t.includes("kitchen"))
    return {
      icon: Utensils,
      color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/50",
    };
  if (t.includes("roof"))
    return {
      icon: Home,
      color: "text-blue-400 bg-blue-950/40 border-blue-900/50",
    };
  if (t.includes("hvac"))
    return {
      icon: Thermometer,
      color: "text-sky-400 bg-sky-950/40 border-sky-900/50",
    };
  if (t.includes("electrical"))
    return {
      icon: Zap,
      color: "text-amber-400 bg-amber-950/40 border-amber-900/50",
    };
  if (t.includes("plumbing"))
    return {
      icon: Droplet,
      color: "text-cyan-400 bg-cyan-950/40 border-cyan-900/50",
    };
  if (t.includes("garage"))
    return {
      icon: CarFront,
      color: "text-slate-400 bg-slate-950/40 border-slate-900/50",
    };
  return {
    icon: Wrench,
    color: "text-gray-400 bg-gray-950/40 border-gray-900/50",
  };
};

export default function LeadsDashboardPage() {
  // 3. SWAPPED TO DYNAMIC STATE
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("All Trades");
  const [activeLeadDetails, setActiveLeadDetails] = useState<string | null>(
    null,
  );

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // const ACTIVE_TENANT_ID = "demo_contractor_001";
  const ACTIVE_TENANT_ID = "REPLACE_WITH_DYNAMIC_TENANT_ID";

  // 4. THE LIVE FETCH ENGINE
  // 4. THE LIVE FETCH & REAL-TIME ENGINE
  useEffect(() => {
    let subscription: any;

    async function loadLeadsForLiveUser() {
      // Extract the live authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 1. Fetch the initial historical leads
        const response = await getTenantLeads(user.id);

        if (response.success && response.leads) {
          const mappedLeads = response.leads.map((rawLead: any) => {
            const config = getTradeConfig(rawLead.trade_classification);
            const shortId = `LD-${rawLead.id.split("-")[0].substring(0, 4).toUpperCase()}`;

            return {
              id: rawLead.id,
              displayId: shortId,
              name: rawLead.consumer_name || "Unknown Target",
              email: rawLead.consumer_email || "No Email Provided",
              phone: rawLead.consumer_phone || "",
              address: rawLead.property_address || "Location Pending",
              trade: rawLead.trade_classification || "Unclassified Scope",
              icon: config.icon,
              color: config.color,
              tier: rawLead.selected_tier || "Research Phase",
              estimate: rawLead.estimated_value || 0,
              date: new Date(rawLead.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              aiSpecs: rawLead.ai_specs || {
                Status: "No parameters extracted",
              },
            };
          });

          setLeads(mappedLeads);
        }

        // 2. Subscribe to REAL-TIME database inserts for this specific contractor
        subscription = supabase
          .channel("realtime-tenant-leads")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "leads",
              filter: `tenant_id=eq.${user.id}`, // Only listen for THIS contractor's leads
            },
            (payload) => {
              // When a new lead hits the DB, map it instantly
              const rawLead = payload.new;
              const config = getTradeConfig(rawLead.trade_classification);
              const shortId = `LD-${rawLead.id.split("-")[0].substring(0, 4).toUpperCase()}`;

              const newLead = {
                id: rawLead.id,
                displayId: shortId,
                name: rawLead.consumer_name || "Unknown Target",
                email: rawLead.consumer_email || "No Email Provided",
                phone: rawLead.consumer_phone || "",
                address: rawLead.property_address || "Location Pending",
                trade: rawLead.trade_classification || "Unclassified Scope",
                icon: config.icon,
                color: config.color,
                tier: rawLead.selected_tier || "Research Phase",
                estimate: rawLead.estimated_value || 0,
                date: new Date(rawLead.created_at).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                ),
                aiSpecs: rawLead.ai_specs || {
                  Status: "No parameters extracted",
                },
              };

              // Inject it at the very top of the current state array without refreshing
              setLeads((currentLeads) => [newLead, ...currentLeads]);
            },
          )
          .subscribe();
      } else {
        window.location.href = "/auth";
      }
      setIsLoading(false);
    }

    loadLeadsForLiveUser();

    // Cleanup the subscription when the user leaves the page
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [supabase]);
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.address.toLowerCase().includes(search.toLowerCase()) ||
      lead.displayId.toLowerCase().includes(search.toLowerCase());
    const matchesTrade =
      selectedTrade === "All Trades" || lead.trade === selectedTrade;
    return matchesSearch && matchesTrade;
  });

  const uniqueTrades = [
    "All Trades",
    ...Array.from(new Set(leads.map((l) => l.trade))),
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">
          Synchronizing Database...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* HEADER SUMMARY */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900/80 pb-6">
        <div>
          <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
            Platform Database Cache
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Qualified Lead Registry
          </h1>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-2xl flex items-center gap-4 backdrop-blur-sm shadow-xl">
          <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-900/40 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              Pipeline Volume
            </p>
            <p className="text-xl font-black text-white">
              $
              {leads
                .reduce((acc, curr) => acc + curr.estimate, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL CONTROLLER ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by lead ID, name, property address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 font-medium focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            {uniqueTrades.map((trade) => (
              <option key={trade} value={trade}>
                {trade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* REVENUE PIPELINE GRID/TABLE */}
      <div className="bg-slate-900/20 border border-slate-900/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-950/80">
                <th className="py-4 px-6">ID & Consumer Target</th>
                <th className="py-4 px-6">Trade Classification</th>
                <th className="py-4 px-6">Selected Scope Pricing</th>
                <th className="py-4 px-6">Captured Context Timestamp</th>
                <th className="py-4 px-6 text-right">Parameter Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-sm font-medium text-slate-300">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center font-bold text-slate-600 uppercase tracking-widest text-xs"
                  >
                    No matching records resolved in database caches.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const TradeIcon = lead.icon;
                  const isExpanded = activeLeadDetails === lead.id;

                  return (
                    <Fragment key={lead.id}>
                      <tr
                        className={`hover:bg-slate-900/40 transition-colors ${isExpanded ? "bg-slate-900/30" : ""}`}
                      >
                        <td className="py-5 px-6 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-500">
                              {lead.displayId}
                            </span>
                            <span className="font-black text-white text-base">
                              {lead.name}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium space-x-2">
                            <span>{lead.email}</span>
                            {lead.phone && (
                              <>
                                <span className="text-slate-700">•</span>
                                <span>{lead.phone}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-[320px]">
                            {lead.address}
                          </p>
                        </td>

                        <td className="py-5 px-6">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase ${lead.color}`}
                          >
                            <TradeIcon className="w-3.5 h-3.5" />
                            {lead.trade.split("-")[0].trim()}
                          </div>
                        </td>

                        <td className="py-5 px-6 space-y-0.5">
                          <span className="text-base font-black text-white">
                            ${lead.estimate.toLocaleString()}
                          </span>
                          <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                            {lead.tier}
                          </p>
                        </td>

                        <td className="py-5 px-6 text-xs text-slate-400 font-semibold">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-600" />
                            {lead.date}
                          </div>
                        </td>

                        <td className="py-5 px-6 text-right">
                          <button
                            onClick={() =>
                              setActiveLeadDetails(isExpanded ? null : lead.id)
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                              isExpanded
                                ? "bg-blue-600 border-blue-500 text-white"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                            }`}
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            {isExpanded ? "Close Inspect" : "Inspect Payload"}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-950/60 border-l-2 border-l-blue-500">
                          <td colSpan={5} className="p-6 shadow-inner">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest">
                                <Cpu className="w-3.5 h-3.5" />
                                Computed Algorithmic Specifications
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(lead.aiSpecs).map(
                                  ([key, val]) => (
                                    <div
                                      key={key}
                                      className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl space-y-1"
                                    >
                                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block truncate">
                                        {key}
                                      </span>
                                      <span className="text-sm font-bold text-white block">
                                        {String(val)}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
