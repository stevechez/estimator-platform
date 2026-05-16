// lib/supabase/leads.ts
import { createClient } from "./client";

export interface LeadPayload {
  tenant_id: string;
  consumer_name: string;
  consumer_email: string;
  consumer_phone?: string;
  property_address?: string;
  trade_classification: string;
  estimated_value: number;
  selected_tier: string;
  ai_specs: Record<string, string | number | boolean>;
}

export async function submitQualifiedLead(payload: LeadPayload) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        tenant_id: payload.tenant_id,
        consumer_name: payload.consumer_name,
        consumer_email: payload.consumer_email,
        consumer_phone: payload.consumer_phone,
        property_address: payload.property_address,
        trade_classification: payload.trade_classification,
        estimated_value: payload.estimated_value,
        selected_tier: payload.selected_tier,
        ai_specs: payload.ai_specs,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Lead insertion failed:", error.message);
    throw new Error("Failed to secure lead data.");
  }

  return data;
}
