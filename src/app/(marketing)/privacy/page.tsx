// app/privacy/page.tsx

export const metadata = {
  title: "Privacy Policy | BUILDRAIL",
  description:
    "Global data privacy protocols and consumer protection frameworks.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-slate-900 space-y-2">
      <div className="space-y-4 border-b border-slate-900 pb-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest">
          Last Updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-2 text-medium leading-relaxed font-medium">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. Architectural Data Collection
          </h2>
          <p>
            BUILDRAIL operates a multi-tenant embedded project estimation
            framework. We collect information directly from consumers on behalf
            of our platform tenants (licensed contractors and digital agencies).
            This data includes names, physical property deployment addresses,
            communication endpoints (email, phone), and uploaded spatial project
            photos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            2. Data Utilization & Processing Loops
          </h2>
          <p>
            Collected infrastructure metrics and contact profiles are
            exclusively utilized to generate localized project estimates and
            route high-intent leads to the authorized contractor tenant whose
            embed code generated the layout instance. BUILDRAIL never sells,
            brokers, or exposes consumer profile caches to external data
            networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            3. Spatial Image Storage & Deletion
          </h2>
          <p>
            Photos uploaded to our Vision AI processing matrix are securely held
            inside encrypted Supabase cloud storage buckets. These images are
            evaluated solely to extract job scoping attributes (e.g., cabinet
            counts, wall locations, roof parameters). Tenants retain systemic
            control over lead history logs and may trigger permanent asset
            deletion fields at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            4. Security Infrastructure
          </h2>
          <p>
            <b>Security Measures:</b> All data transfers across embedded iframes
            are protected via 256-bit SSL/TLS encryption tokens. Database
            records live behind isolated row-level security (RLS) layers inside
            our cloud database stack, preventing unauthorized cross-tenant
            profile visibility leaks.
          </p>
        </section>
        <section className="space-y-3">
          <h2
            id="security"
            className="text-xl font-bold text-white tracking-tight"
          >
            5. Infrastructure & Security Safeguards
          </h2>
          <p>
            BUILDRAIL protects your platform metrics and customer lead profiles
            using defense-in-depth engineering. All interaction sessions
            originating from embedded multi-tenant iframe containers are
            mandated over 256-bit Secure Socket Layer (SSL/TLS) encrypted
            transfer channels. Database records are strictly partitioned via
            PostgreSQL Row-Level Security (RLS) policies within our data
            architecture, preventing cross-tenant visibility leaks. Furthermore,
            structural property photographs are stored inside encrypted
            serverless cloud storage buckets with time-throttled access
            permissions, ensuring your proprietary pipeline remains secure
            against unauthorized interception vectors.
          </p>
        </section>
      </div>
    </main>
  );
}
