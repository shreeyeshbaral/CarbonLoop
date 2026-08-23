import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: "forest" | "leaf" | "amber" | "charcoal" | "crimson";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "forest",
  className,
}: StatCardProps) {
  const accentStyles = {
    forest: {
      bg: "bg-forest-light",
      text: "text-forest",
      border: "border-forest/20",
    },
    leaf: {
      bg: "bg-leaf-light",
      text: "text-leaf",
      border: "border-leaf/20",
    },
    amber: {
      bg: "bg-amber-light",
      text: "text-amber",
      border: "border-amber/20",
    },
    crimson: {
      bg: "bg-crimson-light",
      text: "text-crimson",
      border: "border-crimson/20",
    },
    charcoal: {
      bg: "bg-surfaceSubtle",
      text: "text-ink",
      border: "border-border",
    },
  }[accentColor];

  return (
    <div
      className={cn(
        "relative p-5 rounded-2xl bg-surface border border-border/80 shadow-card hover:shadow-hover hover:border-forest/30 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {title}
          </p>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {value}
          </h3>
        </div>

        <div className={cn("p-2.5 rounded-xl shrink-0 border", accentStyles.bg, accentStyles.text, accentStyles.border)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
          {subtitle && <span className="text-ink-muted">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md",
                trend.isPositive ? "bg-forest-light text-forest" : "bg-amber-light text-amber"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
              {trend.label && <span className="font-normal text-[10px] text-ink-muted ml-0.5">{trend.label}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
