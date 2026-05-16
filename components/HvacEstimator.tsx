"use client";

import React, { useState } from "react";
import {
  Calculator,
  Thermometer,
  ShieldCheck,
  RefreshCw,
  Landmark,
  HelpCircle,
  Flame,
} from "lucide-react";
import LeadCaptureSqueeze from "@/components/LeadCaptureSqueeze";

export default function HvacEstimator() {
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);

  // Form Inputs
  const [systemType, setSystemType] = useState("Gas Furnace & AC Combo");
  const [homeSize, setHomeSize] = useState(2050);
  const [currentSeer, setCurrentSeer] = useState("10");
  const [newSeer, setNewSeer] = useState("18");
  const [includeDuctwork, setIncludeDuctwork] = useState(false);

  // Helper to format currency cleanly
  const formatVal = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // --- HVAC SIZE & ENERGY LOGIC ---
  const runCalculation = () => {
    const sqFt = Number(homeSize) || 0;
    const oldEff = Number(currentSeer) || 10;
    const newEff = Number(newSeer) || 14;

    // 1. Size Calculation: 1 Ton of cooling capacity per 500 sq ft
    const calculatedTonnage = Math.max(1.5, Math.round((sqFt / 500) * 2) / 2); // Round to nearest 0.5 Ton

    // 2. Base Equipment & Labor Cost (Cupertino baseline metrics)
    let baseEquipmentCost = calculatedTonnage * 2200;
    let baseLaborCost = calculatedTonnage * 1200;

    // Surcharges for high-efficiency inverter units (Higher SEER = higher equipment cost)
    if (newEff >= 18) baseEquipmentCost *= 1.45;
    else if (newEff >= 16) baseEquipmentCost *= 1.2;

    // Heat pumps run slightly premium over standard AC systems
    if (systemType.includes("Heat Pump")) {
      baseEquipmentCost *= 1.15;
    }

    const ductworkCost = includeDuctwork ? sqFt * 3.5 : 0;
    const permitAndTestingFees = 1100; // Includes mandatory HERS duct testing in CA

    const subtotal =
      baseEquipmentCost + baseLaborCost + ductworkCost + permitAndTestingFees;
    const finalTotal = subtotal;

    // 3. SEER Energy Savings Calculations (Based on average South Bay electrical rates)
    const averageAnnualCoolingBill = sqFt * 0.45; // Approximate localized baseline
    const efficiencyRatio = oldEff / newEff;
    const annualSavings = averageAnnualCoolingBill * (1 - efficiencyRatio);
    const tenYearSavings = annualSavings * 10;

    return {
      tonnage: calculatedTonnage,
      equipmentCost: baseEquipmentCost,
      laborCost: baseLaborCost,
      ductworkCost,
      fees: permitAndTestingFees,
      finalTotal,
      annualSavings,
      tenYearSavings,
    };
  };

  const calculatedValues = runCalculation();

  const handleCalculateClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowLeadForm(true);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl p-8 text-white shadow-md text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
            <Thermometer className="w-8 h-8 text-amber-400 animate-pulse" />
            HVAC System Estimator
          </h1>
          <p className="text-blue-100 mt-1 font-medium">
            Professional Quote & SEER Savings Calculator – Local Multi-Tier
            Metrics
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* LEFT COLUMN: Configuration Panel */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            System Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                System Type
              </label>
              <select
                disabled={hasUnlocked && !showLeadForm}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
                value={systemType}
                onChange={(e) => setSystemType(e.target.value)}
              >
                <option>Gas Furnace & AC Combo</option>
                <option>High-Efficiency Heat Pump (All Electric)</option>
                <option>AC Only Upgrade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Home Size
              </label>
              <div className="relative">
                <input
                  disabled={hasUnlocked && !showLeadForm}
                  type="number"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
                  value={homeSize}
                  onChange={(e) =>
                    setHomeSize(Math.max(0, parseInt(e.target.value) || 0))
                  }
                />
                <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400">
                  sq ft
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  Current SEER <HelpCircle className="w-3 h-3 text-slate-400" />
                </label>
                <select
                  disabled={hasUnlocked && !showLeadForm}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-700"
                  value={currentSeer}
                  onChange={(e) => setCurrentSeer(e.target.value)}
                >
                  <option value="10">10 SEER (Old Old)</option>
                  <option value="13">13 SEER (Standard Old)</option>
                  <option value="14">14 SEER</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Target SEER
                </label>
                <select
                  disabled={hasUnlocked && !showLeadForm}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-blue-600"
                  value={newSeer}
                  onChange={(e) => setNewSeer(e.target.value)}
                >
                  <option value="14">14 SEER (Minimum)</option>
                  <option value="16">16 SEER (High Efficiency)</option>
                  <option value="18">18 SEER (Ultra Inverter)</option>
                  <option value="20">20+ SEER (Premium)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <input
                  disabled={hasUnlocked && !showLeadForm}
                  type="checkbox"
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  checked={includeDuctwork}
                  onChange={(e) => setIncludeDuctwork(e.target.checked)}
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Include Ductwork Replacement
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Recommended for systems over 15 years old
                  </p>
                </div>
              </label>
            </div>

            {!hasUnlocked && !showLeadForm && (
              <button
                onClick={handleCalculateClick}
                disabled={loading}
                className="w-full mt-2 py-4 bg-blue-600 text-white font-black text-lg rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  "Generate System Quote"
                )}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Lead Gate or Results Display */}
        <div className="md:col-span-3 space-y-6">
          {showLeadForm && (
            <LeadCaptureSqueeze
              projectType="HVAC"
              aiSpecs={{
                systemType,
                homeSize,
                currentSeer,
                newSeer,
                includeDuctwork,
                tonnage: calculatedValues.tonnage,
              }}
              onSuccess={() => {
                setShowLeadForm(false);
                setHasUnlocked(true);
              }}
            />
          )}

          {hasUnlocked && !showLeadForm && (
            <div className="space-y-6 Skinner-animation animate-in fade-in duration-500">
              {/* Job Estimate Display Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Job Estimate
                </h3>
                <p className="text-xs font-semibold text-slate-500 tracking-tight">
                  Professional HVAC Installation Quote
                </p>
                <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl py-6 text-white max-w-md mx-auto shadow-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
                    Total System Cost
                  </p>
                  <p className="text-5xl font-black">
                    {formatVal(calculatedValues.finalTotal)}
                  </p>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mt-2">
                    Sized for: {calculatedValues.tonnage} Ton Capacity
                  </p>
                </div>
              </div>

              {/* SEER ROI / Savings Analysis Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                  Estimated SEER Operating Savings
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-center">
                    <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider mb-1">
                      Annual Power Savings
                    </p>
                    <p className="text-2xl font-black text-emerald-700">
                      +{formatVal(calculatedValues.annualSavings)}/yr
                    </p>
                  </div>
                  <div className="bg-emerald-600 p-4 rounded-xl text-center text-white shadow-sm">
                    <p className="text-[10px] font-bold uppercase text-emerald-100 tracking-wider mb-1">
                      10-Year Projected Savings
                    </p>
                    <p className="text-2xl font-black">
                      {formatVal(calculatedValues.tenYearSavings)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown Sheet Line Items */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Cost Breakdown
                </h3>

                <div className="space-y-2 text-sm font-medium">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600">
                      Equipment Cost ({newSeer} SEER)
                    </span>
                    <span className="text-slate-900 font-bold">
                      {formatVal(calculatedValues.equipmentCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600">
                      Labor & Configuration Cost
                    </span>
                    <span className="text-slate-900 font-bold">
                      {formatVal(calculatedValues.laborCost)}
                    </span>
                  </div>
                  {includeDuctwork && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-600">
                        Full R-8 Ductwork Assembly
                      </span>
                      <span className="text-slate-900 font-bold">
                        {formatVal(calculatedValues.ductworkCost)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600">
                      Permit Fees, HERS Testing & Disposal
                    </span>
                    <span className="text-slate-900 font-bold">
                      {formatVal(calculatedValues.fees)}
                    </span>
                  </div>
                </div>

                {/* Local Incentives Notice */}
                {systemType.includes("Heat Pump") && (
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-blue-800 text-xs font-semibold">
                    <Landmark className="w-5 h-5 text-blue-600 shrink-0" />
                    <p>
                      This system likely qualifies for up to $2,000 in Federal
                      Inflation Reduction Act (IRA) Section 25C Tax Credits.
                    </p>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <button
                    onClick={() => {
                      setHasUnlocked(false);
                      setShowLeadForm(false);
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-center border border-slate-200"
                  >
                    Adjust Configuration
                  </button>
                </div>

                {/* Notice Footnote */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 text-slate-400 text-[10px] leading-relaxed font-medium">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p>
                    Energy calculations are localized references. Real utility
                    performance profiles fluctuate based on insulation factors,
                    ambient exposure thresholds, internal thermodynamic
                    structures, and individual lifestyle configurations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State Screen */}
          {!hasUnlocked && !showLeadForm && (
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 bg-white shadow-inner flex flex-col items-center justify-center space-y-4">
              <Flame className="w-12 h-12 text-slate-300 animate-pulse" />
              <div>
                <p className="font-bold text-slate-500">
                  Awaiting Thermodynamic Inputs
                </p>
                <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                  Configure the home layout metrics on the left and trigger
                  compilation to calculate equipment tonnage requirements and
                  utility savings profiles.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
