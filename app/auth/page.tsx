"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function AuthPortal() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // 1. Sign up the user inside Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          },
        );

        if (authError) throw authError;

        if (authData?.user) {
          // 2. Automatically seed their row inside your contractors database relation
          const { error: dbError } = await supabase.from("contractors").insert([
            {
              tenant_id: authData.user.id,
              company_name: companyName,
              pricing_multiplier: 1.0,
              roofing_base_rate: 18000,
              kitchen_base_rate: 45000,
              bathroom_base_rate: 16000,
              hvac_base_rate: 12000,
              garage_base_rate: 40000,
              electrical_base_rate: 4500,
              plumbing_base_rate: 3500,
            },
          ]);

          if (dbError) throw dbError;
        }
      } else {
        // Standard Sign In Execution
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      // Route directly to their live database command center
      router.push("/dashboard/leads");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An authentication exception occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 bg-blue-950 border border-blue-900/40 rounded-xl items-center justify-center text-blue-400 mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isSignUp
              ? "Create your BUILDRAIL Engine"
              : "Sign In to Command Center"}
          </h1>
          <p className="text-xs text-slate-500">
            {isSignUp
              ? "Deploy instant algorithmic estimation widgets."
              : "Access your active revenue pipelines."}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 text-xs font-bold p-3.5 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Company Name
              </label>
              <input
                required
                type="text"
                placeholder="ProBuild Contractors"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <input
              required
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Password
            </label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2 shadow-lg shadow-blue-600/10"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="text-sm">
                  {isSignUp ? "Get Started" : "Sign In"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/60">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
            }}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Need an engine? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}
