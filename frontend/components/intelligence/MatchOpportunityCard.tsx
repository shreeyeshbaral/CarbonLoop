import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  MapPin,
  IndianRupee,
  CloudSun,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Truck,
  Check,
} from "lucide-react";
import { MatchOpportunity } from "@/types";
import { formatCurrency, formatWeight } from "@/lib/utils";

interface MatchOpportunityCardProps {
  match: MatchOpportunity;
  onInitiateTransfer: (match: MatchOpportunity) => void;
}

export function MatchOpportunityCard({ match, onInitiateTransfer }: MatchOpportunityCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleTransfer = () => {
    setIsRequested(true);
    onInitiateTransfer(match);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-forest bg-forest-light border-forest/30";
    if (score >= 75) return "text-leaf bg-leaf-light border-leaf/30";
    return "text-amber bg-amber-light border-amber/30";
  };

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-card hover:shadow-hover hover:border-forest/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Match Score & Badges */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`font-heading text-xs font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 ${getScoreColor(match.matchScore)}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {match.matchScore}/100 Match Score
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surfaceSubtle text-ink-muted border border-border">
              {match.request.urgency} Urgency
            </span>
          </div>

          <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-forest" />
            {match.distanceKm} km apart
          </span>
        </div>

        {/* Transfer Route Visual (Source Dept -> Target Dept) */}
        <div className="p-4 rounded-2xl bg-canvas border border-border/60 mb-4">
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Source */}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
                Surplus Source
              </span>
              <div className="font-bold text-ink truncate flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>{match.sourceDepartment.name}</span>
              </div>
              <span className="text-[11px] text-ink-muted block truncate">
                {match.sourceDepartment.building}
              </span>
            </div>

            {/* Arrow */}
            <div className="w-8 h-8 rounded-full bg-forest-light text-forest flex items-center justify-center shrink-0 shadow-xs">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Target */}
            <div className="min-w-0 flex-1 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber block">
                Shortage Target
              </span>
              <div className="font-bold text-ink truncate flex items-center justify-end gap-1 mt-0.5">
                <span>{match.targetDepartment.name}</span>
                <Building2 className="w-3.5 h-3.5 text-amber shrink-0" />
              </div>
              <span className="text-[11px] text-ink-muted block truncate">
                {match.targetDepartment.building}
              </span>
            </div>
          </div>
        </div>

        {/* Matched Asset Info */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-base font-bold text-ink group-hover:text-forest transition-colors">
              {match.asset.name}
            </h4>
            <span className="font-mono text-xs text-ink-muted bg-canvas px-2 py-0.5 rounded border border-border">
              {match.asset.assetTag}
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Condition: <span className="font-semibold text-ink">{match.asset.condition}</span> • Fulfills: <span className="font-semibold text-ink">&quot;{match.request.reason}&quot;</span>
          </p>
        </div>

        {/* Dividend Metrics (Economic & Carbon) */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-surfaceSubtle border border-border/50 text-xs mb-4">
          <div>
            <span className="text-[10px] text-ink-muted uppercase font-bold block">Procurement Avoided</span>
            <span className="font-heading font-bold text-sm text-forest">
              +{formatCurrency(match.procurementAvoided)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-ink-muted uppercase font-bold block">Avoided Scope 3</span>
            <span className="font-heading font-bold text-sm text-leaf">
              +{formatWeight(match.co2AvoidedKg)} CO₂e
            </span>
          </div>
        </div>

        {/* Key Reasons List */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
            Algorithmic Decision Justification:
          </span>
          {match.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-ink">
              <Check className="w-3.5 h-3.5 text-forest shrink-0" />
              <span className="text-[11px]">{reason}</span>
            </div>
          ))}
        </div>

        {/* Score Breakdown Accordion */}
        {showBreakdown && (
          <div className="p-3.5 rounded-xl bg-canvas border border-border text-xs space-y-2 mb-4 animate-in fade-in">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
              Multi-Factor Score Weights:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between p-1.5 bg-surface rounded border border-border/40">
                <span className="text-ink-muted">Category Spec (40%):</span>
                <span className="font-bold text-forest">{match.scoreBreakdown.compatibility}/40</span>
              </div>
              <div className="flex justify-between p-1.5 bg-surface rounded border border-border/40">
                <span className="text-ink-muted">Condition (25%):</span>
                <span className="font-bold text-forest">{match.scoreBreakdown.condition}/25</span>
              </div>
              <div className="flex justify-between p-1.5 bg-surface rounded border border-border/40">
                <span className="text-ink-muted">Proximity (20%):</span>
                <span className="font-bold text-forest">{match.scoreBreakdown.proximity}/20</span>
              </div>
              <div className="flex justify-between p-1.5 bg-surface rounded border border-border/40">
                <span className="text-ink-muted">Urgency (15%):</span>
                <span className="font-bold text-forest">{match.scoreBreakdown.urgency}/15</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1 transition-colors"
        >
          {showBreakdown ? (
            <>
              Hide Breakdown <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View Matrix Weights <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <button
          onClick={handleTransfer}
          disabled={isRequested}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
            isRequested
              ? "bg-forest-light text-forest border border-forest/30 cursor-default"
              : "bg-forest text-surface hover:bg-forest-dark"
          }`}
        >
          {isRequested ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Transfer Request Created
            </>
          ) : (
            <>
              <Truck className="w-4 h-4" /> Initiate Custody Transfer
            </>
          )}
        </button>
      </div>
    </div>
  );
}
