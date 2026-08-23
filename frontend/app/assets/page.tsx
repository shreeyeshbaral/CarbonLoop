"use client";

import React, { useState, useMemo } from "react";
import {
  Boxes,
  Search,
  Filter,
  PlusCircle,
  Sparkles,
  RotateCcw,
  Building2,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { AssetCard } from "@/components/assets/AssetCard";
import { RegisterAssetModal } from "@/components/assets/RegisterAssetModal";
import { MOCK_ASSETS } from "@/lib/mockAssets";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { Asset, AssetCategory, AssetCondition, CircularAction } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function AssetsMarketplacePage() {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedCondition, setSelectedCondition] = useState<string>("ALL");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [claimToast, setClaimToast] = useState<string | null>(null);

  // Multi-criteria predicate filtering
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        searchTerm === "" ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || asset.category === selectedCategory;

      const matchesDept =
        selectedDept === "ALL" || asset.department?.code === selectedDept;

      const matchesCondition =
        selectedCondition === "ALL" || asset.condition === selectedCondition;

      const matchesAction =
        selectedAction === "ALL" || asset.recommendedAction === selectedAction;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDept &&
        matchesCondition &&
        matchesAction
      );
    });
  }, [assets, searchTerm, selectedCategory, selectedDept, selectedCondition, selectedAction]);

  const totalValueUnlocked = useMemo(() => {
    return filteredAssets.reduce((sum, a) => sum + a.estimatedValue, 0);
  }, [filteredAssets]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setSelectedDept("ALL");
    setSelectedCondition("ALL");
    setSelectedAction("ALL");
  };

  const handleAssetClaim = (asset: Asset) => {
    setClaimToast(`Claim request submitted for ${asset.name} (${asset.assetTag}). Routing to Department Manager for approval.`);
    setTimeout(() => setClaimToast(null), 5000);
  };

  const handleNewAssetCreated = (newAsset: Asset) => {
    setAssets([newAsset, ...assets]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {claimToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-forest text-surface shadow-elevated flex items-center gap-3 border border-forest-light/20 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-leaf" />
          <span>{claimToast}</span>
        </div>
      )}

      {/* Header & Registration CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4" />
            Internal Surplus Exchange
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Institutional Asset Marketplace
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Search, claim, and redeploy surplus hardware and laboratory assets across campus departments.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-surface font-semibold text-xs sm:text-sm hover:bg-forest-dark transition-all shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Declare Surplus Asset
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-card space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by asset name, tag (e.g. ASSET-CSE-104), brand, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas border border-border text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-forest"
          />
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            >
              <option value="ALL">All Categories</option>
              <option value="LAPTOP">Laptops</option>
              <option value="MONITOR">Monitors</option>
              <option value="CHAIR">Chairs</option>
              <option value="DESK">Desks</option>
              <option value="PROJECTOR">Projectors</option>
              <option value="PRINTER">Printers</option>
              <option value="NETWORKING">Networking</option>
              <option value="LAB_EQUIPMENT">Lab Equipment</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            >
              <option value="ALL">All Departments</option>
              {MOCK_DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            >
              <option value="ALL">All Conditions</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
            </select>
          </div>

          {/* Circular Action */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
              Recommended Action
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            >
              <option value="ALL">All Circular Pathways</option>
              <option value="REUSE">Direct Reuse</option>
              <option value="REDISTRIBUTE">Redistribute</option>
              <option value="REPAIR">Repair & Refurbish</option>
              <option value="RECYCLE">Recycle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center justify-between text-xs text-ink-muted px-1 flex-wrap gap-2">
        <div>
          Showing <span className="font-bold text-ink">{filteredAssets.length}</span> surplus assets matching filters
          {" • "}
          Total Unlocked Value: <span className="font-bold text-forest">{formatCurrency(totalValueUnlocked)}</span>
        </div>

        {(searchTerm !== "" || selectedCategory !== "ALL" || selectedDept !== "ALL" || selectedCondition !== "ALL" || selectedAction !== "ALL") && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-ink hover:text-forest font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Asset Cards Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onRequest={handleAssetClaim} />
          ))}
        </div>
      ) : (
        /* Polished Empty State */
        <div className="p-12 text-center rounded-3xl bg-surface border border-border/80 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-canvas text-ink-muted flex items-center justify-center mx-auto border border-border">
            <Boxes className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-ink">
              No Surplus Assets Match Current Filters
            </h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Try adjusting your category, department, or condition criteria, or declare a new surplus asset.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-forest-light text-forest text-xs font-semibold hover:bg-forest hover:text-surface transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      )}

      {/* Register Asset Modal */}
      <RegisterAssetModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleNewAssetCreated}
      />
    </div>
  );
}
