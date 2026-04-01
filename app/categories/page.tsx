// app/categories/page.tsx
import { Metadata } from 'next';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/product';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: 'All Categories - Shaddyna',
  description: 'Browse all product categories on Shaddyna. Find electronics, fashion, home goods, and more at great prices.',
};

export default async function CategoriesPage() {
  await dbConnect();
  
  // Get all top-level categories with their children
  const topCategories = await Category.find({ level: 1, isActive: true })
    .sort({ order: 1, name: 1 });
  
  // Get all subcategories
  const allSubcategories = await Category.find({ level: { $gte: 2 }, isActive: true })
    .sort({ level: 1, order: 1, name: 1 });
  
  // Create a map of parent to children
  const categoryMap = new Map();
  topCategories.forEach(cat => {
    categoryMap.set(cat._id.toString(), {
      ...cat.toObject(),
      children: [],
      productCount: 0
    });
  });
  
  allSubcategories.forEach(sub => {
    if (sub.parentId) {
      const parentId = sub.parentId.toString();
      if (categoryMap.has(parentId)) {
        const parent = categoryMap.get(parentId);
        if (!parent.children) parent.children = [];
        parent.children.push({
          ...sub.toObject(),
          children: [],
          productCount: 0
        });
      }
    }
  });
  
  // Get product counts for all categories
  const allCategoryIds = [...topCategories.map(c => c._id), ...allSubcategories.map(c => c._id)];
  const productCounts = await Product.aggregate([
    { $match: { 
      categoryId: { $in: allCategoryIds },
      isActive: true,
      isApproved: true
    }},
    { $group: { _id: '$categoryId', count: { $sum: 1 } } }
  ]);
  
  const countMap = new Map(productCounts.map(pc => [pc._id.toString(), pc.count]));
  
  // Update counts in the map
  const categoriesWithCounts = Array.from(categoryMap.values()).map(cat => {
    const updatedCat = { ...cat };
    updatedCat.productCount = countMap.get(cat._id.toString()) || 0;
    
    if (updatedCat.children) {
      updatedCat.children = updatedCat.children.map((child: any) => ({
        ...child,
        productCount: countMap.get(child._id.toString()) || 0
      }));
    }
    
    return updatedCat;
  });
  
  // Get featured categories (with most products)
  const featuredCategories = [...categoriesWithCounts]
    .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
    .slice(0, 6);
  
  // Get popular products from each top category
  const popularProductsByCategory = await Promise.all(
    topCategories.slice(0, 4).map(async (category) => {
      const categoryIds = [category._id];
      const subcategories = allSubcategories.filter(sub => sub.parentId?.toString() === category._id.toString());
      categoryIds.push(...subcategories.map(sub => sub._id));
      
      const products = await Product.find({
        categoryId: { $in: categoryIds },
        isActive: true,
        isApproved: true
      })
        .sort({ 'rating.average': -1, createdAt: -1 })
        .limit(4)
        //.populate('shopId', 'businessName logo');
      
      return {
        category: category.toObject(),
        products: products.map(p => p.toObject())
      };
    })
  );
  
  return (
    <CategoriesClient
      categories={JSON.parse(JSON.stringify(categoriesWithCounts))}
      featuredCategories={JSON.parse(JSON.stringify(featuredCategories))}
      popularProductsByCategory={JSON.parse(JSON.stringify(popularProductsByCategory))}
    />
  );
}