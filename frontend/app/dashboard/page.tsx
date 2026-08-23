import React from "react";
import Link from "next/link";
import {
  Boxes,
  PackageCheck,
  AlertCircle,
  Truck,
  PlusCircle,
  Search,
  Download,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ImpactPillars } from "@/components/dashboard/ImpactPillars";
import { CircularityChart } from "@/components/dashboard/CircularityChart";
import { DepartmentImbalanceChart } from "@/components/dashboard/DepartmentImbalanceChart";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { CampusMapWidget } from "@/components/dashboard/CampusMapWidget";
import { MOCK_IMPACT_METRICS } from "@/lib/mockData";

export default function DashboardPage() {
  const metrics = MOCK_IMPACT_METRICS;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-forest"></span>
            Institutional Circularity Command Center
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Campus Surplus & Resource Flow
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Real-time telemetry on institutional assets, reverse logistics, and carbon abatement.
          </p>
        </div>

        {/* Quick CTA Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/assets?action=new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-surface font-semibold text-xs sm:text-sm hover:bg-forest-dark transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Register Surplus Asset
          </Link>
          <Link
            href="/intelligence"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-ink font-semibold text-xs sm:text-sm hover:bg-canvas transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-forest" />
            Match Surplus ↔ Shortage
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Assets Tracked"
          value={metrics.totalAssetsManaged}
          subtitle="Across 8 academic departments"
          icon={Boxes}
          accentColor="forest"
          trend={{ value: "14%", isPositive: true, label: "vs last month" }}
        />
        <StatCard
          title="Available Surplus"
          value={metrics.surplusAssets}
          subtitle="Ready for circular deployment"
          icon={PackageCheck}
          accentColor="leaf"
          trend={{ value: "+8", isPositive: true, label: "this week" }}
        />
        <StatCard
          title="Active Shortages"
          value={metrics.shortagesActive}
          subtitle="Unmet internal requests"
          icon={AlertCircle}
          accentColor="amber"
          trend={{ value: "6 pending", isPositive: false, label: "high priority" }}
        />
        <StatCard
          title="Active Transfers"
          value={metrics.activeTransfers}
          subtitle="In transit / scheduled"
          icon={Truck}
          accentColor="forest"
          trend={{ value: "3", isPositive: true, label: "out for delivery" }}
        />
      </div>

      {/* Tri-Pillar ESG & Capital Retained Showcase */}
      <ImpactPillars />

      {/* Middle Row: Circular Pathways & Imbalance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CircularityChart />
        <DepartmentImbalanceChart />
      </div>

      {/* Bottom Row: Geospatial Map Preview & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampusMapWidget />
        <RecentActivityFeed />
      </div>
    </div>
  );
}
