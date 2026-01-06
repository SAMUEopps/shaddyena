// app/api/users/[id]/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import Order from '@/models/Order';
import Product from '@/models/product';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // 1️⃣ Extract JWT from cookies
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

    // 3️⃣ Load current user
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json({ message: 'User not found or inactive' }, { status: 404 });
    }

    // 4️⃣ Admin-only check
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // 5️⃣ Await the params promise
    const { id } = await context.params;

    // 6️⃣ Target user lookup
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 7️⃣ Prevent self-deletion
    if (user._id.toString() === currentUser._id.toString()) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
    }

    // 8️⃣ Vendor product protection
    if (user.role === 'vendor') {
      const productCount = await Product.countDocuments({ vendorId: id });
      if (productCount > 0) {
        return NextResponse.json(
          { message: 'Cannot delete vendor with active products. Please transfer or delete products first.', productCount },
          { status: 400 }
        );
      }
    }

    // 9️⃣ Order history protection
    const orderCount = await Order.countDocuments({
      $or: [{ userId: id }, { vendorId: id }],
    });
    if (orderCount > 0) {
      return NextResponse.json({ message: 'Cannot delete user with order history', orderCount }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}