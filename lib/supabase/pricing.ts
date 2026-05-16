// lib/supabase/pricing.ts
import { createClient } from "./client"; // Maps perfectly to your factory function export

export interface PricingMatrix {
  pricing_multiplier: number;
  roofing_base_rate: number;
  kitchen_base_rate: number;
  bathroom_base_rate: number;
  hvac_base_rate: number;
  electrical_base_rate: number;
  plumbing_base_rate: number;
}

// Fetch active baseline properties
export async function getTenantPricing(
  tenantId: string,
): Promise<PricingMatrix | null> {
  // FIXED: Invoke the factory function to initialize the browser client session instance locally
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contractors")
    .select(
      "pricing_multiplier, roofing_base_rate, kitchen_base_rate, bathroom_base_rate, hvac_base_rate, electrical_base_rate, plumbing_base_rate",
    )
    .eq("id", tenantId)
    .maybeSingle();

  if (error) {
    console.error("Error loading pricing record:", error.message);
    return null;
  }
  return data as PricingMatrix;
}

// Update parameters instantly via Row Level Security bounds
export async function updateTenantPricing(
  tenantId: string,
  updates: Partial<PricingMatrix>,
) {
  // FIXED: Invoke the factory function here as well
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contractors")
    .update(updates)
    .eq("id", tenantId);

  if (error) throw new Error(error.message);
  return data;
}
