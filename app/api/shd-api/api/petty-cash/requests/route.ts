// // app/api/petty-cash/requests/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';

// import Budget from '@/shd-models/models/Budget';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
// import ExpenseRequest from '@/shd-models/models/ExpenseRequest';

// async function verifyAuth(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return { error: 'No token provided', status: 401 };
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string; role: string };
//     return { userId: decoded.userId, role: decoded.role };
//   } catch (error) {
//     return { error: 'Invalid token', status: 401 };
//   }
// }

// // GET - Fetch all requests
// export async function GET(req: NextRequest) {
//   try {
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     await connectToDatabase();

//     const requests = await ExpenseRequest.find({
//       requesterId: auth.userId
//     }).sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       requests: requests
//     });

//   } catch (error: any) {
//     console.error('Error fetching requests:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create a new request
// export async function POST(req: NextRequest) {
//   try {
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     const body = await req.json();
//     const { amount, recipientPhone, recipientName, category, description, receiptUrl } = body;

//     await connectToDatabase();

//     // Get active budget
//     const budget = await Budget.findOne({
//       status: 'active',
//       createdBy: auth.userId
//     });

//     if (!budget) {
//       return NextResponse.json(
//         { success: false, error: 'No active budget found' },
//         { status: 400 }
//       );
//     }

//     if (amount > budget.remainingAmount) {
//       return NextResponse.json(
//         { success: false, error: 'Amount exceeds available budget' },
//         { status: 400 }
//       );
//     }

//     // Calculate platform fee
//     const platformFee = amount * 0.03; // 3% fee
//     const totalAmount = amount + platformFee;

//     const request = await ExpenseRequest.create({
//       amount,
//       platformFee,
//       totalAmount,
//       recipientPhone,
//       recipientName: recipientName || 'Unknown',
//       category,
//       description,
//       status: 'pending',
//       requesterId: new mongoose.Types.ObjectId(auth.userId),
//       receiptUrl: receiptUrl || '',
//       metadata: {
//         budgetId: budget._id,
//         createdAt: new Date().toISOString()
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       request: request
//     });

//   } catch (error: any) {
//     console.error('Error creating request:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


// // app/api/petty-cash/requests/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
// import Budget from '@/shd-models/models/Budget';
// import Transaction from '@/shd-models/models/Transaction';
// import { processB2CPayment } from '@/shd-lib/lib/mpesa';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// // Helper to verify JWT token
// async function verifyAuth(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return { error: 'No token provided', status: 401 };
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string; role: string };
//     return { userId: decoded.userId, role: decoded.role };
//   } catch (error) {
//     return { error: 'Invalid token', status: 401 };
//   }
// }

// // GET - Fetch all requests
// export async function GET(req: NextRequest) {
//   try {
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     await connectToDatabase();

//     const requests = await ExpenseRequest.find({
//       requesterId: auth.userId
//     }).sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       requests: requests
//     });

//   } catch (error: any) {
//     console.error('Error fetching requests:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create a new request
// export async function POST(req: NextRequest) {
//   try {
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     const body = await req.json();
//     const { amount, recipientPhone, recipientName, category, description, receiptUrl } = body;

//     // Validate input
//     if (!amount || amount < 1) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid amount. Minimum KSh 1' },
//         { status: 400 }
//       );
//     }

//     if (!recipientPhone) {
//       return NextResponse.json(
//         { success: false, error: 'Recipient phone number is required' },
//         { status: 400 }
//       );
//     }

//     // Validate phone number format
//     const cleanPhone = recipientPhone.replace(/[+\s]/g, '');
//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid Kenyan phone number format' },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // Get active budget
//     const budget = await Budget.findOne({
//       status: 'active',
//       createdBy: auth.userId
//     });

//     if (!budget) {
//       return NextResponse.json(
//         { success: false, error: 'No active budget found. Please create a budget first.' },
//         { status: 400 }
//       );
//     }

//     // Calculate platform fee (1.5%)
//     const platformFeePercentage = 0.015; // 1.5%
//     const platformFee = amount * platformFeePercentage;
//     const totalAmount = amount + platformFee;

