"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Droplet,
  Calculator,
  X,
  FileText,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Wrench,
  Layers,
} from "lucide-react";
import Autocomplete from "react-google-autocomplete";
import { submitQualifiedLead } from "@/lib/supabase/leads";
import { getTenantPricing, PricingMatrix } from "@/lib/supabase/pricing";
import { sendEstimateEmail } from "@/app/actions/send-estimate";

interface PlumbingSpecs {
  address: string;
  scale: string;
  scope: string;
}

interface EstimatorProps {
  tenantId?: string;
}

export default function PlumbingEstimator({
  tenantId = "demo_contractor_001",
}: EstimatorProps) {
  const [tenantConfig, setTenantConfig] = useState<PricingMatrix | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  // Form State
  const [address, setAddress] = useState("");
  const [scale, setScale] = useState("");
  const [scope, setScope] = useState("");

  const [isCalculating, setIsCalculating] = useState(false);
  const [specs, setSpecs] = useState<PlumbingSpecs | null>(null);

  // Conversion State
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUnlocked, setPdfUnlocked] = useState(false);
  const [inspectionRequested, setInspectionRequested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    async function loadTenantConfig() {
      if (tenantId) {
        const data = await getTenantPricing(tenantId);
        if (data) setTenantConfig(data);
      }
      setConfigLoading(false);
    }
    loadTenantConfig();
  }, [tenantId]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // --- DYNAMIC PLUMBING MATH ENGINE ---
  const calculatePlumbingPriceTiers = (specs: PlumbingSpecs) => {
    // Falling back to a standard $3,500 infrastructure baseline (typical main line or localized repipe start)
    const baseRate = 3500;
    const activeMultiplier = tenantConfig?.pricing_multiplier || 1.0;

    // Scale Multipliers
    const scaleFactor =
      specs.scale === "Whole Home Overhaul / New Rough-In"
        ? 4.2
        : specs.scale === "Infrastructure Update / Repipe"
          ? 1.8
          : 0.4; // Localized Fixture / Trim Swap

    // System Scope Multipliers
    const scopeFactor =
      specs.scope === "Luxury Commercial Grade"
        ? 1.75 // Cast iron drains, custom Bidets, multi-valve body sprays
        : specs.scope === "Tankless & Smart Filtration"
          ? 1.35 // High-efficiency tankless units, whole-house water softeners
          : 1.0; // Standard PEX supply lines and standard fixtures

    const adjustedBase =
      baseRate * scaleFactor * scopeFactor * activeMultiplier;

    return {
      good: adjustedBase * 0.85, // Standard builder-grade fixtures, traditional venting configurations
      better: adjustedBase * 1.0, // Premium drop-in fixtures, dedicated loops, enhanced pressure regulation
      best: adjustedBase * 1.45, // Pro-grade manifolds, redundant isolation valves, smart leak detection integration
    };
  };

  const handleGenerateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !scale || !scope) return;
    setIsCalculating(true);

    setTimeout(() => {
      setSpecs({ address, scale, scope });
      setIsCalculating(false);
    }, 1500);
  };

  const handlePdfUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const estimatedValue = calculatePlumbingPriceTiers(specs!).better;

      await submitQualifiedLead({
        tenant_id: tenantId,
        consumer_name: contactInfo.name,
        consumer_email: contactInfo.email,
        property_address: specs!.address,
        trade_classification: "Plumbing Project - PDF Request",
        estimated_value: estimatedValue,
        selected_tier: "Research Phase",
        ai_specs: specs as any,
      });

      const emailResponse = await sendEstimateEmail(
        contactInfo.email,
        contactInfo.name,
        estimatedValue,
        "Plumbing System Services",
        {
          "Property Address": specs!.address,
          "Project Scale": specs!.scale,
          "Technical Scope": specs!.scope,
        },
      );

      if (!emailResponse.success)
        console.error("Email failed:", emailResponse.error);
      setPdfUnlocked(true);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to unlock document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInspectionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitQualifiedLead({
        tenant_id: tenantId,
        consumer_name: contactInfo.name,
        consumer_email: contactInfo.email,
        consumer_phone: contactInfo.phone,
        property_address: specs!.address,
        trade_classification: "Plumbing Project - Consult Req",
        estimated_value: calculatePlumbingPriceTiers(specs!).better,
        selected_tier: "Ready to Buy",
        ai_specs: specs as any,
      });
      setInspectionRequested(true);
    } catch (error) {
      alert("Failed to request consultation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (configLoading) {
    return (
      <div className="max-w-2xl mx-auto p-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Loading Plumbing Engine...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 relative">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Plumbing Estimator
        </h1>
        <p className="text-slate-600">
          Generate engineering estimates for infrastructure, water heating, and
          modern finishes.
        </p>
      </div>

      {/* STAGE 1: Scope Definition Input */}
      {!specs && !isCalculating && (
        <form
          onSubmit={handleGenerateEstimate}
          className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Property Address
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
              <Autocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                onPlaceSelected={(place) => {
                  if (place?.formatted_address)
                    setAddress(place.formatted_address);
                }}
                options={{
                  types: ["address"],
                  componentRestrictions: { country: "us" },
                }}
                defaultValue={address}
                onChange={(e: any) => setAddress(e.target.value)}
                placeholder="Where is the project located?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Scale
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Localized Fixture / Trim Swap",
                "Infrastructure Update / Repipe",
                "Whole Home Overhaul / New Rough-In",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setScale(opt)}
                  className={`p-4 rounded-xl border text-left font-bold transition-all ${scale === opt ? "bg-cyan-50 border-cyan-600 text-cyan-950" : "bg-white border-slate-200 text-slate-600 hover:border-cyan-300"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              System Integration
            </label>
            <div className="grid gap-3">
              {[
                {
                  title: "Standard PEX & Fixtures",
                  desc: "Reliable modern supply distributions and quality drop-in installations.",
                },
                {
                  title: "Tankless & Smart Filtration",
                  desc: "Continuous hot water loops, whole-house filtration, and conditioning hardware.",
                },
                {
                  title: "Luxury Commercial Grade",
                  desc: "Cast iron acoustic drains, specialized trim kits, multi-port manifolds, and premium bidets.",
                },
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setScope(opt.title)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1 ${scope === opt.title ? "bg-cyan-50 border-cyan-600" : "bg-white border-slate-200 hover:border-cyan-300"}`}
                >
                  <span
                    className={`font-bold ${scope === opt.title ? "text-cyan-950" : "text-slate-900"}`}
                  >
                    {opt.title}
                  </span>
                  <span
                    className={`text-xs ${scope === opt.title ? "text-cyan-800" : "text-slate-500"}`}
                  >
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!address || !scale || !scope}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calculator className="w-5 h-5" /> Calculate Estimate
          </button>
        </form>
      )}

      {/* STAGE 1.5: Calculating State */}
      {isCalculating && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-cyan-600 animate-spin" />
          <p className="text-sm font-bold text-slate-900">
            Analyzing volumetric distribution profiles...
          </p>
        </div>
      )}

      {/* STAGE 2: Transparent Results */}
      {specs && !isCalculating && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Project Parameters
                </h2>
                <p className="text-sm font-medium text-slate-900 truncate max-w-[280px]">
                  {specs.address}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                <Layers className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">
                    Scope
                  </p>
                  <p className="text-slate-900 font-black text-xs truncate max-w-[100px]">
                    {specs.scale.split(" ")[0]} Project
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                <Wrench className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">
                    System
                  </p>
                  <p className="text-slate-900 font-black text-xs truncate max-w-[100px]">
                    {specs.scope}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-600" /> Estimated
                Investment
              </h3>
              <button
                onClick={() => setShowPdfModal(true)}
                className="text-sm font-bold text-cyan-600 hover:text-cyan-500 flex items-center gap-1.5 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" /> Save as PDF
              </button>
            </div>

            <div className="grid gap-3">
              <PriceTier
                title="Standard Core Compliance"
                desc="High-grade materials, optimized traditional layouts, and code-certified delivery."
                price={formatPrice(calculatePlumbingPriceTiers(specs).good)}
              />
              <PriceTier
                title="Premium Pro Performance"
                desc="Enhanced distribution manifolds, structural isolation protection, and premium trims."
                price={formatPrice(calculatePlumbingPriceTiers(specs).better)}
                featured
              />
              <PriceTier
                title="Luxury Engineering Tier"
                desc="Cast iron acoustic dampening drains, tankless loops, specialized automation controls, and ultra-premium trims."
                price={formatPrice(calculatePlumbingPriceTiers(specs).best)}
              />
            </div>
          </div>

          {/* INTENT 2: Site Inspection Form */}
          <div className="mt-8 bg-slate-900 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
            {inspectionRequested ? (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black">Review Requested</h3>
                <p className="text-slate-400 text-sm">
                  An engineering coordinator will reach out to organize
                  diagnostic assessments and secure production schedules.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 relative z-10">
                  <h3 className="text-2xl font-black flex items-center gap-2">
                    <CalendarCheck className="w-6 h-6 text-cyan-400" />{" "}
                    Initialize Infrastructure Survey
                  </h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Ready to move forward? Schedule an on-site evaluation to
                    complete absolute physical layout validation and verify
                    existing infrastructure constraints.
                  </p>
                </div>
                <form
                  onSubmit={handleInspectionRequest}
                  className="space-y-4 relative z-10"
                >
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={contactInfo.name}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, name: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-cyan-600 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-500 transition-colors mt-2"
                  >
                    {isSubmitting ? "Submitting..." : "Request Site Survey"}
                  </button>
                </form>
              </>
            )}
          </div>
          <button
            onClick={() => setSpecs(null)}
            className="w-full py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            Start a new estimate
          </button>
        </div>
      )}

      {/* INTENT 1: PDF Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {!pdfUnlocked ? (
              <>
                <div className="text-center mb-6 pt-4">
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Save Your Estimate
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Where should we route your itemized plumbing system
                    blueprint?
                  </p>
                </div>
                <form onSubmit={handlePdfUnlock} className="space-y-4">
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={contactInfo.name}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, name: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                  >
                    {isSubmitting ? "Generating..." : "Generate PDF"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8 space-y-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Blueprint Sent!
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Check your inbox for the attached PDF ledger.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component scoped to layout styling context
function PriceTier({ title, price, desc, featured = false }: any) {
  return (
    <div
      className={`p-4 bg-white border rounded-xl flex justify-between items-center transition-all hover:shadow-md ${featured ? "border-cyan-500 ring-2 ring-cyan-500/10" : "border-slate-200"}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          {featured && (
            <span className="bg-cyan-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
              MOST COMMON
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-[250px]">{desc}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-900">{price}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
          Turnkey
        </p>
      </div>
    </div>
  );
}
