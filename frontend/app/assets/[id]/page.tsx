import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCheck,
  HelpCircle,
  IndianRupee,
  Laptop,
  MapPin,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  User,
  Wrench,
} from "lucide-react";
import { MOCK_ASSETS } from "@/lib/mockAssets";
import { formatCurrency, formatWeight } from "@/lib/utils";

interface AssetDetailsPageProps {
  params: {
    id: string;
  };
}

export default function AssetDetailsPage({ params }: AssetDetailsPageProps) {
  const asset = MOCK_ASSETS.find((a) => a.id === params.id || a.assetTag === params.id);

  if (!asset) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-surface border border-border text-center space-y-4 shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-amber-light text-amber flex items-center justify-center mx-auto">
          <Boxes className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-xl font-bold text-ink">Asset Not Found</h2>
        <p className="text-xs text-ink-muted">
          The requested asset identifier &quot;{params.id}&quot; does not exist in the institutional registry.
        </p>
        <Link
          href="/assets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-surface text-xs font-semibold hover:bg-forest-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/dashboard" className="hover:text-forest transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/assets" className="hover:text-forest transition-colors">
          Asset Marketplace
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-ink">{asset.assetTag}</span>
      </nav>

      {/* Hero Asset Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-forest text-surface flex items-center justify-center font-bold shrink-0 shadow-md">
            <Laptop className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs font-bold text-forest bg-forest-light px-2.5 py-0.5 rounded border border-forest/20">
                {asset.assetTag}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surfaceSubtle text-ink border border-border">
                {asset.status}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-light text-forest border border-forest/20">
                {asset.condition} Condition
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              {asset.name}
            </h1>
            <p className="text-xs text-ink-muted mt-1 flex items-center gap-2 flex-wrap">
              <span>{asset.manufacturer}</span>
              <span>•</span>
              <span>Model: {asset.modelNumber || "Enterprise Standard"}</span>
              <span>•</span>
              <span>Serial: {asset.serialNumber || "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/intelligence"
            className="px-4 py-2.5 rounded-xl bg-forest text-surface text-xs font-bold hover:bg-forest-dark transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Find Department Match
          </Link>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tech Specs, Valuation & Custody Timeline (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Specifications & Hardware Telemetry */}
          <div className="p-6 rounded-2xl bg-surface border border-border/80 shadow-card space-y-4">
            <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
              <Boxes className="w-4 h-4 text-forest" />
              Technical Specifications & Metadata
            </h3>

            {asset.specifications ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(asset.specifications).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-canvas border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-ink-muted block tracking-wider">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-semibold text-ink text-xs mt-0.5 block">{String(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-muted">Standard hardware configuration recorded.</p>
            )}

            {/* Tags Strip */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {asset.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-surfaceSubtle text-ink border border-border">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Financial & Environmental Value Analysis */}
          <div className="p-6 rounded-2xl bg-surface border border-border/80 shadow-card">
            <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2 mb-4">
              <IndianRupee className="w-4 h-4 text-forest" />
              Circularity & Financial Valuation
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-canvas border border-border/50">
                <span className="text-[10px] text-ink-muted uppercase font-bold block">Original Procurement</span>
                <span className="font-heading text-base font-bold text-ink">
                  {formatCurrency(asset.originalPrice)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-border/50">
                <span className="text-[10px] text-forest uppercase font-bold block">Retained Value</span>
                <span className="font-heading text-base font-bold text-forest">
                  {formatCurrency(asset.estimatedValue)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-border/50">
                <span className="text-[10px] text-ink-muted uppercase font-bold block">Refurbishment Cost</span>
                <span className="font-heading text-base font-bold text-ink">
                  {formatCurrency(asset.estimatedRepairCost)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-border/50">
                <span className="text-[10px] text-leaf uppercase font-bold block">Avoided Scope 3</span>
                <span className="font-heading text-base font-bold text-leaf">
                  ~250 kg CO₂e
                </span>
              </div>
            </div>
          </div>

          {/* Chain of Custody & Lifecycle Timeline */}
          <div className="p-6 rounded-2xl bg-surface border border-border/80 shadow-card space-y-4">
            <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest" />
              Chain of Custody & Verification History
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {/* Event 1 */}
              <div className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-forest border-2 border-surface flex items-center justify-center"></div>
                <div>
                  <span className="text-[11px] font-bold text-forest">Surplus Registration & AI Intake</span>
                  <p className="text-xs text-ink mt-0.5">
                    Declared by {asset.department?.name} ({asset.department?.managerName})
                  </p>
                  <span className="text-[10px] text-ink-muted">Recorded: {new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Event 2 */}
              {asset.dataWipeRequired && (
                <div className="relative flex items-start gap-4 pl-8">
                  <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-forest border-2 border-surface flex items-center justify-center"></div>
                  <div>
                    <span className="text-[11px] font-bold text-forest">IT Security Data Wipe Verification</span>
                    <p className="text-xs text-ink mt-0.5">
                      Sanitized under NIST 800-88 standard by Central IT Officer.
                    </p>
                    <span className="text-[10px] text-ink-muted">Certificate Ref: CERT-NIST-2024-8841</span>
                  </div>
                </div>
              )}

              {/* Event 3 */}
              <div className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-leaf border-2 border-surface flex items-center justify-center"></div>
                <div>
                  <span className="text-[11px] font-bold text-leaf">Marketplace Readiness</span>
                  <p className="text-xs text-ink mt-0.5">
                    Asset ready for automated matching and reverse logistics dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Recommendation, IT Security, Location (1 span) */}
        <div className="space-y-6">
          {/* AI Circular Recommendation Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-forest-light/60 via-surface to-surface border border-forest/30 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-forest uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                AI Circular Assessment
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-forest text-surface">
                {(asset.actionConfidence * 100).toFixed(0)}% Confidence
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border/80">
              <span className="text-[10px] text-ink-muted uppercase font-bold block">Recommended Pathway</span>
              <span className="font-heading text-lg font-bold text-forest uppercase">
                {asset.recommendedAction}
              </span>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              {asset.aiReasoning}
            </p>
          </div>

          {/* IT Data-Wipe Security Card */}
          <div className="p-6 rounded-2xl bg-surface border border-border/80 shadow-card space-y-3">
            <h4 className="font-heading text-sm font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest" />
              IT Security & Data Compliance
            </h4>

            <div className="p-3 rounded-xl bg-canvas border border-border/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Data-Wipe Mandatory:</span>
                <span className="font-semibold text-ink">{asset.dataWipeRequired ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Audit Verification:</span>
                <span className="font-bold text-forest">
                  {asset.dataWipeCompleted ? "✓ Certified Wiped" : "Pending Action"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Standard Protocol:</span>
                <span className="font-mono text-ink">NIST 800-88 Rev 1</span>
              </div>
            </div>
          </div>

          {/* Department Location Card */}
          <div className="p-6 rounded-2xl bg-surface border border-border/80 shadow-card space-y-3">
            <h4 className="font-heading text-sm font-bold text-ink flex items-center gap-2">
              <MapPin className="w-4 h-4 text-forest" />
              Current Department Custody
            </h4>

            <div className="text-xs space-y-1">
              <p className="font-bold text-ink">{asset.department?.name}</p>
              <p className="text-ink-muted">{asset.location.building} · {asset.location.room || "Room 304"}</p>
              <p className="text-ink-muted">Custodian: {asset.department?.managerName}</p>
              <p className="text-forest font-mono text-[11px] pt-1">{asset.department?.contactEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
