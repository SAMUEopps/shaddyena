// C:\Users\USER\Desktop\Projects\my-app\app\api\vendors\upgrade\route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Vendor from "@/models/Vendor";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const {
      password,
      businessName,
      ownerName,
      nationalId,
      kraPin,
      businessLocation,
      payoutMethod,
      payoutDetails
    } = body;

    // Get the current user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already a vendor
    if (user.role === 'vendor') {
      return NextResponse.json(
        { error: 'You are already a vendor' },
        { status: 400 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Check if vendor profile already exists
    const existingVendor = await Vendor.findOne({ userId: user._id });
    if (existingVendor) {
      return NextResponse.json(
        { error: 'Vendor profile already exists' },
        { status: 400 }
      );
    }

    // Create vendor profile
    const vendor = await Vendor.create({
      userId: user._id,
      businessName,
      ownerName,
      nationalId,
      kraPin: kraPin || '',
      phoneNumber: user.phoneNumber,
      businessLocation,
      payoutMethod: payoutMethod || 'MPESA',
      payoutDetails: payoutDetails || {
        mpesaNumber: user.phoneNumber
      },
      isActive: true
    });

    // Update user role to vendor
    user.role = 'vendor';
    await user.save();

    // Check if the user was referred and give commission to referrer
    if (user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy });
      if (referrer) {
        // Add KSh 500 commission for referring a vendor
        await User.findByIdAndUpdate(
          referrer._id,
          { $inc: { referralEarnings: 500 } }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'Successfully upgraded to vendor!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          referralCode: user.referralCode
        },
        vendor
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Vendor upgrade error:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade to vendor' },
      { status: 500 }
    );
  }
}