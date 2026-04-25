import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/product';
import User from '@/models/user';
import Shop from '@/models/shop';


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    const vendorId = searchParams.get('vendorId') || 'all';
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Build filter
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'active') {
      filter.isActive = true;
      filter.isApproved = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    } else if (status === 'pending') {
      filter.isApproved = false;
    } else if (status === 'out_of_stock') {
      filter.stock = 0;
    }

    if (category !== 'all') {
      filter.categoryPath = { $regex: category, $options: 'i' };
    }

    if (vendorId !== 'all') {
      filter.vendorId = vendorId;
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'price_high':
        sort = { price: -1 };
        break;
      case 'price_low':
        sort = { price: 1 };
        break;
      case 'name_asc':
        sort = { name: 1 };
        break;
      case 'name_desc':
        sort = { name: -1 };
        break;
      case 'stock_low':
        sort = { stock: 1 };
        break;
      case 'stock_high':
        sort = { stock: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Get products with pagination
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('vendorId', 'firstName lastName email businessName')
        .populate('shopId', 'businessName logo')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Get unique categories for filter
    const categories = await Product.distinct('categoryPath');

    // Get vendors list for filter
    const vendors = await User.find(
      { role: 'vendor', isActive: true },
      'firstName lastName email businessName'
    ).lean();

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      categories: categories.filter(c => c && c !== ''),
      vendors
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}