//     // Check if budget has enough remaining amount
//     if (totalAmount > budget.remainingAmount) {
//       return NextResponse.json({
//         success: false,
//         error: `Insufficient budget. Required: KES ${totalAmount.toFixed(2)} (${amount} + ${platformFee.toFixed(2)} fee), Available: KES ${budget.remainingAmount.toFixed(2)}`
//       }, { status: 400 });
//     }

//     // Create the expense request with pending status
//     const request = await ExpenseRequest.create({
//       amount,
//       platformFee,
//       totalAmount,
//       recipientPhone: cleanPhone,
//       recipientName: recipientName || 'Unknown',
//       category,
//       description,
//       status: 'pending',
//       requesterId: new mongoose.Types.ObjectId(auth.userId),
//       receiptUrl: receiptUrl || '',
//       metadata: {
//         budgetId: budget._id,
//         createdAt: new Date().toISOString(),
//         platformFeePercentage: platformFeePercentage * 100
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       request: request,
//       message: 'Request created successfully. Awaiting approval.'
//     });

//   } catch (error: any) {
//     console.error('Error creating request:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


// app/api/petty-cash/requests/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
// import Budget from '@/shd-models/models/Budget';
// import mongoose from 'mongoose';

// // TEMPORARY TEST USER
// const TEST_USER_ID = '6a648fb076014722ae88bac6';

// // GET - Fetch all requests for the test user
// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     console.log(
//       'Fetching expense requests for test user:',
//       TEST_USER_ID
//     );

//     const requests = await ExpenseRequest.find({
//       requesterId: new mongoose.Types.ObjectId(TEST_USER_ID)
//     }).sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       requests
//     });

//   } catch (error: any) {
//     console.error(
//       'Error fetching requests:',
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error.message ||
//           'Internal server error'
//       },
//       { status: 500 }
//     );
//   }
// }


// // POST - Create a new expense request
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const {
//       amount,
//       recipientPhone,
//       recipientName,
//       category,
//       description,
//       receiptUrl
//     } = body;

//     // ---------------------------------------------------------
//     // Validate amount
//     // ---------------------------------------------------------

//     if (!amount || amount < 1) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Invalid amount. Minimum KSh 1'
//         },
//         { status: 400 }
//       );
//     }

//     // ---------------------------------------------------------
//     // Validate recipient phone
//     // ---------------------------------------------------------

//     if (!recipientPhone) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Recipient phone number is required'
//         },
//         { status: 400 }
//       );
//     }

//     // ---------------------------------------------------------
//     // Normalize phone number
//     // ---------------------------------------------------------

//     const cleanPhone = recipientPhone
//       .replace(/[+\s]/g, '');

//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Invalid Kenyan phone number format'
//         },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     console.log(
//       'Creating expense request for test user:',
//       TEST_USER_ID
//     );

//     // ---------------------------------------------------------
//     // Get active budget
//     // ---------------------------------------------------------

//     const budget = await Budget.findOne({
//       status: 'active',
//       createdBy: TEST_USER_ID
//     }).sort({
//       createdAt: -1
//     });

//     if (!budget) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             'No active budget found. Please create a budget first.'
//         },
//         { status: 400 }
//       );
//     }

//     console.log(
//       'Using active budget:',
//       budget._id
//     );

//     // ---------------------------------------------------------
//     // Calculate platform fee
//     // ---------------------------------------------------------

//     const platformFeePercentage = 0.015; // 1.5%

//     const platformFee =
//       Number(amount) * platformFeePercentage;

//     const totalAmount =
//       Number(amount) + platformFee;

//     // ---------------------------------------------------------
//     // Check available budget
//     // ---------------------------------------------------------

//     if (totalAmount > budget.remainingAmount) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             `Insufficient budget. Required: KES ${totalAmount.toFixed(2)} ` +
//             `(${Number(amount).toFixed(2)} + ${platformFee.toFixed(2)} fee), ` +
//             `Available: KES ${Number(budget.remainingAmount).toFixed(2)}`
//         },
//         { status: 400 }
//       );
//     }

//     // ---------------------------------------------------------
//     // Create expense request
//     // ---------------------------------------------------------

//     const expenseRequest =
//       await ExpenseRequest.create({
//         amount: Number(amount),

//         platformFee,

//         totalAmount,

//         recipientPhone: cleanPhone,

//         recipientName:
//           recipientName || 'Unknown',

//         category,

//         description,

//         status: 'pending',

//         requesterId:
//           new mongoose.Types.ObjectId(TEST_USER_ID),

//         receiptUrl:
//           receiptUrl || '',

//         metadata: {
//           budgetId: budget._id,

//           createdAt:
//             new Date().toISOString(),

//           platformFeePercentage:
//             platformFeePercentage * 100,

//           createdBy:
//             TEST_USER_ID
//         }
//       });

//     console.log(
//       'Created expense request:',
//       expenseRequest._id
//     );

//     return NextResponse.json(
//       {
//         success: true,

//         request: expenseRequest,

//         message:
//           'Request created successfully. Awaiting approval.'
//       },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     console.error(
//       'Error creating request:',
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error.message ||
//           'Internal server error'
//       },
//       { status: 500 }
//     );
//   }
// }


// app/api/petty-cash/requests/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
import Organization from '@/shd-models/models/Organization';
import mongoose from 'mongoose';

// Helper to get Malex organization
async function getMalexOrganization() {
  const organization = await Organization.findOne({ 
    name: { $regex: /^Malex$/i } 
  });
  return organization;
}

// GET - Fetch all expense requests for Malex organization
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const organization = await getMalexOrganization();

    if (!organization) {
      console.error('Malex organization not found');
      return NextResponse.json(
        {
          success: false,
          error: 'Organization not found'
        },
        { status: 404 }
      );
    }

    console.log('Fetching requests for Malex org:', organization._id);

    // Parse query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const requesterId = searchParams.get('requesterId');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {
      organizationId: new mongoose.Types.ObjectId(organization._id)
    };

    if (status) {
      query.status = status;
    }

    if (requesterId) {
      query.requesterId = new mongoose.Types.ObjectId(requesterId);
    }

    if (category) {
      query.category = category;
    }

    console.log('Query:', query);

    // Fetch requests with pagination
    const requests = await ExpenseRequest.find(query)
      .populate('requesterId', 'name email')
      .populate('approverId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await ExpenseRequest.countDocuments(query);

    console.log(`Found ${requests.length} requests (total: ${total})`);

    return NextResponse.json({
      success: true,
      requests: requests,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching requests:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST - Create a new expense request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      amount,
      recipientPhone,
      recipientName,
      category,
      description,
      requesterId,
      platformFee = 0,
      totalAmount,
      receiptUrl,
      metadata = {}
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Valid amount is required (must be greater than 0)' 
        },
        { status: 400 }
      );
    }

    if (!recipientPhone) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Recipient phone number is required' 
        },
        { status: 400 }
      );
    }

    if (!requesterId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Requester ID is required' 
        },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category is required' 
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const organization = await getMalexOrganization();

    if (!organization) {
      console.error('Malex organization not found');
      return NextResponse.json(
        {
          success: false,
          error: 'Organization not found'
        },
        { status: 404 }
      );
    }

    console.log('Creating request for Malex org:', organization._id);

    // Calculate total amount if not provided
    const calculatedTotalAmount = totalAmount || amount + platformFee;

    // Create the expense request
    const request = await ExpenseRequest.create({
      amount,
      platformFee,
      totalAmount: calculatedTotalAmount,
      recipientPhone,
      recipientName: recipientName || 'Unknown',
      category,
      description: description || 'Expense Request',
      requesterId: new mongoose.Types.ObjectId(requesterId),
      organizationId: organization._id,
      status: 'pending',
      receiptUrl: receiptUrl || null,
      metadata: {
        ...metadata,
        organizationName: organization.name,
        createdVia: 'api',
        createdAt: new Date().toISOString()
      }
    });

    console.log('Request created:', request._id);

    // Populate requester info for response
    await request.populate('requesterId', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      request
    });

  } catch (error: any) {
    console.error('Error creating request:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}