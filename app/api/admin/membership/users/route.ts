// app/api/admin/membership/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import MembershipUser from '@/models/MembershipUser';
import SavingsAccount from '@/models/SavingsAccount';
import AdminActivityLog from '@/models/AdminActivityLog';

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('membershipToken')?.value;
  if (!token) return false;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    // Check if user is admin - you need to add a role field to MembershipUser
    const user = await MembershipUser.findById(decoded.userId);
    return user?.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    /*if (!await verifyAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }*/

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { membershipNumber: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status === 'active') query.isActive = true;
    else if (status === 'inactive') query.isActive = false;

    // Get users with pagination
    const users = await MembershipUser.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await MembershipUser.countDocuments(query);

    // Get savings accounts for each user
    const userIds = users.map(u => u._id);
    const savingsAccounts = await SavingsAccount.find({ 
      userId: { $in: userIds } 
    }).lean();

    // Combine data
    /*const usersWithSavings = users.map(user => {
      const account = savingsAccounts.find(a => a.userId.toString() === user.id.toString());
      return {
        ...user,
        savingsAccount: account || null,
      };
    });*/

    // Combine data
    const usersWithSavings = users.map((user: any) => {
      const account = savingsAccounts.find((a: any) =>
        a.userId?.toString() === user._id?.toString()
      );

      return {
        ...user,
        savingsAccount: account || null,
      };
    });

    return NextResponse.json({
      users: usersWithSavings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}