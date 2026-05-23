// lib/supabase/contractors.ts
import { createClient } from "@supabase/supabase-js";

// We use the standard client here. Because this data is public ToF data,
// the anon key is perfectly safe to use for fetching.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getContractorPricing(slug: string) {
  const { data, error } = await supabase
    .from("organizations")
    .select(
      `
      id,
      name,
      pricing_templates (
        standard_asphalt_rate,
        architectural_rate,
        metal_rate,
        steep_surcharge_percent,
        extreme_surcharge_percent
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) {
    // Extract explicit details instead of logging the un-serialized object
    console.error(
      "Error fetching contractor:",
      error.message,
      error.details,
      error.hint,
    );
    return null;
  }
  return data;
}
