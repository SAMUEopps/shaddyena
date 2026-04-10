/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';
import Shop from '@/models/shop';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Only vendors can access their products
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get vendor's shop first
    const shop = await Shop.findOne({ vendorId: decoded.userId });
    if (!shop) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
    }

    // Get products with pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const products = await Product.find({ vendorId: decoded.userId, shopId: shop._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ vendorId: decoded.userId, shopId: shop._id });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Only vendors can create products
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get vendor's shop
    const shop = await Shop.findOne({ vendorId: decoded.userId });
    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found. Please create a shop first.' },
        { status: 400 }
      );
    }

    const productData = await req.json();

    // Validate required category fields
    if (!productData.category) {
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    // Create new product with shopName included
    const product = await Product.create({
      ...productData,
      vendorId: decoded.userId,
      shopId: shop._id,
      shopName: shop.businessName, // <-- Save shop name
    });

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

// app/api/vendor/products/route.ts (updated POST section)
/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';
import Shop from '@/models/shop';
import Category from '@/models/Category';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Only vendors can create products
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get vendor's shop
    const shop = await Shop.findOne({ vendorId: decoded.userId });
    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found. Please create a shop first.' },
        { status: 400 }
      );
    }

    const productData = await req.json();

    // Validate required category
    if (!productData.categoryId) {
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    // Get the category and build the path
    const category = await Category.findById(productData.categoryId);
    if (!category) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    // Build category path
    let categoryPath = category.name;
    if (productData.subcategoryId) {
      const subcategory = await Category.findById(productData.subcategoryId);
      if (subcategory) {
        categoryPath = `${category.name}/${subcategory.name}`;
      }
    }
    if (productData.subSubcategoryId) {
      const subSubcategory = await Category.findById(productData.subSubcategoryId);
      if (subSubcategory) {
        categoryPath = `${categoryPath}/${subSubcategory.name}`;
      }
    }
    if (productData.subSubSubcategoryId) {
      const subSubSubcategory = await Category.findById(productData.subSubSubcategoryId);
      if (subSubSubcategory) {
        categoryPath = `${categoryPath}/${subSubSubcategory.name}`;
      }
    }

    // Create new product with category references
    const product = await Product.create({
      ...productData,
      categoryPath,
      vendorId: decoded.userId,
      shopId: shop._id,
      shopName: shop.businessName,
    });

    // Update category product counts
    await Category.findByIdAndUpdate(productData.categoryId, {
      $inc: { 'metadata.productCount': 1 }
    });
    
    if (productData.subcategoryId) {
      await Category.findByIdAndUpdate(productData.subcategoryId, {
        $inc: { 'metadata.productCount': 1 }
      });
    }
    
    if (productData.subSubcategoryId) {
      await Category.findByIdAndUpdate(productData.subSubcategoryId, {
        $inc: { 'metadata.productCount': 1 }
      });
    }
    
    if (productData.subSubSubcategoryId) {
      await Category.findByIdAndUpdate(productData.subSubSubcategoryId, {
        $inc: { 'metadata.productCount': 1 }
      });
    }

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/


// app/api/vendor/products/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';
import Shop from '@/models/shop';
import Category from '@/models/Category';

export async function POST(req: NextRequest) {
  console.log('🚀 [POST /vendor/products] Request started');

  try {
    await dbConnect();
    console.log('✅ Database connected');

    // ================= AUTH =================
    const token = req.cookies.get('token')?.value;
    if (!token) {
      console.warn('❌ No token found in cookies');
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
      console.log('✅ Token verified:', decoded.userId);
    } catch (err) {
      console.error('❌ Invalid token:', err);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'vendor') {
      console.warn('❌ User is not a vendor:', decoded.role);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // ================= SHOP =================
    const shop = await Shop.findOne({ vendorId: decoded.userId });
    if (!shop) {
      console.warn('❌ Shop not found for vendor:', decoded.userId);
      return NextResponse.json(
        { message: 'Shop not found. Please create a shop first.' },
        { status: 400 }
      );
    }
    console.log('✅ Shop found:', shop.businessName);

    // ================= REQUEST BODY =================
    const productData = await req.json();
    console.log('📦 Incoming product data:', productData.name);

    if (!productData.categoryId) {
      console.warn('❌ Missing categoryId');
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    // ================= CATEGORY =================
    const category = await Category.findById(productData.categoryId);
    if (!category) {
      console.warn('❌ Invalid category:', productData.categoryId);
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    console.log('✅ Category found:', category.name);

    // ================= BUILD CATEGORY PATH =================
    let categoryPath = category.name;

    if (productData.subcategoryId) {
      const sub = await Category.findById(productData.subcategoryId);
      if (sub) {
        categoryPath = `${categoryPath}/${sub.name}`;
        console.log('➡️ Subcategory:', sub.name);
      }
    }

    if (productData.subSubcategoryId) {
      const subSub = await Category.findById(productData.subSubcategoryId);
      if (subSub) {
        categoryPath = `${categoryPath}/${subSub.name}`;
        console.log('➡️ Sub-Subcategory:', subSub.name);
      }
    }

    if (productData.subSubSubcategoryId) {
      const subSubSub = await Category.findById(productData.subSubSubcategoryId);
      if (subSubSub) {
        categoryPath = `${categoryPath}/${subSubSub.name}`;
        console.log('➡️ Level 4 category:', subSubSub.name);
      }
    }

    console.log('📂 Final category path:', categoryPath);

    // ================= CREATE PRODUCT =================
    const product = await Product.create({
      ...productData,
      categoryPath,
      vendorId: decoded.userId,
      shopId: shop._id,
      shopName: shop.businessName,
    });

    console.log('✅ Product created:', product._id);

    // ================= UPDATE CATEGORY COUNTS =================
    const updateCount = async (id: string, label: string) => {
      try {
        await Category.findByIdAndUpdate(id, {
          $inc: { 'metadata.productCount': 1 },
        });
        console.log(`📊 Updated product count for ${label}`);
      } catch (err) {
        console.error(`❌ Failed updating count for ${label}`, err);
      }
    };

    await updateCount(productData.categoryId, 'category');

    if (productData.subcategoryId) {
      await updateCount(productData.subcategoryId, 'subcategory');
    }

    if (productData.subSubcategoryId) {
      await updateCount(productData.subSubcategoryId, 'subSubcategory');
    }

    if (productData.subSubSubcategoryId) {
      await updateCount(productData.subSubSubcategoryId, 'subSubSubcategory');
    }

    console.log('🎉 Product creation completed successfully');

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('🔥 Fatal error creating product:', error);

    if (error.code === 11000) {
      console.warn('⚠️ Duplicate key error (likely SKU)');
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

// app/api/vendor/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';
import Shop from '@/models/shop';
import Category from '@/models/Category';

// Helper to convert string to ObjectId
const toObjectId = (id: string) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
};

// ================= GET: Fetch Vendor Products =================
export async function GET(req: NextRequest) {
  console.log('🚀 [GET /vendor/products] Request started');

  try {
    await dbConnect();
    console.log('✅ Database connected');

    // ================= AUTH =================
    const token = req.cookies.get('token')?.value;
    if (!token) {
      console.warn('❌ No token found in cookies');
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
      console.log('✅ Token verified:', decoded.userId);
    } catch (err) {
      console.error('❌ Invalid token:', err);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'vendor') {
      console.warn('❌ User is not a vendor:', decoded.role);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Convert string ID to ObjectId for proper querying
    const vendorObjectId = toObjectId(decoded.userId);
    if (!vendorObjectId) {
      return NextResponse.json({ message: 'Invalid vendor ID' }, { status: 400 });
    }

    // ================= SHOP =================
    const shop = await Shop.findOne({ vendorId: vendorObjectId });
    if (!shop) {
      console.warn('❌ Shop not found for vendor:', decoded.userId);
      // Return empty array instead of error - vendor might not have shop yet
      return NextResponse.json({
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0
        },
        message: 'No shop found. Please create a shop first to add products.'
      }, { status: 200 });
    }
    console.log('✅ Shop found:', shop.businessName);

    // ================= FETCH PRODUCTS =================
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const query: any = { shopId: shop._id };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    console.log(`✅ Found ${products.length} products (total: ${total})`);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('🔥 Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// ================= POST: Create Product =================
/*export async function POST(req: NextRequest) {
  console.log('🚀 [POST /vendor/products] Request started');

  try {
    await dbConnect();
    console.log('✅ Database connected');

    // ================= AUTH =================
    const token = req.cookies.get('token')?.value;
    if (!token) {
      console.warn('❌ No token found in cookies');
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
      console.log('✅ Token verified:', decoded.userId);
    } catch (err) {
      console.error('❌ Invalid token:', err);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'vendor') {
      console.warn('❌ User is not a vendor:', decoded.role);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Convert string ID to ObjectId for proper querying
    const vendorObjectId = toObjectId(decoded.userId);
    if (!vendorObjectId) {
      return NextResponse.json({ message: 'Invalid vendor ID' }, { status: 400 });
    }

    // ================= SHOP =================
    const shop = await Shop.findOne({ vendorId: vendorObjectId });
    if (!shop) {
      console.warn('❌ Shop not found for vendor:', decoded.userId);
      return NextResponse.json(
        { message: 'Shop not found. Please create a shop first.' },
        { status: 400 }
      );
    }
    console.log('✅ Shop found:', shop.businessName);

    // ================= REQUEST BODY =================
    const productData = await req.json();
    console.log('📦 Incoming product data:', productData.name);

    if (!productData.categoryId) {
      console.warn('❌ Missing categoryId');
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    // ================= CATEGORY =================
    const category = await Category.findById(productData.categoryId);
    if (!category) {
      console.warn('❌ Invalid category:', productData.categoryId);
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    console.log('✅ Category found:', category.name);

    // ================= BUILD CATEGORY PATH =================
    let categoryPath = category.name;

    if (productData.subcategoryId) {
      const sub = await Category.findById(productData.subcategoryId);
      if (sub) {
        categoryPath = `${categoryPath}/${sub.name}`;
        console.log('➡️ Subcategory:', sub.name);
      }
    }

    if (productData.subSubcategoryId) {
      const subSub = await Category.findById(productData.subSubcategoryId);
      if (subSub) {
        categoryPath = `${categoryPath}/${subSub.name}`;
        console.log('➡️ Sub-Subcategory:', subSub.name);
      }
    }

    if (productData.subSubSubcategoryId) {
      const subSubSub = await Category.findById(productData.subSubSubcategoryId);
      if (subSubSub) {
        categoryPath = `${categoryPath}/${subSubSub.name}`;
        console.log('➡️ Level 4 category:', subSubSub.name);
      }
    }

    console.log('📂 Final category path:', categoryPath);

    // ================= CREATE PRODUCT =================
    const product = await Product.create({
      ...productData,
      categoryPath,
      vendorId: vendorObjectId, // Use ObjectId, not string
      shopId: shop._id,
      shopName: shop.businessName,
    });

    console.log('✅ Product created:', product._id);

    // ================= UPDATE CATEGORY COUNTS =================
    const updateCount = async (id: string, label: string) => {
      try {
        await Category.findByIdAndUpdate(id, {
          $inc: { 'metadata.productCount': 1 },
        });
        console.log(`📊 Updated product count for ${label}`);
      } catch (err) {
        console.error(`❌ Failed updating count for ${label}`, err);
      }
    };

    await updateCount(productData.categoryId, 'category');

    if (productData.subcategoryId) {
      await updateCount(productData.subcategoryId, 'subcategory');
    }

    if (productData.subSubcategoryId) {
      await updateCount(productData.subSubcategoryId, 'subSubcategory');
    }

    if (productData.subSubSubcategoryId) {
      await updateCount(productData.subSubSubcategoryId, 'subSubSubcategory');
    }

    console.log('🎉 Product creation completed successfully');

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('🔥 Fatal error creating product:', error);

    if (error.code === 11000) {
      console.warn('⚠️ Duplicate key error (likely SKU)');
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

// ================= POST: Create Product =================
export async function POST(req: NextRequest) {
  console.log('🚀 [POST /vendor/products] Request started');

  try {
    await dbConnect();
    console.log('✅ Database connected');

    // ================= AUTH =================
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const vendorObjectId = toObjectId(decoded.userId);
    if (!vendorObjectId) {
      return NextResponse.json({ message: 'Invalid vendor ID' }, { status: 400 });
    }

    // ================= SHOP =================
    const shop = await Shop.findOne({ vendorId: vendorObjectId });
    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found. Please create a shop first.' },
        { status: 400 }
      );
    }

    // ================= REQUEST BODY =================
    let productData = await req.json();

    console.log('📦 Incoming product:', productData.name);

    // 🔥 CLEAN EMPTY VALUES (VERY IMPORTANT)
    Object.keys(productData).forEach((key) => {
      if (productData[key] === "" || productData[key] === null) {
        delete productData[key];
      }
    });

    // ================= VALIDATION =================
    if (!productData.categoryId) {
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    // ================= CATEGORY =================
    const category = await Category.findById(productData.categoryId);
    if (!category) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    console.log('✅ Category:', category.name);

    // ================= BUILD CATEGORY PATH =================
    let categoryPathParts: string[] = [category.name];

    const safeFindCategory = async (id: any) => {
      if (!id) return null;
      return await Category.findById(id);
    };

    const sub = await safeFindCategory(productData.subcategoryId);
    if (sub) {
      categoryPathParts.push(sub.name);
      console.log('➡️ Subcategory:', sub.name);
    }

    const subSub = await safeFindCategory(productData.subSubcategoryId);
    if (subSub) {
      categoryPathParts.push(subSub.name);
      console.log('➡️ Sub-Subcategory:', subSub.name);
    }

    const subSubSub = await safeFindCategory(productData.subSubSubcategoryId);
    if (subSubSub) {
      categoryPathParts.push(subSubSub.name);
      console.log('➡️ Level 4:', subSubSub.name);
    }

    const categoryPath = categoryPathParts.join('/');
    console.log('📂 Final category path:', categoryPath);

    // ================= CREATE PRODUCT =================
    const product = await Product.create({
      ...productData,
      categoryPath,
      vendorId: vendorObjectId,
      shopId: shop._id,
      shopName: shop.businessName,
    });

    console.log('✅ Product created:', product._id);

    // ================= UPDATE CATEGORY COUNTS =================
    const updateCount = async (id: any, label: string) => {
      if (!id) return;

      try {
        await Category.findByIdAndUpdate(id, {
          $inc: { 'metadata.productCount': 1 },
        });
        console.log(`📊 Updated ${label}`);
      } catch (err) {
        console.error(`❌ Failed updating ${label}`, err);
      }
    };

    await updateCount(productData.categoryId, 'category');
    await updateCount(productData.subcategoryId, 'subcategory');
    await updateCount(productData.subSubcategoryId, 'subSubcategory');
    await updateCount(productData.subSubSubcategoryId, 'subSubSubcategory');

    console.log('🎉 Product creation completed');

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('🔥 Fatal error:', error);

    if (error.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}