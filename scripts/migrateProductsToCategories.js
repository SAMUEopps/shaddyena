// scripts/migrateProductsToCategories.js
import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import dbConnect from '../lib/dbConnect.js';

// Define keyword mappings for automatic category assignment
const keywordMappings = {
  // Electronics
  Smartphones: {
    keywords: ['iphone', 'samsung', 'smartphone', 'mobile phone', 'cell phone', 'android', 'ios', 'xiaomi', 'oneplus', 'google pixel', 'phone', 'mobile', 'retro'],
    parentPath: 'Electronics/Mobiles & Accessories/Smartphones'
  },
  'Chargers & Cables': {
    keywords: ['charger', 'cable', 'charging cable', 'usb cable', 'fast charger', 'charging brick', 'power bank', 'twin cable'],
    parentPath: 'Electronics/Mobiles & Accessories/Chargers & Cables'
  },
  'Gaming Laptops': {
    keywords: ['gaming laptop', 'gaming notebook', 'msi', 'asus rog', 'razer blade', 'gaming'],
    parentPath: 'Electronics/Computers & Laptops/Laptops/Gaming Laptops'
  },
  'Business Laptops': {
    keywords: ['business laptop', 'thinkpad', 'latitude', 'elitebook', 'work laptop', 'laptop', 'notebook'],
    parentPath: 'Electronics/Computers & Laptops/Laptops/Business Laptops'
  },
  Keyboards: {
    keywords: ['keyboard', 'mechanical keyboard', 'wireless keyboard'],
    parentPath: 'Electronics/Computers & Laptops/Computer Accessories/Keyboards'
  },
  Mice: {
    keywords: ['mouse', 'gaming mouse', 'wireless mouse', 'optical mouse'],
    parentPath: 'Electronics/Computers & Laptops/Computer Accessories/Mice'
  },

  // Fashion
  Shirts: {
    keywords: ['shirt', 'button down', 'dress shirt', 'casual shirt', 't-shirt', 'tshirt', 'top'],
    parentPath: 'Fashion/Men/Clothing/Shirts'
  },
  Trousers: {
    keywords: ['trousers', 'pants', 'jeans', 'chinos', 'formal pants', 'trouser'],
    parentPath: 'Fashion/Men/Clothing/Trousers'
  },
  Sneakers: {
    keywords: ['sneakers', 'running shoes', 'athletic shoes', 'trainers', 'sneaker', 'shoe'],
    parentPath: 'Fashion/Men/Footwear/Sneakers'
  },
  'Formal Shoes': {
    keywords: ['formal shoes', 'dress shoes', 'oxford shoes', 'loafers'],
    parentPath: 'Fashion/Men/Footwear/Formal Shoes'
  },
  Dresses: {
    keywords: ['dress', 'gown', 'maxi dress', 'mini dress'],
    parentPath: 'Fashion/Women/Clothing/Dresses'
  },
  'Tops & Blouses': {
    keywords: ['blouse', 'tunic'],
    parentPath: 'Fashion/Women/Clothing/Tops & Blouses'
  },
  Bags: {
    keywords: ['bag', 'handbag', 'purse', 'tote', 'backpack'],
    parentPath: 'Fashion/Women/Accessories/Bags'
  },
  Jewelry: {
    keywords: ['jewelry', 'necklace', 'earrings', 'bracelet', 'ring'],
    parentPath: 'Fashion/Women/Accessories/Jewelry'
  },

  // Home & Kitchen
  Sofas: {
    keywords: ['sofa', 'couch', 'sectional', 'loveseat'],
    parentPath: 'Home & Kitchen/Furniture/Living Room/Sofas'
  },
  'Coffee Tables': {
    keywords: ['coffee table', 'center table', 'living room table'],
    parentPath: 'Home & Kitchen/Furniture/Living Room/Coffee Tables'
  },
  Beds: {
    keywords: ['bed', 'mattress', 'bed frame', 'headboard'],
    parentPath: 'Home & Kitchen/Furniture/Bedroom/Beds'
  },
  Wardrobes: {
    keywords: ['wardrobe', 'closet', 'armoire', 'dresser'],
    parentPath: 'Home & Kitchen/Furniture/Bedroom/Wardrobes'
  },
  Microwaves: {
    keywords: ['microwave', 'microwave oven'],
    parentPath: 'Home & Kitchen/Kitchen Appliances/Cooking Appliances/Microwaves'
  },
  Blenders: {
    keywords: ['blender', 'mixer', 'smoothie maker'],
    parentPath: 'Home & Kitchen/Kitchen Appliances/Cooking Appliances/Blenders'
  },
  Toasters: {
    keywords: ['toaster', 'toaster oven'],
    parentPath: 'Home & Kitchen/Kitchen Appliances/Small Appliances/Toasters'
  },
  'Coffee Makers': {
    keywords: ['coffee maker', 'coffee machine', 'espresso machine'],
    parentPath: 'Home & Kitchen/Kitchen Appliances/Small Appliances/Coffee Makers'
  },
  'Crystal Chandelier': {
    keywords: ['chandelier', 'crystal chandelier', 'light fixture', 'ceiling light'],
    parentPath: 'Home & Kitchen/Furniture/Living Room'
  },
  'Consumer Unit': {
    keywords: ['consumer unit', 'electrical panel', 'breaker box', 'fuse box'],
    parentPath: 'Home & Kitchen'
  },

  // Beauty & Personal Care
  Cleansers: {
    keywords: ['cleanser', 'face wash', 'facial cleanser'],
    parentPath: 'Beauty & Personal Care/Skincare/Face/Cleansers'
  },
  Moisturizers: {
    keywords: ['moisturizer', 'face cream', 'lotion'],
    parentPath: 'Beauty & Personal Care/Skincare/Face/Moisturizers'
  },
  Lotions: {
    keywords: ['body lotion', 'body cream', 'moisturizing lotion'],
    parentPath: 'Beauty & Personal Care/Skincare/Body/Lotions'
  },
  Scrubs: {
    keywords: ['body scrub', 'exfoliator', 'body polish'],
    parentPath: 'Beauty & Personal Care/Skincare/Body/Scrubs'
  },
  'Hair Dryers': {
    keywords: ['hair dryer', 'blow dryer', 'hair styling tool'],
    parentPath: 'Beauty & Personal Care/Haircare/Hair Styling/Hair Dryers'
  },
  Straighteners: {
    keywords: ['hair straightener', 'flat iron', 'hair iron'],
    parentPath: 'Beauty & Personal Care/Haircare/Hair Styling/Straighteners'
  },

  // Food & Beverages
  'Potato Chips': {
    keywords: ['potato chips', 'crisps', 'lays', 'pringles', 'chips'],
    parentPath: 'Food & Beverages/Snacks/Chips & Crisps/Potato Chips'
  },
  'Soft Drinks': {
    keywords: ['soda', 'cola', 'coke', 'pepsi', 'soft drink', 'can'],
    parentPath: 'Food & Beverages/Beverages/Soft Drinks/Cola'
  },
  Coffee: {
    keywords: ['coffee beans', 'ground coffee', 'instant coffee', 'coffee'],
    parentPath: 'Food & Beverages/Beverages/Hot Beverages/Coffee'
  },
  Tea: {
    keywords: ['tea', 'green tea', 'black tea', 'herbal tea'],
    parentPath: 'Food & Beverages/Beverages/Hot Beverages/Tea'
  },

  // Books & Stationery
  Notebooks: {
    keywords: ['notebook', 'journal', 'notepad', 'diary'],
    parentPath: 'Books & Stationery/Stationery/Paper Products/Notebooks'
  },
  Pens: {
    keywords: ['pen', 'ballpoint pen', 'gel pen', 'fountain pen'],
    parentPath: 'Books & Stationery/Stationery/Writing Supplies/Pens'
  }
};

