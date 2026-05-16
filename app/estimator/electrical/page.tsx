import ElectricalEstimator from "@/components/ElectricalEstimator";
import GcEstimator from "@/components/ElectricalEstimator";

export const metadata = {
  title: "Electrical Contractor Estimator | BUILDRAIL",
  description:
    "Generate transparent project line-item cost breakdowns instantly.",
};

export default function ElectricalPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <ElectricalEstimator />
    </main>
  );
}
