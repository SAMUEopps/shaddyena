import { NextRequest, NextResponse } from "next/server";
import { simulateC2Bv2Payment } from "@/lib/mpesaUtils";

/**
 * API to simulate a C2B v2 payment via browser
 * Example URL: /api/mpesa/simulate?amount=100&phone=2547XXXXXXXX
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = parseFloat(searchParams.get("amount") || "1");
    const phone = searchParams.get("phone");
    const accountRef = searchParams.get("accountRef") || "Test123";

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required in query params" },
        { status: 400 }
      );
    }

    // Call your simulate function
    const result = await simulateC2Bv2Payment(amount, phone, accountRef);

    console.log("[BROWSER] Simulation result:", result);

    return NextResponse.json({
      success: true,
      message: "C2B v2 payment simulation completed",
      result,
    });
  } catch (error: any) {
    console.error("[BROWSER] Simulation failed:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
