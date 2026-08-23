import { Department, ImpactMetrics, CircularAction, AssetCategory } from "@/types";

// ===================================================
// 1. CAMPUS DEPARTMENTS (Institute of Technical Education & Research - ITER, SOA University)
// Exact Buildings Mapped from Official Campus Map:
// - ITER Administrative Block
// - Centre for Data Science & C-block
// - Central Library
// - D-block (ECE / Electronics)
// - Bansuri Guru Auditorium & Media Wing (Design)
// - F-Block & G-Block (Mechanical Labs)
// - A-Block (Civil Engineering)
// - S-Block / Sports & Discovery Center (Research)
// ===================================================
export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: "dept-cse",
    code: "CSE",
    name: "Computer Science & Centre for Data Science (C-block)",
    building: "ITER Centre for Data Science & C-block",
    coordinates: { lat: 20.2476, lng: 85.8010, building: "ITER Centre for Data Science", floor: "3rd Floor" },
    contactEmail: "cse.surplus@iter.soa.ac.in",
    managerName: "Prof. Priya Sharma",
    surplusCount: 38,
    shortageCount: 12,
  },
  {
    id: "dept-mech",
    code: "MECH",
    name: "Mechanical Engineering (F-Block & G-Block)",
    building: "ITER F-Block & G-Block Lab Complex",
    coordinates: { lat: 20.2465, lng: 85.8018, building: "ITER F-Block", floor: "Ground Floor" },
    contactEmail: "mech.admin@iter.soa.ac.in",
    managerName: "Dr. Rajesh Kulkarni",
    surplusCount: 24,
    shortageCount: 19,
  },
  {
    id: "dept-ece",
    code: "ECE",
    name: "Electronics & Communication (D-block)",
    building: "ITER D-block (VLSI & Embedded Systems)",
    coordinates: { lat: 20.2466, lng: 85.8003, building: "ITER D-block", floor: "2nd Floor" },
    contactEmail: "ece.stores@iter.soa.ac.in",
    managerName: "Dr. Arvind Swaminathan",
    surplusCount: 29,
    shortageCount: 15,
  },
  {
    id: "dept-civil",
    code: "CIVIL",
    name: "Civil Engineering & Geotech (A-Block)",
    building: "ITER A-Block (Structural Materials Wing)",
    coordinates: { lat: 20.2488, lng: 85.7996, building: "ITER A-Block", floor: "1st Floor" },
    contactEmail: "civil.procurement@iter.soa.ac.in",
    managerName: "Prof. Nandini Rao",
    surplusCount: 16,
    shortageCount: 22,
  },
  {
    id: "dept-design",
    code: "DESIGN",
    name: "Design & Innovation Studio (Bansuri Guru Wing)",
    building: "Bansuri Guru Auditorium & Media Wing",
    coordinates: { lat: 20.2475, lng: 85.8014, building: "Bansuri Guru Wing", floor: "2nd Floor" },
    contactEmail: "design.lab@iter.soa.ac.in",
    managerName: "Prof. Kabir Sen",
    surplusCount: 9,
    shortageCount: 28,
  },
  {
    id: "dept-library",
    code: "LIBRARY",
    name: "ITER Central Library",
    building: "ITER Central Library Building",
    coordinates: { lat: 20.2464, lng: 85.7997, building: "Central Library", floor: "2nd Floor" },
    contactEmail: "library.systems@iter.soa.ac.in",
    managerName: "Dr. Sunita Deshmukh",
    surplusCount: 42,
    shortageCount: 8,
  },
  {
    id: "dept-admin",
    code: "ADMIN",
    name: "ITER Administrative Block & Central Stores",
    building: "ITER Administrative Block (Main Complex)",
    coordinates: { lat: 20.2482, lng: 85.8000, building: "ITER Admin Block", floor: "Ground Floor" },
    contactEmail: "central.stores@soa.ac.in",
    managerName: "Dr. Alok Verma",
    surplusCount: 65,
    shortageCount: 5,
  },
  {
    id: "dept-research",
    code: "RESEARCH",
    name: "Advanced Research & Nanotech Center (S-Block)",
    building: "ITER S-Block & Innovation Center",
    coordinates: { lat: 20.2466, lng: 85.8011, building: "ITER S-Block", floor: "3rd Floor" },
    contactEmail: "research.ops@iter.soa.ac.in",
    managerName: "Dr. Vikram Sethi",
    surplusCount: 14,
    shortageCount: 31,
  },
];

