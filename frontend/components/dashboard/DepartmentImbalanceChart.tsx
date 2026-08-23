"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MOCK_DEPARTMENT_IMBALANCES } from "@/lib/mockData";
import { Scale } from "lucide-react";

export function DepartmentImbalanceChart() {
  const data = MOCK_DEPARTMENT_IMBALANCES;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const surplus = payload.find((p: any) => p.dataKey === "surplus")?.value || 0;
      const shortage = payload.find((p: any) => p.dataKey === "shortage")?.value || 0;
      const net = surplus - shortage;

      return (
        <div className="p-3 bg-surface border border-border rounded-xl shadow-elevated text-xs space-y-1">
          <div className="font-bold text-ink border-b border-border/50 pb-1">
            Department: {label}
          </div>
          <div className="flex items-center justify-between gap-4 text-forest font-semibold">
            <span>Surplus Declared:</span>
            <span>+{surplus} items</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-amber font-semibold">
            <span>Shortage Needed:</span>
            <span>-{shortage} items</span>
          </div>
          <div className="pt-1 border-t border-border/50 flex items-center justify-between gap-4 font-bold text-ink">
            <span>Net Imbalance:</span>
            <span className={net >= 0 ? "text-forest" : "text-amber"}>
              {net >= 0 ? `+${net} (Net Surplus)` : `${net} (Net Shortage)`}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <Scale className="w-4 h-4 text-forest" />
            Departmental Imbalance Monitor
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-canvas text-ink-muted border border-border">
            8 Departments
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          Real-time surplus declarations versus unfulfilled procurement requests.
        </p>
      </div>

      <div className="h-64 w-full my-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DCD8CC" vertical={false} opacity={0.6} />
            <XAxis
              dataKey="department"
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }}
            />
            <Bar dataKey="surplus" name="Surplus Assets" fill="#176B3A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="shortage" name="Active Shortages" fill="#E98A3A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-2.5 rounded-xl bg-canvas border border-border/50 text-xs text-ink-muted flex items-center justify-between">
        <span>Opportunity Highlight:</span>
        <span className="font-semibold text-forest">
          Admin (+60) & Library (+34) can fulfill 100% of Design & Civil shortages
        </span>
      </div>
    </div>
  );
}
