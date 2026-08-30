"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  Building2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { UserRole } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail, verifyDeviceOtp, resendDeviceOtp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentCode, setDepartmentCode] = useState("CSE");
  const [role, setRole] = useState<UserRole>("DEPARTMENT_MANAGER");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Verification Step
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage("Please complete all registration fields.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Please accept the resource sharing guidelines.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const selectedDeptObj = MOCK_DEPARTMENTS.find((d) => d.code === departmentCode);

    const res = await signUpWithEmail({
      name,
      email,
      password,
      role,
      departmentCode,
      departmentName: selectedDeptObj?.name || `${departmentCode} Faculty`,
    });

    setIsSubmitting(false);
    if (res.requiresOtp && res.otp) {
      setRequiresOtp(true);
      setOtpNotice(`Verification Code: ${res.otp} (Sent to ${email})`);
    } else if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(res.error || "Registration failed");
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
        {/* Left Info Panel */}
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
              Join the Circular Loop
            </h1>
            <p className="text-xs text-ink-muted mt-1">
              Connect your faculty lab, department, or research group to the circular asset network.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-ink-muted">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <span>Instant access to campus-wide surplus hardware inventory</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-ink-muted">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <span>Autonomous matching for department procurement shortages</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-ink-muted">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <span>Genuine email verification with cryptographic session tokens</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border text-[11px] text-ink-muted">
            Siksha 'O' Anusandhan Deemed to be University · Bhubaneswar
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {requiresOtp ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-left mb-4">
                <div className="w-10 h-10 rounded-2xl bg-forest-light border border-forest/30 flex items-center justify-center mb-3 text-forest">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-xl font-bold text-ink">Confirm Genuine Email</h2>
                <p className="text-xs text-ink-muted mt-1">
                  We've sent a 6-digit confirmation OTP to your registered address:
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
                    ← Edit Registration
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-heading text-xl font-bold text-ink">Create University Account</h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  Register with your institutional or official email address
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-light/80 border border-amber/30 text-amber text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Prof. Arvind Mohapatra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Email Address (SOA or Any Email)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="arvind.m@iter.soa.ac.in or arvind@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Faculty Department</label>
                    <select
                      value={departmentCode}
                      onChange={(e) => setDepartmentCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                    >
                      {MOCK_DEPARTMENTS.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Campus Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink font-semibold text-forest"
                    >
                      <option value="DEPARTMENT_MANAGER">Department Manager / Lab Head</option>
                      <option value="REQUESTER">Faculty / Research Fellow</option>
                      <option value="IT_OFFICER">IT Security Officer (NIST 800-88)</option>
                      <option value="ADMIN">University Admin / Director</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
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

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest border-border"
                  />
                  <label htmlFor="terms" className="text-xs text-ink-muted">
                    I agree to the university asset redistribution & circular logistics charter.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-forest hover:bg-forest-dark text-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Register & Verify Email via OTP
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-ink-muted">
                Already have an account?{" "}
                <Link href="/login" className="text-forest font-bold hover:underline">
                  Sign In →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
