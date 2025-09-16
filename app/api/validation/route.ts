//validation/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import { decodeRef } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const accountNumber = body.AccountNumber || body.BillRefNumber;
    const amount = Math.round(Number(body.Amount));

    if (!accountNumber) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing account number' });
    }

    // Decode and validate reference
    const decoded = decodeRef(accountNumber);
    if (!decoded.ok) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
    }

    // Find order draft
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference not found' });
    }

    // Check if draft has expired
    if (draft.expiresAt < new Date()) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference expired' });
    }

    // Check if amount matches
    if (amount !== draft.totalAmount) {
      return NextResponse.json({ 
        ResultCode: 1, 
        ResultDesc: `Amount mismatch. Expected ${draft.totalAmount}` 
      });
    }

    // Update draft status
    draft.status = 'VALIDATED';
    await draft.save();

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}*/

// validation/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import { decodeRef } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("[VALIDATION] Incoming:", body);

    console.log("📩 [VALIDATION] Incoming payload:", JSON.stringify(body, null, 2));

    const accountNumber = body.AccountNumber || body.BillRefNumber;
    const amount = Math.round(Number(body.Amount));

    if (!accountNumber) {
      console.error("❌ [VALIDATION FAILED] Missing account number");
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing account number' });
    }

    // Decode and validate reference
    const decoded = decodeRef(accountNumber);
    if (!decoded.ok) {
      console.error(`❌ [VALIDATION FAILED] Invalid reference: ${accountNumber}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
    }

    // Find order draft
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      console.error(`❌ [VALIDATION FAILED] Draft not found for reference: ${accountNumber}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference not found' });
    }

    // Check if draft has expired
    if (draft.expiresAt < new Date()) {
      console.error(`❌ [VALIDATION FAILED] Draft expired for token: ${decoded.token}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference expired' });
    }

    // Check if amount matches
    if (amount !== draft.totalAmount) {
      console.error(
        `❌ [VALIDATION FAILED] Amount mismatch for token: ${decoded.token}. Expected ${draft.totalAmount}, got ${amount}`
      );
      return NextResponse.json({
        ResultCode: 1,
        ResultDesc: `Amount mismatch. Expected ${draft.totalAmount}`
      });
    }

    // Update draft status
    draft.status = 'VALIDATED';
    await draft.save();

    console.log(`✅ [VALIDATION SUCCESS] Draft ${decoded.token} validated successfully`);
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (error) {
    console.error('❌ [VALIDATION ERROR] Unexpected server error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}
*/

// app/api/validation/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderDraft from "@/models/OrderDraft";
import { decodeRef, lookupShort } from "@/lib/orderUtils";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("📩 [VALIDATION] Incoming payload:", JSON.stringify(body, null, 2));

    const accountNumber = body.AccountNumber || body.BillRefNumber;
    const amount = Math.round(Number(body.Amount));

    if (!accountNumber) {
      console.error("❌ [VALIDATION FAILED] Missing account number");
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Missing account number" });
    }

    // 🔎 Lookup fullRef from shortRef
    const fullRef = lookupShort(accountNumber);
    if (!fullRef) {
      console.error(`❌ [VALIDATION FAILED] Unknown shortRef: ${accountNumber}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Unknown reference" });
    }

    // Decode and validate reference
    const decoded = decodeRef(fullRef);
    if (!decoded.ok || !decoded.token) {
      console.error(`❌ [VALIDATION FAILED] Invalid fullRef: ${fullRef}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid reference" });
    }

    // Find order draft
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      console.error(`❌ [VALIDATION FAILED] Draft not found for token: ${decoded.token}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Reference not found" });
    }

    // Check if draft has expired
    if (draft.expiresAt < new Date()) {
      console.error(`❌ [VALIDATION FAILED] Draft expired for token: ${decoded.token}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Reference expired" });
    }

    // Check if amount matches
    if (amount !== draft.totalAmount) {
      console.error(
        `❌ [VALIDATION FAILED] Amount mismatch for token: ${decoded.token}. Expected ${draft.totalAmount}, got ${amount}`
      );
      return NextResponse.json({
        ResultCode: 1,
        ResultDesc: `Amount mismatch. Expected ${draft.totalAmount}`,
      });
    }

    // Update draft status
    draft.status = "VALIDATED";
    await draft.save();

    console.log(`✅ [VALIDATION SUCCESS] Draft ${decoded.token} validated successfully`);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("❌ [VALIDATION ERROR] Unexpected server error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Server error" });
  }
}
