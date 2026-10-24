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

//     const body = await req.json();
//     const { adId, amount, phoneNumber, purpose } = body;

//     // Validate
//     if (!adId || !amount || !phoneNumber) {
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

//     // Initiate payment with the provided phone number
//     //const paymentService = new MpesaPaymentService(user.id);
//     const paymentService = new MpesaPaymentService(user.userId);
//     const result = await paymentService.initiatePaymentWithPhone(
//       amount,
//       'advertisement',
//       phoneNumber, // Use the provided phone number
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


// // app/api/shd-api/api/advertisements/pay/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Advertisement from '@/shd-models/models/Advertisement';
// import Vendor from '@/shd-models/models/Vendor';
// import User from '@/shd-models/models/User';
// import Transaction from '@/shd-models/models/Transaction';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const token = req.headers.get('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const user = await verifyToken(token);
//     if (!user) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { adId, amount, phoneNumber } = body;

//     if (!adId || !amount || !phoneNumber) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     const advertisement = await Advertisement.findById(adId);
//     if (!advertisement) {
//       return NextResponse.json(
//         { error: 'Advertisement not found' },
//         { status: 404 }
//       );
//     }

//     const vendor = await Vendor.findOne({ userId: user.userId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     if (advertisement.vendorId.toString() !== vendor._id.toString()) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     const userData = await User.findById(user.userId);
//     if (!userData) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // Resolve organizationId (vendor first, fallback to user)
//     const organizationId =
//       vendor.organizationId?.toString() ||
//       userData.organizationId?.toString();

//     console.log('[Advertisement Payment] Organization diagnostic:', {
//       userId: user.userId,
//       userOrganizationId: userData.organizationId?.toString() ?? null,
//       vendorId: vendor._id.toString(),
//       vendorOrganizationId: vendor.organizationId?.toString() ?? null,
//       advertisementId: advertisement._id.toString(),
//     });  

//     if (!organizationId) {
//       return NextResponse.json(
//         { error: 'Organization context is missing for this vendor/user' },
//         { status: 400 }
//       );
//     }

//     // ---- 1. Create the Transaction FIRST (schema requires transactionId + type) ----
//     const transactionId = `TXN-${Date.now()}-${Math.floor(
//       Math.random() * 10000
//     )
//       .toString()
//       .padStart(4, '0')}`;

//     const transaction = await Transaction.create({
//       transactionId,
//       organizationId,
//       type: 'payment',
//       category: 'advertisement',
//       amount,
//       currency: 'KES',
//       status: 'pending',
//       phoneNumber,
//       provider: 'mpesa',
//       purpose: 'advertisement',
//       metadata: {
//         adId: advertisement._id,
//         vendorId: vendor._id,
//         businessName: vendor.businessName,
//         purpose: 'advertisement',
//         userId: user.userId,
//       },
//     });

//     // ---- 2. Initiate STK push ----
//     const paymentService = new MpesaPaymentService(user.userId, organizationId);

//     const result = await paymentService.initiatePaymentWithPhone(
//       amount,
//       'advertisement',
//       phoneNumber,
//       {
//         adId: advertisement._id,
//         vendorId: vendor._id,
//         businessName: vendor.businessName,
//         purpose: 'advertisement',
//         transactionId: transaction.id.toString(),
//       }
//     );

//     // ---- 3. Persist M-Pesa request IDs back onto the transaction ----
//     transaction.checkoutRequestId = result.checkoutRequestId;
//     transaction.providerTransactionId = result.merchantRequestId;
//     await transaction.save();

//     // ---- 4. Link advertisement to the transaction ----
//     advertisement.transactionId = transaction.id.toString();
//     await advertisement.save();

//     return NextResponse.json({
//       success: true,
//       checkoutRequestId: result.checkoutRequestId,
//       transactionId: transaction.id.toString(),
//     });
//   } catch (error: any) {
//     console.error('Error initiating advertisement payment:', error);
//     return NextResponse.json(
//       { error: error.message || 'Payment initiation failed' },
//       { status: 500 }
//     );
//   }
// }



 // app/api/shd-api/api/advertisements/pay/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { verifyToken } from '@/shd-lib/lib/auth';
import Advertisement from '@/shd-models/models/Advertisement';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';


export const runtime = 'nodejs';

type AuthenticatedUser = {
  userId: string;
};

