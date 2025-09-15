import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[INFO] C2B request received:", body);

    const { TransID, TransAmount, MSISDN, BillRefNumber } = body;

    // ---- Backend validation example ----
    const isValidAccount = true; // Check BillRefNumber in your DB
    const expectedAmount = 500;   // Optional: check amount

    if (!isValidAccount || TransAmount <= 0 || TransAmount !== expectedAmount) {
      console.warn("[WARN] Payment rejected:", body);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Rejected" });
    }

    // ---- Save payment to DB here ----
    console.log("[SUCCESS] Payment accepted:", body);

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error: any) {
    console.error("[ERROR] C2B webhook failed:", error.message);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}
