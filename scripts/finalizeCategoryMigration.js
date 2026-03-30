// scripts/finalizeCategoryMigration.js
import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import dbConnect from '../lib/dbConnect.js';

// Additional mappings for remaining products
const additionalMappings = {
  'Consumer unit': {
    keywords: ['consumer unit', 'electrical panel', 'breaker box', 'fuse box', 'distribution board'],
    parentPath: 'Electronics',
    categoryName: 'Electronics'
  },
  'Shay Toy': {
    keywords: ['toy', 'shay toy', 'children toy', 'plaything'],
    parentPath: 'Home & Kitchen',
    categoryName: 'Toys & Games'
  },
  'Dfg': {
    keywords: ['dfg', 'accessory'],
    parentPath: 'Fashion',
    categoryName: 'Fashion Accessories'
  },
  'photo': {
    keywords: ['photo', 'photography', 'camera', 'picture'],
    parentPath: 'Electronics',
    categoryName: 'Cameras & Photography'
  },
  'Mizzo': {
    keywords: ['mizzo', 'fashion', 'clothing'],
    parentPath: 'Fashion',
    categoryName: 'Fashion'
  },
  'nyks': {
    keywords: ['nyks', 'accessory'],
    parentPath: 'Fashion',
    categoryName: 'Fashion Accessories'
  },
  'seller product': {
    keywords: ['seller', 'product', 'general'],
    parentPath: 'Electronics',
    categoryName: 'Electronics'
  }
};

async function createMissingCategories() {
  console.log('🔍 Checking for missing categories...');
  
  // Check if Toys & Games category exists
  let toysCategory = await Category.findOne({ name: 'Toys & Games' });
  if (!toysCategory) {
    console.log('📦 Creating Toys & Games category...');
    const electronicsParent = await Category.findOne({ name: 'Home & Kitchen' });
    if (electronicsParent) {
      toysCategory = await Category.create({
        name: 'Toys & Games',
        slug: 'toys-games',
        level: 2,
        parentId: electronicsParent._id,
        order: 99,
        isActive: true,
        path: `${electronicsParent.path}/Toys & Games`,
        ancestors: [electronicsParent._id],
        metadata: {
          productCount: 0,
          popular: false,
          featured: false
        }
      });
      console.log(`✅ Created Toys & Games category`);
    }
  }
  
  // Check if Fashion Accessories category exists
  let fashionAccessories = await Category.findOne({ name: 'Fashion Accessories' });
  if (!fashionAccessories) {
    console.log('📦 Creating Fashion Accessories category...');
    const fashionParent = await Category.findOne({ name: 'Fashion' });
    if (fashionParent) {
      fashionAccessories = await Category.create({
        name: 'Fashion Accessories',
        slug: 'fashion-accessories',
        level: 2,
        parentId: fashionParent._id,
        order: 99,
        isActive: true,
        path: `${fashionParent.path}/Fashion Accessories`,
        ancestors: [fashionParent._id],
        metadata: {
          productCount: 0,
          popular: false,
          featured: false
        }
      });
      console.log(`✅ Created Fashion Accessories category`);
    }
  }
  
  // Check if Cameras & Photography category exists
  let camerasCategory = await Category.findOne({ name: 'Cameras & Photography' });
  if (!camerasCategory) {
    console.log('📦 Creating Cameras & Photography category...');
    const electronicsParent = await Category.findOne({ name: 'Electronics' });
    if (electronicsParent) {
      camerasCategory = await Category.create({
        name: 'Cameras & Photography',
        slug: 'cameras-photography',
        level: 2,
        parentId: electronicsParent._id,
        order: 99,
        isActive: true,
        path: `${electronicsParent.path}/Cameras & Photography`,
        ancestors: [electronicsParent._id],
        metadata: {
          productCount: 0,
          popular: false,
          featured: false
        }
      });
      console.log(`✅ Created Cameras & Photography category`);
    }
  }
  
  return { toysCategory, fashionAccessories, camerasCategory };
}

