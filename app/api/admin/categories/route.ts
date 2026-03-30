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
    ...cat.toObject(),
    children: buildCategoryTree(categories, cat._id.toString())
  }));
}

// GET: fetch categories
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
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

// POST: create category
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, parentId, description, icon, image, order, isActive, metadata } = body;

    // Generate slug
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) slug = `${slug}-${Date.now()}`;

    // Determine level and path
    let level = 1;
    let path = name;
    let ancestors: string[] = [];

    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) return NextResponse.json({ error: 'Parent category not found' }, { status: 404 });

      level = parent.level + 1;
      path = `${parent.path}/${name}`;
      ancestors = [...parent.ancestors.map((a: { toString: () => any; }) => a.toString()), parentId];

      if (level > 4) {
        return NextResponse.json({ error: 'Maximum category depth is 4 levels' }, { status: 400 });
      }
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      image,
      parentId: parentId || null,
      level,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      metadata: {
        productCount: 0,
        popular: metadata?.popular || false,
        featured: metadata?.featured || false
      },
      path,
      ancestors
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// PUT: update category
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Category ID required' }, { status: 400 });

    const body = await req.json();
    const { name, description, icon, image, order, isActive, metadata } = body;

    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    // Update slug if name changed
    let slug = category.slug;
    if (name && name !== category.name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existingSlug = await Category.findOne({ slug, _id: { $ne: id } });
      if (existingSlug) slug = `${slug}-${Date.now()}`;
    }

    // Update path if name changed
    let path = category.path;
    if (name && name !== category.name) {
      const pathParts = category.path.split('/');
      pathParts[pathParts.length - 1] = name;
      path = pathParts.join('/');
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name || category.name,
        slug,
        description: description ?? category.description,
        icon: icon ?? category.icon,
        image: image ?? category.image,
        order: order ?? category.order,
        isActive: isActive ?? category.isActive,
        path,
        'metadata.popular': metadata?.popular ?? category.metadata?.popular,
        'metadata.featured': metadata?.featured ?? category.metadata?.featured
      },
      { new: true }
    );

    // Update paths of all descendants if name changed
    if (name && name !== category.name) {
      const descendants = await Category.find({ ancestors: id });
      for (const descendant of descendants) {
        const newPath = descendant.path.replace(category.path, updatedCategory.path);
        await Category.findByIdAndUpdate(descendant._id, { path: newPath });
      }
    }

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE: remove category
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Category ID required' }, { status: 400 });

    const children = await Category.find({ parentId: id });
    if (children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Delete subcategories first.' },
        { status: 400 }
      );
    }

    const Product = (await import('@/models/product')).default;
    const products = await Product.find({ categoryId: id });
    if (products.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${products.length} products. Reassign or delete products first.` },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}