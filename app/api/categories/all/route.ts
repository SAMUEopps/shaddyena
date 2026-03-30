// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import User from '@/models/user';

// Helper to verify JWT from cookies and return user
async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

// Helper to build category tree
function buildCategoryTree(categories: any[], parentId: string | null = null): any[] {
  const filtered = categories.filter(cat =>
    parentId === null ? !cat.parentId : cat.parentId?.toString() === parentId
  );

return filtered.map(cat => ({
  ...cat,
  children: buildCategoryTree(categories, cat._id.toString())
}));
}

// GET: fetch categories
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser(req);
    if (!user ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    const categories = await Category.find({})
      .sort({ level: 1, order: 1, name: 1 })
      .lean();

    if (format === 'tree') {
      const tree = buildCategoryTree(categories);
      return NextResponse.json({ categories: tree });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}