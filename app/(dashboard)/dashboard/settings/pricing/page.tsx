"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  getTenantPricing,
  updateTenantPricing,
  PricingMatrix,
} from "@/lib/supabase/pricing";

interface PricingRates {
  roofing: number;
  kitchen: number;
  bathroom: number;
  hvac: number;
}

interface PricingMockData {
  pricing_multiplier: number;
  roofing_base_rate: number;
  kitchen_base_rate: number;
  bathroom_base_rate: number;
  hvac_base_rate: number;
}

interface BaseRateInputProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

// Mocking the Supabase functions for the UI build.
// You'll wire these to your actual lib/supabase/pricing.ts file.
const MOCK_DB: PricingMockData = {
  pricing_multiplier: 1.15,
  roofing_base_rate: 18000,
  kitchen_base_rate: 45000,
  bathroom_base_rate: 16000,
  hvac_base_rate: 12000,
};

export default function PricingControls() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Core Pricing State
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [rates, setRates] = useState<PricingRates>({
    roofing: 0,
    kitchen: 0,
    bathroom: 0,
    hvac: 0,
  });

  // For testing the dashboard, we use a dummy tenant ID.
  const ACTIVE_TENANT_ID = "demo_contractor_001";

  // Load live data from Supabase on mount
  useEffect(() => {
    async function loadPricing() {
      const data = await getTenantPricing(ACTIVE_TENANT_ID);

      if (data) {
        setMultiplier(data.pricing_multiplier);
        setRates({
          roofing: data.roofing_base_rate,
          kitchen: data.kitchen_base_rate,
          bathroom: data.bathroom_base_rate,
          hvac: data.hvac_base_rate,
        });
      }
      setIsLoading(false);
    }
    loadPricing();
  }, []);

  // Save live data back to Supabase
  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setSaveSuccess(false);

    const updatedMatrix: PricingMatrix = {
      pricing_multiplier: multiplier,
      roofing_base_rate: rates.roofing,
      kitchen_base_rate: rates.kitchen,
      bathroom_base_rate: rates.bathroom,
      hvac_base_rate: rates.hvac,
    };

    const result = await updateTenantPricing(ACTIVE_TENANT_ID, updatedMatrix);

    setIsSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert("Failed to save pricing matrix. Check console for details.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Loading Pricing Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Pricing Controls
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your base rates and algorithmic multipliers to protect your
            margins.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 disabled:opacity-70"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-sm font-bold">
            Pricing matrix updated successfully. All live widgets reflect these
            numbers immediately.
          </p>
        </div>
      )}

      {/* SECTION 1: GLOBAL MULTIPLIER */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Global Market Multiplier
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Adjust your overall pricing based on market demand, seasonal
              shifts, or scheduling capacity. A multiplier of 1.0 represents
              your standard base rate. 1.15 adds a 15% surge.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Active Multiplier Factor
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.05"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-20 bg-white border border-slate-200 rounded-lg py-2 text-center font-black text-indigo-600 shadow-sm">
                {multiplier.toFixed(2)}x
              </div>
            </div>
          </div>

          {/* Live Impact Preview */}
          <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex gap-4 items-center">
            <Calculator className="w-8 h-8 text-indigo-300" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Impact Preview
              </p>
              <p className="text-sm text-slate-700 mt-1">
                A standard <strong>$10,000</strong> estimate will be presented
                to homeowners as{" "}
                <strong className="text-indigo-600">
                  ${(10000 * multiplier).toLocaleString()}
                </strong>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRADE SPECIFIC BASE RATES */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Trade Base Rates</h2>
          <p className="text-sm text-slate-500 mt-1">
            Set the minimum starting cost for an average, standard-grade project
            in your local market.
          </p>
        </div>

        <div className="p-6 grid sm:grid-cols-2 gap-6">
          {/* Roof Input */}
          <BaseRateInput
            icon={<Home className="w-5 h-5" />}
            title="Roof Replacement"
            description="Baseline for a standard 20-square architectural shingle tear-off."
            value={rates.roofing}
            onChange={(val) => setRates({ ...rates, roofing: val })}
          />

          {/* Kitchen Input */}
          <BaseRateInput
            icon={<ChefHat className="w-5 h-5" />}
            title="Kitchen Remodel"
            description="Baseline for a standard 150 sqft kitchen (cabinets, counters, basic layout)."
            value={rates.kitchen}
            onChange={(val) => setRates({ ...rates, kitchen: val })}
          />

          {/* Bath Input */}
          <BaseRateInput
            icon={<Bath className="w-5 h-5" />}
            title="Bathroom Remodel"
            description="Baseline for a standard 40 sqft full hall bathroom refresh."
            value={rates.bathroom}
            onChange={(val) => setRates({ ...rates, bathroom: val })}
          />

          {/* HVAC Input */}
          <BaseRateInput
            icon={<Wind className="w-5 h-5" />}
            title="HVAC System Upgrade"
            description="Baseline for a standard 3-ton 16 SEER system replacement."
            value={rates.hvac}
            onChange={(val) => setRates({ ...rates, hvac: val })}
          />
        </div>

        <div className="p-4 bg-blue-50/50 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-2 rounded-b-2xl">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p>
            The AI Estimation Engine uses these base rates as a starting point.
            It dynamically scales costs up based on the homeowner's square
            footage, complexity inputs, and your global multiplier.
          </p>
        </div>
      </section>
    </div>
  );
}

// Helper Component for the Input Cards
function BaseRateInput({
  icon,
  title,
  description,
  value,
  onChange,
}: BaseRateInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-800 font-bold">
        <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
          {icon}
        </div>
        {title}
      </div>
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed min-h-[34px]">
        {description}
      </p>
      <div className="relative">
        <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="number"
          min="0"
          step="500"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 font-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>
    </div>
  );
}
