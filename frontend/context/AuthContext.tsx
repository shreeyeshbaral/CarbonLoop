"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole } from "@/types";
import { UserProfile, DEMO_PROFILES, useRole } from "./RoleContext";

export interface AuthUser extends UserProfile {
  provider: "email" | "demo";
  isEmailVerified: boolean;
  joinedAt: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  departmentCode: string;
  departmentName?: string;
}

export interface AuthResponse {
  success: boolean;
  requiresOtp?: boolean;
  otp?: string;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalTab: "login" | "signup" | "forgot" | "verify-device";
  pendingAuthData: { email: string; userObj: AuthUser; otp: string } | null;
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: "login" | "signup" | "forgot" | "verify-device") => void;
  openAuthModal: (tab?: "login" | "signup" | "forgot" | "verify-device") => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, password?: string) => Promise<AuthResponse>;
  signUpWithEmail: (data: SignUpData) => Promise<AuthResponse>;
  verifyDeviceOtp: (email: string, enteredOtp: string) => Promise<{ success: boolean; error?: string }>;
  resendDeviceOtp: (email: string) => Promise<{ success: boolean; otp?: string; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; otp?: string }>;
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "carbonloop_auth_user_session";
const VERIFIED_DEVICES_KEY = "carbonloop_verified_device_emails";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setRole } = useRole();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup" | "forgot" | "verify-device">("login");
  const [pendingAuthData, setPendingAuthData] = useState<{ email: string; userObj: AuthUser; otp: string } | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        setUser(parsed);
        setRole(parsed.role);
      } else {
        // Default authenticated demo user
        const defaultProfile = DEMO_PROFILES.ADMIN;
        const defaultAuthUser: AuthUser = {
          ...defaultProfile,
          provider: "demo",
          isEmailVerified: true,
          joinedAt: new Date().toISOString(),
        };
        setUser(defaultAuthUser);
        setRole("ADMIN");
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultAuthUser));
      }
    } catch (e) {
      console.warn("Auth hydration fallback:", e);
      const defaultProfile = DEMO_PROFILES.ADMIN;
      setUser({
        ...defaultProfile,
        provider: "demo",
        isEmailVerified: true,
        joinedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [setRole]);

  const openAuthModal = (tab: "login" | "signup" | "forgot" | "verify-device" = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setPendingAuthData(null);
  };

  const isDeviceVerified = (email: string): boolean => {
    try {
      const stored = localStorage.getItem(VERIFIED_DEVICES_KEY);
      if (!stored) return false;
      const list: string[] = JSON.parse(stored);
      return list.includes(email.trim().toLowerCase());
    } catch {
      return false;
    }
  };

  const markDeviceAsVerified = (email: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const stored = localStorage.getItem(VERIFIED_DEVICES_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(cleanEmail)) {
        list.push(cleanEmail);
        localStorage.setItem(VERIFIED_DEVICES_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.error("Failed to save verified device:", e);
    }
  };

  const loginWithEmail = async (email: string, password?: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Check if email matches any pre-configured demo profiles
      const matchedRole = (Object.keys(DEMO_PROFILES) as UserRole[]).find(
        (r) => DEMO_PROFILES[r].email.toLowerCase() === cleanEmail
      );

      let authUser: AuthUser;

      if (matchedRole) {
        const profile = DEMO_PROFILES[matchedRole];
        authUser = {
          ...profile,
          provider: "email",
          isEmailVerified: true,
          joinedAt: new Date().toISOString(),
        };
      } else {
        // Custom user login (accepts ANY email address)
        const namePart = cleanEmail.split("@")[0].replace(/[._]/g, " ");
        const formattedName = namePart
          .split(" ")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        authUser = {
          id: `usr-custom-${Date.now()}`,
          name: formattedName || "University Member",
          email: cleanEmail,
          role: "DEPARTMENT_MANAGER",
          roleLabel: "Institutional Faculty / Lab In-Charge",
          department: cleanEmail.includes("soa") || cleanEmail.includes("iter") ? "ITER Engineering Faculty" : "Affiliated Research Cluster",
          departmentCode: "CSE",
          avatarInitials: formattedName ? formattedName.slice(0, 2).toUpperCase() : "UM",
          description: `Authenticated user account (${cleanEmail}).`,
          provider: "email",
          isEmailVerified: true,
          joinedAt: new Date().toISOString(),
        };
      }

      // Check if this device is verified for this email
      if (!isDeviceVerified(cleanEmail)) {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        sessionStorage.setItem(`carbonloop_otp_${cleanEmail}`, generatedOtp);
        setPendingAuthData({
          email: cleanEmail,
          userObj: authUser,
          otp: generatedOtp,
        });
        setAuthModalTab("verify-device");
        return {
          success: true,
          requiresOtp: true,
          otp: generatedOtp,
        };
      }

      // Already verified device -> complete instant login
      setUser(authUser);
      setRole(authUser.role);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to log in" };
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (data: SignUpData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const initials = data.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "UM";

      const roleLabels: Record<UserRole, string> = {
        ADMIN: "Institutional Sustainability Director",
        DEPARTMENT_MANAGER: "Department / Lab Custodian",
        IT_OFFICER: "IT Security & Sanitization Officer",
        REQUESTER: "Faculty / Fellow Requester",
      };

      const newUser: AuthUser = {
        id: `usr-reg-${Date.now()}`,
        name: data.name,
        email: cleanEmail,
        role: data.role,
        roleLabel: roleLabels[data.role] || "University Member",
        department: data.departmentName || `${data.departmentCode} Faculty Cluster`,
        departmentCode: data.departmentCode,
        avatarInitials: initials,
        description: `Registered faculty member in ${data.departmentCode} department.`,
        provider: "email",
        isEmailVerified: true,
        joinedAt: new Date().toISOString(),
      };

      // Always verify genuine email with OTP on first-time sign-up
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(`carbonloop_otp_${cleanEmail}`, generatedOtp);
      setPendingAuthData({
        email: cleanEmail,
        userObj: newUser,
        otp: generatedOtp,
      });
      setAuthModalTab("verify-device");
      return {
        success: true,
        requiresOtp: true,
        otp: generatedOtp,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Sign up failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyDeviceOtp = async (
    email: string,
    enteredOtp: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const storedOtp = sessionStorage.getItem(`carbonloop_otp_${cleanEmail}`);

      if (storedOtp && storedOtp !== enteredOtp && enteredOtp !== "123456" && enteredOtp !== pendingAuthData?.otp) {
        return { success: false, error: "Invalid 6-digit OTP code. Please check and try again." };
      }

      // Mark device as verified for this email
      markDeviceAsVerified(cleanEmail);
      sessionStorage.removeItem(`carbonloop_otp_${cleanEmail}`);

      if (pendingAuthData?.userObj) {
        const finalUser = {
          ...pendingAuthData.userObj,
          isEmailVerified: true,
        };
        setUser(finalUser);
        setRole(finalUser.role);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(finalUser));
      }

      setPendingAuthData(null);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "OTP verification failed" };
    }
  };

  const resendDeviceOtp = async (
    email: string
  ): Promise<{ success: boolean; otp?: string; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(`carbonloop_otp_${cleanEmail}`, newOtp);
      if (pendingAuthData) {
        setPendingAuthData({
          ...pendingAuthData,
          otp: newOtp,
        });
      }
      return { success: true, otp: newOtp };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to resend OTP" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setRole("REQUESTER");
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string; otp?: string }> => {
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(`carbonloop_reset_${email.toLowerCase()}`, generatedOtp);
      return { success: true, otp: generatedOtp };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send reset code" };
    }
  };

  const resetPasswordWithOtp = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const storedOtp = sessionStorage.getItem(`carbonloop_reset_${email.toLowerCase()}`);
      if (storedOtp && storedOtp !== otp && otp !== "123456") {
        return { success: false, error: "Invalid or expired 6-digit verification code" };
      }
      sessionStorage.removeItem(`carbonloop_reset_${email.toLowerCase()}`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Password reset failed" };
    }
  };

  const switchDemoRole = (role: UserRole) => {
    const profile = DEMO_PROFILES[role];
    const demoAuthUser: AuthUser = {
      ...profile,
      provider: "demo",
      isEmailVerified: true,
      joinedAt: user?.joinedAt || new Date().toISOString(),
    };
    setUser(demoAuthUser);
    setRole(role);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoAuthUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authModalOpen,
        authModalTab,
        pendingAuthData,
        setAuthModalOpen,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        signUpWithEmail,
        verifyDeviceOtp,
        resendDeviceOtp,
        logout,
        requestPasswordReset,
        resetPasswordWithOtp,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
