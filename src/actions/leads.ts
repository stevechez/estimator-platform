"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface QualifiedLeadPayload {
  tenant_id: string;
  consumer_name: string;
  consumer_email: string;
  consumer_phone?: string;
  property_address: string;
  trade_classification: string;
  estimated_value: number;
  selected_tier: string;
  ai_specs: any;
}

export async function submitQualifiedLead(payload: QualifiedLeadPayload) {
  try {
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          tenant_id: payload.tenant_id,
          // MATCHING YOUR ACTUAL DATABASE COLUMNS EXACTLY:
          consumer_name: payload.consumer_name,
          consumer_email: payload.consumer_email,
          consumer_phone: payload.consumer_phone || null,
          property_address: payload.property_address,
          trade_classification: payload.trade_classification,
          estimated_value: payload.estimated_value,
          selected_tier: payload.selected_tier,
          ai_specs: payload.ai_specs || {},
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Lead insertion failed:", error.message);
      throw new Error(error.message);
    }

    return { success: true, lead: data };
  } catch (error: any) {
    console.error("Lead Capture Error:", error);
    return {
      success: false,
      error: error.message || "Failed to secure lead data.",
    };
  }
}

export async function captureLead(payload: any) {
  return submitQualifiedLead(payload);
}
