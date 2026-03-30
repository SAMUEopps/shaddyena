// app/category/[slug]/page.tsx
import { Metadata } from 'next';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/product';
import CategoryPageClient from './CategoryPageClient';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string; sort?: string; minPrice?: string; maxPrice?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  await dbConnect();
  const category = await Category.findOne({ slug: params.slug, isActive: true });
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  return {
    title: `${category.name} - Shaddyna`,
    description: category.description || `Shop for ${category.name} products at Shaddyna. Best prices, quality products, and fast delivery.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  await dbConnect();
  
  const category = await Category.findOne({ slug: params.slug, isActive: true });
  
  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Category Not Found</h1>
          <p className="text-[var(--color-text-muted)] mt-2">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  // Get all descendant categories (subcategories at all levels)
  const getAllDescendantCategories = async (parentId: string) => {
    const descendants = await Category.find({ 
      ancestors: { $in: [parentId] },
      isActive: true 
    });
    return descendants;
  };
  
  // Get all subcategories (direct children)
  const subcategories = await Category.find({ parentId: category._id, isActive: true })
    .sort({ order: 1, name: 1 });
  
  // Get all descendant categories for product filtering
  const descendantCategories = await getAllDescendantCategories(category._id);
  const allRelatedCategoryIds = [category._id, ...descendantCategories.map(c => c._id)];
  
  // Pagination and sorting
  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;
  const sort = searchParams.sort || 'newest';
  const minPrice = parseFloat(searchParams.minPrice || '0');
  const maxPrice = parseFloat(searchParams.maxPrice || '1000000');
  
  let sortQuery = {};
  switch (sort) {
    case 'price_asc':
      sortQuery = { price: 1 };
      break;
    case 'price_desc':
      sortQuery = { price: -1 };
      break;
    case 'rating':
      sortQuery = { 'rating.average': -1 };
      break;
    case 'newest':
    default:
      sortQuery = { createdAt: -1 };
      break;
  }
  
  // Build the product query
  const productQuery = {
    isActive: true,
    isApproved: true,
    price: { $gte: minPrice, $lte: maxPrice },
    $or: [
      // Direct category match
      { categoryId: { $in: allRelatedCategoryIds } },
      // Match by category path (for products with full path stored)
      { categoryPath: { $regex: `^${category.path}`, $options: 'i' } },
      // Match by any of the subcategory fields
      { subcategoryId: { $in: allRelatedCategoryIds } },
      { subSubcategoryId: { $in: allRelatedCategoryIds } },
      { subSubSubcategoryId: { $in: allRelatedCategoryIds } }
    ]
  };
  
  // Get products with filters
  const products = await Product.find(productQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .populate('vendorId', 'name email')
    .populate('shopId', 'businessName logo')
    .lean();
  
  // Get total count for pagination
  const totalProducts = await Product.countDocuments(productQuery);
  
  // Get featured products for this category (top rated)
  const featuredProducts = await Product.find({
    ...productQuery,
    'rating.average': { $gte: 4 }
  })
    .sort({ 'rating.average': -1 })
    .limit(8)
    .lean();
  
  // Get price range for filters
  const priceStats = await Product.aggregate([
    { $match: productQuery },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);
  
  const priceRange = priceStats[0] || { minPrice: 0, maxPrice: 1000000 };
  
  // Get brands for filters
  const brands = await Product.distinct('brand', productQuery);
  
  return (
    <CategoryPageClient
      category={JSON.parse(JSON.stringify(category))}
      subcategories={JSON.parse(JSON.stringify(subcategories))}
      products={JSON.parse(JSON.stringify(products))}
      featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
      totalProducts={totalProducts}
      currentPage={page}
      currentSort={sort}
      priceRange={priceRange}
      brands={brands}
    />
  );
}