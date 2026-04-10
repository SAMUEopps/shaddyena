import mongoose from 'mongoose';
import 'dotenv/config';
import Category from '../models/Category.js';
import dbConnect from '../lib/dbConnect.js';

const newCategoryTree = {
  Chemicals: {
    "Industrial Chemicals": {
      Solvents: {},
      Acids: {},
    },
    "Laboratory Chemicals": {
      Reagents: {},
      Indicators: {},
    },
  },
  "Lab Equipment": {
    "Measuring Equipment": {
      "Beakers & Flasks": {},
      Pipettes: {},
    },
    "Analytical Equipment": {
      Microscopes: {},
      Balances: {},
    },
  },
  "Office Supplies": {
    Stationery: {
      Pens: {},
      Notebooks: {},
    },
    "Office Equipment": {
      Printers: {},
      Scanners: {},
    },
  },
};

// 🔥 safer create (avoids duplicates)
async function findOrCreateCategory(name, level, parentId = null, order = 0) {
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  let parent = null;
  if (parentId) {
    parent = await Category.findById(parentId);
    if (parent) {
      slug = `${parent.slug}-${slug}`;
    }
  }

  // 🔎 check if already exists
  let existing = await Category.findOne({ slug });

  if (existing) {
    return existing; // skip creation
  }

  let path = name;
  let ancestors = [];

  if (parent) {
    path = `${parent.path}/${name}`;
    ancestors = [...parent.ancestors, parent._id];
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

async function updateCategories() {
  try {
    await dbConnect();
    console.log('✅ Connected to DB');

    let order = 100; // start after existing ones

    for (const [level1Name, level1Data] of Object.entries(newCategoryTree)) {
      const level1 = await findOrCreateCategory(level1Name, 1, null, order++);
      console.log(`✓ Level 1: ${level1Name}`);

      let subOrder = 0;

      for (const [level2Name, level2Data] of Object.entries(level1Data)) {
        const level2 = await findOrCreateCategory(level2Name, 2, level1._id, subOrder++);
        console.log(`  ✓ Level 2: ${level2Name}`);

        let subSubOrder = 0;

        for (const [level3Name, level3Data] of Object.entries(level2Data)) {
          const level3 = await findOrCreateCategory(level3Name, 3, level2._id, subSubOrder++);
          console.log(`    ✓ Level 3: ${level3Name}`);

          let subSubSubOrder = 0;

          for (const level4Name of Object.keys(level3Data)) {
            await findOrCreateCategory(level4Name, 4, level3._id, subSubSubOrder++);
            console.log(`      ✓ Level 4: ${level4Name}`);
          }
        }
      }
    }

    const total = await Category.countDocuments();
    console.log(`\n🎉 Update complete! Total categories: ${total}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateCategories();