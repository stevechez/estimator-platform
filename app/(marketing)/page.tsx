import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  Camera,
  FileText,
  Smartphone,
  ShieldCheck,
  SlidersHorizontal,
  LayoutList,
} from "lucide-react";

export const metadata = {
  title: "BUILDRAIL | The AI Walkthrough Assistant for Contractors",
  description:
    "Record voice notes, capture photos, and generate organized estimate drafts automatically while walking the property.",
};

export default function GlobalLandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden font-sans">
      {/* Minimalist Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <header className="relative max-w-7xl mx-auto pt-32 pb-24 px-6 text-center">
        <div className="space-y-8 relative z-10">
          {/* Subtle Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-wide text-slate-300 backdrop-blur-md">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>Built for the field, not the desk.</span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tighter leading-[1.1] text-white max-w-4xl mx-auto">
              Walk the job. <br />
              <span className="bg-gradient-to-r from-slate-200 via-blue-200 to-slate-400 bg-clip-text text-transparent">
                Leave with a draft estimate.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
              Record voice notes, capture photos, and generate organized
              estimate drafts automatically while walking the property. Stop
              rewriting site notes at night.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <Link href="/signup">
              <span className="group inline-flex items-center gap-2 bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer">
                Start A Walkthrough
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link href="/demo">
              <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-slate-300 cursor-pointer">
                Watch Workflow
              </span>
            </Link>
          </div>

          {/* Abstract Hero Visual (Implies Mobile Workflow) */}
          <div className="mt-20 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10 h-full w-full" />
            <div className="relative rounded-2xl border border-white/10 bg-[#111] p-2 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-4">
              {/* Mobile Mockup representation */}
              <div className="flex-1 bg-black rounded-xl border border-white/5 p-6 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20" />
                <div className="flex items-center gap-3 text-blue-400">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    Recording walkthrough...
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-mono">
                  "Master bath needs a complete gut. We're keeping the plumbing
                  footprint but upgrading to a freestanding tub. Need 40 square
                  feet of large format tile..."
                </p>
                <div className="flex gap-2">
                  <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Output generation representation */}
              <div className="flex-1 bg-black rounded-xl border border-white/5 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <LayoutList className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">
                    Generated Scope
                  </span>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="h-6 w-3/4 bg-white/5 rounded-md" />
                  <div className="h-4 w-full bg-white/5 rounded-md" />
                  <div className="h-4 w-5/6 bg-white/5 rounded-md" />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                  <CheckCircle2 className="w-3 h-3" /> Scope Organized
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- PROBLEM SECTION --- */}
      <section className="relative max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Estimating starts with chaos.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* OLD WAY */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 md:p-10 transition-colors hover:bg-white/[0.04]">
            <div className="space-y-6">
              <div>
                <p className="text-slate-500 text-sm font-medium tracking-wide">
                  The Old Way
                </p>
                <h3 className="text-2xl font-semibold text-slate-200 mt-2">
                  Messy workflows & late nights.
                </h3>
              </div>

              <ul className="space-y-4 text-slate-400 text-sm">
                {[
                  "Scribbled paper notes getting lost in the truck",
                  "Photos scattered across your personal camera roll",
                  "Forgetting exact measurements once back at the desk",
                  "Rewriting everything manually into a proposal",
                  "Slow homeowner follow-up kills momentum",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BUILDRAIL */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-blue-400 text-sm font-medium tracking-wide">
                  With BUILDRAIL
                </p>
                <h3 className="text-2xl font-semibold text-white mt-2">
                  Organized before you leave the driveway.
                </h3>
              </div>

              <ul className="space-y-4 text-slate-300 text-sm">
                {[
                  "Voice notes automatically transcribed and cleaned up",
                  "Photos directly attached to specific scope items",
                  "AI organizes messy details into project rooms/phases",
                  "Estimate drafts generated instantly on-site",
                  "Proposals start forming while you're still talking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE WORKFLOW SECTION --- */}
      <section className="border-t border-white/5 bg-[#0d0d0d] py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Built around real contractor walkthroughs.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Software designed for what you already do onsite. No extra typing
              required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Walk The Property",
                desc: "Take photos and talk naturally while inspecting the project. Let the app capture it all.",
                icon: Mic,
              },
              {
                step: "02",
                title: "AI Structures The Scope",
                desc: "The system automatically organizes rooms, labor items, materials, measurements, and notes.",
                icon: LayoutList,
              },
              {
                step: "03",
                title: "Generate Draft Proposal",
                desc: "Leave the site with a professional estimate draft already started and formatted.",
                icon: FileText,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl relative group hover:bg-white/[0.04] transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                      Step {item.step}
                    </span>
                  </div>
                  <h4 className="font-medium text-white text-lg">
                    {item.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[
              {
                title: "Voice Walkthrough Capture",
                desc: "Natural speech transcription optimized specifically for contractor terminology and site visits.",
              },
              {
                title: "Photo-Linked Scope Notes",
                desc: "Attach images directly to rooms, tasks, and estimate items instead of digging through your camera roll.",
              },
              {
                title: "AI Scope Organization",
                desc: "Automatically turn rough walkthrough rambling into usable, structured estimate sections.",
              },
              {
                title: "Proposal Draft Generation",
                desc: "Generate clean homeowner-facing summaries and estimate drafts instantly.",
              },
              {
                title: "Mobile-First Workflow",
                desc: "Designed exclusively for phones in active jobsites, hands full—not for office desk typing.",
              },
              {
                title: "Fully Editable Estimates",
                desc: "You stay in complete control. AI assists with the heavy lifting, but you set the final price.",
              },
            ].map((feature) => (
              <div key={feature.title} className="space-y-3">
                <h4 className="text-slate-200 font-medium">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TARGET CUSTOMER & TRUST SECTION --- */}
      <section className="border-t border-white/5 py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
              Built for residential contractors.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Perfect for Remodelers, Kitchen & Bath teams, Small GCs, and
              Renovation Crews who spend too much time on site-visit admin.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-white font-medium">You Stay In Control</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400 pl-11">
                <li>• Fully editable pricing and outputs</li>
                <li>• AI-assisted, not AI-replaced</li>
                <li>• Review and tweak before sending</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-8 shadow-2xl relative">
            <div className="absolute top-4 right-4 text-slate-600">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-mono mb-6 uppercase tracking-wider">
              Estimate Draft Preview
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <p className="text-white font-medium">Kitchen Remodel</p>
                  <p className="text-slate-500 text-sm">Smith Residence</p>
                </div>
                <p className="text-slate-300 font-mono text-sm">
                  $45,200 <span className="text-slate-600">(Est)</span>
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Demo & Haul Away</span>
                  <span className="text-slate-500 font-mono">$2,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Custom Cabinetry</span>
                  <span className="text-slate-500 font-mono">$18,400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Countertops (Quartz)</span>
                  <span className="text-slate-500 font-mono">$6,200</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                <div className="h-8 flex-1 bg-white/5 rounded flex items-center justify-center text-xs text-slate-400">
                  Edit Scope
                </div>
                <div className="h-8 flex-1 bg-blue-500/10 text-blue-400 rounded flex items-center justify-center text-xs">
                  Export to PDF
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="border-t border-white/5 py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Lightweight software. Simple pricing.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Utility tools shouldn't require enterprise contracts. Pick the
              plan that fits your crew.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Tier 1: Solo */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col h-full hover:bg-white/[0.04] transition-colors">
              <div className="mb-8">
                <h4 className="text-lg font-medium text-slate-200">
                  Solo Contractor
                </h4>
                <p className="text-sm text-slate-500 mt-2">
                  Perfect for independent operators.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-white">$49</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-300 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-600" /> Unlimited
                  walkthrough captures
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-600" /> AI
                  estimate drafts
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-600" /> Proposal
                  exports
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-600" /> Full
                  mobile workflow
                </li>
              </ul>
              <div className="pt-8">
                <Link href="/signup">
                  <span className="block w-full py-3 bg-white/10 hover:bg-white/20 font-medium text-center text-white rounded-lg transition-colors cursor-pointer text-sm">
                    Start Free Trial
                  </span>
                </Link>
              </div>
            </div>

            {/* Tier 2: Team */}
            <div className="bg-[#111] border border-blue-500/30 p-8 rounded-2xl flex flex-col h-full relative shadow-[0_0_40px_-15px_rgba(37,99,235,0.15)]">
              <div className="mb-8">
                <h4 className="text-lg font-medium text-white">Team Plan</h4>
                <p className="text-sm text-slate-400 mt-2">
                  For growing crews and small agencies.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-white">
                    $149
                  </span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-300 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Everything
                  in Solo
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Up to 5
                  team members
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Shared
                  project workspace
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Team
                  pricing templates
                </li>
              </ul>
              <div className="pt-8">
                <Link href="/signup">
                  <span className="block w-full py-3 bg-white text-black hover:bg-slate-200 font-medium text-center rounded-lg transition-colors cursor-pointer text-sm">
                    Get Started
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Stop rewriting site notes at night.
          </h2>
          <p className="text-slate-400 text-lg">
            Turn your walkthrough conversations into organized estimate drafts
            automatically.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/signup">
              <span className="bg-white text-black hover:bg-slate-200 px-8 py-4 rounded-xl font-medium transition-all cursor-pointer">
                Start Free Trial
              </span>
            </Link>
            <Link href="/demo">
              <span className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-slate-300 cursor-pointer">
                Try Demo Walkthrough
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold tracking-wide text-slate-200">
              BUILDRAIL
            </p>
            <p className="text-xs text-slate-500 mt-1">
              AI walkthrough assistant for residential contractors.
            </p>
          </div>

          <div className="flex gap-6 text-sm text-slate-500">
            <a
              className="hover:text-slate-300 transition-colors"
              href="/privacy"
            >
              Privacy
            </a>
            <a className="hover:text-slate-300 transition-colors" href="/terms">
              Terms
            </a>
            <a
              className="hover:text-slate-300 transition-colors"
              href="/security"
            >
              Security
            </a>
            <a
              className="hover:text-slate-300 transition-colors"
              href="/contact"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
