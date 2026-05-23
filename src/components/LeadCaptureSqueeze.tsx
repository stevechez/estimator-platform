"use client";

import React, { useState } from "react";
import { CheckCircle, Lock, Loader2 } from "lucide-react";
import { submitQualifiedLead } from "@/lib/supabase/leads";

interface LeadCaptureProps {
  projectType:
    | "Roof"
    | "Garage"
    | "Bathroom"
    | "Kitchen"
    | "HVAC"
    | "General Contractor"
    | "Electrical"
    | string;
  aiSpecs: any;
  onSuccess: () => void;
  tenantId?: string;
  estimatedValue?: number; // Added to satisfy Supabase NOT NULL requirements
}

export default function LeadCaptureSqueeze({
  projectType,
  aiSpecs,
  onSuccess,
  tenantId = "clx9102", // Fallback to your test string slug
  estimatedValue = 0,
}: LeadCaptureProps) {
  const [submitting, setSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Fire the payload to the actual Supabase database
      await submitQualifiedLead({
        tenant_id: tenantId,
        consumer_name: contactInfo.name,
        consumer_email: contactInfo.email,
        consumer_phone: contactInfo.phone,
        property_address: "Not Provided", // Can add to UI later if needed
        trade_classification: projectType,
        estimated_value: estimatedValue,
        selected_tier: "Pending Review",
        ai_specs: aiSpecs || {},
      });

      // 2. Success! Trigger parent component to hide form and reveal pricing
      onSuccess();
    } catch (error) {
      console.error("Failed to unlock estimate:", error);
      alert("Failed to save lead. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
            We've analyzed your {projectType} and calculated local Cupertino
            costs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={submitting}
            className="w-full mt-6 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Unlock My Estimate <Lock className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-4 italic">
            Your data is stored securely and never sold to third parties.
          </p>
        </form>
      </div>
    </div>
  );
}
