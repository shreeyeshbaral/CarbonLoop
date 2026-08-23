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
  RefreshCw,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useRole, DEMO_PROFILES } from "@/context/RoleContext";
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
  const { currentRole, user, setRole, campusName } = useRole();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md">
      {/* Top Utility & Disclaimer Bar */}
      <div className="bg-canvas border-b border-border/60 px-4 py-1 text-xs text-ink-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-forest-light text-forest">
            <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse"></span>
            Prototype Mode
          </span>
          <span className="hidden sm:inline text-ink-muted">
            Simulated institutional data for hackathon demonstration. Real ERP/CSV pipelines pluggable.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-ink-muted">
            <Building2 className="w-3.5 h-3.5 text-forest" />
            <span className="font-medium text-ink">{campusName}</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-surface shadow-md transition-transform group-hover:scale-105">
                <RefreshCw className="w-5 h-5 text-surfaceSubtle animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-xl tracking-tight text-ink">
                    CARBON<span className="text-forest">LOOP</span>
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-surfaceSubtle border border-border text-ink-muted rounded">
                    v1.0
                  </span>
                </div>
                <span className="text-[11px] font-medium text-ink-muted hidden md:block -mt-0.5">
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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

          {/* Right Area: Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-canvas transition-colors shadow-xs"
              aria-expanded={roleDropdownOpen}
              aria-label="Switch User Perspective Role"
            >
              <div className="w-7 h-7 rounded-lg bg-forest text-surface font-heading text-xs font-bold flex items-center justify-center">
                {user.avatarInitials}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-ink flex items-center gap-1">
                  {user.name}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surfaceSubtle text-forest font-medium border border-border">
                    {user.role}
                  </span>
                </div>
                <div className="text-[10px] text-ink-muted truncate max-w-[150px]">
                  {user.roleLabel}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-ink-muted" />
            </button>

            {/* Role Dropdown Menu */}
            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface border border-border shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-border mb-1">
                  <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-forest" />
                    Switch Perspective (Demo)
                  </div>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    Test the workflow from any institutional role without re-logging.
                  </p>
                </div>

                <div className="space-y-1">
                  {(Object.keys(DEMO_PROFILES) as UserRole[]).map((roleKey) => {
                    const profile = DEMO_PROFILES[roleKey];
                    const isSelected = currentRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          setRole(roleKey);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-3 ${
                          isSelected
                            ? "bg-forest-light border border-forest/20"
                            : "hover:bg-canvas"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
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
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 bg-canvas text-ink-muted rounded">
                              {roleKey}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium text-ink-muted">
                            {profile.roleLabel} · {profile.departmentCode}
                          </div>
                          <p className="text-[10px] text-ink-muted mt-0.5 leading-tight">
                            {profile.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-border px-3 py-1.5 bg-canvas rounded-xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
                  <span className="text-[11px] text-ink-muted">
                    Full JWT & RBAC infrastructure ready for Phase 14.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-border bg-canvas gap-2">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-forest-light text-forest font-semibold"
                  : "text-ink-muted hover:text-ink bg-surface border border-border/50"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-forest" : "text-ink-muted"}`} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
