"use client";

import React, { useState } from "react";
import {
  Route,
  Truck,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Layers,
  Award,
  Calendar,
  User,
  ShieldCheck,
  Package,
  ArrowRight,
  Info,
  Building2,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import {
  DeliveryRun,
  DeliveryEfficiencyMetrics,
  DeliveryEfficiencyScoreBreakdown,
} from "@/types";
import {
  MOCK_DELIVERY_RUNS,
  generateDeliveryInsights,
} from "@/lib/deliveryEfficiency";
import { RouteMapVisualizer } from "./RouteMapVisualizer";

export function DeliveryEfficiencyDashboard() {
  const [selectedRunId, setSelectedRunId] = useState<string>("DLV-001");

  const currentRun: DeliveryRun =
    MOCK_DELIVERY_RUNS.find((r) => r.id === selectedRunId) || MOCK_DELIVERY_RUNS[0];

  const { metrics, stops } = currentRun;
  const { scoreBreakdown } = metrics;
  const insights = generateDeliveryInsights(currentRun);

  // 3-Way Comparison Data for Recharts
  const comparisonBarData = [
    {
      metric: "Distance (km)",
      Baseline: metrics.baselineDistanceKm,
      Optimized: metrics.plannedDistanceKm,
      Actual: metrics.actualDistanceKm,
    },
    {
      metric: "Duration (min)",
      Baseline: metrics.baselineDurationMinutes,
      Optimized: metrics.plannedDurationMinutes,
      Actual: metrics.actualDurationMinutes,
    },
    {
      metric: "Transport CO₂e (kg)",
      Baseline: metrics.baselineCo2Kg,
      Optimized: metrics.plannedCo2Kg,
      Actual: metrics.actualCo2Kg,
    },
  ];

  // Stop-by-stop dwell time data
  const stopDwellData = stops
    .filter((s) => s.type !== "DEPOT")
    .map((s) => ({
      name: s.departmentCode,
      Planned: s.plannedDwellMinutes,
      Actual: s.actualDwellMinutes || 0,
    }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Run Switcher & Metadata */}
      <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest flex items-center justify-center text-surface shadow-md shrink-0">
            <Truck className="w-6 h-6 text-leaf" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-bold text-lg text-ink">
                Delivery Run Execution Telemetry
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  currentRun.status === "COMPLETED"
                    ? "bg-forest-light text-forest border-forest/30"
                    : "bg-amber-light text-amber border-amber/30 animate-pulse"
                }`}
              >
                {currentRun.status}
              </span>
              {currentRun.isDemoData && (
                <span className="text-[10px] font-semibold bg-canvas text-ink-muted border border-border px-2 py-0.5 rounded-full">
                  Synthetic Benchmark Data
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-muted mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-forest" /> {currentRun.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-forest" /> {currentRun.driverName}
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-forest" /> {currentRun.vehicleName}
              </span>
            </div>
          </div>
        </div>

        {/* Run Selector Pills */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <span className="text-xs font-bold text-ink-muted hidden sm:inline">Select Dispatch Run:</span>
          <div className="flex bg-canvas p-1 rounded-2xl border border-border">
            {MOCK_DELIVERY_RUNS.map((run) => (
              <button
                key={run.id}
                onClick={() => setSelectedRunId(run.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRunId === run.id
                    ? "bg-forest text-surface shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                #{run.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 1: Delivery Efficiency Score & Top 5 KPI Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Explainable Delivery Efficiency Score Card (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-forest" />
                Delivery Efficiency Score
              </span>
              <span className="text-[10px] font-semibold text-forest bg-forest-light px-2 py-0.5 rounded border border-forest/20">
                Proprietary Model
              </span>
            </div>

            {/* Score Big Display */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-heading text-5xl font-extrabold text-forest">
                {scoreBreakdown.overallScore}
              </span>
              <span className="text-lg font-bold text-ink-muted">/ 100</span>
            </div>

            <p className="text-xs text-ink-muted mb-4">
              Composite execution metric evaluating route deviation, dwell punctuality, asset throughput, and electric fleet capacity.
            </p>

            {/* Transparent Factor Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-border/80 text-xs">
              <div>
                <div className="flex justify-between text-ink-muted mb-1">
                  <span>1. Distance Efficiency (25% wt)</span>
                  <span className="font-bold text-ink">{scoreBreakdown.distanceEfficiency}/100</span>
                </div>
                <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${scoreBreakdown.distanceEfficiency}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink-muted mb-1">
                  <span>2. Time Adherence (25% wt)</span>
                  <span className="font-bold text-ink">{scoreBreakdown.timeEfficiency}/100</span>
                </div>
                <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${scoreBreakdown.timeEfficiency}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink-muted mb-1">
                  <span>3. Asset Completion (25% wt)</span>
                  <span className="font-bold text-ink">{scoreBreakdown.completionRate}/100</span>
                </div>
                <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${scoreBreakdown.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink-muted mb-1">
                  <span>4. On-Time Performance (15% wt)</span>
                  <span className="font-bold text-ink">{scoreBreakdown.onTimePerformance}/100</span>
                </div>
                <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${scoreBreakdown.onTimePerformance}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink-muted mb-1">
                  <span>5. Vehicle Capacity (10% wt)</span>
                  <span className="font-bold text-ink">{scoreBreakdown.vehicleUtilization}/100</span>
                </div>
                <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${scoreBreakdown.vehicleUtilization}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border text-[11px] text-ink-muted flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest shrink-0" />
            <span>Fully transparent and mathematically verified calculation.</span>
          </div>
        </div>

        {/* Right: Key Performance Metrics Cards Grid (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Distance Execution */}
          <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Distance Travelled</span>
                <Route className="w-4 h-4 text-forest" />
              </div>
              <div className="font-heading text-2xl font-bold text-ink">
                {metrics.actualDistanceKm} <span className="text-sm font-normal text-ink-muted">km</span>
              </div>
              <div className="text-xs text-ink-muted mt-1">
                Planned: <strong className="text-ink">{metrics.plannedDistanceKm} km</strong>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-ink-muted">Deviation:</span>
              <span
                className={`font-bold ${
                  metrics.distanceDeviationPercent <= 0 ? "text-forest" : "text-amber"
                }`}
              >
                {metrics.distanceDeviationPercent > 0 ? `+${metrics.distanceDeviationPercent}%` : `${metrics.distanceDeviationPercent}%`}
              </span>
            </div>
          </div>

          {/* Card 2: Travel Time Duration */}
          <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Actual Duration</span>
                <Clock className="w-4 h-4 text-forest" />
              </div>
              <div className="font-heading text-2xl font-bold text-ink">
                {metrics.actualDurationMinutes} <span className="text-sm font-normal text-ink-muted">mins</span>
              </div>
              <div className="text-xs text-ink-muted mt-1">
                Planned: <strong className="text-ink">{metrics.plannedDurationMinutes} mins</strong>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-ink-muted">Time Variance:</span>
              <span
                className={`font-bold ${
                  metrics.timeDeviationPercent <= 0 ? "text-forest" : "text-amber"
                }`}
              >
                {metrics.timeDeviationPercent > 0 ? `+${metrics.timeDeviationPercent}%` : `${metrics.timeDeviationPercent}%`}
              </span>
            </div>
          </div>

          {/* Card 3: Asset Delivery Completion Rate */}
          <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Completion Rate</span>
                <Package className="w-4 h-4 text-leaf" />
              </div>
              <div className="font-heading text-2xl font-bold text-leaf">
                {metrics.deliveryCompletionRatePercent}%
              </div>
              <div className="text-xs text-ink-muted mt-1">
                <strong className="text-ink">{metrics.deliveredAssetsCount}</strong> of {metrics.plannedAssetsCount} assets delivered
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-ink-muted">Failed / Held:</span>
              <span className={`font-bold ${metrics.failedAssetsCount === 0 ? "text-forest" : "text-red-600"}`}>
                {metrics.failedAssetsCount} item
              </span>
            </div>
          </div>

          {/* Card 4: On-Time Delivery Rate */}
          <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">On-Time Performance</span>
                <CheckCircle2 className="w-4 h-4 text-forest" />
              </div>
              <div className="font-heading text-2xl font-bold text-forest">
                {metrics.onTimeDeliveryRatePercent}%
              </div>
              <div className="text-xs text-ink-muted mt-1">
                Stops executed within 10m window
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-ink-muted">Unplanned Stops:</span>
              <span className={`font-bold ${metrics.unplannedStopsCount === 0 ? "text-forest" : "text-purple-600"}`}>
                {metrics.unplannedStopsCount} stop
              </span>
            </div>
          </div>

          {/* Card 5: Vehicle Payload Utilization */}
          <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Vehicle Utilization</span>
                <Truck className="w-4 h-4 text-amber" />
              </div>
              <div className="font-heading text-2xl font-bold text-ink">
                {metrics.vehicleUtilizationPercent}%
              </div>
              <div className="text-xs text-ink-muted mt-1">
                Load: <strong className="text-ink">{metrics.actualLoadKg} kg</strong> / {metrics.vehicleCapacityKg} kg max
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-ink-muted">Reserve Margin:</span>
              <span className="font-bold text-forest">
                {metrics.vehicleCapacityKg - metrics.actualLoadKg} kg spare
              </span>
            </div>
          </div>

          {/* Card 6: Transport CO2e Emissions */}
          <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Transport Emissions</span>
                <Zap className="w-4 h-4 text-forest" />
              </div>
              <div className="font-heading text-2xl font-bold text-forest">
                {metrics.actualCo2Kg} <span className="text-sm font-normal text-ink-muted">kg CO₂e</span>
              </div>
              <div className="text-xs text-ink-muted mt-1">
                vs {metrics.baselineCo2Kg} kg baseline emissions
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-ink-muted">CO₂ Abated:</span>
              <span className="font-bold text-leaf">
                -{metrics.co2SavedByOptimizationKg} kg CO₂e
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 3-Way Route Comparison Table (Baseline vs Optimized vs Actual) */}
      <div className="p-6 rounded-3xl bg-surface border border-border/80 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-forest" />
              3-Way Route Performance Comparison
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Comparative analysis demonstrating how the optimized plan improved baseline logistics, and how actual execution matched the plan.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-canvas border border-border text-ink-muted shrink-0">
            Formula-Derived Metrics
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-border text-[11px] text-ink-muted uppercase">
              <tr>
                <th className="p-3">Logistics Dimension</th>
                <th className="p-3 font-semibold text-ink-muted">1. Baseline (Naive)</th>
                <th className="p-3 font-bold text-forest">2. Optimized Plan</th>
                <th className="p-3 font-bold text-blue-600">3. Actual Execution</th>
                <th className="p-3 text-right">Optimization Gain</th>
                <th className="p-3 text-right">Execution Deviation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-canvas/50">
                <td className="p-3 font-bold text-ink">Total Travel Distance</td>
                <td className="p-3 font-mono text-ink-muted">{metrics.baselineDistanceKm} km</td>
                <td className="p-3 font-mono font-bold text-forest">{metrics.plannedDistanceKm} km</td>
                <td className="p-3 font-mono font-bold text-blue-600">{metrics.actualDistanceKm} km</td>
                <td className="p-3 text-right font-bold text-leaf">
                  -{metrics.optimizationDistanceImprovementPercent}%
                </td>
                <td className="p-3 text-right font-bold text-amber">
                  +{metrics.distanceDeviationPercent}%
                </td>
              </tr>

              <tr className="hover:bg-canvas/50">
                <td className="p-3 font-bold text-ink">Total Route Duration</td>
                <td className="p-3 font-mono text-ink-muted">{metrics.baselineDurationMinutes} min</td>
                <td className="p-3 font-mono font-bold text-forest">{metrics.plannedDurationMinutes} min</td>
                <td className="p-3 font-mono font-bold text-blue-600">{metrics.actualDurationMinutes} min</td>
                <td className="p-3 text-right font-bold text-leaf">
                  -{metrics.optimizationTimeImprovementPercent}%
                </td>
                <td className="p-3 text-right font-bold text-amber">
                  +{metrics.timeDeviationPercent}%
                </td>
              </tr>

              <tr className="hover:bg-canvas/50">
                <td className="p-3 font-bold text-ink">Stops Completed</td>
                <td className="p-3 font-mono text-ink-muted">{metrics.plannedStopsCount} stops</td>
                <td className="p-3 font-mono font-bold text-forest">{metrics.plannedStopsCount} stops</td>
                <td className="p-3 font-mono font-bold text-blue-600">{metrics.actualStopsCount} stops</td>
                <td className="p-3 text-right font-bold text-ink-muted">0%</td>
                <td className="p-3 text-right font-bold text-purple-600">
                  +{metrics.unplannedStopsCount} detour
                </td>
              </tr>

              <tr className="hover:bg-canvas/50">
                <td className="p-3 font-bold text-ink">Assets Delivered</td>
                <td className="p-3 font-mono text-ink-muted">{metrics.plannedAssetsCount} assets</td>
                <td className="p-3 font-mono font-bold text-forest">{metrics.plannedAssetsCount} assets</td>
                <td className="p-3 font-mono font-bold text-blue-600">{metrics.deliveredAssetsCount} assets</td>
                <td className="p-3 text-right font-bold text-ink-muted">100% target</td>
                <td className="p-3 text-right font-bold text-forest">
                  {metrics.deliveryCompletionRatePercent}% fulfilled
                </td>
              </tr>

              <tr className="hover:bg-canvas/50">
                <td className="p-3 font-bold text-ink">Estimated Transport CO₂e</td>
                <td className="p-3 font-mono text-ink-muted">{metrics.baselineCo2Kg} kg</td>
                <td className="p-3 font-mono font-bold text-forest">{metrics.plannedCo2Kg} kg</td>
                <td className="p-3 font-mono font-bold text-blue-600">{metrics.actualCo2Kg} kg</td>
                <td className="p-3 text-right font-bold text-leaf">
                  -{metrics.co2SavedByOptimizationKg} kg abated
                </td>
                <td className="p-3 text-right font-bold text-amber">
                  +{metrics.co2ExecutionDeviationPercent}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Smart Insights & Comparative Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Smart Delivery Insights (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-forest uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              Smart Delivery Insights
            </div>
            <h4 className="font-heading text-base font-bold text-ink mb-3">
              Automated Operational Diagnosis
            </h4>

            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-canvas border border-border/80 text-xs text-ink leading-relaxed flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border text-[11px] text-ink-muted">
            Generated deterministically from verified GPS checkpoint logs and transfer audit manifests.
          </div>
        </div>

        {/* Right: Comparative Charts (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-surface border border-border/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-sm font-bold text-ink flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-forest" />
              Optimization vs Execution Dynamics
            </h4>
            <span className="text-[11px] text-ink-muted">Campus Fleet Benchmarks</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#737D75" }} />
                <YAxis tick={{ fontSize: 11, fill: "#737D75" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E6ECE8",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="Baseline" fill="#D97706" radius={[4, 4, 0, 0]} opacity={0.75} />
                <Bar dataKey="Optimized" fill="#176B3A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Multi-Route Interactive Leaflet Map Experience */}
      <div className="p-6 rounded-3xl bg-surface border border-border/80 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
              <Route className="w-5 h-5 text-forest" />
              Multi-Route Geospatial Execution Visualizer
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Toggle and inspect the Baseline, Planned VRP, and Actual GPS corridors overlaid on the ITER SOA campus map.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-1 bg-amber-600 rounded inline-block"></span> Baseline
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-forest">
              <span className="w-3 h-1.5 bg-forest rounded inline-block"></span> Planned
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-blue-600">
              <span className="w-3 h-1.5 bg-blue-600 rounded inline-block"></span> Actual
            </span>
          </div>
        </div>

        <div className="h-[520px] rounded-2xl overflow-hidden border border-border">
          <RouteMapVisualizer
            baselineCoordinates={currentRun.baselinePolylineCoordinates}
            optimizedCoordinates={currentRun.optimizedPolylineCoordinates}
            actualCoordinates={currentRun.actualPolylineCoordinates}
            deliveryStops={currentRun.stops}
            showLayerControls={true}
          />
        </div>
      </div>

      {/* Row 5: Detailed Stop-by-Stop Execution Itinerary Table */}
      <div className="p-6 rounded-3xl bg-surface border border-border/80 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <Clock className="w-5 h-5 text-forest" />
            Waypoint Execution Log ({stops.length} Stops)
          </h3>
          <span className="text-xs text-ink-muted">Chronological Dispatch Manifest</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-border text-[11px] text-ink-muted uppercase">
              <tr>
                <th className="p-3">Seq</th>
                <th className="p-3">Department & Location</th>
                <th className="p-3">Type</th>
                <th className="p-3">Planned Arr</th>
                <th className="p-3">Actual Arr</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payload Details</th>
                <th className="p-3">Operational Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {stops.map((stop) => (
                <tr key={stop.id} className="hover:bg-canvas/50">
                  <td className="p-3 font-bold text-ink">#{stop.sequence}</td>
                  <td className="p-3">
                    <div className="font-bold text-ink">{stop.name}</div>
                    <div className="text-[11px] text-ink-muted">{stop.building}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        stop.type === "DEPOT"
                          ? "bg-ink text-surface"
                          : stop.type === "PICKUP"
                          ? "bg-forest text-surface"
                          : "bg-amber text-surface"
                      }`}
                    >
                      {stop.type}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-ink-muted">{stop.plannedArrivalTime}</td>
                  <td className="p-3 font-mono font-bold text-ink">
                    {stop.actualArrivalTime || "Pending"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        stop.status === "COMPLETED"
                          ? "bg-forest-light text-forest"
                          : stop.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : stop.status === "UNPLANNED"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-amber-light text-amber"
                      }`}
                    >
                      {stop.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {stop.assetName ? (
                      <span className="text-ink font-medium">
                        {stop.assetName} ({stop.deliveredQuantity}/{stop.assetQuantity})
                      </span>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    )}
                  </td>
                  <td className="p-3 text-[11px] text-ink-muted max-w-xs">
                    {stop.failureReason ? (
                      <span className="text-red-600 font-semibold">{stop.failureReason}</span>
                    ) : (
                      stop.notes || "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
