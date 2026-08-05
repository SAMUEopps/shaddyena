// // // app/api/shd-api/api/vendors/withdraw/route.ts
// // import { verifyToken } from '@/shd-lib/lib/auth';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import Vendor from '@/shd-models/models/Vendor';

// // import { processB2CPayment } from '@/shd-lib/lib/mpesa';
// // import { NextRequest, NextResponse } from 'next/server';
// // import Withdrawal from '@/shd-models/models/Withdrawal';

// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectToDatabase();
// //     const token = req.headers.get('authorization')?.split(' ')[1];
// //     const decoded = verifyToken(token);
    
// //     if (!decoded) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const body = await req.json();
// //     const { amount, method, phoneNumber, bankDetails } = body;

// //     // Validate amount
// //     if (!amount || amount <= 0) {
// //       return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
// //     }

// //     // Find vendor
// //     const vendor = await Vendor.findOne({ userId: decoded.userId });
// //     if (!vendor) {
// //       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
// //     }

// //     // Check balance
// //     if (amount > vendor.availableBalance) {
// //       return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
// //     }

// //     // Create withdrawal record
// //     const withdrawal = await Withdrawal.create({
// //       vendorId: vendor._id,
// //       amount,
// //       method,
// //       phoneNumber: method === 'MPESA' ? phoneNumber : undefined,
// //       bankDetails: method === 'BANK' ? bankDetails : undefined,
// //       status: 'pending',
// //       reference: `WTH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
// //       createdAt: new Date()
// //     });

// //     // If MPESA, initiate payout
// //     if (method === 'MPESA' && phoneNumber) {
// //       try {
// //         const result = await processB2CPayment(
// //           phoneNumber,
// //           amount,
// //           'BusinessPayment',
// //           `Vendor payout - ${vendor.businessName}`
// //         );

// //         // Update withdrawal with transaction ID
// //         withdrawal.transactionId = result.ConversationID;
// //         withdrawal.status = 'processing';
// //         await withdrawal.save();

// //         // Deduct from vendor balance
// //         vendor.availableBalance -= amount;
// //         vendor.totalWithdrawn = (vendor.totalWithdrawn || 0) + amount;
// //         await vendor.save();

// //         return NextResponse.json({
// //           success: true,
// //           message: 'Withdrawal initiated successfully',
// //           withdrawal,
// //           newBalance: vendor.availableBalance
// //         });
// //       } catch (error) {
// //         console.error('B2C payment error:', error);
// //         withdrawal.status = 'failed';
// //         withdrawal.errorMessage = error instanceof Error ? error.message : 'Payment failed';
// //         await withdrawal.save();
// //         return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
// //       }
// //     }

// //     // For BANK, just create pending withdrawal
// //     await withdrawal.save();
// //     return NextResponse.json({
// //       success: true,
// //       message: 'Withdrawal request submitted for processing',
// //       withdrawal
// //     });

// //   } catch (error) {
// //     console.error('Withdrawal error:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to process withdrawal' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // app/api/shd-api/api/vendors/withdraw/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Vendor from '@/shd-models/models/Vendor';
// import Withdrawal from '@/shd-models/models/Withdrawal';
// import { processB2CPayment } from '@/shd-lib/lib/mpesa';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     const decoded = verifyToken(token);
    
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { amount, method, phoneNumber, bankDetails } = body;

//     // Validate amount
//     if (!amount || amount <= 0) {
//       return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
//     }

//     // Find vendor
//     const vendor = await Vendor.findOne({ userId: decoded.userId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     // Check balance
//     if (amount > vendor.availableBalance) {
//       return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
//     }

//     // Generate reference
//     const reference = `WTH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

//     // Create withdrawal record
//     const withdrawal = await Withdrawal.create({
//       vendorId: vendor._id,
//       amount,
//       method,
//       phoneNumber: method === 'MPESA' ? phoneNumber : undefined,
//       bankDetails: method === 'BANK' ? bankDetails : undefined,
//       status: 'pending',
//       reference,
//       createdAt: new Date()
//     });

//     // If MPESA, initiate B2C payout
//     if (method === 'MPESA' && phoneNumber) {
//       try {
//         // Format phone number
//         const formattedPhone = phoneNumber
//           .replace(/\s+/g, '')
//           .replace('+', '')
//           .replace(/^0/, '254');