// Helper function to find category by path
async function findCategoryByPath(path) {
  return await Category.findOne({ path });
}

// Helper function to find category by name and parent
async function findCategoryByNameAndParent(name, parentId = null) {
  const query = { name };
  if (parentId) {
    query.parentId = parentId;
  }
  return await Category.findOne(query);
}

// Helper function to determine category based on product name and description
function determineCategory(product) {
  const searchText = `${product.name} ${product.description || ''} ${product.tags?.join(' ') || ''}`.toLowerCase();
  
  let bestMatch = null;
  let highestScore = 0;
  
  for (const [categoryName, mapping] of Object.entries(keywordMappings)) {
    for (const keyword of mapping.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        // Score based on keyword length (longer keywords are more specific)
        const score = keyword.length;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = {
            categoryName,
            parentPath: mapping.parentPath
          };
        }
      }
    }
  }
  
  return bestMatch;
}

// Helper function to get category hierarchy
async function getCategoryHierarchy(categoryPath) {
  const pathParts = categoryPath.split('/');
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
  
  return hierarchy;
}

// Inspect product fields
async function inspectProductFields() {
  const sampleProduct = await Product.findOne({});
  if (sampleProduct) {
    console.log('\n📋 Sample product fields:');
    console.log(Object.keys(sampleProduct.toObject()));
    console.log('Category related fields:', {
      category: sampleProduct.category,
      subcategory: sampleProduct.subcategory,
      categoryId: sampleProduct.categoryId,
      categoryPath: sampleProduct.categoryPath
    });
  }
}

