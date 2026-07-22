// C:\Users\USER\Desktop\Projects\my-app\app\api\rider\toggle-availability\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Rider from '@/shd-models/models/Rider';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'rider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { isAvailable } = body;

    const rider = await Rider.findOneAndUpdate(
      { userId: decoded.userId },
      { 
        isAvailable,
        ...(isAvailable ? { lastOnlineAt: new Date() } : { lastOfflineAt: new Date() })
      },
      { new: true }
    );

    if (!rider) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Rider is now ${isAvailable ? 'online' : 'offline'}`,
      isAvailable: rider.isAvailable
    });

  } catch (error) {
    console.error('Error toggling availability:', error);
    return NextResponse.json(
      { error: 'Failed to toggle availability' },
      { status: 500 }
    );
  }
}