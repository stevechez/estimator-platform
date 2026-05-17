"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Save,
  TrendingUp,
  Home,
  Bath,
  Wind,
  ChefHat,
  DollarSign,
  Calculator,
  Info,
  CheckCircle2,
  Loader2,
  CarFront,
  Zap,
  Droplet,
} from "lucide-react";
import {
  getTenantPricing,
  updateTenantPricing,
  PricingMatrix,
} from "@/lib/supabase/pricing";

interface BaseRateInputProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

export default function PricingControls() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Unified State with fallback variables matching your database schema schema
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [rates, setRates] = useState({
    roofing: 0,
    kitchen: 0,
    bathroom: 0,
    hvac: 0,
    garage: 0,
    electrical: 0,
    plumbing: 0,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // LOAD LIVE SESSION DATA
  useEffect(() => {
    async function loadPricing() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const data = await getTenantPricing(user.id);
        if (data) {
          setMultiplier(data.pricing_multiplier);
          setRates({
            roofing: data.roofing_base_rate || 0,
            kitchen: data.kitchen_base_rate || 0,
            bathroom: data.bathroom_base_rate || 0,
            hvac: data.hvac_base_rate || 0,
            garage: data.garage_base_rate || 0,
            electrical: data.electrical_base_rate || 0,
            plumbing: data.plumbing_base_rate || 0,
          });
        }
      } else {
        window.location.href = "/auth";
      }
      setIsLoading(false);
    }
    loadPricing();
  }, [supabase]);

  // SAVE UPDATED CONFIG MATRIX
  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setSaveSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Pass a partial object to protect internal keys like tenant_id
      const updatedMatrix: Partial<PricingMatrix> = {
        pricing_multiplier: multiplier,
        roofing_base_rate: rates.roofing,
        kitchen_base_rate: rates.kitchen,
        bathroom_base_rate: rates.bathroom,
        hvac_base_rate: rates.hvac,
        garage_base_rate: rates.garage,
        electrical_base_rate: rates.electrical,
        plumbing_base_rate: rates.plumbing,
      };

      const result = await updateTenantPricing(user.id, updatedMatrix);

      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(`Failed to save operational updates: ${result.error}`);
      }
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
          Synchronizing Config Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/80 pb-6">
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
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 disabled:opacity-50"
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
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Global structural pricing variables successfully synchronized. All
          live client widgets updated.
        </div>
      )}

      {/* SECTION 1: GLOBAL MULTIPLIER */}
      <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-slate-900/60 flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-950 border border-blue-900/40 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              Global Market Multiplier
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Scale your entire multi-widget portfolio up or down instantly. Use
              this to absorb macroeconomic material fluctuations or adjust for
              high-demand seasonal trends.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-950/40 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 block">
              Active Multiplier Factor
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
              <div className="w-20 bg-slate-900 border border-slate-800 rounded-xl py-2 text-center font-black text-blue-400 shadow-sm text-sm">
                {multiplier.toFixed(2)}x
              </div>
            </div>
          </div>

          {/* Live Impact Preview */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 shadow-sm flex gap-4 items-center">
            <Calculator className="w-8 h-8 text-slate-700" />
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Live Impact Preview
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                A standard <strong className="text-slate-200">$10,000</strong>{" "}
                estimate will be presented to homeowners as{" "}
                <strong className="text-blue-400 font-bold">
                  ${(10000 * multiplier).toLocaleString()}
                </strong>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRADE SPECIFIC BASE RATES */}
      <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="p-6 border-b border-slate-900/60">
          <h2 className="text-base font-black text-white uppercase tracking-wider">
            Regional Baseline Calculations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Set the minimum starting cost for standard trade scopes before
            parameters or scaling equations are applied.
          </p>
        </div>

        <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <BaseRateInput
            icon={<Home className="w-4 h-4" />}
            title="Roof Replacement"
            description="Standard 20-square architectural shingle baseline template."
            value={rates.roofing}
            onChange={(val) => setRates({ ...rates, roofing: val })}
          />

          <BaseRateInput
            icon={<ChefHat className="w-4 h-4" />}
            title="Kitchen Remodel"
            description="Baseline template for a standard structural kitchen framework."
            value={rates.kitchen}
            onChange={(val) => setRates({ ...rates, kitchen: val })}
          />

          <BaseRateInput
            icon={<Bath className="w-4 h-4" />}
            title="Bathroom Remodel"
            description="Baseline variable for primary plumbing bath conversions."
            value={rates.bathroom}
            onChange={(val) => setRates({ ...rates, bathroom: val })}
          />

          <BaseRateInput
            icon={<Wind className="w-4 h-4" />}
            title="HVAC Upgrade"
            description="Baseline rate configuration for standard condenser sets."
            value={rates.hvac}
            onChange={(val) => setRates({ ...rates, hvac: val })}
          />

          <BaseRateInput
            icon={<CarFront className="w-4 h-4" />}
            title="Garage Expansion"
            description="Baseline valuation array for slab construction projects."
            value={rates.garage}
            onChange={(val) => setRates({ ...rates, garage: val })}
          />

          <BaseRateInput
            icon={<Zap className="w-4 h-4" />}
            title="Electrical Infrastructure"
            description="Baseline index variable for smart service panel refits."
            value={rates.electrical}
            onChange={(val) => setRates({ ...rates, electrical: val })}
          />

          <BaseRateInput
            icon={<Droplet className="w-4 h-4" />}
            title="Plumbing Core"
            description="Baseline matrix index for mainline repiping updates."
            value={rates.plumbing}
            onChange={(val) => setRates({ ...rates, plumbing: val })}
          />
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-900/60 text-[11px] text-slate-500 flex items-start gap-2 rounded-b-2xl">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            The BUILDRAIL algorithmic orchestration layers parse these core
            integers dynamically. Baseline metrics scale upward relative to
            homeowner scope inputs, satellite measurements, and structural
            complexity indexes before outputting downline vectors.
          </p>
        </div>
      </section>
    </div>
  );
}

function BaseRateInput({
  icon,
  title,
  description,
  value,
  onChange,
}: BaseRateInputProps) {
  return (
    <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-2.5">
      <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wide">
        <div className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg">
          {icon}
        </div>
        {title}
      </div>
      <p className="text-[10px] text-slate-500 font-medium leading-relaxed min-h-[30px]">
        {description}
      </p>
      <div className="relative">
        <DollarSign className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="number"
          min="0"
          step="500"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}
