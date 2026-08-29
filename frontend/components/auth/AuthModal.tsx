"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { UserRole } from "@/types";
import { DEMO_PROFILES } from "@/context/RoleContext";

export function AuthModal() {
  const {
    authModalOpen,
    authModalTab,
    closeAuthModal,
    setAuthModalTab,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    requestPasswordReset,
    resetPasswordWithOtp,
    switchDemoRole,
  } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("DEPARTMENT_MANAGER");
  const [signupDept, setSignupDept] = useState("CSE");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpStep, setOtpStep] = useState(1);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setErrorMessage("Please enter your university email address.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await loginWithEmail(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || "Login failed");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      setErrorMessage("Please fill in all required registration fields.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    const selectedDeptObj = MOCK_DEPARTMENTS.find((d) => d.code === signupDept);

    const res = await signUpWithEmail({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
      departmentCode: signupDept,
      departmentName: selectedDeptObj?.name || `${signupDept} Faculty`,
    });

    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || "Registration failed");
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || "Google authentication failed");
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMessage("Please enter your registered university email.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await requestPasswordReset(forgotEmail);
    setIsSubmitting(false);
    if (res.success && res.otp) {
      setOtpStep(2);
      setSimulatedOtpNotice(`Verification Code: ${res.otp} (Demo OTP sent to ${forgotEmail})`);
    } else {
      setErrorMessage(res.error || "Could not generate reset code");
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword) {
      setErrorMessage("Please enter both the 6-digit code and your new password.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await resetPasswordWithOtp(forgotEmail, otpCode, newPassword);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMessage("Password reset successfully! You can now log in.");
      setTimeout(() => {
        setAuthModalTab("login");
        setOtpStep(1);
        setSuccessMessage(null);
        setSimulatedOtpNotice(null);
      }, 1500);
    } else {
      setErrorMessage(res.error || "Invalid verification code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-border/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="p-5 sm:p-6 pb-4 bg-canvas/80 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center p-1.5 shadow-md shrink-0">
              <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                <path d="M 20 26 A 14 14 0 0 1 44 26" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" />
                <polyline points="38 20 44 26 38 32" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 44 38 A 14 14 0 0 1 20 38" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" />
                <polyline points="26 44 20 38 26 32" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 28 34 C 28 27, 36 26, 37 26 C 37 34, 30 35, 28 34 Z" fill="#FFFDF8" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">
                CARBON<span className="text-forest">LOOP</span> Auth Portal
              </h2>
              <p className="text-xs text-ink-muted">ITER, Siksha 'O' Anusandhan University</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border bg-surface px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setAuthModalTab("login");
              setErrorMessage(null);
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              authModalTab === "login"
                ? "border-forest text-forest"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthModalTab("signup");
              setErrorMessage(null);
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              authModalTab === "signup"
                ? "border-forest text-forest"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setAuthModalTab("forgot");
              setErrorMessage(null);
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              authModalTab === "forgot"
                ? "border-forest text-forest"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-amber-light/80 border border-amber/30 text-amber text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-forest-light/80 border border-forest/30 text-forest text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN TAB */}
          {authModalTab === "login" && (
            <div className="space-y-4">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-2xl bg-surface border border-border hover:bg-canvas text-ink font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs"
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

              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-[11px] font-semibold text-ink-muted uppercase">or institutional email</span>
                <div className="h-px bg-border flex-1"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">University Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. director.assets@soa.ac.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-ink">Password</label>
                    <button
                      type="button"
                      onClick={() => setAuthModalTab("forgot")}
                      className="text-[11px] font-semibold text-forest hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-ink-muted hover:text-ink"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-forest-dark text-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <KeyRound className="w-4 h-4" />
                  Sign In to CarbonLoop
                </button>
              </form>

              {/* Quick Demo Sign In Cards */}
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <span className="text-[10px] uppercase font-bold text-ink-muted block">
                  ⚡ 1-Click Demo Profiles (For Judges & Testing):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(DEMO_PROFILES) as UserRole[]).map((r) => {
                    const p = DEMO_PROFILES[r];
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => switchDemoRole(r)}
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
            </div>
          )}

          {/* 2. SIGN UP TAB */}
          {authModalTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">Full Name & Title</label>
                <div className="relative">
                  <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Arvind Mohapatra"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">University Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. arvind.m@iter.soa.ac.in"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Faculty Department</label>
                  <select
                    value={signupDept}
                    onChange={(e) => setSignupDept(e.target.value)}
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
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
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
                <label className="text-xs font-bold text-ink block mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 8 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-ink-muted hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-canvas border border-border/80 text-[11px] text-ink-muted flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <span>
                  Accounts registered with <strong className="text-ink">@soa.ac.in</strong> are automatically approved for departmental surplus requisitions and inter-block custody transfers.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-forest-dark text-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Register Institutional Account
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD TAB */}
          {authModalTab === "forgot" && (
            <div className="space-y-4">
              {simulatedOtpNotice && (
                <div className="p-3 rounded-2xl bg-forest-light/90 border border-forest/30 text-forest text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{simulatedOtpNotice}</span>
                </div>
              )}

              {otpStep === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-3">
                  <p className="text-xs text-ink-muted">
                    Enter your university email address. We will send a 6-digit verification code to reset your account password.
                  </p>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">Registered University Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. director.assets@soa.ac.in"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-forest-dark text-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    Send 6-Digit OTP Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmReset} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">6-Digit Verification OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 583921 or 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-center font-mono text-base tracking-widest font-bold text-ink"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter new secure password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-canvas border border-border focus:border-forest focus:outline-none text-xs text-ink"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-ink-muted hover:text-ink"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-forest-dark text-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    Confirm & Update Password
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
