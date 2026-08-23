"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Filter,
  ArrowRight,
  Boxes,
  Building2,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Scale,
  RotateCcw,
} from "lucide-react";
import { MatchOpportunityCard } from "@/components/intelligence/MatchOpportunityCard";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { MOCK_ASSETS } from "@/lib/mockAssets";
import { scoreMatch } from "@/lib/matchingEngine";
import { MatchOpportunity, ShortageRequest, Department } from "@/types";
import { formatCurrency, formatWeight } from "@/lib/utils";

export default function IntelligencePage() {
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [targetFilter, setTargetFilter] = useState<string>("ALL");
  const [minScore, setMinScore] = useState<number>(70);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synthetic Shortage Requests pool for intelligence matching
  const shortagePool: ShortageRequest[] = useMemo(
    () => [
      {
        id: "req-01",
        departmentId: "dept-design",
        category: "MONITOR",
        quantityRequested: 4,
        quantityFulfilled: 0,
        urgency: "HIGH",
        minimumCondition: "GOOD",
        requestedBy: "Prof. Kabir Sen",
        reason: "UI/UX studio requires color-accurate 27-inch secondary monitors for student portfolio projects.",
        status: "OPEN",
        createdAt: "2024-08-14T09:00:00Z",
      },
      {
        id: "req-02",
        departmentId: "dept-design",
        category: "LAPTOP",
        quantityRequested: 3,
        quantityFulfilled: 0,
        urgency: "CRITICAL",
        minimumCondition: "GOOD",
        requestedBy: "Aanya Mehta",
        reason: "Field research fellows need high-performance laptops for generative media rendering.",
        status: "OPEN",
        createdAt: "2024-08-15T11:00:00Z",
      },
      {
        id: "req-03",
        departmentId: "dept-civil",
        category: "PROJECTOR",
        quantityRequested: 1,
        quantityFulfilled: 0,
        urgency: "MEDIUM",
        minimumCondition: "FAIR",
        requestedBy: "Prof. Nandini Rao",
        reason: "Structures Seminar Hall projector failed; need classroom replacement.",
        status: "OPEN",
        createdAt: "2024-08-16T14:30:00Z",
      },
      {
        id: "req-04",
        departmentId: "dept-research",
        category: "NETWORKING",
        quantityRequested: 2,
        quantityFulfilled: 0,
        urgency: "HIGH",
        minimumCondition: "EXCELLENT",
        requestedBy: "Dr. Vikram Sethi",
        reason: "PoE+ gigabit switch required for cleanroom environmental sensor array.",
        status: "OPEN",
        createdAt: "2024-08-17T10:15:00Z",
      },
      {
        id: "req-05",
        departmentId: "dept-research",
        category: "CHAIR",
        quantityRequested: 8,
        quantityFulfilled: 0,
        urgency: "MEDIUM",
        minimumCondition: "GOOD",
        requestedBy: "Dr. Vikram Sethi",
        reason: "Post-doctoral workspace expansion requires ergonomic seating.",
        status: "OPEN",
        createdAt: "2024-08-18T16:00:00Z",
      },
      {
        id: "req-06",
        departmentId: "dept-cse",
        category: "DESK",
        quantityRequested: 2,
        quantityFulfilled: 0,
        urgency: "LOW",
        minimumCondition: "GOOD",
        requestedBy: "Prof. Priya Sharma",
        reason: "Faculty reading cubicles addition.",
        status: "OPEN",
        createdAt: "2024-08-19T08:45:00Z",
      },
    ],
    []
  );

  // Compute all matching pairs dynamically using our deterministic matching engine
  const allMatchOpportunities: MatchOpportunity[] = useMemo(() => {
    const matches: MatchOpportunity[] = [];

    for (const asset of MOCK_ASSETS) {
      const sourceDept =
        MOCK_DEPARTMENTS.find((d) => d.id === asset.departmentId || d.code === asset.department?.code) ||
        MOCK_DEPARTMENTS[0];

      for (const req of shortagePool) {
        // Skip matching an asset with its own department
        if (sourceDept.id === req.departmentId) continue;

        const targetDept =
          MOCK_DEPARTMENTS.find((d) => d.id === req.departmentId) || MOCK_DEPARTMENTS[4];

        const scoreResult = scoreMatch(asset, req, sourceDept, targetDept);

        if (scoreResult.matchScore >= 50) {
          matches.push({
            id: `match-${asset.id}-${req.id}`,
            assetId: asset.id,
            asset,
            requestId: req.id,
            request: req,
            sourceDepartment: sourceDept,
            targetDepartment: targetDept,
            matchScore: scoreResult.matchScore,
            scoreBreakdown: scoreResult.scoreBreakdown,
            distanceKm: scoreResult.distanceKm,
            procurementAvoided: scoreResult.procurementAvoided,
            co2AvoidedKg: scoreResult.co2AvoidedKg,
            reasons: scoreResult.reasons,
            status: "PROPOSED",
          });
        }
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }, [shortagePool]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    return allMatchOpportunities.filter((match) => {
      const matchesSource =
        sourceFilter === "ALL" || match.sourceDepartment.code === sourceFilter;
      const matchesTarget =
        targetFilter === "ALL" || match.targetDepartment.code === targetFilter;
      const matchesScore = match.matchScore >= minScore;

      return matchesSource && matchesTarget && matchesScore;
    });
  }, [allMatchOpportunities, sourceFilter, targetFilter, minScore]);

  const totalProcurementAvoided = useMemo(() => {
    return filteredMatches.reduce((sum, m) => sum + m.procurementAvoided, 0);
  }, [filteredMatches]);

  const totalCo2Avoided = useMemo(() => {
    return filteredMatches.reduce((sum, m) => sum + m.co2AvoidedKg, 0);
  }, [filteredMatches]);

  const handleInitiateTransfer = (match: MatchOpportunity) => {
    setToastMessage(
      `Transfer proposal created for ${match.asset.name} (${match.sourceDepartment.code} → ${match.targetDepartment.code}). State advanced to APPROVAL_PENDING.`
    );
    setTimeout(() => setToastMessage(null), 6000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-forest text-surface shadow-elevated flex items-center gap-3 border border-forest-light/20 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-leaf" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Deterministic Resource Allocation
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Surplus ↔ Shortage Matching Engine
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Multi-factor algorithmic pairings matching idle departmental assets with active campus procurement demand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-forest-light text-forest border border-forest/20">
            {allMatchOpportunities.length} Total Pairings Computed
          </span>
        </div>
      </div>

      {/* Aggregate Metric Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-forest-light text-forest flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted block">High-Confidence Matches</span>
            <span className="font-heading text-xl font-bold text-ink">{filteredMatches.length} Opportunities</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-leaf-light text-leaf flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted block">Unrealized Capital Recovery</span>
            <span className="font-heading text-xl font-bold text-forest">+{formatCurrency(totalProcurementAvoided)}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-light text-amber flex items-center justify-center font-bold shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted block">Embodied Carbon Abatement</span>
            <span className="font-heading text-xl font-bold text-ink">+{formatWeight(totalCo2Avoided)} CO₂e</span>
          </div>
        </div>
      </div>

      {/* Filter and Matrix Tuning Bar */}
      <div className="p-5 rounded-2xl bg-surface border border-border/80 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Source Department Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Source Department (Surplus)
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            >
              <option value="ALL">All Source Departments</option>
              {MOCK_DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Target Department Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Target Department (Shortage)
            </label>
            <select
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            >
              <option value="ALL">All Target Departments</option>
              {MOCK_DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Match Score Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Minimum Match Score
              </label>
              <span className="font-heading font-bold text-xs text-forest">
                {minScore}/100
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-forest cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <MatchOpportunityCard
              key={match.id}
              match={match}
              onInitiateTransfer={handleInitiateTransfer}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-surface border border-border text-xs text-ink-muted space-y-3 shadow-card">
          <Sparkles className="w-8 h-8 mx-auto text-ink-muted" />
          <p className="font-bold text-sm text-ink">No Match Opportunities Exceeding {minScore}% Threshold</p>
          <p className="text-ink-muted">Try lowering the minimum score slider or widening departmental filters.</p>
          <button
            onClick={() => {
              setSourceFilter("ALL");
              setTargetFilter("ALL");
              setMinScore(50);
            }}
            className="px-4 py-2 rounded-xl bg-forest-light text-forest font-semibold hover:bg-forest hover:text-surface transition-colors"
          >
            Reset Matching Filters
          </button>
        </div>
      )}
    </div>
  );
}
