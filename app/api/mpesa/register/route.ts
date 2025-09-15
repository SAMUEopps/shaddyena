import { NextRequest, NextResponse } from "next/server";
import { registerC2BUrls } from "@/lib/mpesaUtils";

export async function GET(req: NextRequest) {
  try {
    const result = await registerC2BUrls();
    return NextResponse.json({
      success: true,
      message: "C2B URLs registered successfully",
      result,
    });
  } catch (error: any) {
    console.error("Register error:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Failed to register C2B URLs" },
      { status: 500 }
    );
  }
}
