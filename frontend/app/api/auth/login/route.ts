import { NextRequest, NextResponse } from "next/server";
import { DEMO_PROFILES } from "@/context/RoleContext";
import { UserRole } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check demo accounts
    const matchedRole = (Object.keys(DEMO_PROFILES) as UserRole[]).find(
      (r) => DEMO_PROFILES[r].email.toLowerCase() === cleanEmail
    );

    if (matchedRole) {
      const profile = DEMO_PROFILES[matchedRole];
      return NextResponse.json({
        success: true,
        user: {
          ...profile,
          provider: "email",
          token: `jwt-demo-${matchedRole.toLowerCase()}-${Date.now()}`,
        },
      });
    }

    // 2. Custom valid user fallback
    const namePart = cleanEmail.split("@")[0].replace(/[._]/g, " ");
    const formattedName = namePart
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return NextResponse.json({
      success: true,
      user: {
        id: `usr-${Date.now()}`,
        name: formattedName || "Faculty Member",
        email: cleanEmail,
        role: "DEPARTMENT_MANAGER",
        roleLabel: "Faculty Lab In-Charge",
        department: "ITER Engineering Cluster",
        departmentCode: "CSE",
        avatarInitials: formattedName ? formattedName.slice(0, 2).toUpperCase() : "FM",
        description: "Authenticated institutional user.",
        provider: "email",
        token: `jwt-custom-${Date.now()}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Authentication failed", details: error.message }, { status: 500 });
  }
}
