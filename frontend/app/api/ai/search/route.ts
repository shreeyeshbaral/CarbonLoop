import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    const q = (query || "").toLowerCase();

    // Check category
    let category = null;
    if (q.includes("laptop") || q.includes("notebook")) category = "LAPTOP";
    else if (q.includes("monitor") || q.includes("screen") || q.includes("display")) category = "MONITOR";
    else if (q.includes("chair") || q.includes("seating")) category = "CHAIR";
    else if (q.includes("desk") || q.includes("table")) category = "DESK";
    else if (q.includes("projector")) category = "PROJECTOR";
    else if (q.includes("printer")) category = "PRINTER";
    else if (q.includes("switch") || q.includes("networking") || q.includes("router")) category = "NETWORKING";
    else if (q.includes("lab") || q.includes("microscope")) category = "LAB_EQUIPMENT";

    // Check quantity
    const qtyMatch = q.match(/\b(\d+)\b/);
    const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;

    // Check distance
    const distMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometers?)/);
    const maxDistanceKm = distMatch ? parseFloat(distMatch[1]) : null;

    // Check condition
    let condition = null;
    if (q.includes("excellent") || q.includes("mint") || q.includes("like new")) condition = "EXCELLENT";
    else if (q.includes("good") || q.includes("working") || q.includes("usable")) condition = "GOOD";
    else if (q.includes("fair") || q.includes("repairable")) condition = "FAIR";

    return NextResponse.json({
      status: "success",
      data: {
        originalQuery: query,
        parsedFilters: {
          category,
          condition,
          maxDistanceKm,
          quantity,
          status: "AVAILABLE",
        },
        explanation: `AI extracted structured filters: Category=${category || "ANY"}, Min Condition=${condition || "ANY"}, Quantity=${quantity}${
          maxDistanceKm ? `, Max Distance=${maxDistanceKm}km` : ""
        }`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to parse natural search query" },
      { status: 500 }
    );
  }
}
