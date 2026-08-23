import React from "react";
import { Award, TrendingUp, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { MOCK_DEPARTMENT_RANKINGS } from "@/lib/analyticsData";
import { formatCurrency, formatWeight } from "@/lib/utils";

export function DepartmentCircularityRankings() {
  const rankings = MOCK_DEPARTMENT_RANKINGS;

  const getTierBadge = (badge: string) => {
    switch (badge) {
      case "Gold Tier":
        return "bg-forest-light text-forest border-forest/30";
      case "Silver Tier":
        return "bg-leaf-light text-leaf border-leaf/30";
      case "Bronze Tier":
        return "bg-amber-light text-amber border-amber/30";
      default:
        return "bg-canvas text-ink-muted border-border";
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <Award className="w-4 h-4 text-forest" />
            Department Circularity Index (DCI) Leaderboard
          </h3>
          <p className="text-xs text-ink-muted">
            Ranked by surplus asset recovery, shortage fulfillment, and carbon efficiency.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-forest-light text-forest">
          8 Departments Ranked
        </span>
      </div>

      <div className="space-y-2.5">
        {rankings.map((dept) => (
          <div
            key={dept.code}
            className="p-3.5 rounded-2xl bg-canvas border border-border/60 hover:border-forest/40 transition-all flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-surface border border-border flex items-center justify-center font-heading font-extrabold text-ink shrink-0">
                #{dept.rank}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink truncate">{dept.name}</span>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded border ${getTierBadge(dept.badge)}`}>
                    {dept.badge}
                  </span>
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  +{dept.surplusShared} Surplus shared • -{dept.shortagesFulfilled} Shortages fulfilled
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-heading font-extrabold text-sm text-forest">
                {dept.circularityScore}/100 DCI
              </div>
              <div className="text-[10px] text-ink-muted">
                +{formatCurrency(dept.capitalSavedInr)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
