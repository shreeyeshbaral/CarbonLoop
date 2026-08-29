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
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset, resetPasswordWithOtp } = useAuth();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your registered university email.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await requestPasswordReset(email);
    setIsSubmitting(false);
    if (res.success && res.otp) {
      setStep(2);
      setSimulatedOtpNotice(`Verification Code: ${res.otp} (Demo OTP sent to ${email})`);
    } else {
      setErrorMessage(res.error || "Failed to generate recovery code");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword) {
      setErrorMessage("Please enter both the 6-digit code and your new password.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await resetPasswordWithOtp(email, otpCode, newPassword);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setErrorMessage(res.error || "Invalid verification code");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md rounded-3xl bg-surface border border-border/80 shadow-elevated p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-light border border-forest/30 flex items-center justify-center mx-auto mb-3 text-forest shadow-xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-ink">Reset Password</h1>
          <p className="text-xs text-ink-muted mt-1">
            {step === 1
              ? "Enter your university email to receive a verification OTP"
              : "Enter the 6-digit code and your new password"}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-light/80 border border-amber/30 text-amber text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {simulatedOtpNotice && (
          <div className="p-3.5 rounded-2xl bg-forest-light/90 border border-forest/30 text-forest text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{simulatedOtpNotice}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-forest-light/90 border border-forest/30 text-forest text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">University Email</label>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-forest hover:bg-forest-dark text-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              Send 6-Digit OTP Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">6-Digit Verification OTP</label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="583921"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-center font-mono text-lg tracking-widest font-bold text-ink"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              Confirm Password Reset
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-ink-muted hover:text-ink pt-1"
            >
              ← Re-enter Email Address
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-border text-center text-xs text-ink-muted">
          Remember your password?{" "}
          <Link href="/login" className="text-forest font-bold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
