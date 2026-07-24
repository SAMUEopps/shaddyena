// // C:\Users\USER\Desktop\Projects\my-app\app\api\referral\stats\route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import User from '@/shd-models/models/User';
// import { NextRequest, NextResponse } from 'next/server';


// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     const user = await User.findById(decoded.userId)
//       .select('referralCode referrals referralEarnings name email phoneNumber role');
    
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // Get details of referred users
//     const referredUsers = await User.find({
//       referredBy: user.referralCode
//     }).select('name email phoneNumber role isVerified createdAt');

//     // Count vendors among referrals
//     //const vendorCount = referredUsers.filter(u => u.role === 'vendor').length;

    
//     // app/api/referral/stats/route.ts (Update)
//     // Update the vendor count calculation
//     const vendorCount = await User.countDocuments({
//       referredBy: user.referralCode,
//       role: 'vendor'
//     });

//     return NextResponse.json({
//       referralCode: user.referralCode,
//       totalReferrals: user.referrals?.length || 0,
//       referralEarnings: user.referralEarnings || 0,
//       referredUsers: referredUsers,
//       vendorCount: vendorCount,
//       referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${user.referralCode}`
//     });
//   } catch (error) {
//     console.error('Referral stats error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch referral stats' },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\USER\Desktop\Projects\my-app\app\api\referral\stats\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId)
      .select('referralCode referrals referralEarnings name email phoneNumber role');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get details of referred users from the referrals array
    let referredUsers = [];
    let vendorCount = 0;

    if (user.referrals && user.referrals.length > 0) {
      // Query users whose IDs are in the referrals array
      referredUsers = await User.find({
        _id: { $in: user.referrals }
      }).select('name email phoneNumber role isVerified createdAt');

      // Count vendors among referrals
      vendorCount = referredUsers.filter(u => u.role === 'vendor').length;
    }

    // Also check for users who might have this user's referral code as referredBy
    // This handles any legacy or manually created referrals
    const referredByFieldUsers = await User.find({
      referredBy: user.referralCode
    }).select('name email phoneNumber role isVerified createdAt');

    // Merge the two lists, avoiding duplicates
    const allReferredUsers = [...referredUsers];
    const existingIds = new Set(referredUsers.map(u => u._id.toString()));
    
    for (const refUser of referredByFieldUsers) {
      if (!existingIds.has(refUser._id.toString())) {
        allReferredUsers.push(refUser);
        if (refUser.role === 'vendor') {
          vendorCount++;
        }
      }
    }

    // Get total unique referrals count
    const totalReferrals = allReferredUsers.length;

    // Build the response
    return NextResponse.json({
      referralCode: user.referralCode || null,
      totalReferrals: totalReferrals,
      referralEarnings: user.referralEarnings || 0,
      referredUsers: allReferredUsers,
      vendorCount: vendorCount,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shd-pages/register?ref=${user.referralCode}`
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}