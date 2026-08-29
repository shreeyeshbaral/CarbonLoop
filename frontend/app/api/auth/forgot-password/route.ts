import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    return NextResponse.json({
      success: true,
      message: `Password reset verification code generated for ${cleanEmail}`,
      otp,
      expiresIn: "15 minutes",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Password reset request failed", details: error.message }, { status: 500 });
  }
}