//         console.log(`💰 Initiating B2C payout to ${formattedPhone} for ${amount} KES`);

//         // Process B2C payment
//         const result = await processB2CPayment(
//           formattedPhone,
//           amount,
//           'BusinessPayment',
//           `Vendor payout - ${vendor.businessName}`,
//           `Withdrawal ${reference}`
//         );

//         console.log('B2C Result:', result);

//         // Update withdrawal with transaction ID
//         withdrawal.transactionId = result.ConversationID || result.conversationID;
//         withdrawal.status = 'processing';
//         await withdrawal.save();

//         // Deduct from vendor balance
//         vendor.availableBalance -= amount;
//         vendor.totalWithdrawn = (vendor.totalWithdrawn || 0) + amount;
//         await vendor.save();

//         return NextResponse.json({
//           success: true,
//           message: 'Withdrawal initiated successfully',
//           withdrawal,
//           newBalance: vendor.availableBalance,
//           transactionId: withdrawal.transactionId
//         });

//       } catch (error: any) {
//         console.error('B2C payment error:', error);
        
//         // Update withdrawal as failed
//         withdrawal.status = 'failed';
//         withdrawal.errorMessage = error.message || 'B2C payment failed';
//         await withdrawal.save();

//         return NextResponse.json(
//           { 
//             error: 'Failed to process payment', 
//             details: error.message 
//           }, 
//           { status: 500 }
//         );
//       }
//     }

//     // For BANK, just create pending withdrawal
//     // You can integrate with a bank API later
//     await withdrawal.save();
    
//     // Deduct from vendor balance (assuming bank transfer is manual)
//     vendor.availableBalance -= amount;
//     vendor.totalWithdrawn = (vendor.totalWithdrawn || 0) + amount;
//     await vendor.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Withdrawal request submitted for processing',
//       withdrawal,
//       newBalance: vendor.availableBalance
//     });

//   } catch (error: any) {
//     console.error('Withdrawal error:', error);
//     return NextResponse.json(
//       { error: 'Failed to process withdrawal', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/vendors/withdraw/route.ts

import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Vendor from '@/shd-models/models/Vendor';
import Withdrawal from '@/shd-models/models/Withdrawal';
import { processB2CPayment } from '@/shd-lib/lib/mpesa';
import { NextRequest, NextResponse } from 'next/server';


const LOG = '[WITHDRAWAL]';


function formatPhoneNumber(phone: string) {
  return phone
    .replace(/\s+/g, '')
    .replace('+', '')
    .replace(/^0/, '254');
}


