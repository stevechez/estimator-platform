"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  getTenantPricing,
  updateTenantPricing,
  PricingMatrix,
} from "@/lib/supabase/pricing";
import {
  Sliders,
  Percent,
  Home,
  Utensils,
  CarFront,
  Zap,
  Droplet,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function PricingSettingsPage() {
  const [pricing, setPricing] = useState<PricingMatrix | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    async function fetchConfig() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const data = await getTenantPricing(user.id);
        if (data) setPricing(data);
      } else {
        window.location.href = "/auth";
      }
      setIsLoading(false);
    }
    fetchConfig();
  }, [supabase]);

  const handleInputChange = (
    field: keyof PricingMatrix,
    value: number | string,
  ) => {
    if (!pricing) return;
    setPricing({
      ...pricing,
      [field]: typeof value === "string" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricing) return;
    setIsSaving(true);
    setSaveSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const response = await updateTenantPricing(user.id, {
        pricing_multiplier: pricing.pricing_multiplier,
        roofing_base_rate: pricing.roofing_base_rate,
        kitchen_base_rate: pricing.kitchen_base_rate,
        garage_base_rate: pricing.garage_base_rate,
        electrical_base_rate: pricing.electrical_base_rate,
        plumbing_base_rate: pricing.plumbing_base_rate,
      });

      if (response.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Failed to commit operational updates.");
      }
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">
          Synchronizing Config Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900/80 pb-6">
        <div>
          <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
            Operational Settings
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Algorithmic Pricing Controls
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/10 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Commit Matrix Updates"}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-xs font-bold p-4 rounded-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          Global structural pricing variables successfully synchronized. All
          live client widgets updated.
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* COLUMN 1 & 2: BASE RATES CONFIG */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-6 backdrop-blur-sm">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 text-slate-400">
              <Sliders className="w-4 h-4 text-blue-400" /> Regional Baseline
              Calculations
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Adjust the baseline raw-cost integers for standard trade scopes.
              These variables are passed directly into consumer-facing
              components before regional sizing multipliers are applied.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <RateInput
                label="Roofing Base Rate"
                icon={Home}
                value={pricing?.roofing_base_rate}
                onChange={(v) => handleInputChange("roofing_base_rate", v)}
              />
              <RateInput
                label="Kitchen Base Rate"
                icon={Utensils}
                value={pricing?.kitchen_base_rate}
                onChange={(v) => handleInputChange("kitchen_base_rate", v)}
              />
              <RateInput
                label="Garage Base Rate"
                icon={CarFront}
                value={pricing?.garage_base_rate}
                onChange={(v) => handleInputChange("garage_base_rate", v)}
              />
              <RateInput
                label="Electrical Base Rate"
                icon={Zap}
                value={pricing?.electrical_base_rate}
                onChange={(v) => handleInputChange("electrical_base_rate", v)}
              />
              <RateInput
                label="Plumbing Base Rate"
                icon={Droplet}
                value={pricing?.plumbing_base_rate}
                onChange={(v) => handleInputChange("plumbing_base_rate", v)}
              />
            </div>
          </div>
        </div>

        {/* COLUMN 3: GLOBAL MULTIPLIER (THE ACCELERATOR) */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-6 backdrop-blur-sm h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 text-slate-400">
                <Percent className="w-4 h-4 text-blue-400" /> Global Margin
                Multiplier
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scale your entire multi-widget portfolio up or down instantly.
                Use this to absorb macroeconomic material fluctuations or adjust
                for high-demand seasonal trends.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-1 mt-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                  Current Scaling Factor
                </span>
                <span className="text-3xl font-black text-blue-400 tracking-tight block">
                  {pricing?.pricing_multiplier.toFixed(2)}x
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={pricing?.pricing_multiplier || 1.0}
                onChange={(e) =>
                  handleInputChange("pricing_multiplier", e.target.value)
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600">
                <span>0.50x (Deflationary)</span>
                <span>1.00x (Baseline)</span>
                <span>2.00x (Premium Surge)</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

interface RateInputProps {
  label: string;
  icon: React.ComponentType<any>;
  value: number | undefined;
  onChange: (val: string) => void;
}

function RateInput({ label, icon: Icon, value, onChange }: RateInputProps) {
  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
      <label className="text-[10px] uppercase tracking-wider font-black text-slate-500 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-600" /> {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">
          $
        </span>
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}
