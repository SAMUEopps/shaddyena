// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // 1️⃣ Get token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // 2️⃣ Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // 3️⃣ Get current user
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json({ message: 'User not found or inactive' }, { status: 404 });
    }

    // 4️⃣ Admin check
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // 5️⃣ Await the params promise
    const { id } = await context.params;

    // 6️⃣ Validate updates
    const body = await req.json();
    const allowedUpdates = ['role', 'isActive', 'isVerified'];

    const updateData: Record<string, any> = {};
    Object.keys(body).forEach((key) => {
      if (allowedUpdates.includes(key)) updateData[key] = body[key];
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid updates provided' }, { status: 400 });
    }

    // 7️⃣ Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}