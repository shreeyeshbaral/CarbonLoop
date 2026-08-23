"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MOCK_CATEGORY_LIFESPAN } from "@/lib/analyticsData";
import { Layers } from "lucide-react";

export function CategoryHealthChart() {
  const data = MOCK_CATEGORY_LIFESPAN;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="p-3 bg-surface border border-border rounded-xl shadow-elevated text-xs space-y-1">
          <span className="font-bold text-ink border-b border-border/40 pb-0.5 block">{label}</span>
          <div className="text-ink">Total Volume: <span className="font-bold">{item.totalVolume} units</span></div>
          <div className="text-forest">Reuse Rate: <span className="font-bold">{item.reuseRatePercent}%</span></div>
          <div className="text-ink-muted">Avg Age: <span className="font-bold">{item.averageAgeYears} yrs</span></div>
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
            <Layers className="w-4 h-4 text-forest" />
            Asset Category Longevity & Reuse Rates
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-canvas text-ink-muted border border-border">
            8 Hardware Categories
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          Operational lifespan extension metrics across institutional equipment classes.
        </p>
      </div>

      <div className="h-64 w-full my-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DCD8CC" vertical={false} opacity={0.6} />
            <XAxis
              dataKey="category"
              stroke="#6B716B"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#DCD8CC" }}
            />
            <YAxis
              stroke="#6B716B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#DCD8CC" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }}
            />
            <Bar dataKey="totalVolume" name="Total Tracked Assets" fill="#18201B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reuseRatePercent" name="Direct Circular Reuse Rate (%)" fill="#176B3A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-border/50 text-xs text-ink-muted flex items-center justify-between">
        <span>Highest Circular Class:</span>
        <span className="font-bold text-forest">Ergonomic Chairs (92% direct reuse) & Monitors (88%)</span>
      </div>
    </div>
  );
}
