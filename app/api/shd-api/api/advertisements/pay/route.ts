// // app/api/shd-api/api/advertisements/pay/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Advertisement from '@/shd-models/models/Advertisement';
// import Vendor from '@/shd-models/models/Vendor';
// import User from '@/shd-models/models/User';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     // Verify authentication
//     const token = req.headers.get('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const user = await verifyToken(token);
//     if (!user) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     const { adId, amount, purpose } = await req.json();

//     // Validate
//     if (!adId || !amount) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Find advertisement
//     const advertisement = await Advertisement.findById(adId);
//     if (!advertisement) {
//       return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
//     }

//     // Find vendor
//     //const vendor = await Vendor.findOne({ userId: user.id });
//     const vendor = await Vendor.findOne({ userId: user.userId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     // Verify ownership
//     if (advertisement.vendorId.toString() !== vendor._id.toString()) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     // Get user for payment
//     //const userData = await User.findById(user.id);
//     const userData = await User.findById(user.userId);
//     if (!userData) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // Initiate payment
//     //const paymentService = new MpesaPaymentService(user.id);
//     const paymentService = new MpesaPaymentService(user.userId);
//     const result = await paymentService.initiatePaymentWithPhone(
//       amount,
//       'advertisement',
//       userData.phoneNumber,
//       {
//         adId: advertisement._id,
//         vendorId: vendor._id,
//         businessName: vendor.businessName,
//         purpose: 'advertisement'
//       }
//     );

//     // Update advertisement with transaction ID
//     advertisement.transactionId = result.transactionId;
//     await advertisement.save();

//     return NextResponse.json({
//       success: true,
//       checkoutRequestId: result.checkoutRequestId,
//       transactionId: result.transactionId,
//     });

//   } catch (error: any) {
//     console.error('Error initiating advertisement payment:', error);
//     return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
//   }
// }

// app/api/shd-api/api/advertisements/pay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Advertisement from '@/shd-models/models/Advertisement';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import { verifyToken } from '@/shd-lib/lib/auth';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Verify authentication
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { adId, amount, phoneNumber, purpose } = body;

    // Validate
    if (!adId || !amount || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find advertisement
    const advertisement = await Advertisement.findById(adId);
    if (!advertisement) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    // Find vendor
    //const vendor = await Vendor.findOne({ userId: user.id });
    const vendor = await Vendor.findOne({ userId: user.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Verify ownership
    if (advertisement.vendorId.toString() !== vendor._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get user for payment
    //const userData = await User.findById(user.id);
    const userData = await User.findById(user.userId);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initiate payment with the provided phone number
    //const paymentService = new MpesaPaymentService(user.id);
    const paymentService = new MpesaPaymentService(user.userId);
    const result = await paymentService.initiatePaymentWithPhone(
      amount,
      'advertisement',
      phoneNumber, // Use the provided phone number
      {
        adId: advertisement._id,
        vendorId: vendor._id,
        businessName: vendor.businessName,
        purpose: 'advertisement'
      }
    );

    // Update advertisement with transaction ID
    advertisement.transactionId = result.transactionId;
    await advertisement.save();

    return NextResponse.json({
      success: true,
      checkoutRequestId: result.checkoutRequestId,
      transactionId: result.transactionId,
    });

  } catch (error: any) {
    console.error('Error initiating advertisement payment:', error);
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}