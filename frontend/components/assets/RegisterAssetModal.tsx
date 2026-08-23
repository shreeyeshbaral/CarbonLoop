"use client";

import React, { useState } from "react";
import { X, Sparkles, PlusCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { AssetCategory, AssetCondition, CircularAction } from "@/types";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";

interface RegisterAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAsset: any) => void;
}

export function RegisterAssetModal({ isOpen, onClose, onSuccess }: RegisterAssetModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "LAPTOP" as AssetCategory,
    condition: "GOOD" as AssetCondition,
    departmentId: "dept-cse",
    building: "Alan Turing IT Complex",
    room: "",
    originalPrice: 75000,
    naturalDescription: "",
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState<{
    recommendedAction: CircularAction;
    confidence: number;
    dataWipeRequired: boolean;
    reasoning: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulateAiAssessment = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const isLaptopOrIT = ["LAPTOP", "DESKTOP", "PRINTER", "NETWORKING"].includes(formData.category);
      setAiPreview({
        recommendedAction: formData.condition === "POOR" ? "REPAIR" : "REDISTRIBUTE",
        confidence: 0.94,
        dataWipeRequired: isLaptopOrIT,
        reasoning: `Based on condition (${formData.condition}) and institutional shortage telemetry, this ${formData.category.toLowerCase()} is classified for immediate circular redeployment.`,
      });
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdAsset = {
      id: `ast-${Date.now().toString().slice(-4)}`,
      assetTag: `ASSET-NEW-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name || `Surplus ${formData.category}`,
      category: formData.category,
      condition: formData.condition,
      departmentId: formData.departmentId,
      department: MOCK_DEPARTMENTS.find((d) => d.id === formData.departmentId) || MOCK_DEPARTMENTS[0],
      location: { lat: 12.9716, lng: 77.5946, building: formData.building, room: formData.room },
      ageYears: 2.0,
      purchaseDate: "2022-01-01",
      originalPrice: Number(formData.originalPrice) || 50000,
      estimatedValue: Math.round((Number(formData.originalPrice) || 50000) * 0.55),
      estimatedRepairCost: formData.condition === "POOR" ? 4500 : 0,
      status: "AVAILABLE",
      dataWipeRequired: aiPreview ? aiPreview.dataWipeRequired : ["LAPTOP", "DESKTOP"].includes(formData.category),
      dataWipeCompleted: false,
      recommendedAction: aiPreview ? aiPreview.recommendedAction : "REDISTRIBUTE",
      actionConfidence: aiPreview ? aiPreview.confidence : 0.92,
      aiReasoning: aiPreview?.reasoning || "Registered via standard intake.",
      tags: ["New Intake", "Surplus Declared"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSuccess(createdAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface rounded-3xl border border-border shadow-elevated p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-canvas text-ink-muted hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-light text-forest text-xs font-semibold uppercase tracking-wider mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            Institutional Surplus Intake
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
            Register Surplus Asset
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            Declare idle departmental equipment for internal matching and circular redistribution.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
              Asset Name / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dell Latitude 5420 (16GB RAM, i7)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border text-sm text-ink focus:outline-none focus:border-forest"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as AssetCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border text-sm text-ink focus:outline-none focus:border-forest"
              >
                <option value="LAPTOP">Laptop / Notebook</option>
                <option value="MONITOR">Color Monitor</option>
                <option value="DESKTOP">Desktop Workstation</option>
                <option value="CHAIR">Ergonomic Chair</option>
                <option value="DESK">Standing Desk / Table</option>
                <option value="PROJECTOR">Classroom Projector</option>
                <option value="PRINTER">LaserJet Printer</option>
                <option value="NETWORKING">Switch / Router</option>
                <option value="LAB_EQUIPMENT">Laboratory Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Observed Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as AssetCondition })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border text-sm text-ink focus:outline-none focus:border-forest"
              >
                <option value="EXCELLENT">Excellent (Like New)</option>
                <option value="GOOD">Good (Fully Operational)</option>
                <option value="FAIR">Fair (Minor Wear / Repairable)</option>
                <option value="POOR">Poor (Requires Overhaul)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Source Department
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border text-sm text-ink focus:outline-none focus:border-forest"
              >
                {MOCK_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Room / Storage Location
              </label>
              <input
                type="text"
                placeholder="e.g. Room 304, IT Store"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border text-sm text-ink focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          {/* AI Assessment Trigger Section */}
          <div className="p-4 rounded-2xl bg-canvas border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-forest" />
                AI Assistant Intake Classifier
              </span>
              <button
                type="button"
                onClick={handleSimulateAiAssessment}
                disabled={isAnalyzing}
                className="text-[11px] font-semibold text-forest hover:text-forest-dark bg-forest-light px-2.5 py-1 rounded-md transition-colors"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
              </button>
            </div>
            <p className="text-[11px] text-ink-muted">
              Auto-detects data-wipe flags, estimated valuation, and optimal circular pathways.
            </p>

            {aiPreview && (
              <div className="mt-3 p-3 rounded-xl bg-surface border border-forest/30 text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-ink">Recommendation:</span>
                  <span className="text-forest uppercase bg-forest-light px-2 py-0.5 rounded">
                    {aiPreview.recommendedAction} ({(aiPreview.confidence * 100).toFixed(0)}% confidence)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Data-Wipe Requirement:</span>
                  <span className="font-semibold text-ink">
                    {aiPreview.dataWipeRequired ? "⚠️ NIST 800-88 Required" : "No Data Wipe Needed"}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted border-t border-border/40 pt-1">
                  {aiPreview.reasoning}
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-ink-muted hover:bg-canvas transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-forest text-surface text-xs font-bold hover:bg-forest-dark transition-colors shadow-xs"
            >
              Confirm Surplus Intake
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
