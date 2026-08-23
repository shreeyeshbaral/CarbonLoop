"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MOCK_CIRCULAR_PATHWAYS } from "@/lib/mockData";
import { RefreshCw } from "lucide-react";

export function CircularityChart() {
  const data = MOCK_CIRCULAR_PATHWAYS;
  const totalItems = data.reduce((acc, curr) => acc + curr.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="p-3 bg-surface border border-border rounded-xl shadow-elevated text-xs">
          <div className="flex items-center gap-2 font-bold text-ink mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name}
          </div>
          <div className="text-ink-muted">
            Volume: <span className="font-semibold text-ink">{item.count} assets</span> ({item.percentage}%)
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
            <RefreshCw className="w-4 h-4 text-forest" />
            Circular Pathway Allocation
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-forest-light text-forest">
            {totalItems} Decisions
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          AI & Rule Engine routing across Reuse, Redistribute, Repair, and Certified Recycling.
        </p>
      </div>

      <div className="h-60 w-full relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFDF8" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label inside donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-heading text-2xl font-bold text-ink">71%</span>
          <span className="text-[10px] uppercase font-semibold text-forest tracking-wider">
            Direct Circularity
          </span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50 text-xs">
        {data.map((item) => (
          <div key={item.action} className="flex items-center justify-between p-2 rounded-lg bg-canvas border border-border/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-ink font-medium truncate">{item.name}</span>
            </div>
            <span className="font-bold text-ink shrink-0 ml-1">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
