import { createClient } from "@/lib/supabase/client";

export async function getContractorPricing(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select(`
      id,
      name,
      pricing_templates (
        standard_asphalt_rate,
        architectural_rate,
        metal_rate,
        steep_surcharge_percent,
        extreme_surcharge_percent
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}
