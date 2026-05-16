// app/estimator/[slug]/page.tsx
import { getContractorPricing } from "@/lib/supabase/contractors";
import EstimatorClient from "@/components/EstimatorClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EstimatorPage({ params }: PageProps) {
  // 1. Unwrap the dynamic route parameter promise safely
  const { slug } = await params;

  // 2. Fetch the target contractor based on their specific slug ID row
  const contractor = await getContractorPricing(slug);

  // 3. Fallback check layout safety guard
  if (!contractor) {
    return (
      <div className="p-12 text-center font-bold text-slate-700">
        Contractor workspace profile not found.
      </div>
    );
  }

  // 4. Pass data cleanly down to your standard client components
  return (
    <EstimatorClient
      contractorName={contractor.name}
      pricing={contractor.pricing_templates?.[0] || {}}
    />
  );
}
