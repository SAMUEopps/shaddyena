// // // app/api/products/[id]/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { connectToDatabase } from '@/lib/mongodb';
// // import Product from '@/models/Product';
// // import Vendor from '@/models/Vendor';
// // import { verifyToken } from '@/lib/auth';

// // export async function PUT(
// //   req: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   try {
// //     await connectToDatabase();
// //     const token = req.headers.get('authorization')?.split(' ')[1];
// //     const decoded = verifyToken(token);
    
// //     if (!decoded) {
// //       return NextResponse.json(
// //         { error: 'Unauthorized' },
// //         { status: 401 }
// //       );
// //     }

// //     // Get vendor profile
// //     const vendor = await Vendor.findOne({ userId: decoded.userId });
// //     if (!vendor) {
// //       return NextResponse.json(
// //         { error: 'Vendor profile not found' },
// //         { status: 404 }
// //       );
// //     }

// //     const productId = params.id;
// //     const body = await req.json();
// //     const { name, price, stock, description, isActive } = body;

// //     // Find the product and verify ownership
// //     const product = await Product.findOne({ 
// //       _id: productId, 
// //       vendorId: vendor._id 
// //     });

// //     if (!product) {
// //       return NextResponse.json(
// //         { error: 'Product not found or you do not have permission to edit it' },
// //         { status: 404 }
// //       );
// //     }

// //     // Update product fields
// //     if (name !== undefined) product.name = name;
// //     if (price !== undefined) product.price = price;
// //     if (stock !== undefined) product.stock = stock;
// //     if (description !== undefined) product.description = description;
// //     if (isActive !== undefined) product.isActive = isActive;

// //     await product.save();

// //     return NextResponse.json({
// //       message: 'Product updated successfully',
// //       product
// //     });

// //   } catch (error) {
// //     console.error('Product update error:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to update product' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function DELETE(
// //   req: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   try {
// //     await connectToDatabase();
// //     const token = req.headers.get('authorization')?.split(' ')[1];
// //     const decoded = verifyToken(token);
    
// //     if (!decoded) {
// //       return NextResponse.json(
// //         { error: 'Unauthorized' },
// //         { status: 401 }
// //       );
// //     }

// //     // Get vendor profile
// //     const vendor = await Vendor.findOne({ userId: decoded.userId });
// //     if (!vendor) {
// //       return NextResponse.json(
// //         { error: 'Vendor profile not found' },
// //         { status: 404 }
// //       );
// //     }

// //     const productId = params.id;

// //     // Find and delete the product (verify ownership)
// //     const product = await Product.findOneAndDelete({ 
// //       _id: productId, 
// //       vendorId: vendor._id 
// //     });

// //     if (!product) {
// //       return NextResponse.json(
// //         { error: 'Product not found or you do not have permission to delete it' },
// //         { status: 404 }
// //       );
// //     }

// //     return NextResponse.json({
// //       message: 'Product deleted successfully'
// //     });

// //   } catch (error) {
// //     console.error('Product deletion error:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to delete product' },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextRequest, NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import { connectToDatabase } from '@/lib/mongodb';
// import Product from '@/models/Product';
// import Vendor from '@/models/Vendor';
// import { verifyToken } from '@/lib/auth';

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectToDatabase();

//     const token = req.headers.get('authorization')?.split(' ')[1];

//     if (!token) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const decoded = verifyToken(token);

//     if (!decoded) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const { id: productId } = await params;

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return NextResponse.json(
//         { error: 'Invalid product ID' },
//         { status: 400 }
//       );
//     }

//     const vendor = await Vendor.findOne({ userId: decoded.userId });

//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor profile not found' },
//         { status: 404 }
//       );
//     }

//     const body = await req.json();

//     const {
//       name,
//       price,
//       stock,
//       description,
//       isActive,
//       image,
//       category,
//     } = body;

//     const product = await Product.findOne({
//       _id: productId,
//       vendorId: vendor._id,
//     });

//     if (!product) {
//       return NextResponse.json(
//         {
//           error:
//             'Product not found or you do not have permission to edit it',
//         },
//         { status: 404 }
//       );
//     }

//     if (name !== undefined) product.name = name;
//     if (price !== undefined) product.price = price;
//     if (stock !== undefined) product.stock = stock;
//     if (description !== undefined) product.description = description;
//     if (isActive !== undefined) product.isActive = isActive;
//     if (image !== undefined) product.image = image;
//     if (category !== undefined) product.category = category;

//     await product.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Product updated successfully',
//       product,
//     });
//   } catch (error) {
//     console.error('Product update error:', error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Failed to update product',
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectToDatabase();

//     const token = req.headers.get('authorization')?.split(' ')[1];

//     if (!token) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const decoded = verifyToken(token);

//     if (!decoded) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const { id: productId } = await params;

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return NextResponse.json(
//         { error: 'Invalid product ID' },
//         { status: 400 }
//       );
//     }

//     const vendor = await Vendor.findOne({
//       userId: decoded.userId,
//     });

//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor profile not found' },
//         { status: 404 }
//       );
//     }

//     const product = await Product.findOneAndDelete({
//       _id: productId,
//       vendorId: vendor._id,
//     });

//     if (!product) {
//       return NextResponse.json(
//         {
//           error:
//             'Product not found or you do not have permission to delete it',
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Product deleted successfully',
//     });
//   } catch (error) {
//     console.error('Product deletion error:', error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Failed to delete product',
//       },
//       { status: 500 }
//     );
//   }
// }

// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { verifyToken } from '@/shd-lib/lib/auth';
import Vendor from '@/shd-models/models/Vendor';
import Product from '@/models/product';
import { deleteFromCloudinary } from '@/shd-lib/lib/cloudinary';


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ userId: decoded.userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      name,
      price,
      stock,
      description,
      isActive,
      image,
      imagePublicId,
      category,
      removeImage,
    } = body;

    const product = await Product.findOne({
      _id: productId,
      vendorId: vendor._id,
    });

    if (!product) {
      return NextResponse.json(
        {
          error:
            'Product not found or you do not have permission to edit it',
        },
        { status: 404 }
      );
    }

    // Handle image removal
    if (removeImage) {
      if (product.imagePublicId) {
        try {
          await deleteFromCloudinary(product.imagePublicId);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
      product.image = undefined;
      product.imagePublicId = undefined;
    } else if (image !== undefined) {
      // If updating image, delete old one from Cloudinary
      if (product.imagePublicId && image !== product.image) {
        try {
          await deleteFromCloudinary(product.imagePublicId);
        } catch (error) {
          console.error('Error deleting old image from Cloudinary:', error);
        }
      }
      product.image = image;
      product.imagePublicId = imagePublicId;
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (description !== undefined) product.description = description;
    if (isActive !== undefined) product.isActive = isActive;
    if (category !== undefined) product.category = category;

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Product update error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({
      userId: decoded.userId,
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const product = await Product.findOne({
      _id: productId,
      vendorId: vendor._id,
    });

    if (!product) {
      return NextResponse.json(
        {
          error:
            'Product not found or you do not have permission to delete it',
        },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if exists
    if (product.imagePublicId) {
      try {
        await deleteFromCloudinary(product.imagePublicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await product.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Product deletion error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
      },
      { status: 500 }
    );
  }
}