"use client";

import { useState } from "react";
import { getRoofData } from "@/app/actions/roofing";
import { Calculator, Info } from "lucide-react";
import AddressSearch from "@/components/AddressSearch";

// Types for our internal state
type EstimateResult = {
  totalSquares: string;
  avgPitch: string;
  totalAreaM2: number;
};

// Pricing rates per square (Cupertino Rates)
const pricing: Record<string, number> = {
  standard_asphalt_rate: 850,
  architectural_rate: 1100,
  metal_rate: 1850,
  steep_surcharge_percent: 1.25,
  extreme_surcharge_percent: 1.5,
};

export default function EstimatorPage() {
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  // Pricing Logic
  const calculatePrice = (squares: string, materialKey: string) => {
    const sq = parseFloat(squares);
    const pitch = parseFloat(estimate?.avgPitch || "0");

    // Grab the base multiplier from our local dictionary
    const baseMultiplier = pricing[materialKey];

    let steepnessMultiplier = 1.0;
    if (pitch > 45) {
      steepnessMultiplier = pricing.extreme_surcharge_percent;
    } else if (pitch > 30) {
      steepnessMultiplier = pricing.steep_surcharge_percent;
    }

    const finalPrice = sq * baseMultiplier * steepnessMultiplier;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(finalPrice);
  };

  const handleAddressSelect = async (
    lat: number,
    lng: number,
    address: string,
  ) => {
    setLoading(true);
    const result = await getRoofData(lat, lng);

    if (result.success && parseFloat(result.totalSquares || "0") > 0) {
      setEstimate(result as EstimateResult);
    } else {
      alert("No 3D satellite data found for this specific address.");
      setEstimate(null);
    }

    // Make sure we stop the loading spinner!
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          AI Roof Estimator
        </h1>
        <p className="text-lg text-slate-600">
          Transparent satellite analysis. No phone calls, no spam.
        </p>
      </div>

      {/* The Search Bar */}
      <div className="max-w-2xl mx-auto">
        <AddressSearch onAddressSelect={handleAddressSelect} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center p-20 animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium">
            Analyzing 3D roof geometry...
          </p>
        </div>
      )}

      {/* Results Section */}
      {estimate && !loading && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Left Column: The Stats */}
          <div className="md:col-span-1 space-y-4">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                Roof Geometry
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-black text-slate-900">
                    {estimate.totalSquares}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    Total Squares (100 sq ft)
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-2xl font-bold text-slate-800">
                    {estimate.avgPitch}°
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    Average Pitch (Slope)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-xs leading-relaxed text-blue-800">
                Our AI uses 3D surface modeling to account for roof steepness,
                ensuring more accuracy than a flat square-foot measurement.
              </p>
            </div>
          </div>

          {/* Right Column: The Estimates */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Estimated Install Cost
            </h2>

            <div className="grid gap-4">
              {/* NOTE: Now passing the string keys instead of raw numbers! */}
              <PriceTier
                title="Standard Asphalt"
                desc="Reliable, industry-standard shingles"
                price={calculatePrice(
                  estimate.totalSquares,
                  "standard_asphalt_rate",
                )}
                color="border-slate-200"
              />
              <PriceTier
                title="Architectural Shingles"
                desc="High-wind resistance & 30-year life"
                price={calculatePrice(
                  estimate.totalSquares,
                  "architectural_rate",
                )}
                color="border-blue-500 ring-2 ring-blue-500/10"
                featured
              />
              <PriceTier
                title="Standing Seam Metal"
                desc="Premium lifetime durability"
                price={calculatePrice(estimate.totalSquares, "metal_rate")}
                color="border-slate-200"
              />
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-4">
              *Estimates are based on national averages and satellite data.
              Actual onsite quotes may vary.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PriceTier({ title, price, desc, color, featured = false }: any) {
  return (
    <div
      className={`p-6 bg-white border rounded-2xl flex justify-between items-center transition-all hover:shadow-md ${color}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-xl text-slate-900">{title}</h3>
          {featured && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
              MOST POPULAR
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-black text-slate-900">{price}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
          Full Install
        </p>
      </div>
    </div>
  );
}
