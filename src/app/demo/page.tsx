// app/demo/page.tsx
import EstimatorHub from "../estimator/page";

export const metadata = {
  title: "Interactive Sandbox Demo | BUILDRAIL",
  description: "Test drive our 5-trade real-time estimation infrastructure.",
};

export default function DemoPage() {
  // Re-uses your component. It will read the "/demo" path name and configure itself automatically!
  return <EstimatorHub />;
}
