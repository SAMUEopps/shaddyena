import { NextRequest, NextResponse } from 'next/server';
import Shop from '@/models/shop';
import dbConnect from '@/lib/dbConnect';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   
) {
  try {
    await dbConnect();

    const { id } = await params;                    
    const shop = await Shop.findById(id)
      .populate('vendorId', 'firstName lastName email phone');

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json({ error: 'Failed to fetch shop' }, { status: 500 });
  }
}