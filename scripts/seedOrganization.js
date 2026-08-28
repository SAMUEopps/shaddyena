import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in your environment');
}

const TEST_USER_ID = '6a648fb076014722ae88bac6';

// ------------------------------------------------------------
// Organization schema
// We define it here because this is a standalone Node seed
// script and does not need to import your TypeScript model.
// ------------------------------------------------------------
const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  settings: {
    weeklyBudget: {
      type: Number,
      default: 10000,
    },

    monthlyBudget: {
      type: Number,
      default: 40000,
    },

    approvalThresholds: {
      admin: {
        type: Number,
        default: 5000,
      },

      director: {
        type: Number,
        default: 20000,
      },
    },

    categories: [
      {
        name: {
          type: String,
          required: true,
        },

        maxAmount: {
          type: Number,
          default: 5000,
        },

        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    platformFeePercentage: {
      type: Number,
      default: 0,
    },

    feeBearer: {
      type: String,
      enum: ['payer', 'recipient', 'platform'],
      default: 'payer',
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Organization =
  mongoose.models.Organization ||
  mongoose.model('Organization', OrganizationSchema);

async function seedOrganization() {
  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    console.log('Connected to MongoDB');

    const userObjectId = new mongoose.Types.ObjectId(TEST_USER_ID);

    // ----------------------------------------------------------
    // Verify the test user exists
    // ----------------------------------------------------------
    const User = mongoose.models.User || mongoose.model(
      'User',
      new mongoose.Schema({}, { strict: false })
    );

    const user = await User.findById(userObjectId);

    if (!user) {
      throw new Error(
        `Test user ${TEST_USER_ID} does not exist. Create the user first.`
      );
    }

    console.log(`Found test user: ${user.name || TEST_USER_ID}`);

    // ----------------------------------------------------------
    // Check whether this user already has an organization
    // ----------------------------------------------------------
    let organization = await Organization.findOne({
      createdBy: userObjectId,
    });

    if (organization) {
      console.log('Organization already exists.');
      console.log('----------------------------------------');
      console.log('Organization ID:', organization._id.toString());
      console.log('Organization Name:', organization.name);
      console.log('Created By:', organization.createdBy.toString());
      console.log('----------------------------------------');

      return;
    }

    // ----------------------------------------------------------
    // Create organization
    // ----------------------------------------------------------
    organization = await Organization.create({
      name: 'My E-Commerce Organization',

      createdBy: userObjectId,

      settings: {
        weeklyBudget: 10000,
        monthlyBudget: 40000,

        approvalThresholds: {
          admin: 5000,
          director: 20000,
        },

        categories: [
          {
            name: 'Transport',
            maxAmount: 5000,
            isActive: true,
          },
          {
            name: 'Meals',
            maxAmount: 3000,
            isActive: true,
          },
          {
            name: 'Office Supplies',
            maxAmount: 5000,
            isActive: true,
          },
          {
            name: 'Communication',
            maxAmount: 3000,
            isActive: true,
          },
          {
            name: 'Miscellaneous',
            maxAmount: 5000,
            isActive: true,
          },
        ],

        platformFeePercentage: 0,

        feeBearer: 'payer',
      },
    });

    console.log('');
    console.log('========================================');
    console.log('ORGANIZATION CREATED SUCCESSFULLY');
    console.log('========================================');
    console.log('Organization ID:', organization._id.toString());
    console.log('Organization Name:', organization.name);
    console.log('Created By:', organization.createdBy.toString());
    console.log('Weekly Budget:', organization.settings.weeklyBudget);
    console.log('Monthly Budget:', organization.settings.monthlyBudget);
    console.log('========================================');
    console.log('');
  } catch (error) {
    console.error('Failed to seed organization:');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

seedOrganization();