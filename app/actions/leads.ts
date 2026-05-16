"use server";

import { createClient } from "@supabase/supabase-js";

// Use the Service Role key for secure backend insertions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function captureLead(leadData: {
  tenant_id: string;
  project_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  ai_specs: any;
}) {
  try {
    const { data, error } = await supabase
      .from("leads")
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, lead: data };
  } catch (error: any) {
    console.error("Lead Capture Error:", error);
    return { success: false, error: error.message };
  }
}
