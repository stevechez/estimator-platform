"use client";

import { useState, Fragment } from "react"; // FIXED: Explicitly importing Fragment here
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
} from "lucide-react";

const INITIAL_LEADS = [
  {
    id: "LD-9401",
    name: "Marcus Vance",
    email: "marcus.v@gmail.com",
    phone: "(408) 555-0192",
    address: "10240 N Wolfe Rd, Cupertino, CA",
    trade: "Kitchen Remodel",
    icon: Utensils,
    color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/50",
    tier: "Best Tier (Luxury Premium)",
    estimate: 118500,
    date: "May 15, 2026",
    aiSpecs: {
      "Cabinet Vol": "Extensive",
      "Appliance Grade": "Sub-Zero Match",
      "Layout Alteration": "True",
      "Island Footprint": "Expanded",
    },
  },
  {
    id: "LD-9402",
    name: "Sarah Jenkins",
    email: "s.jenkins@outlook.com",
    phone: "(650) 555-0143",
    address: "21020 Homestead Rd, Cupertino, CA",
    trade: "HVAC Upgrade",
    icon: Thermometer,
    color: "text-sky-400 bg-sky-950/40 border-sky-900/50",
    tier: "Better Tier (High Efficiency)",
    estimate: 16400,
    date: "May 14, 2026",
    aiSpecs: {
      "Target Sizing": "4 Tons",
      "Calculated SEER": "18 SEER",
      "Ductwork Remediation": "Required",
      "Est. 10-Yr Savings": "$4,200",
    },
  },
  {
    id: "LD-9403",
    name: "David Chen",
    email: "dchen.builds@techcorp.com",
    phone: "(408) 555-0115",
    address: "10600 Torre Ave, Cupertino, CA",
    trade: "Roof Replacement",
    icon: Home,
    color: "text-blue-400 bg-blue-950/40 border-blue-900/50",
    tier: "Good Tier (Architectural Shingle)",
    estimate: 24800,
    date: "May 12, 2026",
    aiSpecs: {
      "Sq Footage": "2,450 sqft",
      "Calculated Pitch": "6:12",
      "Topology Obstacles": "2 Skylights",
      "Decking Condition": "Stable",
    },
  },
  {
    id: "LD-9404",
    name: "Elena Rostova",
    email: "elena.ros@yahoo.com",
    phone: "(408) 555-0178",
    address: "11900 Stevens Creek Blvd, Cupertino, CA",
    trade: "Electrical & EV Charger",
    icon: Zap,
    color: "text-amber-400 bg-amber-950/40 border-amber-900/50",
    tier: "Better Tier (Dual Load)",
    estimate: 4200,
    date: "May 11, 2026",
    aiSpecs: {
      "Charger Standard": "Level 2 Dual",
      "Panel Headroom": "Insufficient",
      "Required Upgrade": "200A Service MPU",
      "Conduit Run Length": "45ft",
    },
  },
  {
    id: "LD-9405",
    name: "Robert Miller",
    email: "bob.miller@construction-services.net",
    phone: "(510) 555-0122",
    address: "19950 Stevens Creek Blvd, Cupertino, CA",
    trade: "Plumbing Diagnostics",
    icon: Wrench,
    color: "text-cyan-400 bg-cyan-950/40 border-cyan-900/50",
    tier: "Good Tier (Standard Clearing)",
    estimate: 1250,
    date: "May 10, 2026",
    aiSpecs: {
      "Incident Type": "Mainline Clog",
      "Severity Index": "Emergency High",
      "Root Intrusion Tracer": "Highly Likely",
      "Cleanout Access": "Exterior",
    },
  },
];

export default function LeadsDashboardPage() {
  const [leads] = useState(INITIAL_LEADS);
  const [search, setSearch] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("All Trades");
  const [activeLeadDetails, setActiveLeadDetails] = useState<string | null>(
    null,
  );

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.address.toLowerCase().includes(search.toLowerCase()) ||
      lead.id.toLowerCase().includes(search.toLowerCase());
    const matchesTrade =
      selectedTrade === "All Trades" || lead.trade === selectedTrade;
    return matchesSearch && matchesTrade;
  });

  const uniqueTrades = [
    "All Trades",
    ...Array.from(new Set(leads.map((l) => l.trade))),
  ];

  return (
    // UPGRADED: Forced background to deep slate-950 to fit the modern dark aesthetic layout
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8 max-w-7xl mx-auto pt-24">
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
                    // FIXED: Replaced standard generic fragment with formal keyed React Fragment block
                    <Fragment key={lead.id}>
                      <tr
                        className={`hover:bg-slate-900/40 transition-colors ${isExpanded ? "bg-slate-900/30" : ""}`}
                      >
                        <td className="py-5 px-6 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-500">
                              {lead.id}
                            </span>
                            <span className="font-black text-white text-base">
                              {lead.name}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium space-x-2">
                            <span>{lead.email}</span>
                            <span className="text-slate-700">•</span>
                            <span>{lead.phone}</span>
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
                            {lead.trade}
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
                                Computer Vision AI Extracted Structural Scope
                                Matrix
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(lead.aiSpecs).map(
                                  ([key, val]) => (
                                    <div
                                      key={key}
                                      className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl space-y-1"
                                    >
                                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">
                                        {key}
                                      </span>
                                      <span className="text-sm font-bold text-white block">
                                        {val}
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
