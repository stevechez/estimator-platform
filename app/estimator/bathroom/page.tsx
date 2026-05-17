"use client";

import React, { useState, useEffect } from "react";
import {
  Bath,
  Layers,
  Sparkles,
  Calculator,
  DownloadCloud,
  CheckCircle,
  Wrench,
  Construction,
} from "lucide-react";
import LeadCaptureSqueeze from "@/components/LeadCaptureSqueeze";
import { PDFDownloadLink } from "@react-pdf/renderer";
import EstimateDocument from "@/components/pdf/EstimateDocument";

interface BathroomSpecs {
  bathroomSize: "Powder" | "Full" | "Primary Master";
  vanityConfig: "Single" | "Double";
  wetAreaType:
    | "Standard Tub/Shower"
    | "Walk-in Shower"
    | "Luxury Freestanding & Shower";
  layoutChange: boolean;
}

interface EstimatorProps {
  tenantId?: string;
  multiplier?: number;
}

export default function BathroomEstimator({
  tenantId = "REPLACE_WITH_DYNAMIC_TENANT_ID",
  multiplier = 1.0,
}: EstimatorProps) {
  // Input Selection States
  const [size, setSize] = useState<BathroomSpecs["bathroomSize"]>("Full");
  const [vanity, setVanity] = useState<BathroomSpecs["vanityConfig"]>("Single");
  const [wetArea, setWetArea] = useState<BathroomSpecs["wetAreaType"]>(
    "Standard Tub/Shower",
  );
  const [layoutChange, setLayoutChange] = useState<boolean>(false);

  // Pipeline Flow States
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<BathroomSpecs | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Bathroom Scope Estimation Formulas
  const calculateBathroomPriceTiers = (specs: BathroomSpecs) => {
    const baseRates = {
      Powder: { good: 8500, better: 14000, best: 22000 },
      Full: { good: 16000, better: 26000, best: 42000 },
      "Primary Master": { good: 28000, better: 48000, best: 85000 },
    };

    const calculateForTier = (tier: "good" | "better" | "best") => {
      let total = baseRates[specs.bathroomSize][tier];

      // Vanity configuration markup modifications
      if (specs.vanityConfig === "Double" && specs.bathroomSize !== "Powder") {
        total += tier === "good" ? 1200 : tier === "better" ? 2500 : 4500;
      }

      // Premium Wet Area structural changes
      if (specs.wetAreaType === "Walk-in Shower") {
        total += tier === "good" ? 2000 : 4500;
      } else if (specs.wetAreaType === "Luxury Freestanding & Shower") {
        total += tier === "good" ? 5000 : tier === "better" ? 9000 : 16000;
      }

      // Plumbing line relocation penalties
      if (specs.layoutChange) {
        total += tier === "good" ? 4500 : tier === "better" ? 8500 : 15000;
      }

      return total * multiplier;
    };

    return {
      good: calculateForTier("good"),
      better: calculateForTier("better"),
      best: calculateForTier("best"),
    };
  };

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate localized geometry mapping matrices
    setTimeout(() => {
      setSpecs({
        bathroomSize: size,
        vanityConfig: vanity,
        wetAreaType: wetArea,
        layoutChange: layoutChange,
      });
      setLoading(false);
      setShowLeadForm(true);
    }, 2200);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">
          AI Bathroom Estimator
        </h1>
        <p className="text-slate-600">
          Scope premium fixture sets, plumbing configurations, and finish tiers.
        </p>
      </div>

      {/* STAGE 1: Configuration Input Matrix Dashboard Panel */}
      {!specs && !loading && (
        <form
          onSubmit={handleRunAnalysis}
          className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
        >
          {/* Bathroom Scale Selection Layout Row */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Bathroom Scale & Footprint
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["Powder", "Full", "Primary Master"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSize(t)}
                  className={`p-3 text-xs font-bold uppercase rounded-xl border transition-all ${
                    size === t
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Vanity Configuration Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Vanity Station Layout
              </label>
              <select
                value={vanity}
                onChange={(e) => setVanity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Single">Single Basin Setup</option>
                <option value="Double">Double Basin / Dual Station</option>
              </select>
            </div>

            {/* Wet Area Configuration Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Wet Area Fixtures
              </label>
              <select
                value={wetArea}
                onChange={(e) => setWetArea(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Standard Tub/Shower">
                  Standard Tub / Shower Combo
                </option>
                <option value="Walk-in Shower">
                  Custom Curbless Walk-In Shower
                </option>
                <option value="Luxury Freestanding & Shower">
                  Freestanding Tub + Walk-In Shower
                </option>
              </select>
            </div>
          </div>

          {/* Toggle Block: Relocation Checkbox */}
          <div className="pt-2">
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                layoutChange
                  ? "bg-amber-50/60 border-amber-300 text-amber-900"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <input
                type="checkbox"
                checked={layoutChange}
                onChange={(e) => setLayoutChange(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-bold block">
                  Relocating Core Plumbing Rough-ins
                </span>
                <span className="text-xs opacity-80 block">
                  Check this box if moving the toilet position, altering main
                  sewer stacks, or converting tub boundaries.
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Wrench className="w-5 h-5" />
            Evaluate Structural Scope
          </button>
        </form>
      )}

      {/* STAGE 1.5: Analyzing State Viewport Loader */}
      {loading && (
        <div className="relative rounded-2xl overflow-hidden h-64 border border-slate-200 bg-slate-950 flex flex-col items-center justify-center space-y-4 shadow-inner">
          <Construction className="w-16 h-16 text-blue-400 animate-spin" />
          <div className="text-center space-y-1 relative z-10">
            <p className="font-bold text-white tracking-wide">
              Compiling Layout Matrix...
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Calculating footprint factors for {size} layout
            </p>
          </div>
        </div>
      )}

      {/* STAGE 2: Gated Lead Capture Squeeze Wall Screen */}
      {specs && showLeadForm && (
        <LeadCaptureSqueeze
          projectType="Bathroom Remodel"
          tenantId={tenantId}
          aiSpecs={specs}
          estimatedValue={calculateBathroomPriceTiers(specs).better}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}

      {/* STAGE 3: Unlocked Financial Estimation Tiers Summary Grid */}
      {specs && !showLeadForm && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Detailed Structural Badge Overview Header */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Configured Blueprint Parameters
                </h2>
                <p className="text-base font-black text-slate-900">
                  {specs.bathroomSize} Suite Transformation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-semibold text-slate-600">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span>Station: {specs.vanityConfig} Basin</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2 col-span-1 md:col-span-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span className="truncate">Wet Area: {specs.wetAreaType}</span>
              </div>
            </div>

            {specs.layoutChange && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Structural layout changes and wet footprint engineering updates
                included.
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Projected Renovation Investment
            </h3>
            <div className="grid gap-3">
              <PriceTier
                title="Traditional Finish (Good)"
                desc="Prefabricated vanities, standard tile surrounds, and bright replacement fixtures."
                price={formatPrice(calculateBathroomPriceTiers(specs).good)}
              />
              <PriceTier
                title="Signature Custom (Better)"
                desc="Semi-custom cabinetry, curbless walk-in tile shower basins, and premium matte trim arrays."
                price={formatPrice(calculateBathroomPriceTiers(specs).better)}
                featured
              />
              <PriceTier
                title="Elite Wellness Haven (Best)"
                desc="Full layout customization, freestanding soaking tubs, customized stone slabs, and integrated bidet installations."
                price={formatPrice(calculateBathroomPriceTiers(specs).best)}
              />
            </div>
          </div>

          {/* REAL TIME CONVERSION DOWNLOAD ACTION CONTROLLER */}
          {isClient && (
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <PDFDownloadLink
                document={
                  <EstimateDocument
                    consumerName="Homeowner"
                    projectType="Bathroom Remodel"
                    date={new Date().toLocaleDateString()}
                    aiSpecs={{
                      "Footprint Scale": specs.bathroomSize,
                      "Vanity Architecture": `${specs.vanityConfig} Station`,
                      "Wet Area Deliverables": specs.wetAreaType,
                      "Sub-Surface Relocation": specs.layoutChange
                        ? "Plumbing Modifications Required"
                        : "Standard Footprint Maintained",
                    }}
                    estimatedValue={calculateBathroomPriceTiers(specs).better}
                  />
                }
                fileName={`Bathroom-Estimate.pdf`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md"
              >
                {({ loading }) =>
                  loading ? (
                    "Compiling PDF..."
                  ) : (
                    <>
                      <DownloadCloud className="w-4 h-4" />
                      Download Official PDF Quote
                    </>
                  )
                }
              </PDFDownloadLink>
            </div>
          )}

          <button
            onClick={() => setSpecs(null)}
            className="w-full py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors mt-4"
          >
            Reconfigure structural layout factors
          </button>
        </div>
      )}
    </div>
  );
}

function PriceTier({ title, price, desc, featured = false }: any) {
  return (
    <div
      className={`p-4 bg-white border rounded-xl flex justify-between items-center transition-all hover:shadow-md ${featured ? "border-blue-500 ring-2 ring-blue-500/10" : "border-slate-200"}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          {featured && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
              MOST COMMON
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-[360px] leading-relaxed">
          {desc}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-2xl font-black text-slate-900">{price}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
          Turnkey Execution
        </p>
      </div>
    </div>
  );
}
