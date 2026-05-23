"use server";

import { createClient } from "@supabase/supabase-js";

// Uses the secure service role key to ensure the server can reliably read/write pricing data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// The fully unified interface containing all trade configurations
export interface PricingMatrix {
  tenant_id: string;
  company_name: string;
  pricing_multiplier: number;
  roofing_base_rate: number;
  kitchen_base_rate: number;
  bathroom_base_rate: number;
  hvac_base_rate: number;
  garage_base_rate: number;
  electrical_base_rate: number;
  plumbing_base_rate: number;
}

// Fetches the entire pricing row for a specific contractor
export async function getTenantPricing(
  tenantId: string,
): Promise<PricingMatrix | null> {
  try {
    const { data, error } = await supabase
      .from("contractors")
      .select("*") // Grabs all columns, ensuring the new trades are included
      .eq("tenant_id", tenantId)
      .single();

    if (error || !data) return null;
    return data as PricingMatrix;
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return null;
  }
}

// Allows updating either a single rate or the entire matrix simultaneously
export async function updateTenantPricing(
  tenantId: string,
  updates: Partial<PricingMatrix>,
) {
  try {
    const { data, error } = await supabase
      .from("contractors")
      .update(updates)
      .eq("tenant_id", tenantId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating pricing matrix:", error);
    return { success: false, error: error.message };
  }
}
