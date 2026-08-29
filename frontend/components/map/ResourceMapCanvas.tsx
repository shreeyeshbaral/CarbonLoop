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

  // Active Transfer Routes across exact ITER buildings:
  // - C-block (Data Science)
  // - D-block (ECE)
  // - Bansuri Guru Auditorium (Design)
  // - Central Library
  // - ITER Admin Block
  // - S-Block (Sports Complex)
  const transferRoutes: TransferRoute[] = [
    {
      id: "rt-01",
      sourceDept: MOCK_DEPARTMENTS[0], // C-block Data Science
      targetDept: MOCK_DEPARTMENTS[4], // Bansuri Guru Design
      assetName: "4x Dell Latitude 5420 Laptops",
      quantity: 4,
      status: "In Transit",
      driverEta: "2 mins",
      coordinates: [
        [20.2494, 85.8008],
        [20.2499, 85.8016],
      ],
    },
    {
      id: "rt-02",
      sourceDept: MOCK_DEPARTMENTS[2], // D-block ECE
      targetDept: MOCK_DEPARTMENTS[4], // Bansuri Guru Design
      assetName: "2x BenQ 4K Color Monitors",
      quantity: 2,
      status: "Scheduled",
      driverEta: "3 mins",
      coordinates: [
        [20.2495, 85.8000],
        [20.2496, 85.8008],
        [20.2499, 85.8016],
      ],
    },
    {
      id: "rt-03",
      sourceDept: MOCK_DEPARTMENTS[6], // ITER Admin Block
      targetDept: MOCK_DEPARTMENTS[3], // A-Block Civil
      assetName: "1x Epson Interactive Projector",
      quantity: 1,
      status: "Loading",
      driverEta: "2 mins",
      coordinates: [
        [20.2510, 85.8003],
        [20.2505, 85.7997],
      ],
    },
    {
      id: "rt-04",
      sourceDept: MOCK_DEPARTMENTS[5], // Central Library
      targetDept: MOCK_DEPARTMENTS[7], // S-Block Research
      assetName: "6x Ergonomic Aeron Chairs",
      quantity: 6,
      status: "In Transit",
      driverEta: "3 mins",
      coordinates: [
        [20.2486, 85.7997],
        [20.2486, 85.8009],
      ],
    },
  ];

  const createCustomIcon = (dept: Department) => {
    if (!L) return undefined;
    const surplus = dept.surplusCount || 0;
    const shortage = dept.shortageCount || 0;
    const isNetSurplus = surplus >= shortage;
    const isSelected = selectedDepartment?.id === dept.id;

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
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          border: 2.5px solid #FFFDF8;
          transition: transform 0.15s ease;
          ${isSelected ? "transform: scale(1.15);" : ""}
        ">
          ${isNetSurplus ? `+${surplus}` : `-${shortage}`}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  const filteredDepartments = departments.filter((d) => {
    if (activeFilter === "SURPLUS_ONLY") return (d.surplusCount || 0) >= (d.shortageCount || 0);
    if (activeFilter === "SHORTAGE_ONLY") return (d.shortageCount || 0) > (d.surplusCount || 0);
    return true;
  });

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] rounded-3xl overflow-hidden border border-border relative bg-surfaceSubtle shadow-card">
      {isMounted && L ? (
        <MapContainer
          center={[20.2497, 85.8008]}
          zoom={18}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Institute of Technical Education & Research (ITER)'
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
                      ITER Campus Van Route
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
          <span>Rendering geospatial coordinate matrix for ITER SOA Bhubaneswar...</span>
        </div>
      )}
    </div>
  );
}
