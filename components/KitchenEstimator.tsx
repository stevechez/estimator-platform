"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Sparkles,
  Calculator,
  Utensils,
  CheckCircle,
  Lock,
  DownloadCloud,
} from "lucide-react";
import { analyzeKitchen } from "@/app/actions/kitchen";
import { captureLead } from "@/app/actions/leads";

import { PDFDownloadLink } from "@react-pdf/renderer";
import EstimateDocument from "@/components/pdf/EstimateDocument";

interface EstimatorProps {
  tenantId?: string;
  multiplier?: number;
  isDemo?: boolean;
}

export default function KitchenEstimator({
  tenantId = "REPLACE_WITH_DYNAMIC_TENANT_ID",
  multiplier = 1.0,
  isDemo = false,
}: EstimatorProps) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<any>(null);

  // Safe SSR hydration check for the PDF link
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const calculateKitchenPriceTiers = (specs: any) => {
    const baseRates = {
      Small: { good: 25000, better: 45000, best: 75000 },
      Medium: { good: 35000, better: 65000, best: 110000 },
      Large: { good: 45000, better: 85000, best: 150000 },
    };

    const volume = (specs.cabinetVolume as keyof typeof baseRates) || "Medium";

    const calculateTotal = (tier: "good" | "better" | "best") => {
      let total = baseRates[volume][tier];

      if (tier === "good") total += 5000;
      if (tier === "better") total += 12000;
      if (tier === "best" || specs.applianceGrade === "Luxury") total += 25000;

      if (specs.hasIsland && tier !== "good") {
        total += tier === "better" ? 8000 : 15000;
      }

      if (specs.layoutChangeLikely && tier !== "good") {
        total += tier === "better" ? 12000 : 20000;
      }

      return total * multiplier;
    };

    return {
      good: calculateTotal("good"),
      better: calculateTotal("better"),
      best: calculateTotal("best"),
    };
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const runAnalysis = async () => {
    setLoading(true);
    const base64Promises = images.map((img) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(img.file);
        reader.onloadend = () =>
          resolve((reader.result as string).split(",")[1]);
      });
    });

    const base64Images = await Promise.all(base64Promises);
    const result = await analyzeKitchen(base64Images);

    if (result.success) {
      setSpecs(result.data);
      setShowLeadForm(true);
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);

    const result = await captureLead({
      tenant_id: tenantId,
      project_type: "Kitchen",
      customer_name: contactInfo.name,
      customer_email: contactInfo.email,
      customer_phone: contactInfo.phone,
      ai_specs: specs,
    });

    if (result.success) {
      setShowLeadForm(false);
    } else {
      alert("Something went wrong saving your details.");
    }
    setSubmittingLead(false);
  };

  const resetEstimator = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setSpecs(null);
    setShowLeadForm(false);
    setContactInfo({ name: "", email: "", phone: "" });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900">
          Kitchen AI Estimator
        </h1>
        <p className="text-slate-500">
          Capture the cabinets, island, and appliances.
        </p>
      </div>

      {/* STAGE 1: UPLOAD ZONE */}
      {!specs && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden border border-slate-200"
              >
                <img
                  src={img.preview}
                  className="object-cover w-full h-full"
                  alt="Preview"
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <Plus className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Add Photo
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleAddImage}
                accept="image/jpeg, image/png, image/webp"
              />
            </label>
          </div>

          {images.length > 0 && (
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Utensils className="w-5 h-5" />
                  Analyze {images.length} Photos
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* STAGE 2: THE SQUEEZE */}
      {showLeadForm && specs && (
        <div className="animate-in zoom-in-95 duration-300">
          <div className="p-8 bg-white rounded-2xl border-2 border-blue-500 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Analysis Complete!
              </h2>
              <p className="text-slate-600 mt-2">
                We've mapped your {specs.layoutType} layout and calculated local
                installation costs.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={contactInfo.name}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Phone
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingLead}
                className="w-full mt-6 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submittingLead ? "Unlocking..." : "Unlock My Estimate"}
                {!submittingLead && <Lock className="w-4 h-4" />}
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-4">
                By unlocking, you agree to receive a follow-up from a certified
                local contractor.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* STAGE 3: THE RESULTS */}
      {specs && !showLeadForm && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
              Detected Layout
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2">
                <p className="text-slate-400 text-[10px] uppercase mb-1">
                  Floorplan
                </p>
                <p className="text-slate-900 font-bold">{specs.layoutType}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 text-[10px] uppercase mb-1">
                  Cabinet Volume
                </p>
                <p className="text-slate-900 font-bold">
                  {specs.cabinetVolume}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 text-[10px] uppercase mb-1">
                  Appliance Tier
                </p>
                <p className="text-slate-900 font-bold">
                  {specs.applianceGrade}
                </p>
              </div>
            </div>
            {specs.layoutChangeLikely && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Major layout change or wall removal detected.
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              Estimated Remodel Tiers
            </h3>
            <div className="grid gap-3">
              <PriceTier
                title="Cosmetic Update"
                desc="Reface cabinets, new stone counters, standard appliances."
                price={formatPrice(calculateKitchenPriceTiers(specs).good)}
                isDemo={isDemo}
              />
              <PriceTier
                title="Full Replacement"
                desc="All new semi-custom cabinets, premium appliances, new island."
                price={formatPrice(calculateKitchenPriceTiers(specs).better)}
                featured
              />
              <PriceTier
                title="Chef's Kitchen"
                desc="Custom cabinetry, luxury built-ins, moving plumbing/walls."
                price={formatPrice(calculateKitchenPriceTiers(specs).best)}
              />
            </div>
          </div>

          {/* PDF DOWNLOAD BUTTON (Conditionally rendered on client to avoid Next.js hydration mismatch) */}
          {isClient && (
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <PDFDownloadLink
                document={
                  <EstimateDocument
                    consumerName={contactInfo.name || "Homeowner"}
                    projectType="Kitchen Remodel"
                    date={new Date().toLocaleDateString()}
                    aiSpecs={specs}
                    estimatedValue={calculateKitchenPriceTiers(specs).better}
                  />
                }
                fileName={`Estimate-${(contactInfo.name || "Project").replace(/\s+/g, "-")}.pdf`}
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
            onClick={resetEstimator}
            className="w-full py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors mt-4"
          >
            Scan another kitchen
          </button>
        </div>
      )}
    </div>
  );
}

function PriceTier({ title, price, desc, featured = false }: any) {
  return (
    <div
      className={`p-4 bg-white border rounded-xl flex justify-between items-center transition-all ${featured ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-md" : "border-slate-200"}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          {featured && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
              MOST COMMON
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
          {desc}
        </p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-900">{price}</p>
      </div>
    </div>
  );
}
