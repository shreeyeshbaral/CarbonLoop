"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MOCK_MONTHLY_IMPACT } from "@/lib/analyticsData";
import { CloudSun, Leaf } from "lucide-react";
import { formatWeight } from "@/lib/utils";

export function CarbonAbatementChart() {
  const data = MOCK_MONTHLY_IMPACT;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="p-3 bg-surface border border-border rounded-xl shadow-elevated text-xs space-y-1">
          <span className="font-bold text-ink border-b border-border/40 pb-0.5 block">{label} 2024</span>
          <div className="flex items-center gap-2 text-leaf font-bold">
            <span>Embodied CO₂e Abated:</span>
            <span>{formatWeight(val)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-leaf" />
            Scope 3 Embodied Carbon Abatement
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-leaf-light text-leaf">
            9.15 Metric Tons CO₂e
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          Avoided cradle-to-gate manufacturing emissions under GHG Protocol Scope 3 Cat 1.
        </p>
      </div>

      <div className="h-64 w-full my-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="leafGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E9B59" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2E9B59" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#DCD8CC" vertical={false} opacity={0.6} />
            <XAxis
              dataKey="month"
              stroke="#6B716B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#DCD8CC" }}
            />
            <YAxis
              stroke="#6B716B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#DCD8CC" }}
              tickFormatter={(v) => `${v} kg`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="co2AvoidedKg"
              stroke="#2E9B59"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#leafGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-border/50 text-xs text-ink-muted flex items-center justify-between">
        <span>Equivalence Benchmark:</span>
        <span className="font-semibold text-leaf">
          🌳 Equivalent to ~415 mature trees absorbing carbon for 1 year
        </span>
      </div>
    </div>
  );
}
