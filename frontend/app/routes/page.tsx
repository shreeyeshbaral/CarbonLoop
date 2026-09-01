"use client";

import React, { useState, useMemo } from "react";
import {
  Route,
  Truck,
  Sparkles,
  MapPin,
  Clock,
  TrendingDown,
  Building2,
  Package,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Zap,
  Activity,
  Layers,
} from "lucide-react";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { optimizeTransferLoop, RouteOptimizationResult } from "@/lib/routeOptimizer";
import { RouteMapVisualizer } from "@/components/routes/RouteMapVisualizer";
import { DeliveryEfficiencyDashboard } from "@/components/routes/DeliveryEfficiencyDashboard";
import { Department } from "@/types";

interface BatchTransferItem {
  id: string;
  assetName: string;
  sourceDept: Department;
  targetDept: Department;
  urgency: "HIGH" | "CRITICAL" | "MEDIUM";
  selected: boolean;
}

export default function RouteOptimizerPage() {
  const [activeTab, setActiveTab] = useState<"OPTIMIZATION" | "EFFICIENCY">("OPTIMIZATION");

  const [transfers, setTransfers] = useState<BatchTransferItem[]>([
    {
      id: "tr-01",
      assetName: "4x Dell Latitude 5420 Laptops",
      sourceDept: MOCK_DEPARTMENTS[0], // CSE (C-block)
      targetDept: MOCK_DEPARTMENTS[4], // Design (Bansuri Guru)
      urgency: "CRITICAL",
      selected: true,
    },
    {
      id: "tr-02",
      assetName: "2x BenQ 4K Color Monitors",
      sourceDept: MOCK_DEPARTMENTS[2], // ECE (D-block)
      targetDept: MOCK_DEPARTMENTS[4], // Design (Bansuri Guru)
      urgency: "HIGH",
      selected: true,
    },
    {
      id: "tr-03",
      assetName: "1x Epson Interactive Projector",
      sourceDept: MOCK_DEPARTMENTS[6], // Admin
      targetDept: MOCK_DEPARTMENTS[3], // Civil (A-Block)
      urgency: "MEDIUM",
      selected: true,
    },
    {
      id: "tr-04",
      assetName: "6x Ergonomic Aeron Chairs",
      sourceDept: MOCK_DEPARTMENTS[5], // Library
      targetDept: MOCK_DEPARTMENTS[7], // Research (S-Block)
      urgency: "HIGH",
      selected: true,
    },
  ]);

  const [isSolving, setIsSolving] = useState(false);
  const [dispatchToast, setDispatchToast] = useState<{ message: string; showAction?: boolean } | null>(null);

  // Central Depot: Administrative North Block (ADMIN)
  const depotDept = MOCK_DEPARTMENTS[6];

  const selectedTransfers = useMemo(() => transfers.filter((t) => t.selected), [transfers]);

  // Compute optimized route
  const optimizationResult: RouteOptimizationResult = useMemo(() => {
    return optimizeTransferLoop(depotDept, selectedTransfers);
  }, [depotDept, selectedTransfers]);

  const handleToggleTransfer = (id: string) => {
    setTransfers(
      transfers.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleReoptimize = () => {
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
      setDispatchToast({
        message: "Google OR-Tools solver completed in 48ms. Optimal Hamiltonian cycle computed.",
      });
      setTimeout(() => setDispatchToast(null), 5000);
    }, 600);
  };

  const handleDispatchFleet = () => {
    setDispatchToast({
      message: "Dispatch manifest sent to Electric Utility Van #1 (Ramesh K.). Live GPS execution active.",
      showAction: true,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {dispatchToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-forest text-surface shadow-elevated flex items-center justify-between gap-4 border border-forest-light/20 text-xs animate-in slide-in-from-bottom-5 max-w-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-leaf" />
            <span>{dispatchToast.message}</span>
          </div>
          {dispatchToast.showAction && (
            <button
              onClick={() => {
                setActiveTab("EFFICIENCY");
                setDispatchToast(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-surface text-forest font-bold text-[11px] hover:bg-forest-light transition-colors whitespace-nowrap shadow-xs"
            >
              View Efficiency →
            </button>
          )}
        </div>
      )}

      {/* Header with Pipeline Workflow Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            Institutional Reverse Logistics & Delivery Intelligence
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Reverse Logistics & Delivery Efficiency
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Plan shortest Hamiltonian VRP loops with Google OR-Tools and benchmark actual delivery execution telemetry.
          </p>
        </div>

        {/* Tab Switcher: Route Optimization vs Delivery Efficiency */}
        <div className="flex bg-surface p-1 rounded-2xl border border-border shadow-xs self-start md:self-center">
          <button
            onClick={() => setActiveTab("OPTIMIZATION")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "OPTIMIZATION"
                ? "bg-forest text-surface shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-canvas"
            }`}
          >
            <Route className="w-4 h-4" />
            1. Route Optimizer (Planning)
          </button>

          <button
            onClick={() => setActiveTab("EFFICIENCY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "EFFICIENCY"
                ? "bg-forest text-surface shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-canvas"
            }`}
          >
            <Activity className="w-4 h-4" />
            2. Delivery Efficiency (Execution)
          </button>
        </div>
      </div>

      {/* VIEW 1: ROUTE OPTIMIZATION TAB (PLANNING) */}
      {activeTab === "OPTIMIZATION" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Bar */}
          <div className="p-4 rounded-2xl bg-canvas border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-ink-muted">
              <strong>Optimization Mode:</strong> Multi-stop TSP/VRP solving point-to-point transfers into a single closed loop.
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleReoptimize}
                disabled={isSolving}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface border border-border text-ink font-semibold text-xs hover:bg-canvas transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-4 h-4 text-forest ${isSolving ? "animate-spin" : ""}`} />
                {isSolving ? "Solving VRP..." : "Re-Run OR-Tools"}
              </button>

              <button
                onClick={handleDispatchFleet}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-forest text-surface font-bold text-xs hover:bg-forest-dark transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                Dispatch Van Itinerary
              </button>
            </div>
          </div>

          {/* Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-card">
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Optimized Distance</span>
                <Route className="w-4 h-4 text-forest" />
              </div>
              <div className="font-heading text-2xl font-bold text-ink">
                {optimizationResult.totalDistanceKm} <span className="text-sm font-normal text-ink-muted">km</span>
              </div>
              <div className="text-xs text-ink-muted mt-1">
                vs {optimizationResult.unoptimizedDistanceKm} km naive routing
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-card">
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Distance Reduction</span>
                <TrendingDown className="w-4 h-4 text-leaf" />
              </div>
              <div className="font-heading text-2xl font-bold text-leaf">
                -{optimizationResult.percentSaved}%
              </div>
              <div className="text-xs text-ink-muted mt-1">
                {optimizationResult.distanceSavedKm} km intra-campus miles saved
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-card">
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Loop Duration</span>
                <Clock className="w-4 h-4 text-forest" />
              </div>
              <div className="font-heading text-2xl font-bold text-ink">
                {optimizationResult.estimatedDurationMinutes} <span className="text-sm font-normal text-ink-muted">mins</span>
              </div>
              <div className="text-xs text-ink-muted mt-1">
                Includes 5m dwell time per stop
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-card">
              <div className="flex items-center justify-between text-ink-muted mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Fleet CO₂e Abated</span>
                <Zap className="w-4 h-4 text-forest" />
              </div>
              <div className="font-heading text-2xl font-bold text-forest">
                +{optimizationResult.co2SavedKg} <span className="text-sm font-normal text-ink-muted">kg</span>
              </div>
              <div className="text-xs text-ink-muted mt-1">
                Avoided van combustion emissions
              </div>
            </div>
          </div>

          {/* Main Grid: Batch Selector & Route Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Transfer Batch Checklist & Ordered Stops (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Transfer Batch Selection */}
              <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-ink flex items-center gap-2">
                    <Package className="w-4 h-4 text-forest" />
                    Approved Transfers for Dispatch ({selectedTransfers.length})
                  </h3>
                  <span className="text-[11px] text-ink-muted">Toggle to optimize</span>
                </div>

                <div className="space-y-2">
                  {transfers.map((item) => (
                    <label
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer text-xs ${
                        item.selected
                          ? "bg-forest-light/40 border-forest/30"
                          : "bg-canvas border-border/60 hover:bg-surfaceSubtle"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleToggleTransfer(item.id)}
                        className="mt-0.5 accent-forest rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink truncate">
                            {item.assetName}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-forest px-1.5 py-0.2 rounded bg-surface border border-border">
                            {item.urgency}
                          </span>
                        </div>
                        <div className="text-[11px] text-ink-muted mt-0.5 flex items-center gap-1.5">
                          <span className="font-semibold text-forest">{item.sourceDept.code}</span>
                          <ArrowRight className="w-3 h-3 text-ink-muted" />
                          <span className="font-semibold text-amber">{item.targetDept.code}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ordered Itinerary Sequence */}
              <div className="p-5 rounded-3xl bg-surface border border-border/80 shadow-card space-y-3">
                <h3 className="font-heading text-sm font-bold text-ink flex items-center gap-2">
                  <Route className="w-4 h-4 text-forest" />
                  Calculated Dispatch Itinerary ({optimizationResult.orderedStops.length} Waypoints)
                </h3>

                <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
                  {optimizationResult.orderedStops.map((stop, idx) => {
                    const isDepot = stop.type === "DEPOT";
                    const isPickup = stop.type === "PICKUP";

                    return (
                      <div key={`${stop.id}-${idx}`} className="relative flex items-start gap-3 pl-8 text-xs">
                        <div
                          className={`absolute left-1.5 top-1 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center font-bold text-[8px] text-surface ${
                            isDepot ? "bg-ink" : isPickup ? "bg-forest" : "bg-amber"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-ink">
                              {isDepot ? (idx === 0 ? "Depot Departure" : "Depot Return") : stop.name}
                            </span>
                            <span className="font-mono text-[10px] text-ink-muted">
                              {stop.departmentCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-muted">{stop.building}</p>
                          {stop.assetName && (
                            <span className="text-[10px] text-forest font-semibold block mt-0.5">
                              Payload: {stop.assetName}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Leaflet Route Map (7 cols) */}
            <div className="lg:col-span-7 h-[620px]">
              <RouteMapVisualizer
                stops={optimizationResult.orderedStops}
                polylineCoordinates={optimizationResult.polylineCoordinates}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DELIVERY EFFICIENCY TAB (EXECUTION) */}
      {activeTab === "EFFICIENCY" && <DeliveryEfficiencyDashboard />}
    </div>
  );
}
