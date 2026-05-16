import KitchenEstimator from "@/components/KitchenEstimator";

export const metadata = {
  title: "Bathroom Estimator | BUILDRAIL",
  description: "AI-powered bathroom remodel estimates",
};

export default function KitchenPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      {/* This renders the multi-upload gallery component 
        we created in the last step! 
      */}
      <KitchenEstimator />
    </main>
  );
}
