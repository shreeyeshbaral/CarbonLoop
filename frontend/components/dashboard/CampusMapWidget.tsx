"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { MapPin, Layers, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

// Dynamically load Leaflet components to prevent SSR "window is not defined" error
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

export function CampusMapWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const createCustomIcon = (surplus: number, shortage: number) => {
    if (!L) return undefined;
    const isNetSurplus = surplus >= shortage;
    const bgColor = isNetSurplus ? "#176B3A" : "#E98A3A";

    return L.divIcon({
      className: "custom-map-pin",
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
          font-weight: 700;
          font-size: 11px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          border: 2px solid #FFFDF8;
        ">
          ${isNetSurplus ? `+${surplus}` : `-${shortage}`}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border/80 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <MapPin className="w-4 h-4 text-forest" />
            ITER SOA Campus Geospatial Distribution
          </h3>
          <p className="text-xs text-ink-muted">
            Live surplus & shortage nodes across ITER academic blocks (C-block, D-block, Central Library, Admin Block).
          </p>
        </div>

        <Link
          href="/map"
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-forest-light text-forest hover:bg-forest hover:text-surface transition-colors"
        >
          Open Full Resource Map <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Map Container Viewport */}
      <div className="w-full h-80 rounded-xl overflow-hidden border border-border relative bg-surfaceSubtle">
        {isMounted && L ? (
          <MapContainer
            center={[20.2472, 85.8008]}
            zoom={18}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ITER SOA Campus'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MOCK_DEPARTMENTS.map((dept) => (
              <Marker
                key={dept.id}
                position={[dept.coordinates.lat, dept.coordinates.lng]}
                icon={createCustomIcon(dept.surplusCount || 0, dept.shortageCount || 0)}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 min-w-[180px]">
                    <div className="font-bold text-xs text-ink border-b border-border pb-1">
                      {dept.name}
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      Building: <span className="font-medium text-ink">{dept.building}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      <div className="p-1 rounded bg-forest-light text-forest font-semibold text-center">
                        +{dept.surplusCount} Surplus
                      </div>
                      <div className="p-1 rounded bg-amber-light text-amber font-semibold text-center">
                        -{dept.shortageCount} Shortage
                      </div>
                    </div>
                    <Link
                      href={`/map?dept=${dept.code}`}
                      className="block text-center text-[10px] font-bold text-forest hover:underline pt-1"
                    >
                      Inspect Department Assets →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-xs text-ink-muted gap-2">
            <div className="w-6 h-6 border-2 border-forest border-t-transparent rounded-full animate-spin"></div>
            <span>Hydrating geospatial tiles for ITER Bhubaneswar...</span>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-ink-muted flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-forest border border-surface inline-block shadow-xs"></span>
            <span className="font-medium text-ink">Net Surplus Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber border border-surface inline-block shadow-xs"></span>
            <span className="font-medium text-ink">Net Shortage Zone</span>
          </div>
        </div>
        <span className="text-[11px]">ITER Campus (Jagamara, Khandagiri)</span>
      </div>
    </div>
  );
}
