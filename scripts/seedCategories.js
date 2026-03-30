// scripts/seedCategories.js
import mongoose from 'mongoose';
import 'dotenv/config';
import Category from '../models/Category.js';
import dbConnect from '../lib/dbConnect.js';


const categoryTree = {
  Electronics: {
    "Mobiles & Accessories": {
      Smartphones: { Android: {}, iOS: {} },
      "Chargers & Cables": { "Fast Chargers": {}, "USB Cables": {} },
    },
    "Computers & Laptops": {
      Laptops: { "Gaming Laptops": {}, "Business Laptops": {} },
      "Computer Accessories": { Keyboards: {}, Mice: {} },
    },
  },
  Fashion: {
    Men: {
      Clothing: { Shirts: {}, Trousers: {} },
      Footwear: { Sneakers: {}, "Formal Shoes": {} },
    },
    Women: {
      Clothing: { Dresses: {}, "Tops & Blouses": {} },
      Accessories: { Bags: {}, Jewelry: {} },
    },
  },
  "Home & Kitchen": {
    Furniture: {
      "Living Room": { Sofas: {}, "Coffee Tables": {} },
      Bedroom: { Beds: {}, Wardrobes: {} },
    },
    "Kitchen Appliances": {
      "Cooking Appliances": { Microwaves: {}, Blenders: {} },
      "Small Appliances": { Toasters: {}, "Coffee Makers": {} },
    },
  },
  "Beauty & Personal Care": {
    Skincare: {
      Face: { Cleansers: {}, Moisturizers: {} },
      Body: { Lotions: {}, Scrubs: {} },
    },
    Haircare: {
      Shampoos: { "For Dry Hair": {}, "For Oily Hair": {} },
      "Hair Styling": { "Hair Dryers": {}, Straighteners: {} },
    },
  },
  "Food & Beverages": {
    Snacks: {
      "Chips & Crisps": { "Potato Chips": {}, "Tortilla Chips": {} },
      "Nuts & Seeds": { Almonds: {}, Cashews: {} },
    },
    Beverages: {
      "Soft Drinks": { Cola: {}, "Fruit Flavored": {} },
      "Hot Beverages": { Coffee: {}, Tea: {} },
    },
  },
  "Books & Stationery": {
    Books: {
      Fiction: { Novels: {}, "Short Stories": {} },
      "Non-Fiction": { Biographies: {}, "Self-Help": {} },
    },
    Stationery: {
      "Writing Supplies": { Pens: {}, Pencils: {} },
      "Paper Products": { Notebooks: {}, Diaries: {} },
    },
  },
};

async function seedCategories() {
  try {
    await dbConnect();
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('✓ Cleared existing categories');

      async function createCategory(name, level, parentId = null, order = 0) {
  // Generate slug from name + parent path
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (parentId) {
    const parent = await Category.findById(parentId);
    if (parent) {
      slug = `${parent.slug}-${slug}`; // prepend parent slug
    }
  }

  let path = name;
  let ancestors = [];

  if (parentId) {
    const parent = await Category.findById(parentId);
    if (parent) {
      path = `${parent.path}/${name}`;
      ancestors = [...parent.ancestors, parent._id];
    }
  }

  const category = await Category.create({
    name,
    slug,
    level,
    parentId: parentId || null,
    order,
    isActive: true,
    path,
    ancestors,
    metadata: {
      productCount: 0,
      popular: level === 1,
      featured: level === 1,
    },
  });

  return category;
}

    let order = 0;
    
    // Create level 1 categories
    for (const [level1Name, level1Data] of Object.entries(categoryTree)) {
      const level1 = await createCategory(level1Name, 1, null, order++);
      console.log(`✓ Created level 1: ${level1Name}`);
      
      let subOrder = 0;
      // Create level 2 categories
      for (const [level2Name, level2Data] of Object.entries(level1Data)) {
        const level2 = await createCategory(level2Name, 2, level1._id, subOrder++);
        console.log(`  ✓ Created level 2: ${level2Name}`);
        
        let subSubOrder = 0;
        // Create level 3 categories
        for (const [level3Name, level3Data] of Object.entries(level2Data)) {
          const level3 = await createCategory(level3Name, 3, level2._id, subSubOrder++);
          console.log(`    ✓ Created level 3: ${level3Name}`);
          
          let subSubSubOrder = 0;
          // Create level 4 categories
          for (const level4Name of Object.keys(level3Data)) {
            await createCategory(level4Name, 4, level3._id, subSubSubOrder++);
            console.log(`      ✓ Created level 4: ${level4Name}`);
          }
        }
      }
    }
    
    // Get total count
    const totalCategories = await Category.countDocuments();
    console.log(`\n✅ Categories seeded successfully! Total: ${totalCategories} categories`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

// Run the seeder
seedCategories();