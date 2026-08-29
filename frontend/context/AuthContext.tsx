"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole } from "@/types";
import { UserProfile, DEMO_PROFILES, useRole } from "./RoleContext";

export interface AuthUser extends UserProfile {
  provider: "email" | "google" | "demo";
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

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalTab: "login" | "signup" | "forgot";
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: "login" | "signup" | "forgot") => void;
  openAuthModal: (tab?: "login" | "signup" | "forgot") => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; otp?: string }>;
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "carbonloop_auth_user_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setRole } = useRole();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup" | "forgot">("login");

  // Initialize from LocalStorage or default to Dr. Alok Verma for seamless demo
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
        joinedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [setRole]);

  const openAuthModal = (tab: "login" | "signup" | "forgot" = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const loginWithEmail = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // 1. Check if email matches any pre-configured demo profiles
      const matchedRole = (Object.keys(DEMO_PROFILES) as UserRole[]).find(
        (r) => DEMO_PROFILES[r].email.toLowerCase() === email.toLowerCase()
      );

      let authUser: AuthUser;

      if (matchedRole) {
        const profile = DEMO_PROFILES[matchedRole];
        authUser = {
          ...profile,
          provider: "email",
          joinedAt: new Date().toISOString(),
        };
      } else {
        // Custom user login
        const namePart = email.split("@")[0].replace(/[._]/g, " ");
        const formattedName = namePart
          .split(" ")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        authUser = {
          id: `usr-custom-${Date.now()}`,
          name: formattedName || "University Member",
          email: email.toLowerCase(),
          role: "REQUESTER",
          roleLabel: "Faculty / Research Member",
          department: "ITER Academic Cluster",
          departmentCode: "CSE",
          avatarInitials: formattedName ? formattedName.slice(0, 2).toUpperCase() : "UM",
          description: "Institutional member accessing surplus and shortage resources.",
          provider: "email",
          joinedAt: new Date().toISOString(),
        };
      }

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

  const signUpWithEmail = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
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
        email: data.email.toLowerCase(),
        role: data.role,
        roleLabel: roleLabels[data.role] || "University Member",
        department: data.departmentName || `${data.departmentCode} Faculty Cluster`,
        departmentCode: data.departmentCode,
        avatarInitials: initials,
        description: `Registered faculty member in ${data.departmentCode} department.`,
        provider: "email",
        joinedAt: new Date().toISOString(),
      };

      setUser(newUser);
      setRole(newUser.role);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Sign up failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate authentic Google OAuth response with verified institutional domain
      const googleUser: AuthUser = {
        id: `usr-google-${Date.now()}`,
        name: "Shreeyesh Baral",
        email: "shreeyesh.baral@soa.ac.in",
        role: "DEPARTMENT_MANAGER",
        roleLabel: "Department Head (ITER CSE)",
        department: "Computer Science & Engineering (ITER Block 1)",
        departmentCode: "CSE",
        avatarInitials: "SB",
        description: "Authenticated via Google Workspace (Siksha 'O' Anusandhan University).",
        provider: "google",
        joinedAt: new Date().toISOString(),
      };

      setUser(googleUser);
      setRole(googleUser.role);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Google Authentication failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Keep RoleContext safe
    setRole("REQUESTER");
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string; otp?: string }> => {
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      // Store in sessionStorage for verification simulation
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
        setAuthModalOpen,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
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
