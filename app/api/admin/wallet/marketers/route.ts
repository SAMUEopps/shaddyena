// // app/api/admin/wallet/marketers/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import User from '@/shd-models/models/User';
// import MarketerWithdrawal from '@/shd-models/models/MarketerWithdrawal';

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const authHeader = req.headers.get('authorization');
//     const token = authHeader?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const organizationId = searchParams.get('organizationId');

//     // Base query: only marketers (optionally scoped to org)
//     const query: any = { role: 'marketer' };
//     if (organizationId) query.organizationId = organizationId;

//     const marketers = await User.find(query)
//       .select(
//         '_id name email phoneNumber marketerStatus marketerTier ' +
//           'totalCommissions totalReferralsMade availableBalance ' +
//           'referralEarnings referralCommissionEarnings referralSubscriptionEarnings ' +
//           'payoutMethod payoutDetails'
//       )
//       .sort({ name: 1 })
//       .lean();

//     // Compute owed = totalCommissions - (sum of completed/processing withdrawals)
//     const ids = marketers.map((m: any) => m._id);

//     const withdrawalAgg = await MarketerWithdrawal.aggregate([
//       {
//         $match: {
//           marketerId: { $in: ids },
//           status: { $in: ['pending', 'processing', 'completed'] },
//         },
//       },
//       {
//         $group: {
//           _id: '$marketerId',
//           disbursed: { $sum: '$amount' },
//         },
//       },
//     ]);

//     const disbursedMap = new Map(
//       withdrawalAgg.map((w: any) => [String(w._id), w.disbursed])
//     );

//     const result = marketers.map((m: any) => {
//       // totalCommissions is the lifetime earned amount
//       const earned = Number(m.totalCommissions || 0);
//       const disbursed = Number(disbursedMap.get(String(m._id)) || 0);
//       const owed = Math.max(0, earned - disbursed);

//       return {
//         _id: String(m._id),
//         name: m.name,
//         email: m.email,
//         phoneNumber: m.phoneNumber,
//         marketerStatus: m.marketerStatus,
//         marketerTier: m.marketerTier,
//         totalCommissions: earned,
//         totalReferralsMade: m.totalReferralsMade || 0,
//         disbursed,
//         owed,
//         payoutMethod: m.payoutMethod,
//         payoutDetails: m.payoutDetails,
//       };
//     });

//     return NextResponse.json({ marketers: result });
//   } catch (error: any) {
//     console.error('[ADMIN MARKETERS LIST]', error);
//     return NextResponse.json(
//       { error: 'Failed to load marketers', details: error.message },
//       { status: 500 }
//     );
//   }
// }


// app/api/admin/wallet/marketers/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
import MarketerWithdrawal from '@/shd-models/models/MarketerWithdrawal';

