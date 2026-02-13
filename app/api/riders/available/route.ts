import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function GET(request: NextRequest) {
  await dbConnect();

  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = verify(token, process.env.JWT_SECRET as string);
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const currentUser = await User.findById(decoded.userId);

  if (!currentUser || !currentUser.isActive) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // ✅ Vendors ARE allowed
  if (!['vendor', 'admin'].includes(currentUser.role)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const riders = await User.find({
    role: 'delivery',
    isActive: true,
  })
    .select('_id firstName lastName phone')
    .lean();

  return NextResponse.json({ riders });
}
