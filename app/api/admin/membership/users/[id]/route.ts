// app/api/admin/membership/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import MembershipUser from '@/models/MembershipUser';
import SavingsAccount from '@/models/SavingsAccount';
import AdminActivityLog from '@/models/AdminActivityLog';

async function verifyAdmin(req: NextRequest): Promise<any> {
  const token = req.cookies.get('membershipToken')?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await MembershipUser.findById(decoded.userId);
    return user?.role === 'admin' ? decoded : null;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const user = await MembershipUser.findById(params.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const savingsAccount = await SavingsAccount.findOne({ userId: user._id });

    return NextResponse.json({
      user,
      savingsAccount,
    });
  } catch (error: any) {
    console.error('Admin user fetch error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { isActive, isVerified, role, businessName, phone } = body;

    const user = await MembershipUser.findById(params.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update fields
    if (isActive !== undefined) user.isActive = isActive;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (role) user.role = role;
    if (businessName !== undefined) user.businessName = businessName;
    if (phone) user.phone = phone;

    await user.save();

    // Log activity
    await AdminActivityLog.create({
      adminId: admin.userId,
      action: 'update_user',
      targetType: 'user',
      targetId: user._id,
      details: {
        updatedFields: body,
        previousData: {
          isActive: user.isActive,
          isVerified: user.isVerified,
          role: user.role,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ message: error.message || 'Failed to update user' }, { status: 500 });
  }
}