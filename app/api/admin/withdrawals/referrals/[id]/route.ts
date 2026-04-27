import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import ReferralWithdrawal from "@/models/RefferalWithdrawal";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const admin = await User.findById(decoded.userId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { status, mpesaTransactionCode, adminNotes } =
      await req.json();

    const withdrawalId = params.id;

    const withdrawal =
      await ReferralWithdrawal.findById(withdrawalId);

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      status,
      processedBy: admin._id,
      processedAt: new Date(),
    };

    if (mpesaTransactionCode) {
      updateData.mpesaTransactionCode = mpesaTransactionCode;
    }

    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    await ReferralWithdrawal.findByIdAndUpdate(
      withdrawalId,
      updateData
    );

    const updatedWithdrawal = await ReferralWithdrawal.findById(
      withdrawalId
    )
      .populate(
        "userId",
        "firstName lastName email phone"
      )
      .populate(
        "processedBy",
        "firstName lastName email"
      );

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${status} successfully`,
      withdrawal: updatedWithdrawal,
    });
  } catch (err) {
    console.error("Admin referral withdrawal update error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const admin = await User.findById(decoded.userId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const withdrawalId = params.id;

    const withdrawal =
      await ReferralWithdrawal.findById(withdrawalId);

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "pending") {
      return NextResponse.json(
        {
          error:
            "Can only delete pending withdrawal requests",
        },
        { status: 400 }
      );
    }

    await ReferralWithdrawal.findByIdAndDelete(withdrawalId);

    return NextResponse.json({
      success: true,
      message: "Withdrawal request deleted successfully",
    });
  } catch (err) {
    console.error("Admin referral withdrawal delete error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}