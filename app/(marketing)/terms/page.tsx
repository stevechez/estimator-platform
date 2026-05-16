// app/terms/page.tsx

export const metadata = {
  title: "Terms of Service | BUILDRAIL",
  description:
    "Platform subscription framework regulations and white-label layout licensing.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-slate-300 space-y-12">
      <div className="space-y-4 border-b border-slate-900 pb-8">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest">
          Effective Date:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed font-medium">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. License Allocation & Embed Restrictions
          </h2>
          <p>
            BUILDRAIL grants subscription accounts a non-exclusive, revocable
            right to render our proprietary code engines inside responsive
            iframe containers across authorized client domains. Reverse
            engineering script loops, scraping API endpoints, or manipulating
            mathematical multipliers outside the provided user controls is
            strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            2. Accuracy of Mathematical Projections
          </h2>
          <p>
            BUILDRAIL tools use algorithmic logic models to compute material
            averages and labor costs based on user configurations. All generated
            figures are **estimates only** and do not represent binding
            structural contracts. BUILDRAIL holds zero liability for pricing
            variances, on-site measurement errors, or contractual disputes
            occurring between contractors and consumers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            3. White-Label Billing Architecture
          </h2>
          <p>
            Agency scale subscriptions are billed on a recurring monthly cycle.
            Failure to settle account invoices triggers automatic embedding
            validation lockouts. If an account lapses, your active website
            widgets will display a graceful maintenance screen until billing
            parameters are successfully re-established.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            4. System Availability & Fair Use Policy
          </h2>
          <p>
            While our serverless infrastructure is optimized for continuous
            uptime scales, we provide no explicit guarantees for network speed
            drops caused by external API failures or upstream hosting network
            degradation. We monitor submission traffic; extreme bandwidth abuse
            or scraping patterns will trigger programmatic account suspension
            blocks.
          </p>
        </section>
      </div>
    </main>
  );
}
