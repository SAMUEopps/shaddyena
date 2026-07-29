// // // // // C:\Users\USER\Desktop\Projects\my-app\app\api\membership\activate\route.ts
// // // // import { NextRequest, NextResponse } from 'next/server';

// // // // import bcrypt from 'bcryptjs';
// // // // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // // // import { verifyToken } from '@/shd-lib/lib/auth';
// // // // import User from '@/shd-models/models/User';
// // // // import Savings from '@/shd-models/models/Savings';

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
// // // //     const { password, initialDeposit } = body;

// // // //     // Validate initial deposit (minimum 100)
// // // //     if (!initialDeposit || initialDeposit < 100) {
// // // //       return NextResponse.json(
// // // //         { error: 'Minimum initial deposit is KSh 100' },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     // Get user
// // // //     const user = await User.findById(decoded.userId);
// // // //     if (!user) {
// // // //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// // // //     }

// // // //     // Check if already a member
// // // //     if (user.isMember) {
// // // //       return NextResponse.json(
// // // //         { error: 'You are already a member' },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     // Verify password
// // // //     const isValidPassword = await bcrypt.compare(password, user.password);
// // // //     if (!isValidPassword) {
// // // //       return NextResponse.json(
// // // //         { error: 'Incorrect password' },
// // // //         { status: 401 }
// // // //       );
// // // //     }

// // // //     // Generate reference number
// // // //     const reference = `MEM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

// // // //     // Create savings record for initial deposit
// // // //     const saving = await Savings.create({
// // // //       userId: user._id,
// // // //       amount: initialDeposit,
// // // //       type: 'deposit',
// // // //       description: 'Initial membership deposit',
// // // //       status: 'completed',
// // // //       reference
// // // //     });

// // // //     // Update user to member
// // // //     user.isMember = true;
// // // //     user.memberSince = new Date();
// // // //     user.totalSavings = initialDeposit;
// // // //     user.availableBalance = initialDeposit;
// // // //     await user.save();

// // // //     return NextResponse.json({
// // // //       message: 'Membership activated successfully!',
// // // //       user: {
// // // //         id: user._id,
// // // //         name: user.name,
// // // //         isMember: user.isMember,
// // // //         memberSince: user.memberSince,
// // // //         totalSavings: user.totalSavings,
// // // //         availableBalance: user.availableBalance
// // // //       },
// // // //       saving
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Membership activation error:', error);
// // // //     return NextResponse.json(
// // // //       { error: 'Failed to activate membership' },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }

// // // // app/api/shd-api/api/membership/activate/route.ts
// // // import { NextRequest, NextResponse } from 'next/server';
// // // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // // import { verifyToken } from '@/shd-lib/lib/auth';
// // // import User from '@/shd-models/models/User';
// // // import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';


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
// // //     const { password, initialDeposit } = body;

// // //     // Validate initial deposit (minimum 100)
// // //     if (!initialDeposit || initialDeposit < 100) {
// // //       return NextResponse.json(
// // //         { error: 'Minimum initial deposit is KSh 100' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const user = await User.findById(decoded.userId);
// // //     if (!user) {
// // //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// // //     }

// // //     // Check if already a member
// // //     if (user.isMember) {
// // //       return NextResponse.json(
// // //         { error: 'You are already a member' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Verify password
// // //     const bcrypt = require('bcryptjs');
// // //     const isValidPassword = await bcrypt.compare(password, user.password);
// // //     if (!isValidPassword) {
// // //       return NextResponse.json(
// // //         { error: 'Incorrect password' },
// // //         { status: 401 }
// // //       );
// // //     }

// // //     // Initialize M-Pesa payment
// // //     const mpesaService = new MpesaPaymentService(user._id);
    
// // //     const paymentResult = await mpesaService.initiatePayment(
// // //       initialDeposit,
// // //       'membership',
// // //       {
// // //         initialDeposit: initialDeposit
// // //       }
// // //     );

// // //     return NextResponse.json({
// // //       message: 'Membership activation initiated. Please complete M-Pesa payment.',
// // //       payment: {
// // //         checkoutRequestId: paymentResult.checkoutRequestId,
// // //         transactionId: paymentResult.transactionId,
// // //         phoneNumber: user.phoneNumber
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error('Membership activation error:', error);
// // //     return NextResponse.json(
// // //       { error: 'Failed to initiate membership activation' },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // app/api/shd-api/api/membership/activate/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import { verifyToken } from '@/shd-lib/lib/auth';
// // import User from '@/shd-models/models/User';

// // import bcrypt from 'bcryptjs';
// // import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

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
// //     const { password, initialDeposit } = body;

// //     // Validate initial deposit (minimum 100)
// //     if (!initialDeposit || initialDeposit < 100) {
// //       return NextResponse.json(
// //         { error: 'Minimum initial deposit is KSh 100' },
// //         { status: 400 }
// //       );
// //     }

// //     const user = await User.findById(decoded.userId);
// //     if (!user) {
// //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// //     }

// //     // Check if already a member
// //     if (user.isMember) {
// //       return NextResponse.json(
// //         { error: 'You are already a member' },
// //         { status: 400 }
// //       );
// //     }

