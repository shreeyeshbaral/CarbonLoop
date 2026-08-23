"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Department } from "@/types";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";
import { MapPin, Navigation, Truck, Layers, Info } from "lucide-react";

// Safe dynamic imports for React-Leaflet
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

interface TransferRoute {
  id: string;
  sourceDept: Department;
  targetDept: Department;
  assetName: string;
  quantity: number;
  status: string;
  driverEta: string;
  coordinates: [number, number][];
}

interface ResourceMapCanvasProps {
  departments: Department[];
  selectedDepartment: Department | null;
  onSelectDepartment: (dept: Department) => void;
  activeFilter: string;
  mapMode: "INVENTORY" | "LOGISTICS";
}

export function ResourceMapCanvas({
  departments,
  selectedDepartment,
  onSelectDepartment,
  activeFilter,
  mapMode,
}: ResourceMapCanvasProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Active Transfer Routes for Logistics Mode
  const transferRoutes: TransferRoute[] = [
    {
      id: "rt-01",
      sourceDept: MOCK_DEPARTMENTS[0], // CSE
      targetDept: MOCK_DEPARTMENTS[4], // Design
      assetName: "4x Dell Latitude 5420 Laptops",
      quantity: 4,
      status: "In Transit",
      driverEta: "8 mins",
      coordinates: [
        [12.9722, 77.5935],
        [12.9731, 77.5930],
        [12.9740, 77.5925],
      ],
    },
    {
      id: "rt-02",
      sourceDept: MOCK_DEPARTMENTS[2], // ECE
      targetDept: MOCK_DEPARTMENTS[4], // Design
      assetName: "2x BenQ 4K Color Monitors",
      quantity: 2,
      status: "Scheduled",
      driverEta: "25 mins",
      coordinates: [
        [12.9735, 77.5955],
        [12.9738, 77.5940],
        [12.9740, 77.5925],
      ],
    },
    {
      id: "rt-03",
      sourceDept: MOCK_DEPARTMENTS[6], // Admin
      targetDept: MOCK_DEPARTMENTS[3], // Civil
      assetName: "1x Epson Interactive Projector",
      quantity: 1,
      status: "Loading",
      driverEta: "15 mins",
      coordinates: [
        [12.9702, 77.5952],
        [12.9698, 77.5941],
        [12.9695, 77.5930],
      ],
    },
    {
      id: "rt-04",
      sourceDept: MOCK_DEPARTMENTS[5], // Library
      targetDept: MOCK_DEPARTMENTS[7], // Research
      assetName: "6x Ergonomic Aeron Chairs",
      quantity: 6,
      status: "In Transit",
      driverEta: "12 mins",
      coordinates: [
        [12.9715, 77.5948],
        [12.9723, 77.5959],
        [12.9730, 77.5970],
      ],
    },
  ];

  const createCustomIcon = (dept: Department) => {
    if (!L) return undefined;
    const surplus = dept.surplusCount || 0;
    const shortage = dept.shortageCount || 0;
    const isNetSurplus = surplus >= shortage;
    const isSelected = selectedDepartment?.id === dept.id;

    // Strict color rules: Forest Green for Surplus, Amber for Shortage
    const bgColor = isNetSurplus ? "#176B3A" : "#E98A3A";

    return L.divIcon({
      className: "custom-map-pin",
      html: `
        <div style="
          background-color: ${bgColor};
          color: #FFFDF8;
          width: ${isSelected ? "38px" : "32px"};
          height: ${isSelected ? "38px" : "32px"};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: ${isSelected ? "12px" : "11px"};
          box-shadow: 0 6px 14px rgba(24, 32, 27, 0.25);
          border: ${isSelected ? "3px solid #18201B" : "2px solid #FFFDF8"};
          transition: all 0.2s ease;
        ">
          ${isNetSurplus ? `+${surplus}` : `-${shortage}`}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  // Filter departments based on active layer
  const filteredDepartments = departments.filter((d) => {
    if (activeFilter === "SURPLUS_ONLY") return (d.surplusCount || 0) >= (d.shortageCount || 0);
    if (activeFilter === "SHORTAGE_ONLY") return (d.shortageCount || 0) > (d.surplusCount || 0);
    return true;
  });

  return (
    <div className="w-full h-full min-h-[580px] rounded-3xl overflow-hidden border border-border relative bg-surfaceSubtle shadow-card">
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

          {/* Render Department Pins */}
          {filteredDepartments.map((dept) => (
            <Marker
              key={dept.id}
              position={[dept.coordinates.lat, dept.coordinates.lng]}
              icon={createCustomIcon(dept)}
              eventHandlers={{
                click: () => onSelectDepartment(dept),
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 min-w-[200px]">
                  <div className="font-bold text-xs text-ink border-b border-border pb-1">
                    {dept.name} ({dept.code})
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    Building: <span className="font-semibold text-ink">{dept.building}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <div className="p-1 rounded bg-forest-light text-forest font-semibold text-center">
                      +{dept.surplusCount} Surplus
                    </div>
                    <div className="p-1 rounded bg-amber-light text-amber font-semibold text-center">
                      -{dept.shortageCount} Shortage
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectDepartment(dept)}
                    className="w-full mt-1 py-1 rounded bg-forest text-surface text-[10px] font-bold text-center hover:bg-forest-dark"
                  >
                    Open Department Telemetry
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Transfer Polylines in Logistics Mode */}
          {mapMode === "LOGISTICS" &&
            transferRoutes.map((rt) => (
              <Polyline
                key={rt.id}
                positions={rt.coordinates}
                pathOptions={{
                  color: "#176B3A",
                  weight: 4,
                  dashArray: "6, 8",
                  opacity: 0.85,
                }}
              >
                <Popup>
                  <div className="p-1 text-xs space-y-1">
                    <div className="font-bold text-forest flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Active Reverse Logistics
                    </div>
                    <p className="font-semibold text-ink">{rt.assetName}</p>
                    <p className="text-ink-muted text-[11px]">
                      From: {rt.sourceDept.code} → To: {rt.targetDept.code}
                    </p>
                    <p className="text-[10px] text-forest font-semibold">
                      Driver ETA: {rt.driverEta} ({rt.status})
                    </p>
                  </div>
                </Popup>
              </Polyline>
            ))}
        </MapContainer>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-xs text-ink-muted gap-2">
          <div className="w-7 h-7 border-2 border-forest border-t-transparent rounded-full animate-spin"></div>
          <span>Rendering geospatial coordinate matrix...</span>
        </div>
      )}
    </div>
  );
}
