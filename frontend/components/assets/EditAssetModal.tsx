"use client";

import React, { useState } from "react";
import { Asset, AssetCondition, CircularAction } from "@/types";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { useAssets } from "@/context/AssetContext";
import { X, CheckCircle2, Edit3, Building2, Save, Trash2, ShieldAlert } from "lucide-react";

interface EditAssetModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

export function EditAssetModal({ asset, isOpen, onClose }: EditAssetModalProps) {
  const { updateAsset, deleteAsset } = useAssets();

  const [name, setName] = useState(asset.name);
  const [condition, setCondition] = useState<AssetCondition>(asset.condition);
  const [estimatedValue, setEstimatedValue] = useState(asset.estimatedValue);
  const [estimatedRepairCost, setEstimatedRepairCost] = useState(asset.estimatedRepairCost);
  const [departmentCode, setDepartmentCode] = useState<string>(asset.department?.code || "CSE");
  const [room, setRoom] = useState(asset.location?.room || "Lab Room 101");
  const [recommendedAction, setRecommendedAction] = useState<CircularAction>(asset.recommendedAction);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const targetDept = MOCK_DEPARTMENTS.find((d) => d.code === departmentCode) || MOCK_DEPARTMENTS[0];

    updateAsset(asset.id, {
      name,
      condition,
      estimatedValue: Number(estimatedValue),
      estimatedRepairCost: Number(estimatedRepairCost),
      department: targetDept,
      departmentId: targetDept.id,
      recommendedAction,
      location: {
        ...targetDept.coordinates,
        room,
      },
    });

    setToastMsg("Asset details updated successfully!");
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1200);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove ${asset.name} (${asset.assetTag}) from the database?`)) {
      deleteAsset(asset.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-in fade-in duration-150">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-60 p-4 rounded-2xl bg-forest text-surface shadow-elevated flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-leaf" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="w-full max-w-xl rounded-3xl bg-surface border border-border/80 shadow-elevated p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-forest-light text-forest flex items-center justify-center font-bold">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-ink">Edit Asset Details</h3>
              <p className="text-xs text-ink-muted">{asset.assetTag} · {asset.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-canvas text-ink-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Asset Name */}
          <div className="space-y-1">
            <label className="font-bold text-ink">Equipment Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              required
            />
          </div>

          {/* Department & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ink">Assigned Department / Building</label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              >
                {MOCK_DEPARTMENTS.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink">Room / Lab Bay</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              />
            </div>
          </div>

          {/* Condition & Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ink">Hardware Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as AssetCondition)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              >
                <option value="EXCELLENT">EXCELLENT (Like New)</option>
                <option value="GOOD">GOOD (Operational)</option>
                <option value="FAIR">FAIR (Minor Issues)</option>
                <option value="POOR">POOR (E-Waste / Defective)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink">Circular Pathway Action</label>
              <select
                value={recommendedAction}
                onChange={(e) => setRecommendedAction(e.target.value as CircularAction)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              >
                <option value="REUSE">REUSE (Direct Local Use)</option>
                <option value="REDISTRIBUTE">REDISTRIBUTE (Inter-Faculty Transfer)</option>
                <option value="REPAIR">REPAIR (Refurbish & Fix)</option>
                <option value="RECYCLE">RECYCLE (Certified E-Waste Recycling)</option>
              </select>
            </div>
          </div>

          {/* Value & Repair Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ink">Retained Value (₹ INR)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink">Estimated Repair Cost (₹ INR)</label>
              <input
                type="number"
                value={estimatedRepairCost}
                onChange={(e) => setEstimatedRepairCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2 rounded-xl bg-crimson-light text-crimson font-bold flex items-center gap-1.5 hover:bg-crimson hover:text-surface transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete E-Waste
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-ink-muted hover:bg-canvas"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-forest text-surface font-bold flex items-center gap-1.5 hover:bg-forest-dark transition-all shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