// //     // Verify password
// //     const isValidPassword = await bcrypt.compare(password, user.password);
// //     if (!isValidPassword) {
// //       return NextResponse.json(
// //         { error: 'Incorrect password' },
// //         { status: 401 }
// //       );
// //     }

// //     try {
// //       // Initialize M-Pesa payment
// //       const mpesaService = new MpesaPaymentService(user._id);
      
// //       const paymentResult = await mpesaService.initiatePayment(
// //         initialDeposit,
// //         'membership',
// //         {
// //           initialDeposit: initialDeposit,
// //           memberName: user.name,
// //           memberEmail: user.email
// //         }
// //       );

// //       return NextResponse.json({
// //         message: 'Membership activation initiated. Please complete M-Pesa payment.',
// //         payment: {
// //           checkoutRequestId: paymentResult.checkoutRequestId,
// //           transactionId: paymentResult.transactionId,
// //           phoneNumber: user.phoneNumber
// //         }
// //       });

// //     } catch (mpesaError: any) {
// //       return NextResponse.json(
// //         { error: mpesaError.message || 'Failed to initiate payment' },
// //         { status: 500 }
// //       );
// //     }

// //   } catch (error: any) {
// //     console.error('Membership activation error:', error);
// //     return NextResponse.json(
// //       { error: error.message || 'Failed to initiate membership activation' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // app/api/shd-api/api/membership/activate/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import User from '@/shd-models/models/User';

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
//     const { password, initialDeposit, phoneNumber } = body;

//     // Validate initial deposit (minimum 100)
//     if (!initialDeposit || initialDeposit < 1) {
//       return NextResponse.json(
//         { error: 'Minimum initial deposit is KSh 100' },
//         { status: 400 }
//       );
//     }

//     // Validate phone number
//     if (!phoneNumber) {
//       return NextResponse.json(
//         { error: 'Phone number is required' },
//         { status: 400 }
//       );
//     }

//     // Clean phone number
//     let cleanPhone = phoneNumber.replace(/[+\s]/g, '');
//     // If it starts with 0, replace with 254
//     if (cleanPhone.startsWith('0')) {
//       cleanPhone = '254' + cleanPhone.substring(1);
//     }
//     // If it doesn't start with 254, add it
//     if (!cleanPhone.startsWith('254')) {
//       cleanPhone = '254' + cleanPhone;
//     }

//     // Validate Kenyan phone number
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

//     // Check if already a member
//     if (user.isMember) {
//       return NextResponse.json(
//         { error: 'You are already a member' },
//         { status: 400 }
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
      
//       // We need to pass the phone number to the service
//       const paymentResult = await mpesaService.initiatePaymentWithPhone(
//         initialDeposit,
//         'membership',
//         cleanPhone, // Pass the cleaned phone number
//         {
//           initialDeposit: initialDeposit,
//           memberName: user.name,
//           memberEmail: user.email,
//           providedPhone: cleanPhone
//         }
//       );

//       return NextResponse.json({
//         message: 'Membership activation initiated. Please complete M-Pesa payment.',
//         payment: {
//           checkoutRequestId: paymentResult.checkoutRequestId,
//           transactionId: paymentResult.transactionId,
//           phoneNumber: cleanPhone
//         }
//       });

//     } catch (mpesaError: any) {
//       console.error('M-Pesa error:', mpesaError);
//       return NextResponse.json(
//         { error: mpesaError.message || 'Failed to initiate payment' },
//         { status: 500 }
//       );
//     }

//   } catch (error: any) {
//     console.error('Membership activation error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to initiate membership activation' },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/membership/activate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { verifyToken } from '@/shd-lib/lib/auth';
import User from '@/shd-models/models/User';

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
    const { password, initialDeposit, phoneNumber } = body;

    // Validate initial deposit (minimum 100)
    if (!initialDeposit || initialDeposit < 100) {
      return NextResponse.json(
        { error: 'Minimum initial deposit is KSh 100' },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Clean phone number
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

    if (user.isMember) {
      return NextResponse.json(
        { error: 'You are already a member' },
        { status: 400 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    try {
      // Initialize M-Pesa payment
      const mpesaService = new MpesaPaymentService(user._id);
      
      // This will create a transaction with both checkoutRequestId AND accountReference
      const paymentResult = await mpesaService.initiatePaymentWithPhone(
        initialDeposit,
        'membership',
        cleanPhone,
        {
          initialDeposit: initialDeposit,
          memberName: user.name,
          memberEmail: user.email,
          providedPhone: cleanPhone
        }
      );

      return NextResponse.json({
        message: 'Membership activation initiated. Please complete M-Pesa payment.',
        payment: {
          checkoutRequestId: paymentResult.checkoutRequestId,
          transactionId: paymentResult.transactionId,
          phoneNumber: cleanPhone
        }
      });

    } catch (mpesaError: any) {
      console.error('M-Pesa error:', mpesaError);
      return NextResponse.json(
        { error: mpesaError.message || 'Failed to initiate payment' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Membership activation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate membership activation' },
      { status: 500 }
    );
  }
}