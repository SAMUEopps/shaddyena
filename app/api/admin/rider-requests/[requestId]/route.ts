import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import RiderRequest from '@/models/RiderRequest';

export async function PUT(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    const { requestId } = params;
    const body = await req.json();
    const { action, adminNotes } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Find the rider request
    const riderRequest = await RiderRequest.findById(requestId);
    
    if (!riderRequest) {
      return NextResponse.json(
        { success: false, error: 'Rider request not found' },
        { status: 404 }
      );
    }

    if (riderRequest.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `This request has already been ${riderRequest.status}` },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Update rider request status
      riderRequest.status = 'approved';
      riderRequest.adminNotes = adminNotes || 'Application approved. Welcome to the delivery team!';
      riderRequest.reviewedBy = adminUser._id;
      riderRequest.reviewedAt = new Date();
      await riderRequest.save();

      // Update user role to delivery
      const user = await User.findById(riderRequest.userId);
      if (user) {
        user.role = 'delivery';
        
        // Add rider profile information
        user.riderProfile = {
          isApproved: true,
          vehicleType: riderRequest.vehicleType,
          vehicleModel: riderRequest.vehicleModel,
          vehiclePlate: riderRequest.vehiclePlate,
          licenseNumber: riderRequest.licenseNumber,
          rating: 0,
          totalDeliveries: 0,
          joinedAt: new Date(),
        };
        
        await user.save();
      }

      return NextResponse.json({
        success: true,
        message: 'Rider application approved and user role updated to delivery',
        data: riderRequest,
      });
    } else {
      // Reject the request
      if (!adminNotes || adminNotes.trim() === '') {
        return NextResponse.json(
          { success: false, error: 'Please provide a reason for rejection' },
          { status: 400 }
        );
      }
      
      riderRequest.status = 'rejected';
      riderRequest.adminNotes = adminNotes;
      riderRequest.reviewedBy = adminUser._id;
      riderRequest.reviewedAt = new Date();
      await riderRequest.save();

      return NextResponse.json({
        success: true,
        message: 'Rider application rejected',
        data: riderRequest,
      });
    }
  } catch (error) {
    console.error('Error processing rider request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process rider request' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    const { requestId } = params;

    const riderRequest = await RiderRequest.findById(requestId);

    if (!riderRequest) {
      return NextResponse.json(
        { success: false, error: 'Rider request not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of pending or rejected requests
    if (riderRequest.status === 'approved') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete an approved request' },
        { status: 400 }
      );
    }

    await RiderRequest.findByIdAndDelete(requestId);

    return NextResponse.json({
      success: true,
      message: 'Rider request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting rider request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete rider request' },
      { status: 500 }
    );
  }
}