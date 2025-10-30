import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import SellerRequest from '@/models/SellerRequest';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Look up user in DB and check if admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user is admin
    if (adminUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { action, rejectionReason } = await req.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    // Find the seller request
    const sellerRequest = await SellerRequest.findById(params.id).populate('user');
    if (!sellerRequest) {
      return NextResponse.json({ message: 'Seller request not found' }, { status: 404 });
    }

    if (sellerRequest.status !== 'pending') {
      return NextResponse.json({ message: 'This request has already been processed' }, { status: 400 });
    }

    // Start a session for transaction
    const session = await dbConnect().then(conn => conn.startSession());

    try {
      session.startTransaction();

      if (action === 'approve') {
        // Update user role to vendor and add business info
        await User.findByIdAndUpdate(
          sellerRequest.user._id,
          {
            role: 'vendor',
            businessName: sellerRequest.businessName,
            businessType: sellerRequest.businessType,
            mpesaNumber: sellerRequest.mpesaNumber,
          },
          { session }
        );

        // Update seller request status
        sellerRequest.status = 'approved';
        sellerRequest.reviewedBy = adminUser._id;
        sellerRequest.reviewedAt = new Date();
        await sellerRequest.save({ session });

        await session.commitTransaction();

        return NextResponse.json({ message: 'Seller request approved successfully' });
      } else if (action === 'reject') {
        if (!rejectionReason?.trim()) {
          return NextResponse.json({ message: 'Rejection reason is required' }, { status: 400 });
        }

        // Update seller request status
        sellerRequest.status = 'rejected';
        sellerRequest.reviewedBy = adminUser._id;
        sellerRequest.reviewedAt = new Date();
        sellerRequest.rejectionReason = rejectionReason;
        await sellerRequest.save({ session });

        await session.commitTransaction();

        return NextResponse.json({ message: 'Seller request rejected successfully' });
      }
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error('Process seller request error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SellerRequest from "@/models/SellerRequest";
import User from "@/models/user";
import { verify } from "jsonwebtoken";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ Await the promise

  try {
    await dbConnect();

    // Extract token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Parse body
    const { status, notes } = await req.json();

    // Update request
    const updatedRequest = await SellerRequest.findByIdAndUpdate(
      id,
      { status, notes, reviewedBy: adminUser._id },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Seller request updated successfully" });
  } catch (error: any) {
    console.error("PATCH seller request error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}*/
