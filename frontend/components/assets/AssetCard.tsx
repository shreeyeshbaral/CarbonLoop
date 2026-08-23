import React from "react";
import Link from "next/link";
import {
  Laptop,
  Monitor,
  Armchair,
  Table,
  Tv,
  Printer,
  Network,
  Microscope,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Sparkles,
  ArrowRight,
  IndianRupee,
  Wrench,
} from "lucide-react";
import { Asset, AssetCategory, CircularAction, AssetCondition } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface AssetCardProps {
  asset: Asset;
  onRequest?: (asset: Asset) => void;
}

export function AssetCard({ asset, onRequest }: AssetCardProps) {
  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case "LAPTOP":
      case "DESKTOP":
        return Laptop;
      case "MONITOR":
        return Monitor;
      case "CHAIR":
        return Armchair;
      case "DESK":
        return Table;
      case "PROJECTOR":
        return Tv;
      case "PRINTER":
        return Printer;
      case "NETWORKING":
        return Network;
      case "LAB_EQUIPMENT":
        return Microscope;
      default:
        return HelpCircle;
    }
  };

  const getActionBadge = (action: CircularAction) => {
    switch (action) {
      case "REUSE":
        return { label: "Direct Reuse", bg: "bg-forest-light", text: "text-forest", border: "border-forest/30" };
      case "REDISTRIBUTE":
        return { label: "Redistribute", bg: "bg-leaf-light", text: "text-leaf", border: "border-leaf/30" };
      case "REPAIR":
        return { label: "Repair & Refurb", bg: "bg-amber-light", text: "text-amber", border: "border-amber/30" };
      case "RECYCLE":
        return { label: "Recycle", bg: "bg-canvas", text: "text-ink-muted", border: "border-border" };
    }
  };

  const getConditionColor = (condition: AssetCondition) => {
    switch (condition) {
      case "EXCELLENT":
        return "text-forest bg-forest-light border-forest/20";
      case "GOOD":
        return "text-leaf bg-leaf-light border-leaf/20";
      case "FAIR":
        return "text-amber bg-amber-light border-amber/20";
      case "POOR":
      case "FOR_PARTS":
        return "text-crimson bg-crimson-light border-crimson/20";
    }
  };

  const CategoryIcon = getCategoryIcon(asset.category);
  const actionBadge = getActionBadge(asset.recommendedAction);

  return (
    <div className="rounded-2xl bg-surface border border-border/80 p-5 shadow-card hover:shadow-hover hover:border-forest/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-ink-muted bg-canvas px-2 py-0.5 rounded border border-border">
              {asset.assetTag}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getConditionColor(asset.condition)}`}>
              {asset.condition}
            </span>
          </div>

          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${actionBadge.bg} ${actionBadge.text} ${actionBadge.border}`}>
            {actionBadge.label}
          </span>
        </div>

        {/* Title & Category */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-canvas border border-border/80 flex items-center justify-center text-forest shrink-0 group-hover:scale-105 transition-transform">
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/assets/${asset.id}`}
              className="font-heading text-sm font-bold text-ink hover:text-forest transition-colors line-clamp-1 block"
            >
              {asset.name}
            </Link>
            <div className="text-[11px] text-ink-muted flex items-center gap-1.5 mt-0.5">
              <span>{asset.manufacturer || "Institutional Surplus"}</span>
              <span>•</span>
              <span>{asset.ageYears} yrs old</span>
            </div>
          </div>
        </div>

        {/* Department & Location */}
        <div className="p-2.5 rounded-xl bg-canvas border border-border/50 text-xs text-ink-muted space-y-1 mb-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium text-ink">
              <Building2 className="w-3.5 h-3.5 text-forest" />
              {asset.department?.name || "Department Stores"}
            </span>
            <span className="text-[10px] font-mono text-ink-muted">
              {asset.department?.code}
            </span>
          </div>
          <div className="text-[11px] text-ink-muted pl-4">
            {asset.location.building} · {asset.location.room || "Storage Bay"}
          </div>
        </div>

        {/* IT Security / Data Wipe Tag */}
        {asset.dataWipeRequired && (
          <div className="mb-3 flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg bg-surfaceSubtle border border-border/60">
            <div className="flex items-center gap-1.5 font-medium text-ink">
              {asset.dataWipeCompleted ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                  <span className="text-forest font-semibold">NIST 800-88 Wiped</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber" />
                  <span className="text-amber font-semibold">Data Wipe Pending</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-ink-muted">IT Security</span>
          </div>
        )}

        {/* Financial Valuation Strip */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs mb-4">
          <div>
            <span className="text-[10px] text-ink-muted block uppercase font-semibold">Value Retained</span>
            <span className="font-heading font-bold text-sm text-forest">
              {formatCurrency(asset.estimatedValue)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-ink-muted block uppercase font-semibold">Repair Cost</span>
            <span className="font-heading font-semibold text-xs text-ink flex items-center justify-end gap-0.5">
              {asset.estimatedRepairCost > 0 ? (
                <>
                  <Wrench className="w-3 h-3 text-amber" />
                  {formatCurrency(asset.estimatedRepairCost)}
                </>
              ) : (
                <span className="text-forest font-bold">₹0 (Ready)</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2">
        <Link
          href={`/assets/${asset.id}`}
          className="flex-1 text-center py-2 px-3 rounded-xl bg-canvas border border-border text-xs font-semibold text-ink hover:bg-surfaceSubtle hover:text-forest transition-colors"
        >
          Inspect Dossier
        </Link>
        <button
          onClick={() => onRequest?.(asset)}
          className="py-2 px-3 rounded-xl bg-forest text-surface text-xs font-semibold hover:bg-forest-dark transition-colors shadow-xs flex items-center gap-1 shrink-0"
        >
          Claim Asset
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