// Main migration function
async function migrateProducts() {
  try {
    await dbConnect();
    console.log('✓ Connected to database');
    
    // Inspect product fields first
    await inspectProductFields();
    
    // Get all products
    const products = await Product.find({});
    console.log(`\nFound ${products.length} products to migrate\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        console.log(`\n📦 Processing product: ${product.name} (SKU: ${product.sku})`);
        
        // Check if product already has the new category structure
        if (product.categoryId && product.categoryPath) {
          console.log(`   ✅ Product already has new category structure, skipping...`);
          skippedCount++;
          continue;
        }
        
        // Try to get category from old fields
        let currentCategoryName = product.category;
        let currentSubcategoryName = product.subcategory;
        
        console.log(`   Current category (old format): ${currentCategoryName || 'None'}`);
        console.log(`   Current subcategory (old format): ${currentSubcategoryName || 'None'}`);
        
        let targetCategory = null;
        let targetPath = null;
        
        // Strategy 1: Try to find by old category name
        if (currentCategoryName && currentCategoryName !== 'None') {
          const categoryByName = await findCategoryByNameAndParent(currentCategoryName);
          
          if (categoryByName) {
            console.log(`   Found matching level 1 category: ${categoryByName.name}`);
            
            // If there's a subcategory and it's not a placeholder
            if (currentSubcategoryName && currentSubcategoryName !== 'fg' && currentSubcategoryName !== 'None') {
              const subcategory = await findCategoryByNameAndParent(currentSubcategoryName, categoryByName._id);
              
              if (subcategory) {
                console.log(`   Found matching subcategory: ${subcategory.name}`);
                targetCategory = subcategory;
                targetPath = subcategory.path;
              } else {
                targetCategory = categoryByName;
                targetPath = categoryByName.path;
              }
            } else {
              targetCategory = categoryByName;
              targetPath = categoryByName.path;
            }
          }
        }
        
        // Strategy 2: If no match, try keyword matching
        if (!targetCategory) {
          const matchedCategory = determineCategory(product);
          
          if (matchedCategory) {
            const hierarchy = await getCategoryHierarchy(matchedCategory.parentPath);
            
            if (hierarchy.level4) {
              targetCategory = hierarchy.level4;
              targetPath = matchedCategory.parentPath;
              console.log(`   Matched via keywords: ${targetCategory.name}`);
            } else if (hierarchy.level3) {
              targetCategory = hierarchy.level3;
              targetPath = matchedCategory.parentPath.split('/').slice(0, 3).join('/');
              console.log(`   Matched via keywords: ${targetCategory.name} (level 3)`);
            } else if (hierarchy.level2) {
              targetCategory = hierarchy.level2;
              targetPath = matchedCategory.parentPath.split('/').slice(0, 2).join('/');
              console.log(`   Matched via keywords: ${targetCategory.name} (level 2)`);
            }
          }
        }
        
        // Strategy 3: Use default category based on product type
        if (!targetCategory) {
          // Default categories for unknown products
          if (product.name.toLowerCase().includes('shoe')) {
            targetCategory = await findCategoryByNameAndParent('Sneakers');
            if (targetCategory) targetPath = targetCategory.path;
          } else if (product.name.toLowerCase().includes('toy')) {
            targetCategory = await findCategoryByNameAndParent('Toys');
            if (targetCategory) targetPath = targetCategory.path;
          } else if (product.name.toLowerCase().includes('can')) {
            targetCategory = await findCategoryByNameAndParent('Soft Drinks');
            if (targetCategory) targetPath = targetCategory.path;
          } else if (product.name.toLowerCase().includes('crystal') || product.name.toLowerCase().includes('chandelier')) {
            targetCategory = await findCategoryByNameAndParent('Living Room');
            if (targetCategory) targetPath = 'Home & Kitchen/Furniture/Living Room';
          } else if (product.name.toLowerCase().includes('conductor')) {
            targetCategory = await findCategoryByNameAndParent('Electronics');
            if (targetCategory) targetPath = 'Electronics';
          }
        }
        
        if (!targetCategory) {
          console.log(`   ⚠️ No suitable category found for product`);
          errorCount++;
          continue;
        }
        
        // Get the full hierarchy
        const hierarchy = await getCategoryHierarchy(targetPath);
        
        // Prepare update data
        const updateData = {
          categoryId: targetCategory._id,
          categoryPath: targetPath
        };
        
        // Add subcategory references if they exist
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
        console.log(`      Category ID: ${targetCategory._id}`);
        console.log(`      Category Path: ${targetPath}`);
        if (hierarchy.level2) console.log(`      Subcategory: ${hierarchy.level2.name}`);
        if (hierarchy.level3) console.log(`      SubSubcategory: ${hierarchy.level3.name}`);
        if (hierarchy.level4) console.log(`      SubSubSubcategory: ${hierarchy.level4.name}`);
        
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
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Products updated: ${updatedCount}`);
    console.log(`⏭️ Products skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📦 Total products processed: ${products.length}`);
    
    // Verification
    const migratedProducts = await Product.find({ categoryId: { $exists: true, $ne: null } });
    console.log(`\n📊 Verification: ${migratedProducts.length} products now have categoryId set`);
    
    if (migratedProducts.length > 0) {
      console.log('\n📋 Sample of migrated products:');
      const samples = migratedProducts.slice(0, 5);
      for (const sample of samples) {
        console.log(`   - ${sample.name} (${sample.sku}) → ${sample.categoryPath}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateProducts();