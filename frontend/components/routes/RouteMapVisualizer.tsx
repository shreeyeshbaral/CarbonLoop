"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RouteStop } from "@/lib/routeOptimizer";
import { DeliveryStopExecution } from "@/types";
import { Truck, MapPin, Building2, Package, CheckCircle2, AlertCircle, HelpCircle, Layers, Eye } from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface RouteMapVisualizerProps {
  stops?: RouteStop[];
  polylineCoordinates?: [number, number][];
  // Extended Multi-Route Props for Delivery Efficiency
  baselineCoordinates?: [number, number][];
  optimizedCoordinates?: [number, number][];
  actualCoordinates?: [number, number][];
  deliveryStops?: DeliveryStopExecution[];
  showLayerControls?: boolean;
}

export function RouteMapVisualizer({
  stops = [],
  polylineCoordinates = [],
  baselineCoordinates = [],
  optimizedCoordinates = [],
  actualCoordinates = [],
  deliveryStops = [],
  showLayerControls = false,
}: RouteMapVisualizerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  // Layer Toggles
  const [showBaseline, setShowBaseline] = useState(true);
  const [showOptimized, setShowOptimized] = useState(true);
  const [showActual, setShowActual] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Standard Route Stop Icon
  const createStopIcon = (stop: RouteStop, index: number) => {
    if (!L) return undefined;

    const isDepot = stop.type === "DEPOT";
    const isPickup = stop.type === "PICKUP";
    const bgColor = isDepot ? "#18201B" : isPickup ? "#176B3A" : "#E98A3A";
    const label = isDepot ? (index === 0 ? "Depot" : "End") : `${index}`;

    return L.divIcon({
      className: "custom-route-stop",
      html: `
        <div style="
          background-color: ${bgColor};
          color: #FFFDF8;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: ${isDepot ? "8px" : "11px"};
          box-shadow: 0 4px 10px rgba(24, 32, 27, 0.25);
          border: 2px solid #FFFDF8;
          text-transform: uppercase;
        ">
          ${label}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  // Execution Delivery Stop Icon (with Completed, Failed, Unplanned status colors)
  const createExecutionStopIcon = (stop: DeliveryStopExecution) => {
    if (!L) return undefined;

    let bgColor = "#176B3A"; // default green
    let label = `${stop.sequence}`;

    if (stop.type === "DEPOT") {
      bgColor = "#18201B";
      label = stop.sequence === 1 ? "Start" : "End";
    } else if (stop.status === "FAILED") {
      bgColor = "#DC2626"; // Red
      label = "✕";
    } else if (stop.status === "UNPLANNED") {
      bgColor = "#7C3AED"; // Purple
      label = "!";
    } else if (stop.status === "PENDING") {
      bgColor = "#D97706"; // Amber
      label = "⏳";
    }

    return L.divIcon({
      className: "custom-execution-stop",
      html: `
        <div style="
          background-color: ${bgColor};
          color: #FFFDF8;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 11px;
          box-shadow: 0 6px 14px rgba(0,0,0,0.3);
          border: 2.5px solid #FFFDF8;
        ">
          ${label}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Default coordinates fallback
  const effectiveOptimized =
    optimizedCoordinates.length > 0 ? optimizedCoordinates : polylineCoordinates;

  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden border border-border relative bg-surfaceSubtle shadow-card flex flex-col">
      {/* Optional Interactive Layer Control Header */}
      {showLayerControls && (
        <div className="bg-surface/90 backdrop-blur-md px-4 py-2.5 border-b border-border z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-ink">
            <Layers className="w-4 h-4 text-forest" />
            <span>Route Layers:</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Baseline Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-ink-muted hover:text-ink">
              <input
                type="checkbox"
                checked={showBaseline}
                onChange={(e) => setShowBaseline(e.target.checked)}
                className="rounded accent-amber"
              />
              <span className="w-3.5 h-1 bg-amber/80 rounded inline-block border border-dashed border-amber"></span>
              <span>1. Baseline Route</span>
            </label>

            {/* Optimized Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-ink-muted hover:text-ink">
              <input
                type="checkbox"
                checked={showOptimized}
                onChange={(e) => setShowOptimized(e.target.checked)}
                className="rounded accent-forest"
              />
              <span className="w-3.5 h-1.5 bg-forest rounded inline-block"></span>
              <span>2. Optimized Plan</span>
            </label>

            {/* Actual Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-ink-muted hover:text-ink">
              <input
                type="checkbox"
                checked={showActual}
                onChange={(e) => setShowActual(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span className="w-3.5 h-1.5 bg-blue-600 rounded inline-block"></span>
              <span>3. Actual Executed</span>
            </label>
          </div>
        </div>
      )}

      {/* Map Viewport */}
      <div className="flex-1 relative w-full h-full min-h-[440px]">
        {isMounted && L ? (
          <MapContainer
            center={[20.2497, 85.8008]}
            zoom={18}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ITER SOA Campus'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 1. Baseline Route Polyline (Muted Amber/Gray Dashed) */}
            {showBaseline && baselineCoordinates.length > 1 && (
              <Polyline
                positions={baselineCoordinates}
                pathOptions={{
                  color: "#D97706",
                  weight: 3.5,
                  opacity: 0.65,
                  dashArray: "8, 8",
                }}
              />
            )}

            {/* 2. Optimized Route Polyline (Emerald Green) */}
            {showOptimized && effectiveOptimized.length > 1 && (
              <Polyline
                positions={effectiveOptimized}
                pathOptions={{
                  color: "#176B3A",
                  weight: 5,
                  opacity: 0.9,
                  dashArray: "5, 6",
                }}
              />
            )}

            {/* 3. Actual Executed Route Polyline (Electric Blue) */}
            {showActual && actualCoordinates.length > 1 && (
              <Polyline
                positions={actualCoordinates}
                pathOptions={{
                  color: "#2563EB",
                  weight: 5.5,
                  opacity: 0.95,
                }}
              />
            )}

            {/* Render Delivery Execution Stops (if provided) */}
            {deliveryStops.length > 0 &&
              deliveryStops.map((stop) => (
                <Marker
                  key={`exec-${stop.id}`}
                  position={[stop.lat, stop.lng]}
                  icon={createExecutionStopIcon(stop)}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 min-w-[200px] text-xs">
                      <div className="flex items-center justify-between border-b border-border pb-1">
                        <span className="font-bold text-ink">
                          Stop #{stop.sequence}: {stop.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            stop.status === "COMPLETED"
                              ? "bg-forest-light text-forest"
                              : stop.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : stop.status === "UNPLANNED"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-amber-light text-amber"
                          }`}
                        >
                          {stop.status}
                        </span>
                      </div>

                      <p className="text-ink-muted text-[11px]">
                        <Building2 className="w-3 h-3 text-forest inline mr-1" />
                        {stop.building}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 bg-canvas p-1.5 rounded-lg text-[10px]">
                        <div>
                          <span className="text-ink-muted block">Planned:</span>
                          <span className="font-semibold text-ink">{stop.plannedArrivalTime}</span>
                        </div>
                        <div>
                          <span className="text-ink-muted block">Actual:</span>
                          <span
                            className={`font-semibold ${
                              stop.isOnTime ? "text-forest" : "text-amber"
                            }`}
                          >
                            {stop.actualArrivalTime || "Pending"}
                          </span>
                        </div>
                      </div>

                      {stop.assetName && (
                        <div className="p-1.5 rounded-lg bg-surface border border-border text-[11px] text-ink font-medium">
                          <Package className="w-3 h-3 text-forest inline mr-1" />
                          {stop.assetName} ({stop.deliveredQuantity}/{stop.assetQuantity} delivered)
                        </div>
                      )}

                      {stop.failureReason && (
                        <div className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-[10px] text-red-700 font-medium">
                          <strong>Note:</strong> {stop.failureReason}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Standard Planner Route Stops Fallback */}
            {deliveryStops.length === 0 &&
              stops.map((stop, idx) => (
                <Marker
                  key={`std-${stop.id}-${idx}`}
                  position={[stop.lat, stop.lng]}
                  icon={createStopIcon(stop, idx)}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 min-w-[190px] text-xs">
                      <div className="flex items-center justify-between border-b border-border pb-1">
                        <span className="font-bold text-ink">
                          {stop.type === "DEPOT" ? "SOA Central Depot" : `Stop #${idx}: ${stop.type}`}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-canvas px-1.5 py-0.2 rounded border border-border text-forest">
                          {stop.departmentCode}
                        </span>
                      </div>

                      <p className="text-ink-muted text-[11px]">
                        <Building2 className="w-3 h-3 text-forest inline mr-1" />
                        {stop.building}
                      </p>

                      {stop.assetName && (
                        <div className="p-1.5 rounded-lg bg-canvas text-[11px] text-ink font-medium">
                          <Package className="w-3 h-3 text-forest inline mr-1" />
                          {stop.assetName}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-xs text-ink-muted gap-2">
            <div className="w-7 h-7 border-2 border-forest border-t-transparent rounded-full animate-spin"></div>
            <span>Rendering geospatial multi-route matrix for ITER SOA Bhubaneswar...</span>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="bg-canvas px-4 py-2 border-t border-border/80 flex items-center justify-between text-[11px] text-ink-muted flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-forest inline-block"></span> Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span> Failed/Delayed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span> Unplanned Detour
          </span>
        </div>
        <span>Jagamara Campus Logistics Corridor</span>
      </div>
    </div>
  );
}
