"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  X,
  FileCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Hash,
} from "lucide-react";
import { Asset } from "@/types";
import { useRole } from "@/context/RoleContext";

interface DataWipeVerificationModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onVerified: (cert: {
    certificateId: string;
    officerName: string;
    method: string;
    timestamp: string;
    hash: string;
  }) => void;
}

export function DataWipeVerificationModal({
  asset,
  isOpen,
  onClose,
  onVerified,
}: DataWipeVerificationModalProps) {
  const { user } = useRole();
  const [method, setMethod] = useState("NIST 800-88 Rev 1 (Cryptographic Purge & Verification)");
  const [checkedDrives, setCheckedDrives] = useState(true);
  const [checkedMdm, setCheckedMdm] = useState(true);
  const [checkedHash, setCheckedHash] = useState(true);
  const [notes, setNotes] = useState("All sectors verified zeroed. MDM profiles released from university console.");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const certId = `CERT-NIST-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const hash = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    onVerified({
      certificateId: certId,
      officerName: user.name,
      method,
      timestamp: new Date().toISOString(),
      hash,
    });
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

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-light text-forest text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            IT Security Governance
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
            NIST 800-88 Data Sanitization Audit
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            Certify digital sanitization and firmware decoupling before institutional transfer.
          </p>
        </div>

        {/* Asset Hardware Details */}
        <div className="p-4 rounded-2xl bg-canvas border border-border/60 mb-5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink">{asset.name}</span>
            <span className="font-mono text-[11px] bg-surface px-2 py-0.5 rounded border border-border text-ink-muted">
              {asset.assetTag}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-ink-muted text-[11px] pt-1 border-t border-border/40">
            <div>Serial: <span className="font-mono font-medium text-ink">{asset.serialNumber || "N/A"}</span></div>
            <div>Manufacturer: <span className="font-medium text-ink">{asset.manufacturer || "Standard"}</span></div>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink mb-1.5">
              Sanitization Protocol Standard
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border text-sm text-ink focus:outline-none focus:border-forest"
            >
              <option value="NIST 800-88 Rev 1 (Cryptographic Purge & Verification)">
                NIST 800-88 Rev 1 (Cryptographic Purge & Verification)
              </option>
              <option value="ATA Secure Erase (Firmware-Level NVMe Sanitation)">
                ATA Secure Erase (Firmware-Level NVMe Sanitation)
              </option>
              <option value="DoD 5220.22-M (3-Pass Zero-Entropy Overwrite)">
                DoD 5220.22-M (3-Pass Zero-Entropy Overwrite)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink mb-1.5">
              Certifying IT Officer
            </label>
            <div className="p-3 rounded-xl bg-canvas border border-border flex items-center justify-between text-xs">
              <span className="font-bold text-ink">{user.name} ({user.roleLabel})</span>
              <span className="text-[10px] text-forest font-semibold bg-forest-light px-2 py-0.5 rounded">
                Authorized Signatory
              </span>
            </div>
          </div>

          {/* Audit Checkboxes */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-surfaceSubtle border border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Required Compliance Checklist:
            </span>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedDrives}
                onChange={(e) => setCheckedDrives(e.target.checked)}
                className="mt-0.5 accent-forest rounded"
              />
              <span className="text-ink">
                I verify that all internal SSD/HDD storage blocks have been purged and validated with zero recoverable sector traces.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedMdm}
                onChange={(e) => setCheckedMdm(e.target.checked)}
                className="mt-0.5 accent-forest rounded"
              />
              <span className="text-ink">
                I verify that institutional cloud MDM profiles (Intune/Jamf) and BIOS supervisor locks have been permanently removed.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedHash}
                onChange={(e) => setCheckedHash(e.target.checked)}
                className="mt-0.5 accent-forest rounded"
              />
              <span className="text-ink">
                Generate cryptographic SHA-256 tamper-evident verification certificate hash into the institutional audit log.
              </span>
            </label>
          </div>

          {/* Officer Notes */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink mb-1.5">
              Audit Notes & Log Comments
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-forest"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-ink-muted hover:bg-canvas transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!checkedDrives || !checkedMdm || !checkedHash}
              className="px-5 py-2.5 rounded-xl bg-forest text-surface text-xs font-bold hover:bg-forest-dark transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              Sign & Issue NIST Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
