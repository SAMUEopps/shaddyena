// scripts/migrate-orders-viewed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js'; // note the .js extension in ES modules

dotenv.config();

async function migrateOrdersIsViewed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.db.collection('orders');

    // Add isViewed field to all orders that don't have it
    const updateResult = await collection.updateMany(
      { isViewed: { $exists: false } },
      { $set: { isViewed: true, updatedAt: new Date() } }
    );

    console.log(`📊 Migration Results:`);
    console.log(`   - Matched: ${updateResult.matchedCount}`);
    console.log(`   - Modified: ${updateResult.modifiedCount}`);

    // Create index
    await collection.createIndex({ isViewed: 1 });
    console.log(`✅ Created index on isViewed`);

    // Sample verification
    const sampleOrders = await collection.find({ isViewed: { $exists: true } })
      .limit(5)
      .project({ orderId: 1, isViewed: 1, createdAt: 1 })
      .toArray();

    console.log('\n📋 Sample Orders:');
    sampleOrders.forEach(order => {
      console.log(` - Order ${order.orderId}: isViewed = ${order.isViewed}`);
    });

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

migrateOrdersIsViewed();