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
//     const { amount, description, password, phoneNumber } = body;

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

//     if (!phoneNumber) {
//       return NextResponse.json(
//         { error: 'Phone number is required' },
//         { status: 400 }
//       );
//     }

//     // Clean and validate phone number
//     let cleanPhone = phoneNumber.replace(/[+\s]/g, '');
//     if (cleanPhone.startsWith('0')) {
//       cleanPhone = '254' + cleanPhone.substring(1);
//     }
//     if (!cleanPhone.startsWith('254')) {
//       cleanPhone = '254' + cleanPhone;
//     }

//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       return NextResponse.json(
//         { error: 'Invalid phone number format. Use 254XXXXXXXXX' },
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
//       // Initialize M-Pesa payment with the provided phone number
//       const mpesaService = new MpesaPaymentService(user._id);
      
//       const paymentResult = await mpesaService.initiatePaymentWithPhone(
//         amount,
//         'savings',
//         cleanPhone, // Use the provided phone number
//         {
//           description: description || 'Savings deposit',
//           memberName: user.name,
//           memberEmail: user.email,
//           providedPhone: cleanPhone
//         }
//       );

//       return NextResponse.json({
//         message: 'Deposit initiated. Please complete M-Pesa payment.',
//         payment: {
//           checkoutRequestId: paymentResult.checkoutRequestId,
//           transactionId: paymentResult.transactionId,
//           phoneNumber: cleanPhone
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


// // app/api/shd-api/api/savings/deposit/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import User from '@/shd-models/models/User';
// import Transaction from '@/shd-models/models/Transaction';

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
//     const { amount, description, password, phoneNumber } = body;

//     if (!amount || amount < 1) {
//       return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
//     }

//     if (!password) {
//       return NextResponse.json(
//         { error: 'Password is required' },
//         { status: 400 }
//       );
//     }

//     if (!phoneNumber) {
//       return NextResponse.json(
//         { error: 'Phone number is required' },
//         { status: 400 }
//       );
//     }

//     // Clean and validate phone number
//     let cleanPhone = phoneNumber.replace(/[+\s]/g, '');
//     if (cleanPhone.startsWith('0')) {
//       cleanPhone = '254' + cleanPhone.substring(1);
//     }
//     if (!cleanPhone.startsWith('254')) {
//       cleanPhone = '254' + cleanPhone;
//     }

//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       return NextResponse.json(
//         { error: 'Invalid phone number format. Use 254XXXXXXXXX' },
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

//     // ─────────────────────────────────────────────
//     // Resolve organizationId (user's own organization)
//     // ─────────────────────────────────────────────
//     const organizationId =
//       user.organizationId?.toString() ;

//     if (!organizationId) {
//       return NextResponse.json(
//         { error: 'Organization context is missing for this user' },
//         { status: 400 }
//       );
//     }

//     try {
//       // ─────────────────────────────────────────────
//       // 1. Create the Transaction FIRST
//       // ─────────────────────────────────────────────
//       const transactionId = `TXN-${Date.now()}-${Math.floor(
//         Math.random() * 10000
//       )
//         .toString()
//         .padStart(4, '0')}`;

//       const transaction = await Transaction.create({
//         transactionId,
//         organizationId,
//         type: 'deposit',
//         category: 'savings',
//         amount,
//         currency: 'KES',
//         status: 'pending',
//         phoneNumber: cleanPhone,
//         provider: 'mpesa',
//         purpose: 'savings',
//         metadata: {
//           userId: user._id.toString(),
//           description: description || 'Savings deposit',
//           memberName: user.name,
//           memberEmail: user.email,
//           providedPhone: cleanPhone,
//           purpose: 'savings',
//         },
//       });

//       // ─────────────────────────────────────────────
//       // 2. Initiate M-Pesa STK push
//       // ─────────────────────────────────────────────
//       const mpesaService = new MpesaPaymentService(
//         user._id.toString(),
//         organizationId
//       );

