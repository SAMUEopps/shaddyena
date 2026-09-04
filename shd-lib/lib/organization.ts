// shd-lib/lib/organization.ts
import Organization from '@/shd-models/models/Organization';
import User from '@/shd-models/models/User';
import mongoose from 'mongoose';

/**
 * Get or create organization for a user
 * If organization doesn't exist, create it with "Shaddyna" as name
 */
export async function getOrCreateOrganization(userId: string | mongoose.Types.ObjectId) {
  try {
    // First, try to find user's organization
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If user already has an organization, return it
    if (user.organizationId) {
      const organization = await Organization.findById(user.organizationId);
      if (organization) {
        return organization;
      }
    }

    // Check if "Shaddyna" organization exists
    let organization = await Organization.findOne({ name: 'Shaddyna' });
    
    if (!organization) {
      // Create default Shaddyna organization
      organization = await Organization.create({
        name: 'Shaddyna',
        createdBy: new mongoose.Types.ObjectId(userId),
        settings: {
          weeklyBudget: 10000,
          monthlyBudget: 40000,
          approvalThresholds: {
            admin: 5000,
            director: 20000
          },
          categories: [
            { name: 'order', maxAmount: 5000, isActive: true },
            { name: 'membership', maxAmount: 5000, isActive: true },
            { name: 'savings', maxAmount: 5000, isActive: true },
            { name: 'investment', maxAmount: 5000, isActive: true },
            { name: 'petty_cash', maxAmount: 5000, isActive: true },
            { name: 'advertisement', maxAmount: 5000, isActive: true },
            { name: 'subscription', maxAmount: 5000, isActive: true },
            { name: 'vendor_payout', maxAmount: 5000, isActive: true },
            { name: 'customer_payment', maxAmount: 5000, isActive: true }
          ],
          platformFeePercentage: 0,
          feeBearer: 'payer'
        }
      });
      
      console.log('✅ Created default Shaddyna organization');
    }

    // Associate user with organization if not already
    if (!user.organizationId) {
      await User.findByIdAndUpdate(userId, {
        organizationId: organization._id
      });
    }

    return organization;
  } catch (error) {
    console.error('❌ Error getting/creating organization:', error);
    throw error;
  }
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(organizationId: string | mongoose.Types.ObjectId) {
  return await Organization.findById(organizationId);
}

/**
 * Get user's organization
 */
export async function getUserOrganization(userId: string | mongoose.Types.ObjectId) {
  const user = await User.findById(userId).populate('organizationId');
  if (!user) {
    throw new Error('User not found');
  }
  return user.organizationId || null;
}