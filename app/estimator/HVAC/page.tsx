import HvacEstimator from "@/components/HvacEstimator";

export const metadata = {
  title: "HVAC Contractor Estimator | BUILDRAIL",
  description:
    "Generate transparent project line-item cost breakdowns instantly.",
};

export default function HvacPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <HvacEstimator />
    </main>
  );
}
