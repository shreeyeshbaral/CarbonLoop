import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, role, departmentCode, departmentName } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "UM";

    return NextResponse.json({
      success: true,
      user: {
        id: `usr-reg-${Date.now()}`,
        name,
        email: cleanEmail,
        role: role || "DEPARTMENT_MANAGER",
        roleLabel: "Institutional Faculty / Lab Head",
        department: departmentName || `${departmentCode || "CSE"} Faculty Cluster`,
        departmentCode: departmentCode || "CSE",
        avatarInitials: initials,
        description: `Registered faculty member in ${departmentCode || "CSE"}.`,
        provider: "email",
        token: `jwt-reg-${Date.now()}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Registration failed", details: error.message }, { status: 500 });
  }
}
