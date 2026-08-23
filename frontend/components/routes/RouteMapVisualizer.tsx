"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RouteStop } from "@/lib/routeOptimizer";
import { Truck, MapPin, Building2, Package, CheckCircle2 } from "lucide-react";

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
  stops: RouteStop[];
  polylineCoordinates: [number, number][];
}

export function RouteMapVisualizer({
  stops,
  polylineCoordinates,
}: RouteMapVisualizerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const createStopIcon = (stop: RouteStop, index: number, isLast: boolean) => {
    if (!L) return undefined;

    const isDepot = stop.type === "DEPOT";
    const isPickup = stop.type === "PICKUP";
    const bgColor = isDepot ? "#18201B" : isPickup ? "#176B3A" : "#E98A3A"; // Charcoal for Depot, Forest for Pickup, Amber for Delivery
    const label = isDepot ? (index === 0 ? "Depot" : "End") : `${index}`;

    return L.divIcon({
      className: "custom-route-stop",
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
          font-size: ${isDepot ? "9px" : "11px"};
          box-shadow: 0 6px 14px rgba(24, 32, 27, 0.25);
          border: 2px solid #FFFDF8;
          text-transform: uppercase;
        ">
          ${label}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden border border-border relative bg-surfaceSubtle shadow-card">
      {isMounted && L ? (
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Polyline Route */}
          {polylineCoordinates.length > 1 && (
            <Polyline
              positions={polylineCoordinates}
              pathOptions={{
                color: "#176B3A",
                weight: 5,
                opacity: 0.9,
                dashArray: "4, 6",
              }}
            />
          )}

          {/* Markers */}
          {stops.map((stop, idx) => (
            <Marker
              key={`${stop.id}-${idx}`}
              position={[stop.lat, stop.lng]}
              icon={createStopIcon(stop, idx, idx === stops.length - 1)}
            >
              <Popup>
                <div className="p-1 space-y-1.5 min-w-[190px] text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-1">
                    <span className="font-bold text-ink">
                      {stop.type === "DEPOT" ? "Central Depot" : `Stop #${idx}: ${stop.type}`}
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
          <span>Rendering optimized polyline route matrix...</span>
        </div>
      )}
    </div>
  );
}
