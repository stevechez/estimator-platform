"use client";

import React, { useState } from "react";
import {
  Calculator,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Printer,
  HelpCircle,
} from "lucide-react";
import LeadCaptureSqueeze from "@/components/LeadCaptureSqueeze";

interface EstimatorProps {
  tenantId?: string;
  multiplier?: number;
}

export default function PlumbingEstimator({
  tenantId = "REPLACE_WITH_DYNAMIC_TENANT_ID",
  multiplier = 1.0,
}: EstimatorProps) {
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);

  // Form Inputs
  const [jobType, setJobType] = useState("Pipe Work / Repair");
  const [severity, setSeverity] = useState("Low");
  const [fixtureCount, setFixtureCount] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);

  // Helper to format currency cleanly
  const formatVal = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // --- PLUMBING MATHEMATICAL MATRIX ---
  const runCalculation = () => {
    const fixtures = Number(fixtureCount) || 1;

    // Base rates matching structural specifications
    const baseRates: Record<string, number> = {
      "Pipe Work / Repair": 800,
      "Water Heater Replacement": 2200,
      "Drain Clog Clearing": 350,
      "Sewer Line Mainline Repair": 4500,
    };

    const targetBase = baseRates[jobType] || 500;
    const severityMultiplier =
      severity === "Severe" ? 1.5 : severity === "Medium" ? 1.2 : 1.0;

    // Calculate materials and setup labor allocations
    const baseMaterials = targetBase * 0.4 * severityMultiplier;
    let baseLabor =
      targetBase * 0.6 * severityMultiplier + (fixtures - 1) * 250;

    // Emergency call-out surcharge premium ($350 dispatch multiplier flat-fee)
    const emergencySurcharge = isEmergency ? 350 : 0;
    const permitFees =
      jobType.includes("Water Heater") || jobType.includes("Sewer") ? 450 : 0;

    const subtotal =
      baseMaterials + baseLabor + emergencySurcharge + permitFees;

    // Apply multi-tenant dynamic markup settings scale multiplier right at the end
    const finalTotal = subtotal * multiplier;

    return {
      materials: baseMaterials * multiplier,
      labor: baseLabor * multiplier,
      emergencySurcharge: emergencySurcharge * multiplier,
      permitFees: permitFees * multiplier,
      finalTotal,
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
            <Wrench className="w-8 h-8 text-amber-400" />
            Plumbing Job Estimator
          </h1>
          <p className="text-blue-100 mt-1 font-medium">
            Professional Project Cost Calculator – Instant Diagnostics & Local
            Rates
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* LEFT COLUMN: Input Control panel */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            Job Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Job Type
              </label>
              <select
                disabled={hasUnlocked && !showLeadForm}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option>Pipe Work / Repair</option>
                <option>Water Heater Replacement</option>
                <option>Drain Clog Clearing</option>
                <option>Sewer Line Mainline Repair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Problem Severity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Low", "Medium", "Severe"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    disabled={hasUnlocked && !showLeadForm}
                    onClick={() => setSeverity(level)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      severity === level
                        ? level === "Severe"
                          ? "bg-red-50 border-red-500 text-red-600 ring-2 ring-red-500/10"
                          : "bg-blue-50 border-blue-500 text-blue-600 ring-2 ring-blue-500/10"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Affected Fixture Count
              </label>
              <input
                disabled={hasUnlocked && !showLeadForm}
                type="number"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
                value={fixtureCount}
                onChange={(e) =>
                  setFixtureCount(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <input
                  disabled={hasUnlocked && !showLeadForm}
                  type="checkbox"
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Emergency Dispatch Requested
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Applies priority routing & immediate dispatch fees
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
                  "Calculate Service Costs"
                )}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Lead Funnel or Unlocked Data Summary */}
        <div className="md:col-span-3 space-y-6">
          {showLeadForm && (
            <LeadCaptureSqueeze
              projectType="Bathroom" // Using your centralized dynamic schema keys mapping
              tenantId={tenantId}
              aiSpecs={{
                jobType,
                severity,
                fixtureCount,
                isEmergency,
                calculatedValues,
              }}
              onSuccess={() => {
                setShowLeadForm(false);
                setHasUnlocked(true);
              }}
            />
          )}

          {hasUnlocked && !showLeadForm && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Main Total Estimate Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Final Total Estimate
                </h3>

                {isEmergency && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex gap-2.5 items-center max-w-md mx-auto text-left text-red-800 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    Priority Emergency Dispatch Surcharge Active.
                  </div>
                )}

                <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl py-6 text-white max-w-md mx-auto shadow-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
                    Estimated Project Total
                  </p>
                  <p className="text-5xl font-black">
                    {formatVal(calculatedValues.finalTotal)}
                  </p>
                </div>
              </div>

              {/* Comprehensive Line Item Breakdown List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Cost Breakdown
                </h3>

                <div className="space-y-2 text-sm font-medium">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600">
                      Materials, Fittings & Seals Allocation
                    </span>
                    <span className="text-slate-900 font-bold">
                      {formatVal(calculatedValues.materials)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600">
                      Licensed Plumbing Labor hours
                    </span>
                    <span className="text-slate-900 font-bold">
                      {formatVal(calculatedValues.labor)}
                    </span>
                  </div>
                  {isEmergency && (
                    <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-amber-900">
                      <span>Emergency Priority Call-out Surcharge</span>
                      <span className="font-bold">
                        {formatVal(calculatedValues.emergencySurcharge)}
                      </span>
                    </div>
                  )}
                  {calculatedValues.permitFees > 0 && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-600">
                        Municipal Regulatory Safety Permits
                      </span>
                      <span className="text-slate-900 font-bold">
                        {formatVal(calculatedValues.permitFees)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Operational Controls */}
                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Print Summary Sheet
                  </button>
                  <button
                    onClick={() => {
                      setHasUnlocked(false);
                      setShowLeadForm(false);
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-center border border-slate-200"
                  >
                    Adjust Parameters
                  </button>
                </div>

                {/* Disclaimer Footnote info */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 text-slate-400 text-[10px] leading-relaxed font-medium">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p>
                    Plumbing estimates assume code-compliant baseline structural
                    integrity access. Prices may fluctuate following dynamic
                    on-site diagnostics, line scoping feedback loops, slab
                    access restrictions, or hidden structural corrosion
                    variables.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty Waiting State UI View */}
          {!hasUnlocked && !showLeadForm && (
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 bg-white shadow-inner flex flex-col items-center justify-center space-y-4">
              <Calculator className="w-12 h-12 text-slate-300 animate-pulse" />
              <div>
                <p className="font-bold text-slate-500">
                  Awaiting Service Specifications
                </p>
                <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                  Adjust job type profiles on the left grid interface panel and
                  hit calculate to populate your white-label plumbing cost
                  diagnostic overview sheet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
