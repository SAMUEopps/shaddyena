// app/api/category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import product from '@/models/product';


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level');
    const parentId = searchParams.get('parentId');
    const slug = searchParams.get('slug');
    const popular = searchParams.get('popular');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    let query: any = { isActive: true };
    
    if (level) query.level = parseInt(level);
    if (parentId) query.parentId = parentId;
    if (slug) query.slug = slug;
    if (popular === 'true') query['metadata.popular'] = true;
    if (featured === 'true') query['metadata.featured'] = true;

    let categories = await Category.find(query)
      .sort({ level: 1, order: 1, name: 1 })
      .limit(limit);

    // If no categories exist, return empty array
    if (categories.length === 0) {
      return NextResponse.json({ categories: [] });
    }

    // If slug is provided, get the category and its children
    if (slug) {
      const category = categories[0];
      if (category) {
        const children = await Category.find({ parentId: category._id, isActive: true })
          .sort({ order: 1, name: 1 });
        
        // Get product counts for subcategories
        const categoryIds = [category._id, ...children.map(c => c._id)];
        const productCounts = await product.aggregate([
          { $match: { categoryId: { $in: categoryIds }, isActive: true, isApproved: true } },
          { $group: { _id: '$categoryId', count: { $sum: 1 } } }
        ]);

        // Update category metadata with product counts
        const countMap = new Map(productCounts.map(pc => [pc._id.toString(), pc.count]));
        
        return NextResponse.json({
          category,
          children: children.map(child => ({
            ...child.toObject(),
            productCount: countMap.get(child._id.toString()) || 0
          }))
        });
      }
    }

    // Get product counts for all categories
    const categoryIds = categories.map(c => c._id);
    const productCounts = await product.aggregate([
      { $match: { categoryId: { $in: categoryIds }, isActive: true, isApproved: true } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } }
    ]);

    const countMap = new Map(productCounts.map(pc => [pc._id.toString(), pc.count]));

    // Enhance categories with product counts
    const enhancedCategories = categories.map(category => ({
      ...category.toObject(),
      productCount: countMap.get(category._id.toString()) || 0
    }));

    return NextResponse.json({ categories: enhancedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication and admin role
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { verify } = await import('jsonwebtoken');
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const data = await req.json();
    
    // Generate slug from name
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Build path and ancestors
    let path = data.name;
    let ancestors: any[] = [];
    
    if (data.parentId) {
      const parent = await Category.findById(data.parentId);
      if (parent) {
        path = `${parent.path}/${data.name}`;
        ancestors = [...parent.ancestors, parent._id];
      }
    }
    
    const category = await Category.create({
      ...data,
      slug,
      path,
      ancestors,
    });

    // Update parent's metadata if needed
    if (data.parentId) {
      await Category.findByIdAndUpdate(data.parentId, {
        $inc: { 'metadata.productCount': 0 } // This will be updated when products are added
      });
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Category with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}