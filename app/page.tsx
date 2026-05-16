import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Code,
  ShieldCheck,
  Layers,
  Building2,
  Gauge,
  MousePointerClick,
} from "lucide-react";

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
      <header className="relative max-w-6xl mx-auto pt-24 pb-20 px-6 text-center space-y-8">
        {/* Micro Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-bold tracking-widest uppercase text-blue-400 shadow-xl shadow-blue-950/20 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          The New Standard For Home Services SaaS
        </div>

        {/* Master Value Proposition */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.05]">
          Stop chasing tire-kickers. <br />
          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Automate your quoting.
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Embed professional, white-label trade calculators directly onto your
          agency or contracting website. Capture hyper-qualified field estimates
          on autopilot.
        </p>

        {/* Action Callouts */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/estimator">
            <span className="group bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center gap-2 cursor-pointer text-md">
              Explore Live Demos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <a href="#pricing">
            <span className="px-8 py-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl font-bold text-slate-300 transition-all cursor-pointer text-md">
              View White-Label Pricing
            </span>
          </a>
        </div>
      </header>

      {/* --- REVENUE IMPLICATIONS SUITE --- */}
      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-8 space-y-4 backdrop-blur-sm">
            <div className="w-10 h-10 bg-blue-950 border border-blue-800/50 text-blue-400 rounded-xl flex items-center justify-center shadow-inner">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              2.5x Form Completion
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Homeowners demand immediate transparency. Providing instantaneous
              calculation feedback eliminates structural form drop-off.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-8 space-y-4 backdrop-blur-sm">
            <div className="w-10 h-10 bg-emerald-950 border border-emerald-800/50 text-emerald-400 rounded-xl flex items-center justify-center shadow-inner">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Zero Manual Quoting Time
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Filter baseline project inquiries straight to database caches
              automatically before ever scheduling an on-site property
              walkthrough.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-8 space-y-4 backdrop-blur-sm">
            <div className="w-10 h-10 bg-amber-950 border border-amber-800/50 text-amber-400 rounded-xl flex items-center justify-center shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Agency White-Labeling
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Package specialized trade widget code frameworks as an elite
              add-on. Charge clients $500–$1,000 per copy-paste installation.
            </p>
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
            <p className="text-slate-400 max-w-2xl mx-auto font-medium">
              Every interface adapts out-of-the-box. Fully functional
              calculation models map your target territory rules directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                t: "Roofing Specialist",
                d: "3D satellite topology processing with geometric pitch factoring calculations.",
                c: "border-l-blue-500",
              },
              {
                t: "General Contracting / Remodels",
                d: "Deep line-item tracking structures detailing raw margins, materials, and municipal testing overhead.",
                c: "border-l-emerald-500",
              },
              {
                t: "HVAC SEER Logic",
                d: "Tonnage requirement calculation models built with dynamic SEER operational energy savings analysis graphs.",
                c: "border-l-sky-500",
              },
              {
                t: "Electrical Load Analyzer",
                d: "NEC standard compliance tracking arrays built for service panel upgrade scoping and EV chargers.",
                c: "border-l-amber-500",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-6 bg-slate-900/30 border border-slate-900 rounded-2xl flex gap-4 border-l-4 ${item.c}`}
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-lg">{item.t}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INFRASTRUCTURE SNIPPET CODE BLOCK --- */}
      <section className="border-t border-slate-900 py-24 px-6 bg-slate-950">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-10 h-10 bg-slate-900 border border-slate-800 text-blue-400 rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              One Line of Code. <br />
              Infinite Architecture.
            </h2>
            <p className="text-slate-400 leading-relaxed font-medium">
              Deploying custom estimation capabilities to any client domain is
              simplified. Our ultra-lightweight frame engine hooks into external
              systems flawlessly without hurting local script speeds.
            </p>
            <ul className="space-y-3 font-semibold text-slate-300 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fully
                Responsive Cross-Device Breakpoints
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dynamic
                Contractor Parameter Multitenancy
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time
                Supabase Database Lead Squeeze Logging
              </li>
            </ul>
          </div>

          {/* Graphical Representation of Iframe Code block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-[11px] text-slate-300 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span className="text-slate-500 font-bold ml-2">
                embed-widget.html
              </span>
            </div>
            <pre className="text-blue-400 overflow-x-auto leading-relaxed">
              {`<iframe 
  src="https://buildrail.com/embed/clx9102-tenant/hvac" 
  id="buildrail-engine"
  style="width: 100%; min-height: 700px; border: none;"
  loading="lazy"
></iframe>`}
            </pre>
          </div>
        </div>
      </section>

      {/* --- PRICING MATRIX PLATFORM --- */}
      <section
        id="pricing"
        className="border-t border-slate-900 py-24 px-6 bg-slate-950/20"
      >
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              SaaS Scale Architecture Plans
            </h2>
            <p className="text-slate-400 font-medium">
              Whether managing an isolated local company or fueling a large
              digital software agency account framework.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
            {/* Tier 1: Pro Contractor */}
            <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-2xl space-y-6">
              <div>
                <h4 className="text-lg font-bold text-slate-300">
                  Contractor Pro
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Perfect for single trade operations accounts
                </p>
                <p className="text-4xl font-black text-white mt-4">
                  $149
                  <span className="text-sm text-slate-500 font-bold">/mo</span>
                </p>
              </div>
              <ul className="space-y-3 text-slate-400 text-xs font-semibold">
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-400" /> 1 Active Trade
                  Vertical Access
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-400" /> Unlimited Lead
                  Capture Storage
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-400" /> Standard Iframe
                  Embed Control
                </li>
              </ul>
              <Link href="/estimator">
                <span className="block w-full py-3 bg-slate-800 hover:bg-slate-700 font-bold text-center text-slate-200 rounded-xl transition-colors cursor-pointer text-sm">
                  Get Started
                </span>
              </Link>
            </div>

            {/* Tier 2: Enterprise Agency Enterprise */}
            <div className="bg-slate-900 border-2 border-blue-500 p-8 rounded-2xl space-y-6 relative shadow-xl shadow-blue-950/20">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full tracking-wider shadow-md">
                Agency Choice
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Agency Scale White-Label
                </h4>
                <p className="text-xs text-blue-400 font-semibold mt-1">
                  Built to upsell to client lists directly
                </p>
                <p className="text-4xl font-black text-white mt-4">
                  $499
                  <span className="text-sm text-slate-500 font-bold">/mo</span>
                </p>
              </div>
              <ul className="space-y-3 text-slate-300 text-xs font-semibold">
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-400" /> Access Across
                  All 5 Trade Calculators
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-400" /> Custom Hex Color
                  & CSS Style Injection
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-400" /> Custom
                  Contractor Multiplier Variable API Keys
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-400" /> Priority
                  Serverless Route Scaling
                </li>
              </ul>
              <Link href="/estimator">
                <span className="block w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold text-center text-white rounded-xl shadow-md transition-colors cursor-pointer text-sm">
                  Deploy Agency Framework Suite
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- MASTER FOOTER DISPLAY --- */}
      <footer className="border-t border-slate-900 py-12 px-6 text-center text-xs font-bold text-slate-600 tracking-wider bg-slate-950">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="uppercase">
            © {new Date().getFullYear()} BUILDRAIL Systems International. All
            Rights Reserved.
          </p>
          <div className="flex gap-6 text-slate-500 uppercase">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              Security Frameworks
            </span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              API Keys Docs
            </span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              SaaS Terms
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
