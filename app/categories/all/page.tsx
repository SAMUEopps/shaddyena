// app/categories/all/page.tsx
import { Metadata } from 'next';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/product';
import AllCategoriesClient from './AllCategoriesClient';

export const metadata: Metadata = {
  title: 'All Categories - Complete Directory | Shaddyna',
  description: 'Browse our complete category directory. Find everything from electronics to fashion, home goods to beauty products.',
};

// Define the Category type
interface CategoryType {
  _id: any;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: any;
  level: number;
  order: number;
  isActive: boolean;
  metadata?: {
    productCount?: number;
    popular?: boolean;
    featured?: boolean;
  };
  path: string;
  ancestors: any[];
  createdAt: Date;
  updatedAt: Date;
}

export default async function AllCategoriesPage() {
  await dbConnect();
  
  // Get all active categories with proper typing
  const allCategories = await Category.find({ isActive: true })
    .sort({ level: 1, order: 1, name: 1 })
    .lean() as unknown as CategoryType[];
  
  // Get product counts for all categories
  const categoryIds = allCategories.map(c => c._id);
  const productCounts = await Product.aggregate([
    { $match: { 
      categoryId: { $in: categoryIds },
      isActive: true,
      isApproved: true
    }},
    { $group: { _id: '$categoryId', count: { $sum: 1 } } }
  ]);
  
  const countMap = new Map(productCounts.map((pc: any) => [pc._id.toString(), pc.count]));
  
  // Organize categories by level
  const level1Categories = allCategories.filter(c => c.level === 1);
  const level2Categories = allCategories.filter(c => c.level === 2);
  const level3Categories = allCategories.filter(c => c.level === 3);
  const level4Categories = allCategories.filter(c => c.level === 4);
  
  // Create a map for quick parent-child relationships
  const categoriesWithCounts = allCategories.map(category => ({
    ...category,
    productCount: countMap.get(category._id.toString()) || 0,
    _id: category._id.toString(),
    parentId: category.parentId?.toString() || null,
  }));
  
  // Build hierarchical structure
  const categoryMap = new Map();
  categoriesWithCounts.forEach(cat => {
    categoryMap.set(cat._id, { ...cat, children: [] });
  });
  
  const hierarchicalCategories: any[] = [];
  categoriesWithCounts.forEach(cat => {
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      const parent = categoryMap.get(cat.parentId);
      parent.children.push(categoryMap.get(cat._id));
    } else if (cat.level === 1) {
      hierarchicalCategories.push(categoryMap.get(cat._id));
    }
  });
  
  // Get statistics
  const totalProducts = categoriesWithCounts.reduce((sum, cat) => sum + cat.productCount, 0);
  const totalCategories = allCategories.length;
  const topCategories = [...categoriesWithCounts]
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 12);
  
  return (
    <AllCategoriesClient
      categories={JSON.parse(JSON.stringify(categoriesWithCounts))}
      hierarchicalCategories={JSON.parse(JSON.stringify(hierarchicalCategories))}
      level1Categories={JSON.parse(JSON.stringify(level1Categories))}
      level2Categories={JSON.parse(JSON.stringify(level2Categories))}
      level3Categories={JSON.parse(JSON.stringify(level3Categories))}
      level4Categories={JSON.parse(JSON.stringify(level4Categories))}
      totalProducts={totalProducts}
      totalCategories={totalCategories}
      topCategories={JSON.parse(JSON.stringify(topCategories))}
    />
  );
}