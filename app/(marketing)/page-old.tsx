import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Zap, Code } from "lucide-react";

export const metadata = {
  title: "BUILDRAIL | AI Lead-Generation Suite for Elite Contractors",
  description:
    "Embed dynamic, high-ticket trade calculators natively on your website. Capture pre-qualified leads without lifting a finger.",
};

export default function GlobalLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Decorative Grid Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <header className="relative max-w-7xl mx-auto pt-28 pb-24 px-6 text-center">
        <div className="space-y-8">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-full text-xs font-bold tracking-widest uppercase text-blue-400 shadow-2xl shadow-blue-950/40 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Embedded Estimating Infrastructure
          </div>

          {/* Hero Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-white max-w-5xl mx-auto">
              <span>Instant Estimates. </span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent pb-2">
                Higher-Intent Leads.
              </span>
              <span>Faster Closes.</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
              BUILDRAIL embeds instant quoting tools directly into contractor
              websites so homeowners get transparent pricing immediately — while
              your team receives fully qualified, pre-scoped leads
              automatically.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/estimator">
              <span className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300 cursor-pointer text-lg">
                Launch Interactive Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <a href="#pricing">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all font-bold text-slate-300 cursor-pointer text-lg">
                View Pricing
              </span>
            </a>
          </div>

          {/* Social Proof */}
          <div className="pt-12 flex flex-wrap justify-center gap-6 md:gap-10 text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-600 font-bold">
            <span>Roofing</span>
            <span>HVAC</span>
            <span>Electrical</span>
            <span>Remodeling</span>
            <span>White-Label Agencies</span>
          </div>
        </div>
      </header>

      {/* --- BEFORE / AFTER SECTION --- */}
      <section
        id="features"
        className="relative max-w-6xl mx-auto px-6 pb-28 pt-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* OLD WAY */}
          <div className="rounded-3xl border border-red-900/40 bg-red-950/10 p-8 md:p-10 transition-colors hover:bg-red-950/20">
            <div className="space-y-6">
              <div>
                <p className="text-red-500 text-xs font-black uppercase tracking-[0.2em]">
                  Traditional Websites
                </p>
                <h3 className="text-3xl md:text-4xl font-black text-white mt-3 leading-tight">
                  Static forms. <br />
                  Low intent leads.
                </h3>
              </div>

              <ul className="space-y-4 text-slate-400 font-medium">
                {[
                  "Homeowners wait days for callbacks",
                  "High visitor bounce rates",
                  "Hours wasted on manual quoting",
                  "Unqualified leads flood the inbox",
                  "Price shoppers waste sales time",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500/80 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BUILDRAIL */}
          <div className="rounded-3xl border border-blue-500/30 bg-blue-900/10 p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(37,99,235,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">
                  BUILDRAIL Architecture
                </p>
                <h3 className="text-3xl md:text-4xl font-black text-white mt-3 leading-tight">
                  Automated estimating infrastructure.
                </h3>
              </div>

              <ul className="space-y-4 text-slate-300 font-medium">
                {[
                  "Instant homeowner pricing tiers",
                  "Pre-scoped project deliverables",
                  "Automated budget qualification",
                  "Dramatically higher close rates",
                  "24/7 lead generation engine",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE VERICAL TRADE MATRIX --- */}
      <section className="border-t border-slate-900 bg-slate-950/40 py-24 px-6 relative">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Five Trades. One Unified Pipeline.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg">
              Every interface adapts out-of-the-box. Fully functional
              calculation models map your target territory rules directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                t: "Roofing",
                d: "Instant roof measurements, slope calculations, and homeowner pricing using satellite property data.",
                c: "border-l-blue-500",
              },
              {
                t: "Remodeling",
                d: "Generate remodel estimates with labor, materials, permits, and contractor margins automatically included.",
                c: "border-l-emerald-500",
              },
              {
                t: "HVAC",
                d: "Calculate system sizing, SEER savings projections, and replacement pricing in real-time.",
                c: "border-l-sky-500",
              },
              {
                t: "Electrical",
                d: "Verify EV charger panel capacity and instantly scope service upgrades before dispatching technicians.",
                c: "border-l-amber-500",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-8 bg-slate-900/30 border border-slate-900 rounded-2xl flex gap-4 border-l-4 ${item.c} hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/50 transition-all duration-300`}
              >
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xl">{item.t}</h4>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INFRASTRUCTURE SNIPPET CODE BLOCK --- */}
      <section className="border-t border-slate-900 py-24 px-6 bg-slate-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 text-blue-400 rounded-xl flex items-center justify-center shadow-inner">
              <Code className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Embedded Estimating Infrastructure.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Deploying custom estimation capabilities to any client domain is
              simplified. Our ultra-lightweight frame engine hooks into external
              systems flawlessly without hurting local script speeds.
            </p>
            <ul className="space-y-4 font-semibold text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Fully
                Responsive Cross-Device Breakpoints
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Dynamic
                Contractor Parameter Multitenancy
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Real-time
                Supabase Database Squeeze Logging
              </li>
            </ul>
          </div>

          {/* Graphical Representation of Iframe Code block */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-xs md:text-sm text-slate-300 space-y-4 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl pointer-events-none" />
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-4">
              <div className="w-3 h-3 bg-red-500/80 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500/80 rounded-full" />
              <div className="w-3 h-3 bg-green-500/80 rounded-full" />
              <span className="text-slate-500 font-bold ml-3 tracking-wide">
                embed-widget.html
              </span>
            </div>
            <pre className="text-blue-400 overflow-x-auto leading-loose pt-2">
              {`<iframe 
  src="https://buildrail.com/embed/clx9102/hvac" 
  id="buildrail-engine"
  style="width: 100%; min-height: 700px; border: none;"
  loading="lazy"
></iframe>`}
            </pre>
          </div>
        </div>
      </section>

      {/* --- ENTERPRISE VALUE SECTION --- */}
      <section className="border-t border-slate-900 py-28 px-6 bg-slate-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <p className="text-blue-400 text-xs uppercase tracking-[0.2em] font-black">
              Why BUILDRAIL Wins
            </p>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              Built For Revenue,
              <span className="block text-slate-500 mt-2">
                Not Generic Form Fills.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              {
                title: "Instant Pricing",
                text: "Homeowners receive immediate project clarity instead of waiting days for callbacks.",
              },
              {
                title: "Higher Intent Leads",
                text: "Every submission arrives pre-scoped with pricing expectations already established.",
              },
              {
                title: "Faster Sales Cycles",
                text: "Contractors spend less time qualifying leads and more time closing profitable jobs.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-900 bg-slate-900/30 p-8 hover:bg-slate-900/50 transition-colors"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING MATRIX PLATFORM --- */}
      <section
        id="pricing"
        className="border-t border-slate-900 py-28 px-6 bg-slate-950"
      >
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              Pricing Built Around Revenue.
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">
              BUILDRAIL is designed to pay for itself with a single closed
              project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
            {/* Tier 1: Pro Contractor */}
            <div className="bg-slate-900/40 border border-slate-900 p-8 md:p-10 rounded-3xl space-y-8 hover:border-slate-800 transition-colors">
              <div>
                <h4 className="text-xl font-bold text-slate-300">
                  Growth Contractor
                </h4>
                <p className="text-sm text-slate-500 font-medium mt-2">
                  Perfect for single trade operations accounts.
                </p>
                <p className="text-5xl font-black text-white mt-6">
                  $149
                  <span className="text-lg text-slate-500 font-bold">/mo</span>
                </p>
              </div>
              <ul className="space-y-4 text-slate-300 font-medium">
                <li className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0" /> 1 Active
                  Trade Vertical
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0" /> Unlimited
                  Lead Storage
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0" /> Standard
                  Iframe Embed
                </li>
              </ul>
              <div className="pt-4 space-y-3 text-center">
                <Link href="/estimator">
                  <span className="block w-full py-4 bg-slate-800 hover:bg-slate-700 font-bold text-center text-slate-200 rounded-xl transition-colors cursor-pointer">
                    Get Started
                  </span>
                </Link>
                <p className="text-xs text-slate-500 font-semibold mt-2">
                  Typically pays for itself with one qualified lead.
                </p>
              </div>
            </div>

            {/* Tier 2: Enterprise Agency Enterprise */}
            <div className="bg-slate-900 border-2 border-blue-500 p-8 md:p-10 rounded-3xl space-y-8 relative shadow-[0_0_40px_-10px_rgba(37,99,235,0.2)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-full tracking-wider shadow-lg">
                Agency Choice
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  Agency Infrastructure
                </h4>
                <p className="text-sm text-blue-400 font-semibold mt-2">
                  Built to upsell to client lists directly.
                </p>
                <p className="text-5xl font-black text-white mt-6">
                  $499
                  <span className="text-lg text-slate-500 font-bold">/mo</span>
                </p>
              </div>
              <ul className="space-y-4 text-slate-300 font-medium">
                <li className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{" "}
                  Access to All 5 Trade Calculators
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{" "}
                  Custom Hex Color & CSS Styles
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{" "}
                  Contractor Multiplier Variable Keys
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{" "}
                  Priority Serverless Route Scaling
                </li>
              </ul>
              <div className="pt-4 space-y-3 text-center">
                <Link href="/estimator">
                  <span className="block w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold text-center text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
                    Deploy Agency Framework
                  </span>
                </Link>
                <p className="text-xs text-slate-500 font-semibold mt-2">
                  Typically pays for itself with one qualified lead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MASTER FOOTER DISPLAY --- */}
      <footer className="border-t border-slate-900 py-12 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-black tracking-widest text-white uppercase">
              BUILDRAIL
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Embedded estimating infrastructure for modern contractors.
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-8 text-sm font-semibold text-slate-500">
            <a className="hover:text-white transition-colors" href="/privacy">
              Privacy
            </a>
            <a className="hover:text-white transition-colors" href="/terms">
              Terms
            </a>
            <a
              className="hover:text-white transition-colors"
              href="/privacy/#security"
            >
              Security
            </a>
            {/* <a className="hover:text-white transition-colors" href="#">
              API Docs
            </a> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
