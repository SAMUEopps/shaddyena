// scripts/fixProductCategories.js
// Run with: node scripts/fixProductCategories.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Helper function to find category by path or name
async function findCategoryByNameAndPath(categoryName, parentId = null) {
  if (!categoryName) return null;
  
  const query = { 
    name: categoryName,
    level: parentId ? { $gte: 2 } : 1
  };
  
  if (parentId) {
    query.parentId = parentId;
  }
  
  return await Category.findOne(query);
}

// Helper function to find or create category mapping
async function buildCategoryMap() {
  const categories = await Category.find({});
  const map = new Map();
  
  // Create a map for quick lookup
  categories.forEach(cat => {
    // Map by name and parentId combination
    const key = `${cat.name}|${cat.parentId || 'root'}`;
    map.set(key, cat);
    
    // Also map by name for root categories
    if (cat.level === 1) {
      map.set(`root|${cat.name}`, cat);
    }
  });
  
  return map;
}

// Function to get correct category based on product's category string
async function getCorrectCategory(product, categoryMap) {
  const { category, subcategory, subSubcategory, subSubSubcategory } = product;
  
  try {
    let currentCategory = null;
    let currentParentId = null;
    let path = '';
    let ancestors = [];
    
    // Level 1: Main category
    if (category) {
      const mainCat = await Category.findOne({ 
        name: category, 
        level: 1 
      });
      
      if (!mainCat) {
        console.log(`⚠️  Main category not found: ${category}`);
        return null;
      }
      
      currentCategory = mainCat;
      currentParentId = mainCat._id;
      path = mainCat.name;
      ancestors = [];
      
      // Level 2: Subcategory
      if (subcategory) {
        const subCat = await Category.findOne({
          name: subcategory,
          parentId: currentParentId,
          level: 2
        });
        
        if (subCat) {
          currentCategory = subCat;
          currentParentId = subCat._id;
          path = `${mainCat.name}/${subCat.name}`;
          ancestors = [mainCat._id];
          
          // Level 3: SubSubcategory
          if (subSubcategory) {
            const subSubCat = await Category.findOne({
              name: subSubcategory,
              parentId: currentParentId,
              level: 3
            });
            
            if (subSubCat) {
              currentCategory = subSubCat;
              currentParentId = subSubCat._id;
              path = `${mainCat.name}/${subCat.name}/${subSubCat.name}`;
              ancestors = [mainCat._id, subCat._id];
              
              // Level 4: SubSubSubcategory
              if (subSubSubcategory) {
                const subSubSubCat = await Category.findOne({
                  name: subSubSubcategory,
                  parentId: currentParentId,
                  level: 4
                });
                
                if (subSubSubCat) {
                  currentCategory = subSubSubCat;
                  path = `${mainCat.name}/${subCat.name}/${subSubCat.name}/${subSubSubCat.name}`;
                  ancestors = [mainCat._id, subCat._id, subSubCat._id];
                }
              }
            }
          }
        }
      }
    }
    
    return {
      categoryId: currentCategory._id,
      categoryPath: path,
      level: currentCategory.level,
      ancestors,
      subcategoryId: ancestors[0] || null,
      subSubcategoryId: ancestors[1] || null,
      subSubSubcategoryId: ancestors[2] || null
    };
    
  } catch (error) {
    console.error(`Error finding category for product ${product._id}:`, error);
    return null;
  }
}

// Main function to fix all products
async function fixProductCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products\n`);

    // Build category map
    const categoryMap = await buildCategoryMap();
    console.log(`📂 Loaded ${categoryMap.size} category mappings\n`);

    let fixedCount = 0;
    let errorCount = 0;
    let noCategoryCount = 0;

    // Process each product
    for (const product of products) {
      console.log(`\n🔍 Processing product: ${product.name} (ID: ${product._id})`);
      console.log(`   Current Category: ${product.category}`);
      console.log(`   Current CategoryPath: ${product.categoryPath}`);
      console.log(`   Current CategoryId: ${product.categoryId}`);

      // Get correct category based on product's category strings
      const correctCategory = await getCorrectCategory(product, categoryMap);
      
      if (!correctCategory) {
        console.log(`   ❌ Could not find correct category for ${product.category}`);
        noCategoryCount++;
        continue;
      }

      // Check if product needs update
      const needsUpdate = 
        product.categoryId.toString() !== correctCategory.categoryId.toString() ||
        product.categoryPath !== correctCategory.categoryPath;

      if (!needsUpdate) {
        console.log(`   ✅ Already correct`);
        continue;
      }

      console.log(`   🔄 Updating:`);
      console.log(`      Old CategoryId: ${product.categoryId}`);
      console.log(`      New CategoryId: ${correctCategory.categoryId}`);
      console.log(`      Old Path: ${product.categoryPath}`);
      console.log(`      New Path: ${correctCategory.categoryPath}`);

      // Update product
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            categoryId: correctCategory.categoryId,
            categoryPath: correctCategory.categoryPath,
            subcategoryId: correctCategory.subcategoryId,
            subSubcategoryId: correctCategory.subSubcategoryId,
            subSubSubcategoryId: correctCategory.subSubSubcategoryId
          }
        }
      );

      fixedCount++;
      console.log(`   ✅ Updated successfully`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Products fixed: ${fixedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`⚠️  No category found: ${noCategoryCount}`);
    console.log(`📦 Total products processed: ${products.length}`);

    // Update product counts for all categories
    console.log('\n🔄 Updating category product counts...');
    
    const categories = await Category.find({});
    for (const category of categories) {
      const count = await Product.countDocuments({
        categoryId: category._id,
        isActive: true,
        isApproved: true
      });
      
      await Category.updateOne(
        { _id: category._id },
        { $set: { 'metadata.productCount': count } }
      );
      
      if (count > 0) {
        console.log(`   📊 ${category.name}: ${count} products`);
      }
    }

    console.log('\n✅ All done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  fixProductCategories();
}

module.exports = { fixProductCategories, getCorrectCategory };