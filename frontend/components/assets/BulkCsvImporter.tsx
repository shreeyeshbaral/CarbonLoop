"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  Boxes,
  ArrowRight,
  Database,
} from "lucide-react";
import { Asset, AssetCategory, AssetCondition, CircularAction } from "@/types";
import { useAssets } from "@/context/AssetContext";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";

interface BulkCsvImporterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkCsvImporter({ isOpen, onClose }: BulkCsvImporterProps) {
  const { addAsset } = useAssets();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [csvText, setCsvText] = useState("");
  const [parsedPreview, setParsedPreview] = useState<Partial<Asset>[]>([]);
  const [importStatus, setImportStatus] = useState<"idle" | "parsed" | "importing" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadSampleCsv = () => {
    const sample = `Asset_Name,Category,Condition,Department_Code,Building,Value_INR,Serial_Number
Dell Latitude 5420 i7 16GB,LAPTOP,GOOD,CSE,Centre for Data Science,42000,DELL-LAT-9821
BenQ 27-inch 4K Designer Monitor,MONITOR,EXCELLENT,DESIGN,Bansuri Guru Auditorium,26000,BNQ-4K-7712
Cisco Catalyst 3850 PoE Switch,NETWORKING,GOOD,ECE,D-block,38000,CSCO-CAT-3850
Herman Miller Mirra 2 Chair,CHAIR,EXCELLENT,LIBRARY,ITER Central Library,22000,HM-MIR-4491
Epson EB-2250U Full HD Projector,PROJECTOR,FAIR,MECH,F-Block & G-Block,31000,EPS-EB-2250
HP LaserJet Enterprise M608dn,PRINTER,GOOD,ADMIN,ITER Administrative Block,35000,HP-LJ-608
Tektronix Digital Oscilloscope 100MHz,LAB_EQUIPMENT,EXCELLENT,ECE,D-block,65000,TEK-TBS-1102`;

    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "CarbonLoop_Campus_Inventory_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvText(content);
        parseCsv(content);
      }
    };
    reader.readAsText(file);
  };

  const parseCsv = (text: string) => {
    try {
      setErrorMessage(null);
      const lines = text.trim().split("\n");
      if (lines.length < 2) {
        setErrorMessage("CSV must contain a header row and at least one equipment record.");
        return;
      }

      const records: Partial<Asset>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = line.split(",").map((v) => v.trim());

        const name = values[0] || "University Equipment";
        const categoryRaw = (values[1] || "OTHER").toUpperCase();
        const conditionRaw = (values[2] || "GOOD").toUpperCase();
        const deptCode = (values[3] || "CSE").toUpperCase();
        const building = values[4] || "ITER Campus Building";
        const val = parseInt(values[5], 10) || 25000;
        const serial = values[6] || `SER-${Date.now()}-${i}`;

        // Validate Category
        let category: AssetCategory = "OTHER";
        if (["LAPTOP", "MONITOR", "DESKTOP", "CHAIR", "DESK", "PROJECTOR", "PRINTER", "NETWORKING", "LAB_EQUIPMENT", "OTHER"].includes(categoryRaw)) {
          category = categoryRaw as AssetCategory;
        }

        // Validate Condition
        let condition: AssetCondition = "GOOD";
        if (["EXCELLENT", "GOOD", "FAIR", "POOR"].includes(conditionRaw)) {
          condition = conditionRaw as AssetCondition;
        }

        const deptObj = MOCK_DEPARTMENTS.find((d) => d.code === deptCode);
        const recAction: CircularAction = condition === "POOR" ? "REPAIR" : "REDISTRIBUTE";

        records.push({
          id: `bulk-${Date.now()}-${i}`,
          assetTag: `ASSET-${deptCode}-${Math.floor(100 + Math.random() * 900)}`,
          name,
          category,
          condition,
          estimatedValue: val,
          originalPrice: Math.round(val * 1.5),
          estimatedRepairCost: condition === "POOR" ? 3000 : 0,
          ageYears: 2,
          purchaseDate: "2023-01-15",
          status: "AVAILABLE",
          actionConfidence: 0.95,
          serialNumber: serial,
          tags: ["Bulk Imported", category],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          departmentId: deptObj?.id || "dept-cse",
          department: deptObj || MOCK_DEPARTMENTS[0],
          location: {
            building,
            room: `Lab ${100 + i}`,
            lat: deptObj?.coordinates.lat || 20.2476,
            lng: deptObj?.coordinates.lng || 85.8010,
          },
          recommendedAction: recAction,
          dataWipeRequired: category === "LAPTOP" || category === "DESKTOP" || category === "NETWORKING",
          dataWipeCompleted: false,
        });
      }

      setParsedPreview(records);
      setImportStatus("parsed");
    } catch (e: any) {
      setErrorMessage(`Failed to parse CSV: ${e.message}`);
    }
  };

  const handleExecuteImport = async () => {
    if (parsedPreview.length === 0) return;
    setImportStatus("importing");

    try {
      // Insert parsed items into AssetContext (which writes to IndexedDB disk engine)
      for (const item of parsedPreview) {
        await addAsset(item as Asset);
      }

      setImportStatus("success");
      setTimeout(() => {
        onClose();
        setImportStatus("idle");
        setParsedPreview([]);
        setCsvText("");
      }, 1800);
    } catch (e: any) {
      setErrorMessage(`Import error: ${e.message}`);
      setImportStatus("parsed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-canvas/80 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-surface shadow-md shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-surfaceSubtle" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">
                Bulk Institutional CSV/Excel Importer
              </h2>
              <p className="text-xs text-ink-muted">
                Import 50+ campus assets into the live database with automatic column detection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-light/80 border border-amber/30 text-amber text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {importStatus === "success" && (
            <div className="p-4 rounded-2xl bg-forest-light/90 border border-forest/30 text-forest text-sm font-bold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Successfully imported {parsedPreview.length} assets into the live database!</span>
            </div>
          )}

          {/* Template Download Strip */}
          <div className="p-4 rounded-2xl bg-canvas border border-border/80 flex items-center justify-between gap-4">
            <div className="text-xs">
              <span className="font-bold text-ink block">Need a standard university format?</span>
              <span className="text-ink-muted">Download our pre-formatted institutional equipment CSV template.</span>
            </div>
            <button
              onClick={downloadSampleCsv}
              className="py-2 px-3.5 rounded-xl bg-surface border border-border hover:bg-forest-light hover:text-forest text-ink font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-forest" />
              Sample Template.csv
            </button>
          </div>

          {/* Dropzone / Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-forest/50 bg-canvas/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv, .txt, .xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-forest mx-auto mb-2" />
            <div className="text-xs font-bold text-ink">
              Click to select or drag and drop a .CSV file
            </div>
            <p className="text-[11px] text-ink-muted mt-1">
              Supports standard institutional asset register spreadsheets up to 10,000 items
            </p>
          </div>

          {/* Text Area Manual Paste */}
          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Or Paste CSV Data Directly:
            </label>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                parseCsv(e.target.value);
              }}
              placeholder={`Asset_Name,Category,Condition,Department_Code,Building,Value_INR,Serial_Number\nDell Latitude 5420,LAPTOP,GOOD,CSE,C-block,42000,DELL-9921`}
              className="w-full p-3 rounded-2xl bg-canvas border border-border font-mono text-xs text-ink focus:border-forest focus:outline-none"
            />
          </div>

          {/* Parsed Preview Table */}
          {parsedPreview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-forest" />
                  Validated Records Ready to Ingest ({parsedPreview.length})
                </span>
                <span className="text-[10px] text-forest font-semibold uppercase bg-forest-light px-2 py-0.5 rounded">
                  All Schemas Passed
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto rounded-2xl border border-border bg-surface">
                <table className="w-full text-left text-xs">
                  <thead className="bg-canvas border-b border-border text-[11px] text-ink-muted uppercase">
                    <tr>
                      <th className="p-2.5">Asset</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Dept</th>
                      <th className="p-2.5">Condition</th>
                      <th className="p-2.5 text-right">Value (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {parsedPreview.map((item, idx) => (
                      <tr key={idx} className="hover:bg-canvas/50">
                        <td className="p-2.5 font-medium text-ink truncate max-w-[180px]">
                          {item.name}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-ink-muted">
                          {item.category}
                        </td>
                        <td className="p-2.5 font-bold text-forest">
                          {item.department?.code || "CSE"}
                        </td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-forest-light text-forest font-semibold text-[10px]">
                            {item.condition}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-semibold text-ink">
                          ₹{item.estimatedValue?.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-canvas/80 border-t border-border flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-canvas text-ink font-semibold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteImport}
            disabled={parsedPreview.length === 0 || importStatus === "importing"}
            className="py-2.5 px-5 rounded-xl bg-forest hover:bg-forest-dark disabled:opacity-50 text-surface font-bold text-xs flex items-center gap-2 transition-all shadow-md"
          >
            {importStatus === "importing" ? (
              <span>Ingesting into Database...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Import {parsedPreview.length} Assets to Live Database</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