function normalizePhoneNumber(phone: string): string {
  let normalized = phone.replace(/[\s+\-()]/g, '');

  if (normalized.startsWith('0')) {
    normalized = `254${normalized.slice(1)}`;
  } else if (normalized.startsWith('7') || normalized.startsWith('1')) {
    normalized = `254${normalized}`;
  }

  return normalized;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // 1. Authenticate the caller.
    const authorization = req.headers.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication token is required.' },
        { status: 401 }
      );
    }

    let authenticatedUser: AuthenticatedUser;

    try {
      authenticatedUser = verifyToken(
        authorization.slice('Bearer '.length)
      ) as AuthenticatedUser;
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token.' },
        { status: 401 }
      );
    }

    const userId = authenticatedUser?.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid authenticated user.' },
        { status: 401 }
      );
    }

    // 2. Validate the request body.
    const body = await req.json();

    const adId =
      typeof body.adId === 'string' ? body.adId.trim() : '';

    const requestedPhone =
      typeof body.phoneNumber === 'string'
        ? body.phoneNumber.trim()
        : '';

    const requestedOrganizationId =
      typeof body.organizationId === 'string'
        ? body.organizationId.trim()
        : '';

    if (
      !adId ||
      !requestedPhone ||
      !requestedOrganizationId
    ) {
      return NextResponse.json(
        {
          error:
            'Advertisement ID, phone number, and organization ID are required.',
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(adId)) {
      return NextResponse.json(
        { error: 'Invalid advertisement ID.' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(requestedOrganizationId)) {
      return NextResponse.json(
        { error: 'Invalid organization ID.' },
        { status: 400 }
      );
    }

    const phoneNumber = normalizePhoneNumber(requestedPhone);

    if (!/^254[17]\d{8}$/.test(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            'Invalid Kenyan M-Pesa number. Use a number such as 0712345678 or 254712345678.',
        },
        { status: 400 }
      );
    }

    // 3. Load the authenticated user and their vendor profile.
    const [user, vendor] = await Promise.all([
      User.findById(userId),
      Vendor.findOne({ userId }),
    ]);

    if (!user) {
      return NextResponse.json(
        { error: 'Authenticated user was not found.' },
        { status: 404 }
      );
    }

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile was not found for this user.' },
        { status: 403 }
      );
    }

    // 4. Verify the organization against trusted database records.
    // Do not authorize an organization solely because the client sent its ID.
    const userOrganizationId =
      user.organizationId?.toString() ?? null;

    const vendorOrganizationId =
      vendor.organizationId?.toString() ?? null;

    const trustedOrganizationId =
      vendorOrganizationId || userOrganizationId;

    if (!trustedOrganizationId) {
      console.error('[Advertisement Payment] Missing organization association', {
        userId,
        vendorId: vendor._id.toString(),
        adId,
      });

      return NextResponse.json(
        {
          error:
            'Your account is not linked to an organization. Please select or link your organization before making a payment.',
          code: 'ORGANIZATION_CONTEXT_MISSING',
        },
        { status: 403 }
      );
    }

    if (
      userOrganizationId &&
      vendorOrganizationId &&
      userOrganizationId !== vendorOrganizationId
    ) {
      console.error('[Advertisement Payment] Organization mismatch', {
        userId,
        userOrganizationId,
        vendorId: vendor._id.toString(),
        vendorOrganizationId,
      });

      return NextResponse.json(
        {
          error:
            'Your user account and vendor profile are linked to different organizations.',
        },
        { status: 403 }
      );
    }

    if (trustedOrganizationId !== requestedOrganizationId) {
      return NextResponse.json(
        {
          error:
            'The selected organization does not match your account organization.',
        },
        { status: 403 }
      );
    }

    // 5. Confirm that the advertisement belongs to this vendor.
    const advertisement = await Advertisement.findById(adId);

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement was not found.' },
        { status: 404 }
      );
    }

    const advertisementVendorId =
      advertisement.vendorId?.toString();

    if (
      !advertisementVendorId ||
      advertisementVendorId !== vendor._id.toString()
    ) {
      return NextResponse.json(
        {
          error:
            'You are not authorized to pay for this advertisement.',
        },
        { status: 403 }
      );
    }

    // 6. Prevent arbitrary amounts supplied by the frontend.
    const amount = Number(advertisement.paymentAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error:
            'The advertisement has an invalid payment amount. Please contact support.',
        },
        { status: 400 }
      );
    }

    if (
      body.amount !== undefined &&
      Number(body.amount) !== amount
    ) {
      return NextResponse.json(
        {
          error:
            'The submitted amount does not match the advertisement payment amount.',
        },
        { status: 400 }
      );
    }

    if (advertisement.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'This advertisement has already been paid for.' },
        { status: 409 }
      );
    }

    // 7. Initiate STK Push.
    // The service creates and updates the pending Transaction record.
    const paymentService = new MpesaPaymentService(userId);

    const payment = await paymentService.initiatePaymentWithPhone(
      amount,
      'advertisement',
      phoneNumber,
      {
        adId: advertisement._id.toString(),
        vendorId: vendor._id.toString(),
        organizationId: trustedOrganizationId,
        purpose: 'advertisement',
      }
    );

    // Do not mark the advertisement as paid here.
    // The M-Pesa callback/payment confirmation should do that.

    return NextResponse.json(
      {
        success: true,
        message:
          'M-Pesa payment request initiated. Complete the prompt on your phone.',
        checkoutRequestId: payment.checkoutRequestId,
        transactionId: payment.transactionId,
        adId: advertisement._id.toString(),
        amount,
        phoneNumber,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('[Advertisement Payment] Error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while initiating payment.';

    return NextResponse.json(
      {
        error: 'Failed to initiate advertisement payment.',
        details:
          process.env.NODE_ENV === 'development'
            ? message
            : undefined,
      },
      { status: 500 }
    );
  }
}