async function finalizeMigration() {
  try {
    await dbConnect();
    console.log('✓ Connected to database\n');
    
    // Create any missing categories
    const newCategories = await createMissingCategories();
    console.log('');
    
    // Get all products that still need category migration
    const products = await Product.find({
      $or: [
        { categoryId: { $exists: false } },
        { categoryId: null }
      ]
    });
    
    console.log(`Found ${products.length} products that still need category assignment\n`);
    
    if (products.length === 0) {
      console.log('✅ All products have been migrated!');
      process.exit(0);
    }
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        console.log(`📦 Processing product: ${product.name} (SKU: ${product.sku})`);
        
        let targetCategory = null;
        let targetPath = null;
        
        // Check if product matches any additional mappings
        const productNameLower = product.name.toLowerCase();
        let matchedMapping = null;
        
        for (const [key, mapping] of Object.entries(additionalMappings)) {
          if (productNameLower.includes(key.toLowerCase())) {
            matchedMapping = mapping;
            break;
          }
        }
        
        // Also check by exact name match
        if (!matchedMapping && additionalMappings[product.name]) {
          matchedMapping = additionalMappings[product.name];
        }
        
        if (matchedMapping) {
          console.log(`   Found mapping for: ${matchedMapping.categoryName}`);
          
          // Find the category
          if (matchedMapping.categoryName === 'Electronics') {
            targetCategory = await Category.findOne({ name: 'Electronics', level: 1 });
            targetPath = 'Electronics';
          } else if (matchedMapping.categoryName === 'Toys & Games') {
            targetCategory = newCategories.toysCategory || await Category.findOne({ name: 'Toys & Games' });
            targetPath = 'Home & Kitchen/Toys & Games';
          } else if (matchedMapping.categoryName === 'Fashion Accessories') {
            targetCategory = newCategories.fashionAccessories || await Category.findOne({ name: 'Fashion Accessories' });
            targetPath = 'Fashion/Fashion Accessories';
          } else if (matchedMapping.categoryName === 'Cameras & Photography') {
            targetCategory = newCategories.camerasCategory || await Category.findOne({ name: 'Cameras & Photography' });
            targetPath = 'Electronics/Cameras & Photography';
          } else {
            targetCategory = await Category.findOne({ name: matchedMapping.categoryName });
            if (targetCategory) targetPath = targetCategory.path;
          }
        }
        
        // If still no match, use default categories
        if (!targetCategory) {
          console.log(`   No specific mapping found, using default category...`);
          
          // Default based on product name patterns
          if (product.name.toLowerCase().includes('toy')) {
            targetCategory = newCategories.toysCategory || await Category.findOne({ name: 'Toys & Games' });
            targetPath = 'Home & Kitchen/Toys & Games';
          } else if (product.name.toLowerCase().includes('photo') || product.name.toLowerCase().includes('camera')) {
            targetCategory = newCategories.camerasCategory || await Category.findOne({ name: 'Cameras & Photography' });
            targetPath = 'Electronics/Cameras & Photography';
          } else if (product.name.toLowerCase().includes('consumer') || product.name.toLowerCase().includes('electrical')) {
            targetCategory = await Category.findOne({ name: 'Electronics', level: 1 });
            targetPath = 'Electronics';
          } else {
            // Default to the main category based on vendor or other attributes
            targetCategory = await Category.findOne({ name: 'Electronics', level: 1 });
            targetPath = 'Electronics';
          }
        }
        
        if (!targetCategory) {
          console.log(`   ⚠️ Could not find or create category for product`);
          errorCount++;
          continue;
        }
        
        // Get the full hierarchy
        const pathParts = targetPath.split('/');
        let currentPath = '';
        const hierarchy = {
          level1: null,
          level2: null,
          level3: null,
          level4: null
        };
        
        for (let i = 0; i < pathParts.length; i++) {
          currentPath += (i > 0 ? '/' : '') + pathParts[i];
          const category = await Category.findOne({ path: currentPath });
          
          if (category) {
            switch(category.level) {
              case 1:
                hierarchy.level1 = category;
                break;
              case 2:
                hierarchy.level2 = category;
                break;
              case 3:
                hierarchy.level3 = category;
                break;
              case 4:
                hierarchy.level4 = category;
                break;
            }
          }
        }
        
        // Prepare update data
        const updateData = {
          categoryId: targetCategory._id,
          categoryPath: targetPath
        };
        
        if (hierarchy.level2) {
          updateData.subcategoryId = hierarchy.level2._id;
        }
        if (hierarchy.level3) {
          updateData.subSubcategoryId = hierarchy.level3._id;
        }
        if (hierarchy.level4) {
          updateData.subSubSubcategoryId = hierarchy.level4._id;
        }
        
        // Update the product
        await Product.findByIdAndUpdate(product._id, updateData);
        
        console.log(`   ✅ Updated product with:`);
        console.log(`      Category: ${targetCategory.name}`);
        console.log(`      Path: ${targetPath}`);
        
        updatedCount++;
        
        // Update category product counts
        const categoriesToUpdate = [targetCategory];
        if (hierarchy.level2) categoriesToUpdate.push(hierarchy.level2);
        if (hierarchy.level3) categoriesToUpdate.push(hierarchy.level3);
        if (hierarchy.level4) categoriesToUpdate.push(hierarchy.level4);
        
        for (const cat of categoriesToUpdate) {
          await Category.findByIdAndUpdate(cat._id, {
            $inc: { 'metadata.productCount': 1 }
          });
        }
        
      } catch (error) {
        console.error(`   ❌ Error processing product ${product.sku}:`, error.message);
        errorCount++;
      }
    }
    
    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Products updated in this run: ${updatedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Final verification
    const totalMigrated = await Product.find({ 
      categoryId: { $exists: true, $ne: null } 
    });
    const totalProducts = await Product.countDocuments();
    const stillNeeding = totalProducts - totalMigrated.length;
    
    console.log(`\n📊 OVERALL STATUS:`);
    console.log(`   Total products: ${totalProducts}`);
    console.log(`   Migrated products: ${totalMigrated.length}`);
    console.log(`   Still needing migration: ${stillNeeding}`);
    
    if (stillNeeding === 0) {
      console.log('\n🎉 All products have been successfully migrated! 🎉');
    } else {
      console.log(`\n⚠️ ${stillNeeding} products still need manual attention`);
      const remaining = await Product.find({
        $or: [
          { categoryId: { $exists: false } },
          { categoryId: null }
        ]
      });
      console.log('\nRemaining products:');
      remaining.forEach(p => {
        console.log(`   - ${p.name} (SKU: ${p.sku})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the final migration
finalizeMigration();