import { NextRequest, NextResponse } from 'next/server';

import Product from '@/models/product';
import dbConnect from '@/lib/dbConnect';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await dbConnect();

    const { productId } = params;

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}