"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Sliders,
  Filter,
  CheckCircle2,
  Building2,
  TrendingUp,
  RotateCcw,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { MatchOpportunityCard } from "@/components/intelligence/MatchOpportunityCard";
import { CreateShortageModal } from "@/components/intelligence/CreateShortageModal";
import { useAssets } from "@/context/AssetContext";
import { useShortages } from "@/context/ShortageContext";
import { scoreMatch } from "@/lib/matchingEngine";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { MatchOpportunity, Department } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function MatchingEnginePage() {
  const { assets } = useAssets();
  const { shortages } = useShortages();

  const [minScore, setMinScore] = useState<number>(60);
  const [selectedSourceDept, setSelectedSourceDept] = useState<string>("ALL");
  const [selectedTargetDept, setSelectedTargetDept] = useState<string>("ALL");
  const [transferToast, setTransferToast] = useState<string | null>(null);
  const [isShortageModalOpen, setIsShortageModalOpen] = useState(false);

  // Dynamically compute real-time matches between live surplus assets and active shortages
  const computedMatches: MatchOpportunity[] = useMemo(() => {
    const results: MatchOpportunity[] = [];
    const availableAssets = assets.filter(
      (a) => a.status === "AVAILABLE" || a.status === "DATA_WIPED"
    );
    const openShortages = shortages.filter((s) => s.status === "OPEN");

    availableAssets.forEach((asset) => {
      openShortages.forEach((req) => {
        // Resolve departments
        const sourceDept: Department =
          asset.department ||
          MOCK_DEPARTMENTS.find((d) => d.id === asset.departmentId || d.code === asset.department?.code) ||
          MOCK_DEPARTMENTS[0];

        const targetDept: Department =
          req.department ||
          MOCK_DEPARTMENTS.find((d) => d.id === req.departmentId || d.code === req.department?.code) ||
          MOCK_DEPARTMENTS[1];

        // Skip if same department
        if (sourceDept.id === targetDept.id || sourceDept.code === targetDept.code) {
          return;
        }

        // Only pair if category matches or is compatible
        if (asset.category === req.category) {
          const matchResult = scoreMatch(asset, req, sourceDept, targetDept);

          results.push({
            id: `match-${asset.id}-${req.id}`,
            assetId: asset.id,
            asset,
            requestId: req.id,
            request: req,
            sourceDepartment: sourceDept,
            targetDepartment: targetDept,
            matchScore: matchResult.matchScore,
            scoreBreakdown: matchResult.scoreBreakdown,
            distanceKm: matchResult.distanceKm,
            procurementAvoided: matchResult.procurementAvoided,
            co2AvoidedKg: matchResult.co2AvoidedKg,
            reasons: matchResult.reasons,
            status: "PROPOSED",
          });
        }
      });
    });

    // Sort descending by match score
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }, [assets, shortages]);

  // Predicate filtering
  const filteredMatches = useMemo(() => {
    return computedMatches.filter((match) => {
      const passesMinScore = match.matchScore >= minScore;
      const passesSource =
        selectedSourceDept === "ALL" ||
        match.sourceDepartment.code === selectedSourceDept;
      const passesTarget =
        selectedTargetDept === "ALL" ||
        match.targetDepartment.code === selectedTargetDept;

      return passesMinScore && passesSource && passesTarget;
    });
  }, [computedMatches, minScore, selectedSourceDept, selectedTargetDept]);

  const totalPotentialSavings = useMemo(() => {
    return filteredMatches.reduce((sum, m) => sum + m.procurementAvoided, 0);
  }, [filteredMatches]);

  const totalPotentialCo2 = useMemo(() => {
    return filteredMatches.reduce((sum, m) => sum + m.co2AvoidedKg, 0);
  }, [filteredMatches]);

  const handleInitiateTransfer = (match: MatchOpportunity) => {
    setTransferToast(
      `Custody transfer initiated for ${match.asset.name} (${match.sourceDepartment.code} → ${match.targetDepartment.code}). Dispatched to Route Optimizer.`
    );
    setTimeout(() => setTransferToast(null), 6000);
  };

  const handleResetFilters = () => {
    setMinScore(60);
    setSelectedSourceDept("ALL");
    setSelectedTargetDept("ALL");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {transferToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-forest text-surface shadow-elevated flex items-center gap-3 border border-forest-light/20 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-leaf" />
          <div className="space-y-1">
            <p className="font-bold">{transferToast}</p>
            <Link href="/routes" className="text-leaf underline font-semibold block text-[11px]">
              View in Reverse Logistics Route Optimizer →
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Deterministic Algorithmic Pairing
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Surplus ↔ Shortage Matching Engine
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Autonomous multi-factor pairing algorithm connecting departmental surplus with active campus procurement requisitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShortageModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-surface font-semibold text-xs sm:text-sm hover:bg-forest-dark transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Declare Equipment Shortage
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-card">
          <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
            Pairings Generated
          </span>
          <div className="font-heading text-2xl font-bold text-ink mt-1">
            {filteredMatches.length} <span className="text-sm font-normal text-ink-muted">Opportunities</span>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">Across {shortages.length} open requisitions</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-card">
          <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
            Avoidable Procurement
          </span>
          <div className="font-heading text-2xl font-bold text-forest mt-1">
            {formatCurrency(totalPotentialSavings)}
          </div>
          <p className="text-xs text-ink-muted mt-0.5">Direct retained university capital</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-card">
          <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
            Scope 3 Carbon Abatement
          </span>
          <div className="font-heading text-2xl font-bold text-leaf mt-1">
            +{totalPotentialCo2.toFixed(1)} <span className="text-sm font-normal text-ink-muted">kg CO₂e</span>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">Avoided new manufacturing emissions</p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Slider: Minimum Match Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-ink flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-forest" />
                Minimum Match Score
              </label>
              <span className="font-mono font-bold text-forest bg-forest-light px-2 py-0.5 rounded">
                {minScore}%
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              step={5}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-forest cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-muted">
              <span>40% (Broad)</span>
              <span>70% (Recommended)</span>
              <span>95% (Exact)</span>
            </div>
          </div>

          {/* Source Department Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Source Department (Surplus Holder)
            </label>
            <select
              value={selectedSourceDept}
              onChange={(e) => setSelectedSourceDept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            >
              <option value="ALL">All Source Faculties</option>
              {MOCK_DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Target Department Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Target Department (Requester)
            </label>
            <select
              value={selectedTargetDept}
              onChange={(e) => setSelectedTargetDept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            >
              <option value="ALL">All Requesters</option>
              {MOCK_DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-ink-muted px-1">
          <span>
            Ranked by multi-factor score: <strong className="text-ink">Compatibility (40%) + Condition (25%) + Proximity (20%) + Urgency (15%)</strong>
          </span>
          {(minScore !== 60 || selectedSourceDept !== "ALL" || selectedTargetDept !== "ALL") && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-forest font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {filteredMatches.length > 0 ? (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <MatchOpportunityCard
                key={match.id}
                match={match}
                onInitiateTransfer={handleInitiateTransfer}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-surface border border-border/80 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-canvas text-ink-muted flex items-center justify-center mx-auto border border-border">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-ink">
              No Matches Found Above {minScore}% Threshold
            </h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Try lowering the minimum match score slider or declare a new department equipment shortage.
            </p>
            <button
              onClick={() => setMinScore(50)}
              className="px-4 py-2 rounded-xl bg-forest-light text-forest text-xs font-semibold hover:bg-forest hover:text-surface transition-colors"
            >
              Lower Threshold to 50%
            </button>
          </div>
        )}
      </div>

      {/* Create Shortage Modal */}
      <CreateShortageModal
        isOpen={isShortageModalOpen}
        onClose={() => setIsShortageModalOpen(false)}
      />
    </div>
  );
}
