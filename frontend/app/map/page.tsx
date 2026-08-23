"use client";

import React, { useState } from "react";
import {
  MapPin,
  Layers,
  Truck,
  Building2,
  Boxes,
  Sparkles,
  Navigation,
  Compass,
  ArrowRight,
} from "lucide-react";
import { ResourceMapCanvas } from "@/components/map/ResourceMapCanvas";
import { DepartmentSidebar } from "@/components/map/DepartmentSidebar";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { Department } from "@/types";

export default function ResourceMapPage() {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [selectedDept, setSelectedDept] = useState<Department | null>(MOCK_DEPARTMENTS[0]);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [mapMode, setMapMode] = useState<"INVENTORY" | "LOGISTICS">("INVENTORY");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Mode Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            Geospatial Resource Distribution
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Campus Circular Map
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Live geographic distribution of departmental surplus, equipment shortages, and active transit polylines.
          </p>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border shadow-xs">
          <button
            onClick={() => setMapMode("INVENTORY")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mapMode === "INVENTORY"
                ? "bg-forest text-surface shadow-xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Layers className="w-4 h-4" />
            Inventory Mode
          </button>
          <button
            onClick={() => setMapMode("LOGISTICS")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mapMode === "LOGISTICS"
                ? "bg-forest text-surface shadow-xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Truck className="w-4 h-4" />
            Logistics & Routes
          </button>
        </div>
      </div>

      {/* Layer Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-2xl bg-surface border border-border/80 shadow-card text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px] mr-1">
            Filter Nodes:
          </span>
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeFilter === "ALL"
                ? "bg-forest-light text-forest border border-forest/30"
                : "bg-canvas text-ink-muted hover:text-ink border border-border"
            }`}
          >
            All 8 Departments
          </button>
          <button
            onClick={() => setActiveFilter("SURPLUS_ONLY")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeFilter === "SURPLUS_ONLY"
                ? "bg-forest-light text-forest border border-forest/30"
                : "bg-canvas text-ink-muted hover:text-ink border border-border"
            }`}
          >
            Net Surplus Only (+🟢)
          </button>
          <button
            onClick={() => setActiveFilter("SHORTAGE_ONLY")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeFilter === "SHORTAGE_ONLY"
                ? "bg-amber-light text-amber border border-amber/30"
                : "bg-canvas text-ink-muted hover:text-ink border border-border"
            }`}
          >
            Net Shortages Only (-🟠)
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-forest"></span>
            <span>Surplus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber"></span>
            <span>Shortage</span>
          </div>
          {mapMode === "LOGISTICS" && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-forest border border-dashed border-forest inline-block"></span>
              <span>Active Polyline</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Map + Sidebar Split View */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full h-[620px]">
          <ResourceMapCanvas
            departments={departments}
            selectedDepartment={selectedDept}
            onSelectDepartment={(dept) => setSelectedDept(dept)}
            activeFilter={activeFilter}
            mapMode={mapMode}
          />
        </div>

        {/* Selected Department Side Drawer */}
        {selectedDept && (
          <DepartmentSidebar
            department={selectedDept}
            onClose={() => setSelectedDept(null)}
          />
        )}
      </div>
    </div>
  );
}
