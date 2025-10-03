// scripts/fixReferralCodes.js
require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// import User model
const User = require('../models/Userr').default || require('../models/Userr');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('Connected to MongoDB ✅');

  // Find users with missing or short referral codes
// Find users with missing or short referral codes
const users = await User.find({
  $or: [
    { referralCode: { $exists: false } },        // no field
    { referralCode: { $eq: '' } },              // empty string
    { referralCode: { $regex: /^.{1,7}$/ } }    // less than 8 chars
  ]
});

  console.log(`Found ${users.length} users needing referral code fix`);

  for (const user of users) {
    const newCode = uuidv4().substring(0, 8).toUpperCase();
    user.referralCode = newCode;
    await user.save();
    console.log(`Updated user ${user._id} with referralCode ${newCode}`);
  }

  console.log('Done ✅');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