export async function GET(req: NextRequest) {
  let stage = 'initialization';

  const requestId = Math.random().toString(36).substring(2, 9);

  const log = (message: string, data?: any) => {
    console.log(`[MARKETERS:${requestId}] ${message}`, data ?? '');
  };

  try {
    log('Request received', {
      method: req.method,
      url: req.nextUrl.pathname,
      nodeEnv: process.env.NODE_ENV,
    });

    // 1. Database connection
    stage = 'database_connection';

    await connectToDatabase();

    log('Database connected', {
      database: User.db.name,
      connectionState: User.db.readyState,
    });

    // 2. Authentication
    stage = 'authentication';

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      log('Missing or malformed authorization header');

      return NextResponse.json(
        { error: 'Unauthorized', stage },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      log('Token verification failed');

      return NextResponse.json(
        { error: 'Unauthorized', stage },
        { status: 401 }
      );
    }

    log('Authentication successful', {
      decodedKeys: Object.keys(decoded as any),
      role: (decoded as any).role,
      organizationId: (decoded as any).organizationId,
    });

    // 3. Organization filtering
    stage = 'organization_filter';

    const organizationId =
      req.nextUrl.searchParams.get('organizationId');

    log('Organization filter', {
      organizationId,
      organizationIdType: typeof organizationId,
      hasOrganizationId: !!organizationId,
    });

    // 4. Check marketer records
    stage = 'marketer_query';

    const baseQuery: any = { role: 'marketer' };

    const globalCount = await User.countDocuments(baseQuery);

    log('Global marketer count', globalCount);

    const query: any = { role: 'marketer' };

    if (organizationId) {
      query.organizationId = organizationId;
    }

    log('MongoDB query', query);

    const scopedCount = await User.countDocuments(query);

    log('Organization-scoped marketer count', scopedCount);

    // 5. Fetch marketers
    stage = 'fetch_marketers';


const mongoose = require('mongoose');

const marketerQuery = User.find(query);

log('SCHEMA TYPE', {
  organizationId: User.schema.path('organizationId')?.instance,
});

log('ORIGINAL QUERY', query);

log('CAST QUERY', marketerQuery.cast(User));

log('MONGOOSE CONNECTION', {
  host: User.db.host,
  name: User.db.name,
  readyState: User.db.readyState,
});

const explicitObjectId = new mongoose.Types.ObjectId(organizationId);

const explicitCount = await User.countDocuments({
  role: 'marketer',
  organizationId: explicitObjectId,
});

log('EXPLICIT OBJECT ID COUNT', explicitCount);


    const marketers = await User.find(query)
      .select(
        '_id name email phoneNumber marketerStatus marketerTier ' +
        'totalCommissions totalReferralsMade availableBalance ' +
        'referralEarnings referralCommissionEarnings ' +
        'referralSubscriptionEarnings payoutMethod payoutDetails'
      )
      .sort({ name: 1 })
      .lean();

    log('Marketers fetched', {
      count: marketers.length,
      sample: marketers.slice(0, 5).map((m: any) => ({
        id: String(m._id),
        name: m.name,
        role: m.role,
        organizationId: String(m.organizationId ?? ''),
      })),
    });

    // 6. Withdrawal aggregation
    stage = 'withdrawal_aggregation';

    const ids = marketers.map((m: any) => m._id);

    log('Starting withdrawal aggregation', {
      marketerCount: ids.length,
    });

    const withdrawalAgg = await MarketerWithdrawal.aggregate([
      {
        $match: {
          marketerId: { $in: ids },
          status: {
            $in: ['pending', 'processing', 'completed'],
          },
        },
      },
      {
        $group: {
          _id: '$marketerId',
          disbursed: { $sum: '$amount' },
        },
      },
    ]);

    log('Withdrawal aggregation complete', {
      records: withdrawalAgg.length,
    });

    // 7. Build response
    stage = 'response_mapping';

    const disbursedMap = new Map(
      withdrawalAgg.map((w: any) => [
        String(w._id),
        w.disbursed,
      ])
    );

    const result = marketers.map((m: any) => {
      const earned = Number(m.totalCommissions || 0);
      const disbursed = Number(
        disbursedMap.get(String(m._id)) || 0
      );

      return {
        _id: String(m._id),
        name: m.name,
        email: m.email,
        phoneNumber: m.phoneNumber,
        marketerStatus: m.marketerStatus,
        marketerTier: m.marketerTier,
        totalCommissions: earned,
        totalReferralsMade: m.totalReferralsMade || 0,
        disbursed,
        owed: Math.max(0, earned - disbursed),
        payoutMethod: m.payoutMethod,
        payoutDetails: m.payoutDetails,
      };
    });

    log('Request successful', {
      returnedMarketers: result.length,
    });

    return NextResponse.json({
      marketers: result,
      diagnostics: {
        requestId,
        globalCount,
        scopedCount,
      },
    });

  } catch (error: any) {
    console.error(`[MARKETERS:${requestId}] FAILED`, {
      stage,
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: 'Failed to load marketers',
        stage,
        details: error.message,
        requestId,
      },
      { status: 500 }
    );
  }
}
