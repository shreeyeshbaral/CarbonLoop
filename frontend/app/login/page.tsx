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
  Smartphone,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEMO_PROFILES } from "@/context/RoleContext";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, verifyDeviceOtp, resendDeviceOtp, switchDemoRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification state for first-time device login
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await loginWithEmail(email, password);
    setIsSubmitting(false);

    if (res.requiresOtp && res.otp) {
      setRequiresOtp(true);
      setOtpNotice(`Verification Code: ${res.otp} (Sent to ${email})`);
    } else if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(res.error || "Login failed");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await verifyDeviceOtp(email, otpCode);
    setIsSubmitting(false);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(res.error || "Invalid verification code");
    }
  };

  const handleResend = async () => {
    const res = await resendDeviceOtp(email);
    if (res.success && res.otp) {
      setOtpNotice(`New Verification Code: ${res.otp} (Sent to ${email})`);
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
                <span className="font-bold text-forest block mb-0.5">✉️ Genuine Email Verification</span>
                Secure OTP device-level verification ensures verified departmental identity.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border text-[11px] text-ink-muted">
            ITER — Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {requiresOtp ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-left mb-4">
                <div className="w-10 h-10 rounded-2xl bg-forest-light border border-forest/30 flex items-center justify-center mb-3 text-forest">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-xl font-bold text-ink">Device Security Verification</h2>
                <p className="text-xs text-ink-muted mt-1">
                  First-time sign in on this device detected. We've sent a 6-digit confirmation code to:
                  <strong className="block text-ink font-semibold mt-0.5">{email}</strong>
                </p>
              </div>

              {otpNotice && (
                <div className="p-3.5 rounded-2xl bg-forest-light/90 border border-forest/30 text-forest text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{otpNotice}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-amber-light/80 border border-amber/30 text-amber text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="e.g. 583921"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-center font-mono text-xl tracking-widest font-bold text-ink"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-forest hover:bg-forest-dark text-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verify Email & Open Dashboard
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-forest font-semibold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRequiresOtp(false);
                      setErrorMessage(null);
                    }}
                    className="text-ink-muted hover:text-ink"
                  >
                    ← Re-enter Password
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-heading text-xl font-bold text-ink">Sign In to CarbonLoop</h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  Enter your email address (SOA university email or any valid email)
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-light/80 border border-amber/30 text-amber text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. director.assets@soa.ac.in or user@gmail.com"
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
                  ⚡ 1-Click Demo Profiles (For Testing & Presentation):
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
                Don't have an account?{" "}
                <Link href="/signup" className="text-forest font-bold hover:underline">
                  Create Account →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
