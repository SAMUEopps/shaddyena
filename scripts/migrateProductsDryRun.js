// scripts/migrateProductsDryRun.js
import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import dbConnect from '../lib/dbConnect.js';

// Copy the keywordMappings and helper functions from the main script
// ... (same keywordMappings and helper functions as above)

async function dryRunMigration() {
  try {
    await dbConnect();
    console.log('✓ Connected to database');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to analyze\n`);
    
    const results = [];
    
    for (const product of products) {
      const currentCategory = await Category.findById(product.categoryId);
      const matchedCategory = determineCategory(product);
      
      results.push({
        sku: product.sku,
        name: product.name,
        currentCategory: currentCategory?.name || 'Unknown',
        matchedCategory: matchedCategory?.categoryName || 'No match',
        matchedPath: matchedCategory?.parentPath || 'N/A',
        willBeUpdated: !!matchedCategory && (!product.subcategoryId || !product.subSubcategoryId)
      });
    }
    
    // Print summary
    console.log('📊 DRY RUN RESULTS');
    console.log('='.repeat(60));
    console.log(`Total products: ${results.length}`);
    console.log(`Products to update: ${results.filter(r => r.willBeUpdated).length}`);
    console.log(`Products with no match: ${results.filter(r => r.matchedCategory === 'No match').length}`);
    console.log(`Products already updated: ${results.filter(r => !r.willBeUpdated).length}`);
    
    // Show sample of products to update
    const toUpdate = results.filter(r => r.willBeUpdated).slice(0, 10);
    if (toUpdate.length > 0) {
      console.log('\n📝 Sample of products to update:');
      toUpdate.forEach(p => {
        console.log(`\n  Product: ${p.name} (${p.sku})`);
        console.log(`  Current Category: ${p.currentCategory}`);
        console.log(`  Will be assigned to: ${p.matchedCategory} → ${p.matchedPath}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Dry run failed:', error);
    process.exit(1);
  }
}

dryRunMigration();