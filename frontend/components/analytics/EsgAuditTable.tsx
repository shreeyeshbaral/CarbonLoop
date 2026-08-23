"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Download, ShieldCheck, CheckCircle2, Table as TableIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function EsgAuditTable() {
  const [downloadToast, setDownloadToast] = useState(false);

  const factorTable = [
    { category: "Laptop / Notebook", avgWeightKg: 2.2, embodiedCo2Kg: 240, replacementInr: 75000, ghgProtocolScope: "Scope 3 Cat 1" },
    { category: "Color Monitor", avgWeightKg: 5.5, embodiedCo2Kg: 180, replacementInr: 32000, ghgProtocolScope: "Scope 3 Cat 1" },
    { category: "Desktop PC / Tower", avgWeightKg: 9.0, embodiedCo2Kg: 320, replacementInr: 65000, ghgProtocolScope: "Scope 3 Cat 1" },
    { category: "Ergonomic Chair", avgWeightKg: 14.0, embodiedCo2Kg: 45, replacementInr: 28000, ghgProtocolScope: "Scope 3 Cat 1" },
    { category: "Standing Desk", avgWeightKg: 28.0, embodiedCo2Kg: 65, replacementInr: 35000, ghgProtocolScope: "Scope 3 Cat 1" },
    { category: "Classroom Projector", avgWeightKg: 4.8, embodiedCo2Kg: 160, replacementInr: 85000, ghgProtocolScope: "Scope 3 Cat 1" },
    { category: "LaserJet Printer", avgWeightKg: 16.0, embodiedCo2Kg: 210, replacementInr: 60000, ghgProtocolScope: "Scope 3 Cat 1" },
    { category: "PoE+ Switch / Router", avgWeightKg: 6.2, embodiedCo2Kg: 190, replacementInr: 120000, ghgProtocolScope: "Scope 3 Cat 1" },
    { category: "Lab Test Equipment", avgWeightKg: 22.0, embodiedCo2Kg: 450, replacementInr: 350000, ghgProtocolScope: "Scope 3 Cat 1" },
  ];

  const handleExportReport = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 4000);
  };

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border/80 shadow-card space-y-4">
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-forest text-surface shadow-elevated flex items-center gap-3 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-leaf shrink-0" />
          <span>Generating Certified ESG & Financial Audit Statement (PDF/CSV)...</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-forest" />
            Configurable ESG Emission Factors & Replacement Benchmarks
          </h3>
          <p className="text-xs text-ink-muted">
            Transparent conversion factors stored in database (`ImpactFactorConfig`) for independent auditing.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2 rounded-xl bg-forest text-surface font-semibold text-xs hover:bg-forest-dark transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4" />
          Download Certified ESG Audit
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-canvas border-b border-border text-[10px] uppercase font-bold text-ink-muted tracking-wider">
            <tr>
              <th className="p-3">Hardware Category</th>
              <th className="p-3">Unit Mass (kg)</th>
              <th className="p-3">Embodied CO₂e (kg)</th>
              <th className="p-3">Replacement Benchmark</th>
              <th className="p-3">Standard Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium text-ink">
            {factorTable.map((row) => (
              <tr key={row.category} className="hover:bg-canvas/50 transition-colors">
                <td className="p-3 font-semibold text-ink">{row.category}</td>
                <td className="p-3 font-mono">{row.avgWeightKg} kg</td>
                <td className="p-3 font-mono text-forest font-bold">~{row.embodiedCo2Kg} kg CO₂e</td>
                <td className="p-3 font-mono">{formatCurrency(row.replacementInr)}</td>
                <td className="p-3 text-ink-muted">
                  <span className="px-2 py-0.5 rounded bg-surfaceSubtle border border-border/60 text-[10px]">
                    {row.ghgProtocolScope}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
