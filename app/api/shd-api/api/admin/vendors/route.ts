// C:\Users\USER\Desktop\Projects\my-app\app\api\admin\vendors\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
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

    const vendors = await Vendor.find()
      .populate('userId', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    return NextResponse.json({ vendors });

  } catch (error) {
    console.error('Fetch vendors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}