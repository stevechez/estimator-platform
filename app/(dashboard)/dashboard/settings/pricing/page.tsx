// app/(dashboard)/dashboard/settings/pricing/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getTenantPricing, updateTenantPricing } from "@/lib/supabase/pricing";
import {
  Sliders,
  DollarSign,
  ShieldCheck,
  Save,
  RotateCcw,
  Home,
  Utensils,
  Bath,
  Thermometer,
  Zap,
  Wrench,
} from "lucide-react";

// Using your seeded testing UUID token
const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000000";

export default function PriceControlsPage() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [rates, setRates] = useState({
    roofingBase: 8500,
    kitchenBase: 45000,
    bathroomBase: 18500,
    hvacBase: 8200,
    electricalBase: 2500,
    plumbingBase: 1200,
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // READ DATA LOOP: Run server queries on mount parameters
  useEffect(() => {
    async function loadPricingMetrics() {
      setLoading(true);
      const data = await getTenantPricing(MOCK_TENANT_ID);
      if (data) {
        setMultiplier(Number(data.pricing_multiplier) || 1.0);
        setRates({
          roofingBase: Number(data.roofing_base_rate) || 8500,
          kitchenBase: Number(data.kitchen_base_rate) || 45000,
          bathroomBase: Number(data.bathroom_base_rate) || 18500,
          hvacBase: Number(data.hvac_base_rate) || 8200,
          electricalBase: Number(data.electrical_base_rate) || 2500,
          plumbingBase: Number(data.plumbing_base_rate) || 1200,
        });
      }
      setLoading(false);
    }
    loadPricingMetrics();
  }, []);

  const handleRateChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setRates((prev) => ({ ...prev, [field]: numValue }));
  };

  // WRITE DATA LOOP: Sync modified variables down into live Supabase records
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      await updateTenantPricing(MOCK_TENANT_ID, {
        pricing_multiplier: multiplier,
        roofing_base_rate: rates.roofingBase,
        kitchen_base_rate: rates.kitchenBase,
        bathroom_base_rate: rates.bathroomBase,
        hvac_base_rate: rates.hvacBase,
        electrical_base_rate: rates.electricalBase,
        plumbing_base_rate: rates.plumbingBase,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to commit database variables.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-bold tracking-widest text-xs uppercase">
        Querying Secure Workspace Tables...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8 max-w-5xl mx-auto pt-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
            Workspace Configuration
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Price Control Center
          </h1>
        </div>
      </div>

      <form onSubmit={handleSaveChanges} className="space-y-8">
        {/* RANGE SLIDER TRACK */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-950 border border-blue-900/50 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Global Margin Multiplier
              </h2>
              <p className="text-xs text-slate-400 font-medium max-w-xl">
                Scale all calculated baseline estimates down or up instantly
                across active frameworks across external target installations.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center pt-4 border-t border-slate-900/60">
            <div className="md:col-span-2 space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Conservative (0.80x)</span>
                <span>Aggressive (1.50x)</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.50"
                step="0.01"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer appearance-none"
              />
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-inner">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Active Margin
              </span>
              <div className="flex items-center gap-1 font-mono font-black text-2xl text-white">
                <span>{multiplier.toFixed(2)}</span>
                <span className="text-xs text-blue-400 font-sans font-bold uppercase">
                  x
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* INPUT GRID ROW CAP DATA */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-950 border border-amber-900/50 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Trade Baseline Configuration
              </h2>
              <p className="text-xs text-slate-400 font-medium max-w-xl">
                Define standard bottom entry rate targets. Calculations evaluate
                variables relative to these database markers.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-900/60">
            {[
              {
                label: "Roofing Minimum Base",
                field: "roofingBase",
                icon: Home,
                color: "text-blue-400",
              },
              {
                label: "Kitchen Remodel Base",
                field: "kitchenBase",
                icon: Utensils,
                color: "text-emerald-400",
              },
              {
                label: "Bathroom Remodel Base",
                field: "bathroomBase",
                icon: Bath,
                color: "text-cyan-400",
              },
              {
                label: "HVAC Unit Sizing Base",
                field: "hvacBase",
                icon: Thermometer,
                color: "text-sky-400",
              },
              {
                label: "Electrical Service Base",
                field: "electricalBase",
                icon: Zap,
                color: "text-amber-400",
              },
              {
                label: "Plumbing Service Base",
                field: "plumbingBase",
                icon: Wrench,
                color: "text-teal-400",
              },
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <div key={item.field} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <ItemIcon className={`w-3.5 h-3.5 ${item.color}`} />
                    {item.label}
                  </label>
                  <div className="relative rounded-xl shadow-inner">
                    <DollarSign className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={rates[item.field as keyof typeof rates]}
                      onChange={(e) =>
                        handleRateChange(item.field, e.target.value)
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PERSISTENT ACTIONS FOOTER CONTAINER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Changes commit directly to Supabase production architecture live.
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-900/60 px-3 py-1.5 rounded-xl">
                Supabase synced
              </span>
            )}
            {errorMessage && (
              <span className="text-xs font-bold text-red-400 bg-red-950/50 border border-red-900/60 px-3 py-1.5 rounded-xl">
                {errorMessage}
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Syncing..." : "Save Pricing Matrix"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
