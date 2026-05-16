"use client";

import React, { useState, useEffect } from "react";
import { Camera, CheckCircle, Calculator, DownloadCloud } from "lucide-react";
import { analyzeGaragePhoto } from "@/app/actions/vision";
import LeadCaptureSqueeze from "@/components/LeadCaptureSqueeze";
import { PDFDownloadLink } from "@react-pdf/renderer";
import EstimateDocument from "@/components/pdf/EstimateDocument";

// Types
interface GarageSpecs {
  doorCount: number;
  sizeType: string[];
  hasWindows: boolean;
  materialStyle: string;
  confidence: number;
}

interface EstimatorProps {
  tenantId?: string;
  multiplier?: number;
}

export default function GarageEstimator({
  tenantId = "REPLACE_WITH_DYNAMIC_TENANT_ID",
  multiplier = 1.0,
}: EstimatorProps) {
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<GarageSpecs | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // FIXED 1: Added missing client-side hydration check for the PDF renderer
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper to format currency
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateGaragePriceTiers = (specs: GarageSpecs) => {
    const baseRates = {
      single: { good: 1450, better: 1850, best: 2800 },
      double: { good: 2400, better: 3200, best: 4800 },
      windowSurcharge: { good: 150, better: 300, best: 500 },
    };

    const calculateForTier = (tier: "good" | "better" | "best") => {
      let total = 0;
      specs.sizeType.forEach((size) => {
        const s = size.toLowerCase() === "double" ? "double" : "single";
        total += baseRates[s][tier];
      });

      if (specs.hasWindows) {
        total += baseRates.windowSurcharge[tier] * specs.doorCount;
      }

      return total * multiplier;
    };

    return {
      good: calculateForTier("good"),
      better: calculateForTier("better"),
      best: calculateForTier("best"),
    };
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const mimeType = base64String.split(";")[0].split(":")[1];
      const rawBase64 = base64String.split(",")[1];

      const result = await analyzeGaragePhoto(rawBase64, mimeType);

      if (result.success) {
        setSpecs(result.data);
        setShowLeadForm(true);
      } else {
        alert(`Failed: ${result.error}`);
        setSpecs(null);
      }
      setLoading(false);
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">
          AI Garage Estimator
        </h1>
        <p className="text-slate-600">
          Snap a photo of your garage. We do the rest.
        </p>
      </div>

      {/* STAGE 1: Upload Zone */}
      {!specs && !loading && (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Camera className="w-12 h-12 text-slate-400 mb-4" />
            <p className="mb-2 text-sm text-slate-600">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-slate-500">
              Take a photo from your driveway
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png, image/webp"
            capture="environment"
            onChange={handleImageUpload}
          />
        </label>
      )}

      {/* Loading State */}
      {loading && (
        <div className="relative rounded-2xl overflow-hidden h-64 border border-slate-200">
          <img
            src={previewUrl!}
            className="object-cover w-full h-full opacity-30 grayscale"
            alt="Scanning"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 font-bold text-slate-800">
              Vision AI Scanning...
            </p>
          </div>
        </div>
      )}

      {/* STAGE 2: Gated Lead Capture Form */}
      {specs && showLeadForm && (
        <LeadCaptureSqueeze
          projectType="Garage Door Install"
          tenantId={tenantId}
          aiSpecs={specs}
          // Added estimated value payload required by your database
          estimatedValue={calculateGaragePriceTiers(specs).better}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}

      {/* STAGE 3: Unlocked Results Display */}
      {specs && !showLeadForm && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl flex gap-6 items-center shadow-sm">
            <img
              src={previewUrl!}
              className="w-32 h-32 object-cover rounded-xl border border-slate-200"
              alt="Your garage"
            />
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Extracted Scope
              </h2>
              <p className="text-2xl font-black text-slate-900">
                {specs.doorCount} {specs.doorCount > 1 ? "Doors" : "Door"}{" "}
                Detected
              </p>
              <ul className="text-slate-600 font-medium">
                <li>
                  <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
                  Size: {specs.sizeType.join(" & ")}
                </li>
                <li>
                  <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
                  Style: {specs.materialStyle}
                </li>
                <li>
                  <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
                  Windows: {specs.hasWindows ? "Yes" : "No"}
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Estimated Install Cost
            </h3>
            <div className="grid gap-3">
              <PriceTier
                title="Value Series"
                desc="Non-insulated or vinyl back steel"
                price={formatPrice(calculateGaragePriceTiers(specs).good)}
              />
              <PriceTier
                title="Heritage Collection"
                desc="Triple-layer insulated (R-Value 12+)"
                price={formatPrice(calculateGaragePriceTiers(specs).better)}
                featured
              />
              <PriceTier
                title="Encore Custom"
                desc="High-R value & carriage house design"
                price={formatPrice(calculateGaragePriceTiers(specs).best)}
              />
            </div>
          </div>

          {/* PDF DOWNLOAD BUTTON */}
          {isClient && (
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <PDFDownloadLink
                document={
                  <EstimateDocument
                    consumerName="Homeowner" // FIXED 3: Hardcoded safely since form state lives in the child component
                    projectType="Garage Door Installation" // FIXED 2: Correct project naming
                    date={new Date().toLocaleDateString()}
                    aiSpecs={{
                      "Door Count": specs.doorCount.toString(),
                      "Size Requirements": specs.sizeType.join(" & "),
                      "Material Match": specs.materialStyle,
                      Windows: specs.hasWindows ? "Included" : "None",
                    }}
                    estimatedValue={calculateGaragePriceTiers(specs).better} // FIXED 2: Correct function execution
                  />
                }
                fileName={`Garage-Estimate.pdf`}
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
            onClick={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setSpecs(null);
            }}
            className="w-full py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            Scan a different photo
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
              POPULAR
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-900">{price}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
          Full Install
        </p>
      </div>
    </div>
  );
}
