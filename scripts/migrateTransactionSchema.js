// scripts/migrateTransactionSchema.js - Alternative: In-place update approach
import mongoose from 'mongoose';
import 'dotenv/config';
import dbConnect from '../lib/dbConnect.js';

async function migrateTransactionsInPlace() {
  console.log('🔄 Starting in-place transaction migration...');
  
  try {
    await dbConnect();
    
    const db = mongoose.connection.db;
    const collection = db.collection('transactions');
    
    // Find all transactions without organizationId (old schema)
    const oldTransactions = await collection.find({
      organizationId: { $exists: false }
    }).toArray();
    
    console.log(`📊 Found ${oldTransactions.length} transactions to migrate`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const doc of oldTransactions) {
      try {
        // Map type to new structure
        const typeMap = {
          'order': { type: 'payment', category: 'order' },
          'membership': { type: 'payment', category: 'membership' },
          'savings': { type: 'deposit', category: 'savings' },
          'investment': { type: 'payment', category: 'investment' },
          'payout': { type: 'payout', category: 'vendor_payout' },
          'refund': { type: 'refund', category: 'other' },
          'advertisement': { type: 'payment', category: 'advertisement' },
          'subscription': { type: 'payment', category: 'subscription' },
          'petty_cash_deposit': { type: 'deposit', category: 'petty_cash' },
          'petty_cash_payout': { type: 'payout', category: 'petty_cash' }
        };
        
        const mapped = typeMap[doc.type] || { type: 'payment', category: 'other' };
        
        // Determine provider
        let provider = 'other';
        if (doc.checkoutRequestId) provider = 'mpesa';
        if (doc.metadata?.b2cResponse) provider = 'mpesa';
        if (doc.metadata?.paymentMethod === 'mpesa_stk') provider = 'mpesa';
        
        // Extract provider transaction ID
        let providerTransactionId = null;
        if (doc.metadata?.b2cResponse?.ConversationID) {
          providerTransactionId = doc.metadata.b2cResponse.ConversationID;
        } else if (doc.metadata?.conversationId) {
          providerTransactionId = doc.metadata.conversationId;
        } else if (doc.metadata?.providerTransactionId) {
          providerTransactionId = doc.metadata.providerTransactionId;
        } else if (doc.checkoutRequestId) {
          providerTransactionId = doc.checkoutRequestId;
        }
        
        // Extract external reference
        let externalReference = null;
        if (doc.metadata?.requestId) {
          externalReference = doc.metadata.requestId;
        } else if (doc.orderId) {
          externalReference = doc.orderId.toString();
        }
        
        // Extract external entity
        let externalEntityId = null;
        let externalEntityType = null;
        if (doc.orderId) {
          externalEntityId = doc.orderId.toString();
          externalEntityType = 'order';
        } else if (doc.vendorId) {
          externalEntityId = doc.vendorId.toString();
          externalEntityType = 'vendor';
        } else if (doc.budgetId) {
          externalEntityId = doc.budgetId.toString();
          externalEntityType = 'budget';
        }
        
        // Build update object
        const updateDoc = {
          $set: {
            organizationId: new mongoose.Types.ObjectId('6a919e90136d24f1374bc223'),
            type: mapped.type,
            category: mapped.category,
            currency: 'KES',
            provider: provider,
            providerTransactionId: providerTransactionId,
            externalReference: externalReference,
            externalEntityId: externalEntityId,
            externalEntityType: externalEntityType,
            // Preserve existing data
            status: doc.status || 'pending',
            amount: doc.amount || 0,
            phoneNumber: doc.phoneNumber || null,
            accountReference: doc.accountReference || null,
            checkoutRequestId: doc.checkoutRequestId || null,
            receiptNumber: doc.receiptNumber || null,
            purpose: doc.purpose || null,
            errorMessage: doc.errorMessage || null,
            // Add original type to metadata
            'metadata.originalType': doc.type,
            'metadata.migratedAt': new Date()
          },
          // Remove old fields that are no longer needed
          $unset: {
            orderId: '',
            vendorId: '',
            userId: '',
            budgetId: ''
          }
        };
        
        // Execute update
        const result = await collection.updateOne(
          { _id: doc._id },
          updateDoc
        );
        
        if (result.modifiedCount > 0) {
          migrated++;
          console.log(`✅ Migrated transaction: ${doc.transactionId}`);
        }
        
      } catch (error) {
        errors++;
        console.error(`❌ Error migrating transaction ${doc.transactionId}:`, error.message);
      }
    }
    
    // Create new indexes
    console.log('\n📊 Creating new indexes...');
    await collection.createIndex({ organizationId: 1, createdAt: -1 });
    await collection.createIndex({ organizationId: 1, status: 1 });
    await collection.createIndex({ organizationId: 1, category: 1 });
    await collection.createIndex({ organizationId: 1, externalReference: 1 });
    await collection.createIndex({ organizationId: 1, accountReference: 1 });
    await collection.createIndex({ provider: 1, providerTransactionId: 1 });
    await collection.createIndex({ checkoutRequestId: 1 });
    await collection.createIndex(
      { organizationId: 1, idempotencyKey: 1 },
      { 
        unique: true, 
        partialFilterExpression: { idempotencyKey: { $exists: true, $type: 'string' } }
      }
    );
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migrated}`);
    console.log(`❌ Errors: ${errors}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateTransactionsInPlace()
  .then(() => {
    console.log('\n✨ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });