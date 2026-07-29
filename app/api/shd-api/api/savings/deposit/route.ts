// // // // // C:\Users\USER\Desktop\Projects\my-app\app\api\savings\deposit\route.ts
// // // // import { verifyToken } from '@/shd-lib/lib/auth';
// // // // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // // // import Savings from '@/shd-models/models/Savings';
// // // // import User from '@/shd-models/models/User';
// // // // import { NextRequest, NextResponse } from 'next/server';


// // // // export async function POST(req: NextRequest) {
// // // //   try {
// // // //     await connectToDatabase();
    
// // // //     const token = req.headers.get('authorization')?.split(' ')[1];
// // // //     if (!token) {
// // // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // // //     }

// // // //     const decoded = verifyToken(token);
// // // //     if (!decoded) {
// // // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // // //     }

// // // //     const body = await req.json();
// // // //     const { amount, description } = body;

// // // //     if (!amount || amount < 1) {
// // // //       return NextResponse.json(
// // // //         { error: 'Invalid amount' },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     const user = await User.findById(decoded.userId);
// // // //     if (!user) {
// // // //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// // // //     }

// // // //     if (!user.isMember) {
// // // //       return NextResponse.json(
// // // //         { error: 'You must be a member to save' },
// // // //         { status: 403 }
// // // //       );
// // // //     }

// // // //     // Generate reference number
// // // //     const reference = `SAV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

// // // //     // Create savings record
// // // //     const saving = await Savings.create({
// // // //       userId: user._id,
// // // //       amount,
// // // //       type: 'deposit',
// // // //       description: description || 'Savings deposit',
// // // //       status: 'completed',
// // // //       reference
// // // //     });

// // // //     // Update user balance
// // // //     user.totalSavings += amount;
// // // //     user.availableBalance += amount;
// // // //     await user.save();

// // // //     return NextResponse.json({
// // // //       message: 'Deposit successful!',
// // // //       saving,
// // // //       user: {
// // // //         totalSavings: user.totalSavings,
// // // //         availableBalance: user.availableBalance
// // // //       }
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Deposit error:', error);
// // // //     return NextResponse.json(
// // // //       { error: 'Failed to process deposit' },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }

// // // // app/api/shd-api/api/savings/deposit/route.ts
// // // import { verifyToken } from '@/shd-lib/lib/auth';
// // // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // // import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';
// // // import User from '@/shd-models/models/User';

// // // import { NextRequest, NextResponse } from 'next/server';

// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     await connectToDatabase();
    
// // //     const token = req.headers.get('authorization')?.split(' ')[1];
// // //     if (!token) {
// // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // //     }

// // //     const decoded = verifyToken(token);
// // //     if (!decoded) {
// // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // //     }

// // //     const body = await req.json();
// // //     const { amount, description } = body;

// // //     if (!amount || amount < 1) {
// // //       return NextResponse.json(
// // //         { error: 'Invalid amount' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const user = await User.findById(decoded.userId);
// // //     if (!user) {
// // //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// // //     }

// // //     if (!user.isMember) {
// // //       return NextResponse.json(
// // //         { error: 'You must be a member to save' },
// // //         { status: 403 }
// // //       );
// // //     }

// // //     // Initialize M-Pesa payment
// // //     const mpesaService = new MpesaPaymentService(user._id);
    
// // //     const paymentResult = await mpesaService.initiatePayment(
// // //       amount,
// // //       'savings',
// // //       {
// // //         description: description || 'Savings deposit'
// // //       }
// // //     );

// // //     return NextResponse.json({
// // //       message: 'Deposit initiated. Please complete M-Pesa payment.',
// // //       payment: {
// // //         checkoutRequestId: paymentResult.checkoutRequestId,
// // //         transactionId: paymentResult.transactionId,
// // //         phoneNumber: user.phoneNumber
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error('Deposit error:', error);
// // //     return NextResponse.json(
// // //       { error:  'Failed to initiate deposit' },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // app/api/shd-api/api/savings/deposit/route.ts
// // import { verifyToken } from '@/shd-lib/lib/auth';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';
// // import User from '@/shd-models/models/User';
// // import { NextRequest, NextResponse } from 'next/server';

// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectToDatabase();
    
// //     const token = req.headers.get('authorization')?.split(' ')[1];
// //     if (!token) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const decoded = verifyToken(token);
// //     if (!decoded) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const body = await req.json();
// //     const { amount, description } = body;

