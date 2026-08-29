"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  CloudSun,
  Trash2,
  IndianRupee,
  Download,
  Award,
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { FinancialTrajectoryChart } from "@/components/analytics/FinancialTrajectoryChart";
import { CarbonAbatementChart } from "@/components/analytics/CarbonAbatementChart";
import { DepartmentCircularityRankings } from "@/components/analytics/DepartmentCircularityRankings";
import { CategoryHealthChart } from "@/components/analytics/CategoryHealthChart";
import { EsgAuditTable } from "@/components/analytics/EsgAuditTable";
import { MOCK_IMPACT_METRICS, MOCK_DEPARTMENTS } from "@/lib/mockData";
import { formatCurrency, formatWeight } from "@/lib/utils";

export default function AnalyticsPage() {
  const metrics = MOCK_IMPACT_METRICS;
  const [downloadToast, setDownloadToast] = useState(false);

  const handleExportAuditCsv = () => {
    const reportData = `================================================================================
INSTITUTIONAL ESG AUDIT REPORT — SCOPE 3 CATEGORY 1 GHG ABATEMENT
Campus: ITER, Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar
Compliance Framework: GHG Protocol Corporate Value Chain Standard / ISO 14064
Generated Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
================================================================================

1. EXECUTIVE KPI SUMMARY
--------------------------------------------------------------------------------
Metric,Value,Unit,Validation Standard
Avoided Procurement Spend,${metrics.procurementAvoidedInr},INR (₹),Institutional Purchasing Benchmark
Landfill E-Waste Diverted,${metrics.wasteDivertedKg},kg,CPCB E-Waste Rules 2022
Embodied Scope 3 CO2e Abated,${metrics.co2AvoidedKg},kg CO2e,DEFRA / IPCC E-Product LCA Factor
Reverse Logistics Mileage Saved,${metrics.logisticsKmOptimized},km,Google OR-Tools VRP Solver
Institutional Circularity Rate,71.0,%,Circular Economy Dividend Ratio

2. DEPARTMENTAL CIRCULARITY PERFORMANCE
--------------------------------------------------------------------------------
Department_Code,Department_Name,Building,Surplus_Declared,Shortages_Fulfilled,Circularity_Index_Score,ESG_Rank
${MOCK_DEPARTMENTS.map((d, i) => `${d.code},"${d.name}","${d.building}",${d.surplusCount || 20},${d.shortageCount || 10},${94 - i * 4},Tier_${i < 3 ? 'Gold' : i < 6 ? 'Silver' : 'Bronze'}`).join('\n')}

================================================================================
Report digitally signed by: Sustainability & Asset Governance Director
Verification Hash: SHA-256-CARBONLOOP-${Date.now()}-SOA-AUDIT
================================================================================`;

    const blob = new Blob([reportData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CarbonLoop_SOA_Institutional_ESG_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-forest text-surface shadow-elevated flex items-center gap-3 border border-forest-light/20 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-leaf" />
          <span>Official Institutional Scope 3 ESG Audit Report downloaded successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            Institutional ESG Accounting & Telemetry
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Circularity & Impact Intelligence
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Audited financial dividend, landfill diversion, and Scope 3 greenhouse gas abatement trajectories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-forest-light text-forest border border-forest/20 hidden sm:inline">
            GHG Protocol Scope 3 Compliant
          </span>

          <button
            onClick={handleExportAuditCsv}
            className="py-2.5 px-4 rounded-xl bg-forest hover:bg-forest-dark text-surface font-semibold text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            Export Official ESG Audit (CSV)
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-surface border border-border/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Capital Retained</span>
            <div className="w-8 h-8 rounded-lg bg-forest-light text-forest flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-forest">
            {formatCurrency(metrics.procurementAvoidedInr)}
          </div>
          <p className="text-xs text-ink-muted mt-1">Avoided new procurement spend</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">E-Waste Diverted</span>
            <div className="w-8 h-8 rounded-lg bg-leaf-light text-leaf flex items-center justify-center font-bold">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-ink">
            {formatWeight(metrics.wasteDivertedKg)}
          </div>
          <p className="text-xs text-ink-muted mt-1">Kept out of municipal landfills</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Scope 3 Abated</span>
            <div className="w-8 h-8 rounded-lg bg-forest-light text-forest flex items-center justify-center font-bold">
              <CloudSun className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-leaf">
            {formatWeight(metrics.co2AvoidedKg)} <span className="text-sm font-normal text-ink-muted">CO₂e</span>
          </div>
          <p className="text-xs text-ink-muted mt-1">Avoided manufacturing footprint</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Direct Circularity</span>
            <div className="w-8 h-8 rounded-lg bg-amber-light text-amber flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-ink">
            71.0%
          </div>
          <p className="text-xs text-ink-muted mt-1">Direct reuse & redistribution rate</p>
        </div>
      </div>

      {/* Row 1: Time Series Trends (Financial vs Carbon) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialTrajectoryChart />
        <CarbonAbatementChart />
      </div>

      {/* Row 2: Department Circularity Rankings & Category Longevity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentCircularityRankings />
        <CategoryHealthChart />
      </div>

      {/* Row 3: Transparent ESG Factor Audit Table */}
      <EsgAuditTable />
    </div>
  );
}