// ===================================================
// 2. OVERVIEW IMPACT & ESG METRICS
// ===================================================
export const MOCK_IMPACT_METRICS: ImpactMetrics = {
  totalAssetsManaged: 250,
  surplusAssets: 78,
  shortagesActive: 46,
  activeTransfers: 14,
  reusedCount: 86,
  repairedCount: 42,
  redistributedCount: 79,
  recycledCount: 28,
  procurementAvoidedInr: 4865000, // ₹48.65 Lakhs
  wasteDivertedKg: 3420,           // 3.42 Metric Tons
  co2AvoidedKg: 9150,              // 9.15 Metric Tons CO2e
  logisticsKmOptimized: 184.6,     // 184.6 km saved via OR-Tools
};

// ===================================================
// 3. CIRCULAR PATHWAYS BREAKDOWN
// ===================================================
export const MOCK_CIRCULAR_PATHWAYS = [
  { name: "Reuse Direct", action: "REUSE", count: 86, percentage: 37, color: "#176B3A" },
  { name: "Internal Redistribute", action: "REDISTRIBUTE", count: 79, percentage: 34, color: "#2E9B59" },
  { name: "Repair & Refurbish", action: "REPAIR", count: 42, percentage: 18, color: "#E98A3A" },
  { name: "Certified Recycle", action: "RECYCLE", count: 28, percentage: 11, color: "#6B716B" },
];

// ===================================================
// 4. DEPARTMENT IMBALANCE DATA
// ===================================================
export const MOCK_DEPARTMENT_IMBALANCES = [
  { department: "CSE", surplus: 38, shortage: 12, net: 26 },
  { department: "MECH", surplus: 24, shortage: 19, net: 5 },
  { department: "ECE", surplus: 29, shortage: 15, net: 14 },
  { department: "CIVIL", surplus: 16, shortage: 22, net: -6 },
  { department: "DESIGN", surplus: 9, shortage: 28, net: -19 },
  { department: "LIBRARY", surplus: 42, shortage: 8, net: 34 },
  { department: "ADMIN", surplus: 65, shortage: 5, net: 60 },
  { department: "RESEARCH", surplus: 14, shortage: 31, net: -17 },
];

// ===================================================
// 5. RECENT AUDIT & ACTIVITY STREAM
// ===================================================
export interface ActivityItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actionType: "SURPLUS_REGISTERED" | "MATCH_APPROVED" | "DATA_WIPED" | "IN_TRANSIT" | "DELIVERED";
  assetName: string;
  assetTag: string;
  fromDept: string;
  toDept?: string;
  savingsInr?: number;
}

export const MOCK_RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-01",
    timestamp: "12 mins ago",
    actorName: "Rohan Nair",
    actorRole: "IT Security Officer",
    actionType: "DATA_WIPED",
    assetName: "Dell Latitude 5420 (i7, 16GB)",
    assetTag: "ASSET-CSE-104",
    fromDept: "Centre for Data Science (C-block)",
    toDept: "Bansuri Guru Design Studio",
    savingsInr: 65000,
  },
  {
    id: "act-02",
    timestamp: "45 mins ago",
    actorName: "Dr. Alok Verma",
    actorRole: "Admin Director",
    actionType: "MATCH_APPROVED",
    assetName: "12x Herman Miller Ergonomic Chairs",
    assetTag: "ASSET-LIB-082",
    fromDept: "Central Library",
    toDept: "S-Block Research Lab",
    savingsInr: 180000,
  },
  {
    id: "act-03",
    timestamp: "2 hours ago",
    actorName: "Prof. Priya Sharma",
    actorRole: "CSE Department Head",
    actionType: "SURPLUS_REGISTERED",
    assetName: "5x HP LaserJet Enterprise Printers",
    assetTag: "ASSET-CSE-219",
    fromDept: "Centre for Data Science (C-block)",
  },
  {
    id: "act-04",
    timestamp: "3.5 hours ago",
    actorName: "Logistics Team #1",
    actorRole: "Campus Van Dispatch",
    actionType: "IN_TRANSIT",
    assetName: "3x Epson 4K Interactive Projectors",
    assetTag: "ASSET-ADM-044",
    fromDept: "ITER Administrative Block",
    toDept: "A-Block Civil Engineering",
    savingsInr: 120000,
  },
  {
    id: "act-05",
    timestamp: "5 hours ago",
    actorName: "Prof. Kabir Sen",
    actorRole: "Design Head",
    actionType: "DELIVERED",
    assetName: "4x BenQ 27-inch Color-Accurate Monitors",
    assetTag: "ASSET-ECE-302",
    fromDept: "D-block (ECE)",
    toDept: "Bansuri Guru Wing",
    savingsInr: 96000,
  },
];
