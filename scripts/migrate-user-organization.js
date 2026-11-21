
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const ORGANIZATION_ID = '6a9ae426b93383bc2caacaef';
const APPLY_CHANGES = process.argv.includes('--apply');

async function migrate() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing from environment variables');
    }

    if (!mongoose.Types.ObjectId.isValid(ORGANIZATION_ID)) {
      throw new Error('Invalid organization ObjectId');
    }

    const organizationObjectId =
      new mongoose.Types.ObjectId(ORGANIZATION_ID);

    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB connected');
    console.log('Organization:', organizationObjectId.toString());
    console.log('Mode:', APPLY_CHANGES ? 'LIVE MIGRATION' : 'DRY RUN');

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('MongoDB database connection unavailable');
    }

    // Confirm that the target organization exists.
    const organization = await db
      .collection('organizations')
      .findOne({ _id: organizationObjectId });

    if (!organization) {
      throw new Error(
        `Organization ${ORGANIZATION_ID} does not exist`
      );
    }

    console.log('✅ Target organization exists');

    const usersCollection = db.collection('users');

    // Only assign users who currently have no organization.
    const filter = {
      $or: [
        { organizationId: null },
        { organizationId: { $exists: false } },
      ],
    };

    const affectedUsers = await usersCollection.countDocuments(filter);

    console.log(`\nUsers requiring migration: ${affectedUsers}`);

    if (affectedUsers === 0) {
      console.log('Nothing to migrate.');
      return;
    }

    if (!APPLY_CHANGES) {
      console.log('\nDRY RUN: No database records were changed.');
      console.log('Run with --apply to execute the migration.');
      return;
    }

    const result = await usersCollection.updateMany(
      filter,
      {
        $set: {
          organizationId: organizationObjectId,
        },
      }
    );

    console.log('\n✅ Migration completed');
    console.log('Matched:', result.matchedCount);
    console.log('Modified:', result.modifiedCount);

    // Verify the migration.
    const remaining = await usersCollection.countDocuments(filter);

    console.log('Users still missing organization:', remaining);

    if (remaining === 0) {
      console.log('🎉 All previously unassigned users now have an organization.');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

migrate();