export async function POST(req: NextRequest) {

  const requestId = `WREQ-${Date.now()}`;

  console.log(`${LOG} ${requestId} Incoming withdrawal request`);

  try {

    await connectToDatabase();

    console.log(`${LOG} ${requestId} Database connected`);


    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      console.warn(`${LOG} ${requestId} Missing authorization token`);

      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    const decoded = verifyToken(token);

    if (!decoded) {

      console.warn(
        `${LOG} ${requestId} Invalid token`
      );

      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    console.log(
      `${LOG} ${requestId} Authenticated user ${decoded.userId}`
    );


    const body = await req.json();

    const {
      amount,
      method,
      phoneNumber,
      bankDetails
    } = body;


    console.log(
      `${LOG} ${requestId} Withdrawal payload`,
      {
        amount,
        method,
        hasPhone: !!phoneNumber,
        hasBankDetails: !!bankDetails
      }
    );


    // Validate amount
    if (
      typeof amount !== 'number' ||
      amount <= 0
    ) {

      console.warn(
        `${LOG} ${requestId} Invalid withdrawal amount`,
        amount
      );

      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }


    // Validate method
    if (!['MPESA', 'BANK'].includes(method)) {

      console.warn(
        `${LOG} ${requestId} Invalid withdrawal method`,
        method
      );

      return NextResponse.json(
        { error: 'Invalid withdrawal method' },
        { status: 400 }
      );
    }



    const vendor = await Vendor.findOne({
      userId: decoded.userId
    });


    if (!vendor) {

      console.warn(
        `${LOG} ${requestId} Vendor not found`,
        decoded.userId
      );

      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }


    console.log(
      `${LOG} ${requestId} Vendor found`,
      {
        vendorId: vendor._id,
        businessName: vendor.businessName,
        balance: vendor.availableBalance
      }
    );



    if (amount > vendor.availableBalance) {

      console.warn(
        `${LOG} ${requestId} Insufficient balance`,
        {
          requested: amount,
          available: vendor.availableBalance
        }
      );


      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }



    const reference =
      `WTH-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2,7)
        .toUpperCase()}`;



    console.log(
      `${LOG} ${requestId} Creating withdrawal`,
      {
        reference,
        amount
      }
    );


    const withdrawal = await Withdrawal.create({

      vendorId: vendor._id,

      amount,

      method,

      phoneNumber:
        method === 'MPESA'
          ? phoneNumber
          : undefined,

      bankDetails:
        method === 'BANK'
          ? bankDetails
          : undefined,

      status: 'pending',

      reference

    });



    console.log(
      `${LOG} ${requestId} Withdrawal created`,
      withdrawal._id
    );



    /**
     * MPESA B2C FLOW
     */
    if (method === 'MPESA') {


      if (!phoneNumber) {

        console.warn(
          `${LOG} ${requestId} Missing MPESA phone`
        );


        withdrawal.status = 'failed';
        withdrawal.errorMessage =
          'Phone number required for MPESA';

        await withdrawal.save();


        return NextResponse.json(
          {
            error: 'Phone number required'
          },
          {
            status:400
          }
        );
      }



      try {

        const formattedPhone =
          formatPhoneNumber(phoneNumber);



        console.log(
          `${LOG} ${requestId} Initiating MPESA B2C`,
          {
            phone: formattedPhone,
            amount,
            reference
          }
        );



        const result =
          await processB2CPayment(
            formattedPhone,
            amount,
            'BusinessPayment',
            `Vendor payout - ${vendor.businessName}`,
            `Withdrawal ${reference}`
          );



        console.log(
          `${LOG} ${requestId} MPESA B2C response`,
          result
        );



        withdrawal.transactionId =
          result.ConversationID ||
          result.conversationID;


        withdrawal.status =
          'processing';



        vendor.availableBalance -= amount;

        vendor.totalWithdrawn =
          (vendor.totalWithdrawn || 0) + amount;



        await Promise.all([
          withdrawal.save(),
          vendor.save()
        ]);



        console.log(
          `${LOG} ${requestId} Withdrawal processing`,
          {
            transactionId:
              withdrawal.transactionId,
            newBalance:
              vendor.availableBalance
          }
        );



        return NextResponse.json({

          success:true,

          message:
            'Withdrawal initiated successfully',

          withdrawal,

          newBalance:
            vendor.availableBalance,

          transactionId:
            withdrawal.transactionId

        });



      } catch(error:any) {


        console.error(
          `${LOG} ${requestId} MPESA B2C failed`,
          {
            message:error.message,
            stack:error.stack
          }
        );


        withdrawal.status='failed';

        withdrawal.errorMessage =
          error.message ||
          'B2C payment failed';


        await withdrawal.save();



        return NextResponse.json(
          {
            error:
              'Failed to process payment',
            details:
              error.message
          },
          {
            status:500
          }
        );

      }

    }



    /**
     * BANK WITHDRAWAL FLOW
     */

    console.log(
      `${LOG} ${requestId} Processing BANK withdrawal`
    );



    withdrawal.status='processing';



    vendor.availableBalance -= amount;

    vendor.totalWithdrawn =
      (vendor.totalWithdrawn || 0) + amount;



    await Promise.all([
      withdrawal.save(),
      vendor.save()
    ]);



    console.log(
      `${LOG} ${requestId} Bank withdrawal queued`,
      {
        withdrawalId: withdrawal._id,
        newBalance: vendor.availableBalance
      }
    );



    return NextResponse.json({

      success:true,

      message:
        'Withdrawal request submitted for processing',

      withdrawal,

      newBalance:
        vendor.availableBalance

    });



  } catch(error:any) {


    console.error(
      `${LOG} ${requestId} Fatal withdrawal error`,
      {
        message:error.message,
        stack:error.stack
      }
    );


    return NextResponse.json(
      {
        error:
          'Failed to process withdrawal',
        details:
          error.message
      },
      {
        status:500
      }
    );

  }
}