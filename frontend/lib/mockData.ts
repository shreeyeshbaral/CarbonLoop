import { Department, ImpactMetrics, CircularAction, AssetCategory } from "@/types";

// ===================================================
// 1. CAMPUS DEPARTMENTS (8 Canonical Academic Nodes)
// Realistic Indian Institute of Technology / University Campus
// Center Coordinates: (12.9716, 77.5946)
// ===================================================
export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: "dept-cse",
    code: "CSE",
    name: "Computer Science & Engineering",
    building: "Alan Turing IT Complex",
    coordinates: { lat: 12.9722, lng: 77.5935, building: "Alan Turing IT Complex", floor: "3rd Floor" },
    contactEmail: "cse.surplus@campus.edu",
    managerName: "Prof. Priya Sharma",
    surplusCount: 38,
    shortageCount: 12,
  },
  {
    id: "dept-mech",
    code: "MECH",
    name: "Mechanical Engineering",
    building: "Sir M. Visvesvaraya Block",
    coordinates: { lat: 12.9708, lng: 77.5960, building: "Sir M. Visvesvaraya Block", floor: "Ground Floor" },
    contactEmail: "mech.admin@campus.edu",
    managerName: "Dr. Rajesh Kulkarni",
    surplusCount: 24,
    shortageCount: 19,
  },
  {
    id: "dept-ece",
    code: "ECE",
    name: "Electronics & Communication",
    building: "J.C. Bose Tech Tower",
    coordinates: { lat: 12.9735, lng: 77.5955, building: "J.C. Bose Tech Tower", floor: "2nd Floor" },
    contactEmail: "ece.stores@campus.edu",
    managerName: "Dr. Arvind Swaminathan",
    surplusCount: 29,
    shortageCount: 15,
  },
  {
    id: "dept-civil",
    code: "CIVIL",
    name: "Civil & Environmental Engineering",
    building: "Laurie Baker Eco Complex",
    coordinates: { lat: 12.9695, lng: 77.5930, building: "Laurie Baker Eco Complex", floor: "1st Floor" },
    contactEmail: "civil.procurement@campus.edu",
    managerName: "Prof. Nandini Rao",
    surplusCount: 16,
    shortageCount: 22,
  },
  {
    id: "dept-design",
    code: "DESIGN",
    name: "Department of Design & Media",
    building: "Innovation & Media Pavilion",
    coordinates: { lat: 12.9740, lng: 77.5925, building: "Innovation & Media Pavilion", floor: "4th Floor" },
    contactEmail: "design.lab@campus.edu",
    managerName: "Prof. Kabir Sen",
    surplusCount: 9,
    shortageCount: 28,
  },
  {
    id: "dept-library",
    code: "LIBRARY",
    name: "Central Knowledge Resource Center",
    building: "Central Library Building",
    coordinates: { lat: 12.9715, lng: 77.5948, building: "Central Library Building", floor: "2nd Floor" },
    contactEmail: "library.systems@campus.edu",
    managerName: "Dr. Sunita Deshmukh",
    surplusCount: 42,
    shortageCount: 8,
  },
  {
    id: "dept-admin",
    code: "ADMIN",
    name: "Central Administration & Stores",
    building: "Administrative Heritage Bhavan",
    coordinates: { lat: 12.9702, lng: 77.5952, building: "Administrative Heritage Bhavan", floor: "Ground Floor" },
    contactEmail: "central.stores@campus.edu",
    managerName: "Dr. Alok Verma",
    surplusCount: 65,
    shortageCount: 5,
  },
  {
    id: "dept-research",
    code: "RESEARCH",
    name: "Advanced Nanotech & AI Research Lab",
    building: "C.V. Raman Discovery Center",
    coordinates: { lat: 12.9730, lng: 77.5970, building: "C.V. Raman Discovery Center", floor: "3rd Floor" },
    contactEmail: "research.ops@campus.edu",
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
// 3. CIRCULAR PATHWAYS BREAKDOWN (Strict warm palette: no blue/purple)
// ===================================================
export const MOCK_CIRCULAR_PATHWAYS = [
  { name: "Reuse Direct", action: "REUSE", count: 86, percentage: 37, color: "#176B3A" },       // Forest Green
  { name: "Internal Redistribute", action: "REDISTRIBUTE", count: 79, percentage: 34, color: "#2E9B59" }, // Leaf Green
  { name: "Repair & Refurbish", action: "REPAIR", count: 42, percentage: 18, color: "#E98A3A" },   // Amber
  { name: "Certified Recycle", action: "RECYCLE", count: 28, percentage: 11, color: "#6B716B" },    // Slate Gray
];

// ===================================================
// 4. DEPARTMENT IMBALANCE DATA (Surplus vs Shortage)
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
    fromDept: "CSE",
    toDept: "Design Lab",
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
    fromDept: "Library",
    toDept: "Research Lab",
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
    fromDept: "CSE",
  },
  {
    id: "act-04",
    timestamp: "3.5 hours ago",
    actorName: "Logistics Team #2",
    actorRole: "Internal Dispatch",
    actionType: "IN_TRANSIT",
    assetName: "3x Epson 4K Interactive Projectors",
    assetTag: "ASSET-ADM-044",
    fromDept: "Admin",
    toDept: "Civil Engg",
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
    fromDept: "ECE",
    toDept: "Design Lab",
    savingsInr: 96000,
  },
];
