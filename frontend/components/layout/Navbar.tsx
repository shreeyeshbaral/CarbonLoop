"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  MapPin,
  Sparkles,
  Route,
  BarChart3,
  UserCheck,
  Building2,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useRole, DEMO_PROFILES } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/assets", label: "Asset Marketplace", icon: Boxes },
  { href: "/map", label: "Resource Map", icon: MapPin },
  { href: "/intelligence", label: "Matching Engine", icon: Sparkles },
  { href: "/routes", label: "Route Optimizer", icon: Route },
  { href: "/analytics", label: "Impact & ESG", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const { currentRole, campusName } = useRole();
  const { user, isAuthenticated, openAuthModal, logout, switchDemoRole } = useAuth();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      {/* Top Utility & Operational Status Bar */}
      <div className="bg-canvas border-b border-border/60 px-3 sm:px-4 py-1 text-xs text-ink-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-forest-light text-forest border border-forest/20">
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse"></span>
            Live Institutional Cluster
          </span>
          <span className="hidden md:inline text-ink-muted">
            High-Capacity Real-Time Storage • Supabase Cloud PostgreSQL Sync Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-ink-muted">
            <Building2 className="w-3.5 h-3.5 text-forest shrink-0" />
            <span className="font-medium text-ink truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none text-[11px] sm:text-xs">
              {campusName}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forest flex items-center justify-center p-1.5 shadow-md transition-transform group-hover:scale-105 shrink-0 overflow-hidden">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  <path d="M 20 26 A 14 14 0 0 1 44 26" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" />
                  <polyline points="38 20 44 26 38 32" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 44 38 A 14 14 0 0 1 20 38" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" />
                  <polyline points="26 44 20 38 26 32" stroke="#FFFDF8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 28 34 C 28 27, 36 26, 37 26 C 37 34, 30 35, 28 34 Z" fill="#FFFDF8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-ink">
                    CARBON<span className="text-forest font-bold">LOOP</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 bg-surfaceSubtle border border-border text-ink-muted rounded">
                    v1.0
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-ink-muted hidden lg:block -mt-0.5">
                  Turning Institutional Surplus into Circular Value
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                      isActive
                        ? "bg-forest-light text-forest font-semibold shadow-xs"
                        : "text-ink-muted hover:text-ink hover:bg-canvas"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-forest" : "text-ink-muted"}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Area: Auth Profile & Role Switcher */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-canvas transition-colors shadow-xs"
                  aria-expanded={roleDropdownOpen}
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-forest text-surface font-heading text-xs font-bold flex items-center justify-center shrink-0">
                    {user.avatarInitials}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-ink flex items-center gap-1">
                      {user.name}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surfaceSubtle text-forest font-medium border border-border">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-ink-muted truncate max-w-[130px] md:max-w-[160px]">
                      {user.roleLabel}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
                </button>

                {/* Profile & Role Dropdown Menu */}
                {roleDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-surface border border-border shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setRoleDropdownOpen(false)}
                  >
                    {/* User Identity Box */}
                    <div className="p-3 bg-canvas rounded-xl mb-2 border border-border/70">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-ink">{user.name}</span>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-forest-light text-forest border border-forest/20">
                          Email Verified
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-muted">{user.email}</div>
                      <div className="text-[10px] text-forest font-semibold mt-0.5">
                        {user.department} ({user.departmentCode})
                      </div>
                    </div>

                    <div className="px-3 py-1.5 border-b border-border mb-1">
                      <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-forest" />
                        Switch Perspective (Demo)
                      </div>
                    </div>

                    <div className="space-y-1 max-h-[45vh] overflow-y-auto">
                      {(Object.keys(DEMO_PROFILES) as UserRole[]).map((roleKey) => {
                        const profile = DEMO_PROFILES[roleKey];
                        const isSelected = currentRole === roleKey;
                        return (
                          <button
                            key={roleKey}
                            onClick={() => {
                              switchDemoRole(roleKey);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl transition-colors flex items-start gap-2.5 ${
                              isSelected
                                ? "bg-forest-light border border-forest/20"
                                : "hover:bg-canvas"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "bg-forest text-surface"
                                  : "bg-surfaceSubtle text-ink-muted border border-border"
                              }`}
                            >
                              {profile.avatarInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${isSelected ? "text-forest" : "text-ink"}`}>
                                  {profile.name}
                                </span>
                                <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 bg-canvas text-ink-muted rounded border border-border">
                                  {roleKey}
                                </span>
                              </div>
                              <div className="text-[10px] font-medium text-ink-muted truncate">
                                {profile.roleLabel}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sign Out Button */}
                    <div className="mt-2 pt-2 border-t border-border flex items-center justify-between gap-2 px-1">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          openAuthModal("login");
                        }}
                        className="text-[11px] font-semibold text-forest hover:underline px-2 py-1"
                      >
                        Change Account
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setRoleDropdownOpen(false);
                        }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-amber hover:bg-amber-light/60 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal("login")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-canvas text-xs font-bold text-ink transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-forest" />
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-dark text-xs font-bold text-surface transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-border bg-surface hover:bg-canvas text-ink"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Mobile Menu for Phones & Tablets */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] uppercase font-bold text-ink-muted px-2 py-1 tracking-wider">
            Navigation Menu
          </div>
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-forest-light text-forest font-bold"
                    : "text-ink hover:bg-canvas"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-forest" : "text-ink-muted"}`} />
                {link.label}
              </Link>
            );
          })}

          {!isAuthenticated && (
            <div className="pt-2 border-t border-border flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("login");
                }}
                className="flex-1 py-2 rounded-xl bg-canvas border border-border text-center text-xs font-bold text-ink"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("signup");
                }}
                className="flex-1 py-2 rounded-xl bg-forest text-surface text-center text-xs font-bold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}

      {/* Horizontal Fast Scroll Bar on Mobile/Tablet */}
      <div className="lg:hidden flex items-center overflow-x-auto px-3 py-2 border-t border-border/80 bg-canvas gap-1.5 scrollbar-none">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? "bg-forest text-surface font-semibold shadow-xs"
                  : "text-ink-muted hover:text-ink bg-surface border border-border/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
