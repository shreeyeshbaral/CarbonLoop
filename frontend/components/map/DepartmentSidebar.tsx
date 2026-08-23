"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  X,
  Boxes,
  AlertCircle,
  PackageCheck,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Department, Asset } from "@/types";
import { MOCK_ASSETS } from "@/lib/mockAssets";
import { formatCurrency } from "@/lib/utils";

interface DepartmentSidebarProps {
  department: Department | null;
  onClose: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

export function DepartmentSidebar({ department, onClose, onSelectAsset }: DepartmentSidebarProps) {
  if (!department) return null;

  const departmentAssets = MOCK_ASSETS.filter(
    (a) => a.departmentId === department.id || a.department?.code === department.code
  );

  return (
    <div className="w-full lg:w-96 rounded-3xl bg-surface border border-border/80 shadow-elevated p-6 flex flex-col justify-between max-h-[800px] overflow-y-auto animate-in slide-in-from-right-4 duration-200">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-surface flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-forest bg-forest-light px-2 py-0.5 rounded">
                {department.code}
              </span>
              <h3 className="font-heading text-base font-bold text-ink mt-0.5">
                {department.name}
              </h3>
              <p className="text-xs text-ink-muted">{department.building}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-canvas text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Node Telemetry Quick Strip */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="p-3 rounded-xl bg-forest-light/60 border border-forest/20 text-center">
            <span className="text-[10px] uppercase font-bold text-forest block">Declared Surplus</span>
            <span className="font-heading text-xl font-bold text-forest">
              +{department.surplusCount || departmentAssets.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-light/60 border border-amber/20 text-center">
            <span className="text-[10px] uppercase font-bold text-amber block">Open Shortages</span>
            <span className="font-heading text-xl font-bold text-amber">
              -{department.shortageCount || 12}
            </span>
          </div>
        </div>

        {/* Custodian Contact */}
        <div className="p-3 rounded-xl bg-canvas border border-border/50 text-xs space-y-1 mb-4 text-ink-muted">
          <div className="flex items-center gap-1.5 text-ink font-semibold">
            <User className="w-3.5 h-3.5 text-forest" />
            {department.managerName}
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Mail className="w-3.5 h-3.5 text-ink-muted" />
            {department.contactEmail}
          </div>
        </div>

        {/* Available Surplus Assets List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-forest" />
              Surplus Items in Node ({departmentAssets.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {departmentAssets.length > 0 ? (
              departmentAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 rounded-xl bg-surface border border-border/80 hover:border-forest/40 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink truncate max-w-[170px]">
                      {asset.name}
                    </span>
                    <span className="font-mono text-[10px] bg-canvas px-1.5 py-0.2 rounded border border-border text-ink-muted">
                      {asset.assetTag}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span>{asset.condition} Condition</span>
                    <span className="font-semibold text-forest">
                      {formatCurrency(asset.estimatedValue)}
                    </span>
                  </div>

                  <div className="pt-1.5 flex items-center gap-2">
                    <Link
                      href={`/assets/${asset.id}`}
                      className="text-[11px] font-semibold text-forest hover:underline"
                    >
                      Inspect Telemetry →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-ink-muted italic p-3 bg-canvas rounded-xl text-center">
                No surplus registered currently in this building.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-border/60">
        <Link
          href={`/intelligence?dept=${department.code}`}
          className="w-full py-2.5 px-4 rounded-xl bg-forest text-surface font-semibold text-xs text-center flex items-center justify-center gap-2 hover:bg-forest-dark transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Find Matching Shortages for {department.code}
        </Link>
      </div>
    </div>
  );
}
