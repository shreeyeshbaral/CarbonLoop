import React from "react";
import { History, ShieldCheck, CheckCircle2, PackagePlus, Truck, ArrowRight } from "lucide-react";
import { MOCK_RECENT_ACTIVITIES, ActivityItem } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export function RecentActivityFeed() {
  const activities = MOCK_RECENT_ACTIVITIES;

  const getActionBadge = (type: ActivityItem["actionType"]) => {
    switch (type) {
      case "DATA_WIPED":
        return {
          label: "Data Wiped",
          icon: ShieldCheck,
          bg: "bg-forest-light",
          text: "text-forest",
          border: "border-forest/20",
        };
      case "MATCH_APPROVED":
        return {
          label: "Approved",
          icon: CheckCircle2,
          bg: "bg-leaf-light",
          text: "text-leaf",
          border: "border-leaf/20",
        };
      case "SURPLUS_REGISTERED":
        return {
          label: "Surplus Intake",
          icon: PackagePlus,
          bg: "bg-sand-light",
          text: "text-ink",
          border: "border-border",
        };
      case "IN_TRANSIT":
        return {
          label: "In Transit",
          icon: Truck,
          bg: "bg-amber-light",
          text: "text-amber",
          border: "border-amber/20",
        };
      case "DELIVERED":
        return {
          label: "Completed",
          icon: CheckCircle2,
          bg: "bg-forest-light",
          text: "text-forest",
          border: "border-forest/20",
        };
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <History className="w-4 h-4 text-forest" />
            Live Circular Audit Stream
          </h3>
          <p className="text-xs text-ink-muted">
            Immutable log of institutional surplus transitions and verifications.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-forest bg-forest-light px-2.5 py-1 rounded-full animate-pulse">
          Live Sync
        </span>
      </div>

      <div className="space-y-3 divide-y divide-border/40">
        {activities.map((item) => {
          const badge = getActionBadge(item.actionType);
          const BadgeIcon = badge.icon;

          return (
            <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  <BadgeIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-ink truncate max-w-[200px] sm:max-w-xs">
                      {item.assetName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-canvas text-ink-muted border border-border">
                      {item.assetTag}
                    </span>
                  </div>

                  <div className="text-[11px] text-ink-muted mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-ink">{item.actorName}</span>
                    <span>•</span>
                    <span>{item.fromDept}</span>
                    {item.toDept && (
                      <>
                        <ArrowRight className="w-3 h-3 text-forest inline" />
                        <span className="font-medium text-forest">{item.toDept}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-ink-muted">{item.timestamp}</div>
                {item.savingsInr && (
                  <div className="text-[11px] font-bold text-forest mt-0.5">
                    +{formatCurrency(item.savingsInr)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 text-center">
        <a
          href="/assets"
          className="text-xs font-semibold text-forest hover:text-forest-dark transition-colors inline-flex items-center gap-1"
        >
          View Full Audit Trail & Custody Chain →
        </a>
      </div>
    </div>
  );
}