// //     if (!amount || amount < 1) {
// //       return NextResponse.json(
// //         { error: 'Invalid amount' },
// //         { status: 400 }
// //       );
// //     }

// //     const user = await User.findById(decoded.userId);
// //     if (!user) {
// //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// //     }

// //     if (!user.isMember) {
// //       return NextResponse.json(
// //         { error: 'You must be a member to save' },
// //         { status: 403 }
// //       );
// //     }

// //     try {
// //       // Initialize M-Pesa payment
// //       const mpesaService = new MpesaPaymentService(user._id);
      
// //       const paymentResult = await mpesaService.initiatePayment(
// //         amount,
// //         'savings',
// //         {
// //           description: description || 'Savings deposit',
// //           memberName: user.name
// //         }
// //       );

// //       return NextResponse.json({
// //         message: 'Deposit initiated. Please complete M-Pesa payment.',
// //         payment: {
// //           checkoutRequestId: paymentResult.checkoutRequestId,
// //           transactionId: paymentResult.transactionId,
// //           phoneNumber: user.phoneNumber
// //         }
// //       });

// //     } catch (mpesaError: any) {
// //       return NextResponse.json(
// //         { error: mpesaError.message || 'Failed to initiate deposit' },
// //         { status: 500 }
// //       );
// //     }

// //   } catch (error: any) {
// //     console.error('Deposit error:', error);
// //     return NextResponse.json(
// //       { error: error.message || 'Failed to initiate deposit' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // app/api/shd-api/api/savings/deposit/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import User from '@/shd-models/models/User';

// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { amount, description, password } = body;

//     if (!amount || amount < 1) {
//       return NextResponse.json(
//         { error: 'Invalid amount' },
//         { status: 400 }
//       );
//     }

//     if (!password) {
//       return NextResponse.json(
//         { error: 'Password is required' },
//         { status: 400 }
//       );
//     }

//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     if (!user.isMember) {
//       return NextResponse.json(
//         { error: 'You must be a member to save' },
//         { status: 403 }
//       );
//     }

//     // Verify password
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return NextResponse.json(
//         { error: 'Incorrect password' },
//         { status: 401 }
//       );
//     }

//     try {
//       // Initialize M-Pesa payment
//       const mpesaService = new MpesaPaymentService(user._id);
      
//       const paymentResult = await mpesaService.initiatePayment(
//         amount,
//         'savings',
//         {
//           description: description || 'Savings deposit',
//           memberName: user.name,
//           memberEmail: user.email
//         }
//       );

//       return NextResponse.json({
//         message: 'Deposit initiated. Please complete M-Pesa payment.',
//         payment: {
//           checkoutRequestId: paymentResult.checkoutRequestId,
//           transactionId: paymentResult.transactionId,
//           phoneNumber: user.phoneNumber
//         }
//       });

//     } catch (mpesaError: any) {
//       console.error('M-Pesa error:', mpesaError);
//       return NextResponse.json(
//         { error: mpesaError.message || 'Failed to initiate deposit' },
//         { status: 500 }
//       );
//     }

//   } catch (error: any) {
//     console.error('Deposit error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to initiate deposit' },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/savings/deposit/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, description, password, phoneNumber } = body;

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Clean and validate phone number
    let cleanPhone = phoneNumber.replace(/[+\s]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.substring(1);
    }
    if (!cleanPhone.startsWith('254')) {
      cleanPhone = '254' + cleanPhone;
    }

    if (!/^254[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use 254XXXXXXXXX' },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.isMember) {
      return NextResponse.json(
        { error: 'You must be a member to save' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    try {
      // Initialize M-Pesa payment with the provided phone number
      const mpesaService = new MpesaPaymentService(user._id);
      
      const paymentResult = await mpesaService.initiatePaymentWithPhone(
        amount,
        'savings',
        cleanPhone, // Use the provided phone number
        {
          description: description || 'Savings deposit',
          memberName: user.name,
          memberEmail: user.email,
          providedPhone: cleanPhone
        }
      );

      return NextResponse.json({
        message: 'Deposit initiated. Please complete M-Pesa payment.',
        payment: {
          checkoutRequestId: paymentResult.checkoutRequestId,
          transactionId: paymentResult.transactionId,
          phoneNumber: cleanPhone
        }
      });

    } catch (mpesaError: any) {
      console.error('M-Pesa error:', mpesaError);
      return NextResponse.json(
        { error: mpesaError.message || 'Failed to initiate deposit' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Deposit error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate deposit' },
      { status: 500 }
    );
  }
}