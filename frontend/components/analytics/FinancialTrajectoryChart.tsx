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
import { IndianRupee, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function FinancialTrajectoryChart() {
  const data = MOCK_MONTHLY_IMPACT;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="p-3 bg-surface border border-border rounded-xl shadow-elevated text-xs space-y-1">
          <span className="font-bold text-ink border-b border-border/40 pb-0.5 block">{label} 2024</span>
          <div className="flex items-center gap-2 text-forest font-bold">
            <span>Capital Retained:</span>
            <span>{formatCurrency(val)}</span>
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
            <IndianRupee className="w-4 h-4 text-forest" />
            Cumulative Capital Procurement Avoided
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-forest-light text-forest">
            +₹48.65L YTD
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          Monetary value retained through internal redeployment vs new equipment purchase.
        </p>
      </div>

      <div className="h-64 w-full my-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#176B3A" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#176B3A" stopOpacity={0.0} />
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
              tickFormatter={(v) => `₹${v / 100000}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="procurementAvoidedInr"
              stroke="#176B3A"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#forestGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-border/50 text-xs text-ink-muted flex items-center justify-between">
        <span>Quarterly Growth Rate:</span>
        <span className="font-semibold text-forest flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> +28.4% Month-over-Month
        </span>
      </div>
    </div>
  );
}
