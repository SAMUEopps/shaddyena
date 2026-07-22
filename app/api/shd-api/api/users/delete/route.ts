// C:\Users\USER\Desktop\Projects\my-app\app\api\admin\users\delete\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Vendor from '@/models/Vendor';
import Rider from '@/models/Rider';
import { verifyToken } from '@/lib/auth';

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { userId } = body;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete associated profiles
    if (user.role === 'vendor') {
      await Vendor.deleteOne({ userId: user._id });
    }
    if (user.role === 'rider') {
      await Rider.deleteOne({ userId: user._id });
    }

    await user.deleteOne();

    return NextResponse.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}