//       const paymentResult = await mpesaService.initiatePaymentWithPhone(
//         amount,
//         'savings',
//         cleanPhone,
//         {
//           description: description || 'Savings deposit',
//           memberName: user.name,
//           memberEmail: user.email,
//           providedPhone: cleanPhone,
//           transactionId: transaction.id.toString(), // ✅ required
//         }
//       );

//       // ─────────────────────────────────────────────
//       // 3. Persist M-Pesa request IDs back to Transaction
//       // ─────────────────────────────────────────────
//       transaction.checkoutRequestId = paymentResult.checkoutRequestId;
//       transaction.providerTransactionId = paymentResult.merchantRequestId;
//       await transaction.save();

//       return NextResponse.json({
//         message: 'Deposit initiated. Please complete M-Pesa payment.',
//         payment: {
//           checkoutRequestId: paymentResult.checkoutRequestId,
//           transactionId: transaction.id.toString(),
//           phoneNumber: cleanPhone,
//         },
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
import mongoose from 'mongoose';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
import Transaction from '@/shd-models/models/Transaction';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

const LOG_PREFIX = '[savings/deposit]';

export async function POST(req: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const log = (...args: any[]) => console.log(LOG_PREFIX, `[${requestId}]`, ...args);
  const logErr = (...args: any[]) => console.error(LOG_PREFIX, `[${requestId}]`, ...args);

  log('▶ Incoming request', {
    method: req.method,
    url: req.url,
    nodeEnv: process.env.NODE_ENV,
    hasAuthHeader: !!req.headers.get('authorization'),
    authHeaderPrefix: req.headers.get('authorization')?.slice(0, 20),
    userAgent: req.headers.get('user-agent'),
    origin: req.headers.get('origin'),
  });

  try {
    await connectToDatabase();
    log('✅ DB connected');

    const authHeader = req.headers.get('authorization');
    log('Auth header raw:', authHeader);

    const token = authHeader?.split(' ')[1];
    if (!token) {
      logErr('❌ 401: no token in Authorization header', {
        headerPresent: !!authHeader,
        headerValue: authHeader,
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    log('Token extracted', {
      length: token.length,
      first10: token.slice(0, 10),
      last10: token.slice(-10),
      looksLikeJwt: token.split('.').length === 3,
      parts: token.split('.').length,
    });

    // Decode the JWT payload WITHOUT verifying, purely for logging
    try {
      const [, payloadB64] = token.split('.');
      if (payloadB64) {
        const payload = JSON.parse(
          Buffer.from(payloadB64, 'base64url').toString('utf8')
        );
        log('JWT payload (unverified, for debug only):', {
          userId: payload.userId,
          email: payload.email,
          iat: payload.iat,
          exp: payload.exp,
          expReadable: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
          nowReadable: new Date().toISOString(),
          expired: payload.exp ? payload.exp * 1000 < Date.now() : null,
        });
      }
    } catch (e: any) {
      logErr('Could not decode JWT payload for debug:', e.message);
    }

    log('JWT_SECRET present?', {
      hasSecret: !!process.env.JWT_SECRET,
      secretLength: process.env.JWT_SECRET?.length ?? 0,
      // DO NOT log the actual secret in production
    });

    const decoded = verifyToken(token);
    log('verifyToken result:', decoded);

    if (!decoded) {
      logErr('❌ 401: verifyToken returned null/undefined', {
        reason:
          'Likely causes: JWT_SECRET mismatch between environments, token expired, token signed with different secret, or token malformed.',
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    log('Token verified. decoded.userId:', decoded.userId);

    const body = await req.json();
    log('Body received:', {
      amount: body.amount,
      hasDescription: !!body.description,
      hasPassword: !!body.password,
      hasPhoneNumber: !!body.phoneNumber,
      organizationId: body.organizationId,
      keys: Object.keys(body),
    });

    const { amount, description, password, phoneNumber } = body;

    if (!amount || amount < 1) {
      logErr('❌ 400: invalid amount', { amount });
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!password) {
      logErr('❌ 400: missing password');
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      logErr('❌ 400: missing phoneNumber');
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
      logErr('❌ 400: invalid phone', { cleanPhone });
      return NextResponse.json(
        { error: 'Invalid phone number format. Use 254XXXXXXXXX' },
        { status: 400 }
      );
    }
    log('Phone normalized:', cleanPhone);

    log('Looking up user:', decoded.userId);
    const user = await User.findById(decoded.userId);
    if (!user) {
      logErr('❌ 404: user not found', { userId: decoded.userId });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    log('User found:', {
      id: user._id.toString(),
      email: user.email,
      isMember: user.isMember,
      hasPasswordHash: !!user.password,
      passwordHashPrefix: user.password?.slice(0, 7), // e.g. "$2a$10$"
      passwordHashLength: user.password?.length,
      organizationId: user.organizationId?.toString() ?? null,
    });

    if (!user.isMember) {
      logErr('❌ 403: not a member');
      return NextResponse.json(
        { error: 'You must be a member to save' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    log('bcrypt.compare result:', isValidPassword);

    if (!isValidPassword) {
      logErr('❌ 401: password mismatch', {
        passwordReceivedLength: password.length,
        storedHashPrefix: user.password?.slice(0, 7),
        storedHashLength: user.password?.length,
        hint:
          'If this is true locally but false on live, the live user was likely seeded with a different password / different hash / plaintext.',
      });
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // ─────────────────────────────────────────────
    // Resolve organizationId (user's own organization)
    // ─────────────────────────────────────────────
    const organizationId = user.organizationId?.toString();

    log('Resolved organizationId:', organizationId);
    if (!organizationId) {
      logErr('❌ 400: user has no organizationId');
      return NextResponse.json(
        { error: 'Organization context is missing for this user' },
        { status: 400 }
      );
    }

    try {
      log('Creating transaction…');
      const transactionId = `TXN-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, '0')}`;

      const transaction = await Transaction.create({
        transactionId,
        organizationId,
        type: 'deposit',
        category: 'savings',
        amount,
        currency: 'KES',
        status: 'pending',
        phoneNumber: cleanPhone,
        provider: 'mpesa',
        purpose: 'savings',
        metadata: {
          userId: user._id.toString(),
          description: description || 'Savings deposit',
          memberName: user.name,
          memberEmail: user.email,
          providedPhone: cleanPhone,
          purpose: 'savings',
        },
      });
      log('✅ Transaction created:', {
        _id: transaction.id.toString(),
        transactionId: transaction.transactionId,
        status: transaction.status,
      });

      log('Initiating M-Pesa STK push…', {
        amount,
        purpose: 'savings',
        phone: cleanPhone,
        passTransactionId: transaction.id.toString(),
      });

      const mpesaService = new MpesaPaymentService(
        user._id.toString(),
        organizationId
      );

      const paymentResult = await mpesaService.initiatePaymentWithPhone(
        amount,
        'savings',
        cleanPhone,
        {
          description: description || 'Savings deposit',
          memberName: user.name,
          memberEmail: user.email,
          providedPhone: cleanPhone,
          transactionId: transaction.id.toString(),
        }
      );

      log('✅ M-Pesa initiate returned:', paymentResult);

      transaction.checkoutRequestId = paymentResult.checkoutRequestId;
      transaction.providerTransactionId = paymentResult.merchantRequestId;
      await transaction.save();
      log('✅ Transaction updated with M-Pesa IDs');

      return NextResponse.json({
        message: 'Deposit initiated. Please complete M-Pesa payment.',
        payment: {
          checkoutRequestId: paymentResult.checkoutRequestId,
          transactionId: transaction.transactionId,
          phoneNumber: cleanPhone,
        },
      });
    } catch (mpesaError: any) {
      logErr('❌ M-Pesa error:', {
        message: mpesaError.message,
        stack: mpesaError.stack,
      });
      return NextResponse.json(
        { error: mpesaError.message || 'Failed to initiate deposit' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logErr('❌ Unhandled deposit error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to initiate deposit' },
      { status: 500 }
    );
  }
}