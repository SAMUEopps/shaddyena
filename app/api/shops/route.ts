import { NextRequest, NextResponse } from 'next/server';
import Shop from '@/models/shop';
import dbConnect from '@/lib/dbConnect';


export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    
    const skip = (page - 1) * limit;
    
    // Build filter query
    const filter: any = { isActive: true };
    
    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { businessType: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    
    const shops = await Shop.find(filter)
      .populate('vendorId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Shop.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      shops,
      pagination: {
        currentPage: page,
        totalPages,
        totalShops: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    );
  }
}