// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Balance from '@/shd-models/models/Balance';
// import { NextRequest, NextResponse } from 'next/server';


// export async function GET(request: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const shortcode = process.env.MPESA_SHORTCODE || '174379';
//     const url = new URL(request.url);
//     const limit = parseInt(url.searchParams.get('limit') || '10');
    
//     // Get balance history
//     const history = await Balance.find(
//       { shortcode },
//       { shortcode: 1, accountName: 1, balance: 1, currency: 1, resultCode: 1, timestamp: 1 }
//     )
//     .sort({ timestamp: -1 })
//     .limit(limit);
    
//     return NextResponse.json({
//       success: true,
//       data: history,
//       count: history.length,
//     });
    
//   } catch (error) {
//     console.error('Error fetching balance history:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch balance history' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Balance from '@/shd-models/models/Balance';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Get balance history
    const [history, total] = await Promise.all([
      Balance.find(
        { shortcode },
        { 
          accountName: 1, 
          balance: 1, 
          currency: 1, 
          resultCode: 1, 
          resultDesc: 1,
          timestamp: 1,
          fullBalance: 1
        }
      )
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
      
      Balance.countDocuments({ shortcode })
    ]);
    
    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching balance history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch balance history' },
      { status: 500 }
    );
  }
}