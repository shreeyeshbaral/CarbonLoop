"use client";

import React, { useState } from "react";
import { AssetCategory, UrgencyLevel, AssetCondition } from "@/types";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { useShortages } from "@/context/ShortageContext";
import { X, CheckCircle2, AlertTriangle, PlusCircle, Building2, HelpCircle } from "lucide-react";

interface CreateShortageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShortageModal({ isOpen, onClose }: CreateShortageModalProps) {
  const { addShortage } = useShortages();

  const [departmentCode, setDepartmentCode] = useState("DESIGN");
  const [category, setCategory] = useState<AssetCategory>("MONITOR");
  const [quantityRequested, setQuantityRequested] = useState(4);
  const [urgency, setUrgency] = useState<UrgencyLevel>("HIGH");
  const [minimumCondition, setMinimumCondition] = useState<AssetCondition>("GOOD");
  const [requestedBy, setRequestedBy] = useState("Prof. Kabir Sen");
  const [reason, setReason] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targetDept = MOCK_DEPARTMENTS.find((d) => d.code === departmentCode) || MOCK_DEPARTMENTS[0];

    addShortage({
      departmentId: targetDept.id,
      department: targetDept,
      category,
      quantityRequested: Number(quantityRequested),
      urgency,
      minimumCondition,
      requestedBy,
      reason: reason || `${targetDept.name} requires ${quantityRequested}x ${category} for active campus operations.`,
    });

    setToastMsg(`Shortage request declared for ${quantityRequested}x ${category}! Matching engine triggered.`);
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-in fade-in duration-150">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-60 p-4 rounded-2xl bg-forest text-surface shadow-elevated flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-leaf" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="w-full max-w-lg rounded-3xl bg-surface border border-border/80 shadow-elevated p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-light text-amber flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-ink">Declare Department Equipment Shortage</h3>
              <p className="text-xs text-ink-muted">Post an internal requisition to source from campus surplus.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-canvas text-ink-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Department & Custodian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ink">Requesting Faculty / Block</label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              >
                {MOCK_DEPARTMENTS.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink">Faculty / Custodian Name</label>
              <input
                type="text"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
                required
              />
            </div>
          </div>

          {/* Category & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ink">Required Hardware Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              >
                <option value="LAPTOP">Laptops</option>
                <option value="MONITOR">Monitors</option>
                <option value="CHAIR">Ergonomic Chairs</option>
                <option value="DESK">Desks</option>
                <option value="PROJECTOR">Projectors</option>
                <option value="PRINTER">Printers</option>
                <option value="NETWORKING">Networking / Switches</option>
                <option value="LAB_EQUIPMENT">Lab Equipment</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink">Quantity Needed</label>
              <input
                type="number"
                min={1}
                max={50}
                value={quantityRequested}
                onChange={(e) => setQuantityRequested(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
                required
              />
            </div>
          </div>

          {/* Urgency & Minimum Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ink">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              >
                <option value="LOW">LOW (General Replacement)</option>
                <option value="MEDIUM">MEDIUM (Standard Requisition)</option>
                <option value="HIGH">HIGH (Upcoming Semester Course)</option>
                <option value="CRITICAL">CRITICAL (Emergency Lab Need)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink">Minimum Acceptable Condition</label>
              <select
                value={minimumCondition}
                onChange={(e) => setMinimumCondition(e.target.value as AssetCondition)}
                className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
              >
                <option value="EXCELLENT">EXCELLENT (Like New Only)</option>
                <option value="GOOD">GOOD (Working Operational)</option>
                <option value="FAIR">FAIR (Minor Cosmetic Wear OK)</option>
              </select>
            </div>
          </div>

          {/* Operational Reason */}
          <div className="space-y-1">
            <label className="font-bold text-ink">Operational Justification / Purpose</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Bansuri Guru Design Studio expanding UI/UX lab benched workstations..."
              className="w-full p-2.5 rounded-xl border border-border bg-canvas text-ink font-medium focus:ring-1 focus:ring-forest outline-none"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
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
              <PlusCircle className="w-3.5 h-3.5" />
              Post Shortage Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
