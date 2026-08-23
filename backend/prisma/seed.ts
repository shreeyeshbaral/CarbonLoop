import { PrismaClient, AssetCategory, AssetCondition, CircularAction, AssetStatus, UrgencyLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 [CarbonLoop Seeder]: Initializing synthetic institutional database...");

  // 1. CLEAR EXISTING RECORDS SAFELY
  await prisma.auditLog.deleteMany();
  await prisma.dataWipeAudit.deleteMany();
  await prisma.matchOpportunity.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.shortageRequest.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.impactFactorConfig.deleteMany();
  await prisma.department.deleteMany();

  console.log("🧹 Cleared existing database tables.");

  // 2. SEED DEPARTMENTS
  const departmentsData = [
    {
      code: "CSE",
      name: "Computer Science & Engineering",
      building: "Alan Turing IT Complex",
      floor: "3rd Floor",
      room: "Lab 304",
      lat: 12.9722,
      lng: 77.5935,
      contactEmail: "cse.surplus@campus.edu",
      managerName: "Prof. Priya Sharma",
    },
    {
      code: "MECH",
      name: "Mechanical Engineering",
      building: "Sir M. Visvesvaraya Block",
      floor: "Ground Floor",
      room: "Workshop 1",
      lat: 12.9708,
      lng: 77.5960,
      contactEmail: "mech.admin@campus.edu",
      managerName: "Dr. Rajesh Kulkarni",
    },
    {
      code: "ECE",
      name: "Electronics & Communication",
      building: "J.C. Bose Tech Tower",
      floor: "2nd Floor",
      room: "VLSI Center",
      lat: 12.9735,
      lng: 77.5955,
      contactEmail: "ece.stores@campus.edu",
      managerName: "Dr. Arvind Swaminathan",
    },
    {
      code: "CIVIL",
      name: "Civil & Environmental Engineering",
      building: "Laurie Baker Eco Complex",
      floor: "1st Floor",
      room: "Structures Lab",
      lat: 12.9695,
      lng: 77.5930,
      contactEmail: "civil.procurement@campus.edu",
      managerName: "Prof. Nandini Rao",
    },
    {
      code: "DESIGN",
      name: "Department of Design & Media",
      building: "Innovation & Media Pavilion",
      floor: "4th Floor",
      room: "UI/UX Studio",
      lat: 12.9740,
      lng: 77.5925,
      contactEmail: "design.lab@campus.edu",
      managerName: "Prof. Kabir Sen",
    },
    {
      code: "LIBRARY",
      name: "Central Knowledge Resource Center",
      building: "Central Library Building",
      floor: "2nd Floor",
      room: "Digital Repositories",
      lat: 12.9715,
      lng: 77.5948,
      contactEmail: "library.systems@campus.edu",
      managerName: "Dr. Sunita Deshmukh",
    },
    {
      code: "ADMIN",
      name: "Central Administration & Stores",
      building: "Administrative Heritage Bhavan",
      floor: "Ground Floor",
      room: "Asset Central Bay",
      lat: 12.9702,
      lng: 77.5952,
      contactEmail: "central.stores@campus.edu",
      managerName: "Dr. Alok Verma",
    },
    {
      code: "RESEARCH",
      name: "Advanced Nanotech & AI Research Lab",
      building: "C.V. Raman Discovery Center",
      floor: "3rd Floor",
      room: "Clean Room 2",
      lat: 12.9730,
      lng: 77.5970,
      contactEmail: "research.ops@campus.edu",
      managerName: "Dr. Vikram Sethi",
    },
  ];

  const createdDepartments = [];
  for (const d of departmentsData) {
    const dept = await prisma.department.create({ data: d });
    createdDepartments.push(dept);
  }
  console.log(`✅ Seeded ${createdDepartments.length} departments.`);

  // 3. SEED IMPACT FACTOR CONFIGURATIONS
  const impactFactors: {
    category: AssetCategory;
    avgWeightKg: number;
    embodiedCo2Kg: number;
    avgNewPriceInr: number;
    repairFactor: number;
  }[] = [
    { category: "LAPTOP", avgWeightKg: 2.2, embodiedCo2Kg: 240, avgNewPriceInr: 75000, repairFactor: 0.12 },
    { category: "MONITOR", avgWeightKg: 5.5, embodiedCo2Kg: 180, avgNewPriceInr: 32000, repairFactor: 0.08 },
    { category: "DESKTOP", avgWeightKg: 9.0, embodiedCo2Kg: 320, avgNewPriceInr: 65000, repairFactor: 0.15 },
    { category: "CHAIR", avgWeightKg: 14.0, embodiedCo2Kg: 45, avgNewPriceInr: 28000, repairFactor: 0.05 },
    { category: "DESK", avgWeightKg: 28.0, embodiedCo2Kg: 65, avgNewPriceInr: 35000, repairFactor: 0.05 },
    { category: "PROJECTOR", avgWeightKg: 4.8, embodiedCo2Kg: 160, avgNewPriceInr: 85000, repairFactor: 0.18 },
    { category: "PRINTER", avgWeightKg: 16.0, embodiedCo2Kg: 210, avgNewPriceInr: 60000, repairFactor: 0.10 },
    { category: "NETWORKING", avgWeightKg: 6.2, embodiedCo2Kg: 190, avgNewPriceInr: 120000, repairFactor: 0.06 },
    { category: "LAB_EQUIPMENT", avgWeightKg: 22.0, embodiedCo2Kg: 450, avgNewPriceInr: 350000, repairFactor: 0.15 },
    { category: "OTHER", avgWeightKg: 5.0, embodiedCo2Kg: 50, avgNewPriceInr: 20000, repairFactor: 0.10 },
  ];

  for (const factor of impactFactors) {
    await prisma.impactFactorConfig.create({ data: factor });
  }
  console.log(`✅ Seeded ${impactFactors.length} impact factor benchmarks.`);

  // 4. GENERATE 250+ REALISTIC ASSETS
  const categories: AssetCategory[] = [
    "LAPTOP", "MONITOR", "DESKTOP", "CHAIR", "DESK", "PROJECTOR", "PRINTER", "NETWORKING", "LAB_EQUIPMENT"
  ];
  const conditions: AssetCondition[] = ["EXCELLENT", "GOOD", "FAIR", "POOR"];
  const actions: CircularAction[] = ["REUSE", "REDISTRIBUTE", "REPAIR", "RECYCLE"];

  const manufacturers: Record<string, string[]> = {
    LAPTOP: ["Dell Inc.", "Lenovo", "HP", "Apple"],
    MONITOR: ["Dell", "BenQ", "LG Electronics", "Samsung"],
    DESKTOP: ["Dell OptiPlex", "HP EliteDesk", "Lenovo ThinkCentre"],
    CHAIR: ["Herman Miller", "Steelcase", "Godrej Interio", "Featherlite"],
    DESK: ["Godrej Interio", "Featherlite", "Haworth"],
    PROJECTOR: ["Epson", "BenQ", "Sony", "Optoma"],
    PRINTER: ["HP LaserJet", "Canon ImageRunner", "Epson EcoTank"],
    NETWORKING: ["Cisco Systems", "Aruba Networks", "Juniper", "TP-Link Enterprise"],
    LAB_EQUIPMENT: ["Leica Geosystems", "Tektronix", "Agilent / Keysight", "Zeiss"],
  };

  const assetList = [];
  let tagCounter = 100;

  for (let i = 0; i < 250; i++) {
    const dept = createdDepartments[i % createdDepartments.length];
    const category = categories[i % categories.length];
    const condition = conditions[(i + 1) % conditions.length];
    const mfgList = manufacturers[category] || ["Campus Surplus"];
    const mfg = mfgList[i % mfgList.length];
    const isDataWipeCategory = ["LAPTOP", "DESKTOP", "PRINTER", "NETWORKING"].includes(category);

    const originalPrice =
      category === "LAB_EQUIPMENT" ? 350000 :
      category === "NETWORKING" ? 140000 :
      category === "LAPTOP" ? 85000 :
      category === "PROJECTOR" ? 90000 :
      category === "DESKTOP" ? 65000 :
      category === "MONITOR" ? 34000 :
      category === "CHAIR" ? 42000 : 25000;

    const conditionMultiplier = condition === "EXCELLENT" ? 0.7 : condition === "GOOD" ? 0.55 : condition === "FAIR" ? 0.35 : 0.15;
    const estimatedValue = Math.round(originalPrice * conditionMultiplier);
    const estimatedRepairCost = condition === "POOR" ? Math.round(originalPrice * 0.15) : condition === "FAIR" ? Math.round(originalPrice * 0.08) : 0;

    const recommendedAction =
      condition === "POOR" && estimatedRepairCost > estimatedValue ? "RECYCLE" :
      condition === "POOR" || condition === "FAIR" ? "REPAIR" :
      dept.code === "ADMIN" || dept.code === "LIBRARY" ? "REDISTRIBUTE" : "REUSE";

    const asset = await prisma.asset.create({
      data: {
        assetTag: `ASSET-${dept.code}-${++tagCounter}`,
        name: `${mfg} ${category.replace("_", " ")} Series-${(i % 20) + 1}`,
        category,
        condition,
        departmentId: dept.id,
        building: dept.building,
        floor: dept.floor,
        room: `Bay ${(i % 12) + 1}`,
        lat: dept.lat + (Math.random() - 0.5) * 0.002,
        lng: dept.lng + (Math.random() - 0.5) * 0.002,
        ageYears: Number((1.0 + (i % 5) * 0.8).toFixed(1)),
        purchaseDate: new Date(Date.now() - (i % 5) * 31536000000),
        originalPrice,
        estimatedValue,
        estimatedRepairCost,
        status: "AVAILABLE",
        dataWipeRequired: isDataWipeCategory,
        dataWipeCompleted: isDataWipeCategory && i % 2 === 0,
        recommendedAction,
        actionConfidence: 0.90 + (i % 10) * 0.01,
        aiReasoning: `Asset assessed in ${condition.toLowerCase()} condition. Circular pathway ${recommendedAction} optimizes institutional capital retention.`,
        serialNumber: `SN-${category.slice(0, 3)}-${tagCounter}-${i * 7}`,
        manufacturer: mfg,
        modelNumber: `MOD-${tagCounter}`,
        tags: ["Campus Inventory", "Synthetic Seed"],
      },
    });

    assetList.push(asset);
  }
  console.log(`✅ Seeded ${assetList.length} synthetic institutional assets.`);

  // 5. SEED ACTIVE SHORTAGE REQUESTS
  const shortageData = [
    { code: "DESIGN", category: "MONITOR" as AssetCategory, qty: 8, urgency: "HIGH" as UrgencyLevel, reason: "New UI/UX batch intake requires color-accurate secondary displays." },
    { code: "DESIGN", category: "LAPTOP" as AssetCategory, qty: 5, urgency: "CRITICAL" as UrgencyLevel, reason: "Faculty workstations pending replacement." },
    { code: "RESEARCH", category: "NETWORKING" as AssetCategory, qty: 4, urgency: "HIGH" as UrgencyLevel, reason: "Cleanroom switch expansion for sensor nodes." },
    { code: "CIVIL", category: "PROJECTOR" as AssetCategory, qty: 2, urgency: "MEDIUM" as UrgencyLevel, reason: "Classroom 102 projector lamp failure." },
    { code: "MECH", category: "CHAIR" as AssetCategory, qty: 12, urgency: "MEDIUM" as UrgencyLevel, reason: "CAD Lab ergonomics upgrade." },
    { code: "ECE", category: "LAB_EQUIPMENT" as AssetCategory, qty: 2, urgency: "CRITICAL" as UrgencyLevel, reason: "Signals and RF testing benches short of spectrum analyzers." },
  ];

  for (const s of shortageData) {
    const targetDept = createdDepartments.find((d) => d.code === s.code);
    if (targetDept) {
      await prisma.shortageRequest.create({
        data: {
          departmentId: targetDept.id,
          category: s.category,
          quantityRequested: s.qty,
          quantityFulfilled: 0,
          urgency: s.urgency,
          minimumCondition: "GOOD",
          requestedBy: targetDept.managerName,
          reason: s.reason,
          status: "OPEN",
        },
      });
    }
  }
  console.log(`✅ Seeded ${shortageData.length} departmental shortage requests.`);

  console.log("\n✨ [CarbonLoop Seeder]: Complete! 250 assets across 8 departments ready for live matching.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
