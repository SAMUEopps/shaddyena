// C:\Users\USER\Desktop\Projects\my-app\app\api\admin\members\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
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

    const members = await User.find({ isMember: true })
      .select('name email phoneNumber memberSince totalSavings totalInvestments availableBalance referralEarnings')
      .sort({ memberSince: -1 });

    return NextResponse.json({ members });

  } catch (error) {
    console.error('Fetch members error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}