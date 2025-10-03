const dbConnect = require('../lib/dbConnect');  
const User = require('../models/user');        
const { v4: uuidv4 } = require('uuid');

async function backfillReferralCodes() {
  await dbConnect();

  const usersWithoutCode = await User.find({ referralCode: { $exists: false } });
  console.log(`Found ${usersWithoutCode.length} users missing referralCode`);

  for (const user of usersWithoutCode) {
    user.referralCode = uuidv4().substring(0, 8).toUpperCase();
    await user.save();
    console.log(`Added referralCode for user ${user.email}: ${user.referralCode}`);
  }

  process.exit(0);
}

backfillReferralCodes();
