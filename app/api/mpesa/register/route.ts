import { NextRequest, NextResponse } from "next/server";
import { registerC2BUrls } from "@/lib/mpesaUtils";

export async function GET(req: NextRequest) {
  try {
    console.log("[DEBUG] Starting C2B registration...");
    console.log("[DEBUG] Shortcode:", process.env.MPESA_SHORTCODE ? "OK" : "MISSING");
    console.log("[DEBUG] Callback URL:", process.env.MPESA_CALLBACK_URL ? "OK" : "MISSING");

    const result = await registerC2BUrls();

    return NextResponse.json({
      success: true,
      message: "C2B URLs registered successfully",
      result,
    });
  } catch (error: any) {
    console.error("[FAILURE] Register error full:", error.response?.data || error);

    return NextResponse.json(
      { success: false, message: "Failed to register C2B URLs", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}

