import React from "react";
import { IndianRupee, Trash2, CloudSun, Route, ArrowUpRight, Sparkles } from "lucide-react";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { MOCK_IMPACT_METRICS } from "@/lib/mockData";

export function ImpactPillars() {
  const metrics = MOCK_IMPACT_METRICS;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-forest-light/60 via-surface to-sand-light/50 border border-forest/20 p-6 sm:p-8 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-forest text-surface text-xs font-semibold tracking-wide uppercase mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Institutional Impact Accounting
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
            Tri-Pillar Circular Dividends
          </h2>
          <p className="text-sm text-ink-muted mt-1">
            Realized benefits through closed-loop redeployment across 8 departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface border border-border text-ink-muted">
            Audited against GHG Scope 3 Protocol
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Pillar 1: Economic Dividend */}
        <div className="p-5 rounded-2xl bg-surface border border-border/80 hover:border-forest/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-surface flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-forest bg-forest-light px-2 py-0.5 rounded-md">
              Capital Retained
            </span>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {formatCurrency(metrics.procurementAvoidedInr)}
          </div>
          <p className="text-xs font-medium text-ink-muted mt-1">
            Avoided redundant new procurement
          </p>
          <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-ink-muted flex items-center justify-between">
            <span>Equivalent to:</span>
            <span className="font-semibold text-ink">~42 New Laptops</span>
          </div>
        </div>

        {/* Pillar 2: Waste Diverted */}
        <div className="p-5 rounded-2xl bg-surface border border-border/80 hover:border-leaf/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-leaf text-surface flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-leaf bg-leaf-light px-2 py-0.5 rounded-md">
              E-Waste Diverted
            </span>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {formatWeight(metrics.wasteDivertedKg)}
          </div>
          <p className="text-xs font-medium text-ink-muted mt-1">
            Kept out of municipal landfill streams
          </p>
          <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-ink-muted flex items-center justify-between">
            <span>Direct reuse rate:</span>
            <span className="font-semibold text-ink">71.0%</span>
          </div>
        </div>

        {/* Pillar 3: Scope 3 CO2e Avoided */}
        <div className="p-5 rounded-2xl bg-surface border border-border/80 hover:border-forest/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest-dark text-surface flex items-center justify-center font-bold">
              <CloudSun className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-forest bg-forest-light px-2 py-0.5 rounded-md">
              Scope 3 Abated
            </span>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {formatWeight(metrics.co2AvoidedKg)} <span className="text-sm font-normal text-ink-muted">CO₂e</span>
          </div>
          <p className="text-xs font-medium text-ink-muted mt-1">
            Avoided embodied manufacturing emissions
          </p>
          <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-ink-muted flex items-center justify-between">
            <span>Carbon credits equiv:</span>
            <span className="font-semibold text-ink">~9.1 Metric Tons</span>
          </div>
        </div>

        {/* Pillar 4: Logistics Optimization */}
        <div className="p-5 rounded-2xl bg-surface border border-border/80 hover:border-amber/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber text-surface flex items-center justify-center font-bold">
              <Route className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber bg-amber-light px-2 py-0.5 rounded-md">
              OR-Tools VRP
            </span>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {metrics.logisticsKmOptimized} <span className="text-sm font-normal text-ink-muted">km</span>
          </div>
          <p className="text-xs font-medium text-ink-muted mt-1">
            Inter-department travel saved
          </p>
          <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-ink-muted flex items-center justify-between">
            <span>Route efficiency:</span>
            <span className="font-semibold text-ink">+38.4% faster</span>
          </div>
        </div>
      </div>
    </div>
  );
}
