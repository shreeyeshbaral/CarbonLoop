"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEMO_PROFILES } from "@/context/RoleContext";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, switchDemoRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your university email.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await loginWithEmail(email, password);
    setIsSubmitting(false);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(res.error || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(res.error || "Google login failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-surface border border-border/80 shadow-elevated overflow-hidden">
        {/* Left Side: Brand & Campus Value Strip */}
        <div className="lg:col-span-5 bg-canvas/90 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-forest flex items-center justify-center p-2 shadow-md mb-6">
              <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                <path d="M 20 26 A 14 14 0 0 1 44 26" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" />
                <polyline points="38 20 44 26 38 32" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 44 38 A 14 14 0 0 1 20 38" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" />
                <polyline points="26 44 20 38 26 32" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 28 34 C 28 27, 36 26, 37 26 C 37 34, 30 35, 28 34 Z" fill="#FFFDF8" />
              </svg>
            </div>

            <h1 className="font-heading text-2xl font-bold text-ink">
              CARBON<span className="text-forest">LOOP</span>
            </h1>
            <p className="text-xs text-ink-muted mt-1">
              Institutional Circular Asset Management & Reverse Logistics
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-3.5 rounded-2xl bg-surface border border-border/70 text-xs text-ink-muted">
                <span className="font-bold text-forest block mb-0.5">💰 Avoided Procurement</span>
                Save university capital by matching idle equipment across faculties.
              </div>
              <div className="p-3.5 rounded-2xl bg-surface border border-border/70 text-xs text-ink-muted">
                <span className="font-bold text-forest block mb-0.5">🔒 NIST 800-88 Data Wipe</span>
                Cryptographic drive sanitization signed by IT Security before transfer.
              </div>
              <div className="p-3.5 rounded-2xl bg-surface border border-border/70 text-xs text-ink-muted">
                <span className="font-bold text-forest block mb-0.5">🚚 OR-Tools Van Routing</span>
                41.2% lower fuel mileage across ITER academic blocks.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border text-[11px] text-ink-muted">
            ITER — Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="font-heading text-xl font-bold text-ink">Welcome Back</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Sign in with your university credentials or Google account
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-light/80 border border-amber/30 text-amber text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-surface border border-border hover:bg-canvas text-ink font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-xs mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with SOA Google Workspace
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-[11px] font-semibold text-ink-muted uppercase">or university email</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="director.assets@soa.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-ink">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-forest hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-ink-muted hover:text-ink"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-forest hover:bg-forest-dark text-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <KeyRound className="w-4 h-4" />
              Sign In to CarbonLoop
            </button>
          </form>

          {/* Quick Demo Buttons for Presentation */}
          <div className="mt-6 pt-4 border-t border-border">
            <span className="text-[10px] uppercase font-bold text-ink-muted block mb-2">
              ⚡ 1-Click Demo Profiles (For Presentation):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(DEMO_PROFILES) as UserRole[]).map((r) => {
                const p = DEMO_PROFILES[r];
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      switchDemoRole(r);
                      router.push("/dashboard");
                    }}
                    className="p-2 rounded-xl bg-canvas border border-border/80 hover:border-forest/50 text-left transition-all text-xs flex items-center gap-2"
                  >
                    <span className="w-6 h-6 rounded-lg bg-forest text-surface font-bold text-[10px] flex items-center justify-center shrink-0">
                      {p.avatarInitials}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-ink text-[11px] truncate">{p.name}</div>
                      <div className="text-[9px] text-forest font-semibold">{r}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-ink-muted">
            Don't have an institutional account?{" "}
            <Link href="/signup" className="text-forest font-bold hover:underline">
              Create Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
