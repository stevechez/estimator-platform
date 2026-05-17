"use client";

import React, { useState, useEffect } from "react";
import {
  Wind,
  ThermometerSnowflake,
  Zap,
  Calculator,
  DownloadCloud,
  CheckCircle,
  Settings2,
} from "lucide-react";
import LeadCaptureSqueeze from "@/components/LeadCaptureSqueeze";
import { PDFDownloadLink } from "@react-pdf/renderer";
import EstimateDocument from "@/components/pdf/EstimateDocument";

interface HVACSpecs {
  squareFootage: number;
  floors: number;
  insulation: string;
  calculatedTonnage: number;
  estimatedSavings: number;
}

interface EstimatorProps {
  tenantId?: string;
  multiplier?: number;
}

export default function HVACEstimator({
  tenantId = "REPLACE_WITH_DYNAMIC_TENANT_ID",
  multiplier = 1.0,
}: EstimatorProps) {
  // Input States
  const [sqFt, setSqFt] = useState<number>(2000);
  const [floors, setFloors] = useState<number>(1);
  const [insulation, setInsulation] = useState<string>("Average");

  // Pipeline States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [specs, setSpecs] = useState<HVACSpecs | null>(null);
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

  // HVAC Domain Logic
  const calculateTonnage = (sqFt: number, insulation: string) => {
    // Baseline: 1 ton per 500 sq ft
    let baseTons = sqFt / 500;

    // Insulation adjustments
    if (insulation === "Poor") baseTons *= 1.15;
    if (insulation === "Excellent") baseTons *= 0.85;

    // Round to nearest 0.5 ton (standard HVAC sizing)
    let roundedTons = Math.round(baseTons * 2) / 2;

    // Minimum residential size is usually 1.5 tons, max single unit is 5 tons
    if (roundedTons < 1.5) roundedTons = 1.5;
    if (roundedTons > 5) roundedTons = 5;

    return roundedTons;
  };

  const calculateHVACPriceTiers = (specs: HVACSpecs) => {
    // Base cost per ton for different SEER/Stage ratings
    const rates = {
      standard: 1800, // 14-15 SEER, Single Stage
      highEff: 2600, // 16-18 SEER, Two Stage
      ultra: 3800, // 20+ SEER, Variable Speed
    };

    // Minor ductwork/modification allowance
    const modificationCost = specs.floors > 1 ? 800 : 0;

    const calculateForTier = (baseRatePerTon: number) => {
      const total = specs.calculatedTonnage * baseRatePerTon + modificationCost;
      return total * multiplier;
    };

    return {
      good: calculateForTier(rates.standard),
      better: calculateForTier(rates.highEff),
      best: calculateForTier(rates.ultra),
    };
  };

  const handleRunDiagnostics = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const tonnage = calculateTonnage(sqFt, insulation);
    // Rough 10-year energy savings projection based on upgrading to an 18 SEER unit
    const savings = Math.floor(tonnage * 250 * 1.5);

    setTimeout(() => {
      setSpecs({
        squareFootage: sqFt,
        floors: floors,
        insulation: insulation,
        calculatedTonnage: tonnage,
        estimatedSavings: savings,
      });
      setIsAnalyzing(false);
      setShowLeadForm(true);
    }, 2400);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">
          AI HVAC Estimator
        </h1>
        <p className="text-slate-600">
          Calculate your exact system load and energy savings.
        </p>
      </div>

      {/* STAGE 1: Diagnostic Input Matrix */}
      {!specs && !isAnalyzing && (
        <form
          onSubmit={handleRunDiagnostics}
          className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8"
        >
          {/* Slider Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Square Footage
              </label>
              <span className="text-2xl font-black text-blue-600">
                {sqFt.toLocaleString()} sq ft
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="4000"
              step="100"
              value={sqFt}
              onChange={(e) => setSqFt(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Floor Count Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Stories/Floors
              </label>
              <select
                value={floors}
                onChange={(e) => setFloors(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 Story</option>
                <option value={2}>2 Stories</option>
                <option value={3}>3+ Stories</option>
              </select>
            </div>

            {/* Insulation Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Insulation Quality
              </label>
              <select
                value={insulation}
                onChange={(e) => setInsulation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Poor">Poor (Drafty, Old)</option>
                <option value="Average">Average (Standard)</option>
                <option value="Excellent">Excellent (Modern/Sealed)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Settings2 className="w-5 h-5" />
            Calculate Load Requirements
          </button>
        </form>
      )}

      {/* STAGE 1.5: Analyzing State */}
      {isAnalyzing && (
        <div className="relative rounded-2xl overflow-hidden h-64 border border-slate-200 bg-slate-950 flex flex-col items-center justify-center space-y-4 shadow-inner">
          <Wind
            className="w-16 h-16 text-cyan-400 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <div className="text-center space-y-1 relative z-10">
            <p className="font-bold text-white tracking-wide">
              Calculating Thermal Load...
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Evaluating {sqFt} sqft / {insulation} insulation
            </p>
          </div>
        </div>
      )}

      {/* STAGE 2: Gated Lead Capture Form */}
      {specs && showLeadForm && (
        <LeadCaptureSqueeze
          projectType="HVAC System Upgrade"
          tenantId={tenantId}
          aiSpecs={specs}
          estimatedValue={calculateHVACPriceTiers(specs).better}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}

      {/* STAGE 3: Unlocked Results Display */}
      {specs && !showLeadForm && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Summary Dashboard Card */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center shrink-0">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Required Capacity
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {specs.calculatedTonnage} Tons
                </p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/80">
                  Est. 10-Yr Energy Savings
                </p>
                <p className="text-2xl font-black text-amber-900">
                  +${specs.estimatedSavings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Estimated Replacement Costs
            </h3>
            <div className="grid gap-3">
              <PriceTier
                title="Value Series (14 SEER)"
                desc="Single-stage compressor. Standard efficiency and reliable cooling."
                price={formatPrice(calculateHVACPriceTiers(specs).good)}
              />
              <PriceTier
                title="High Efficiency (16-18 SEER)"
                desc="Two-stage compressor. Better humidity control & lower power bills."
                price={formatPrice(calculateHVACPriceTiers(specs).better)}
                featured
              />
              <PriceTier
                title="Ultimate Comfort (20+ SEER)"
                desc="Variable speed communication. Near-silent operation & max rebates."
                price={formatPrice(calculateHVACPriceTiers(specs).best)}
              />
            </div>
          </div>

          {isClient && (
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <PDFDownloadLink
                document={
                  <EstimateDocument
                    consumerName="Homeowner"
                    projectType="HVAC System Upgrade"
                    date={new Date().toLocaleDateString()}
                    aiSpecs={{
                      "Space Evaluated": `${specs.squareFootage} sqft`,
                      "Floor Levels": specs.floors.toString(),
                      "Insulation Factor": specs.insulation,
                      "Required Tonnage": `${specs.calculatedTonnage} Tons`,
                      "10-Yr Projected Savings": `$${specs.estimatedSavings.toLocaleString()}`,
                    }}
                    estimatedValue={calculateHVACPriceTiers(specs).better}
                  />
                }
                fileName={`HVAC-Estimate.pdf`}
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
            Calculate a different property
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
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-900">{price}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
          System + Install
        </p>
      </div>
    </div>
  );
}
