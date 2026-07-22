// C:\Users\USER\Desktop\Projects\my-app\app\api\riders\register\route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Rider from "@/models/Rider";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function generateReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      // User information
      name,
      email,
      phoneNumber,
      password,
      referralCode,
      
      // Rider information
      fullName,
      nationalId,
      kraPin,
      vehicleType,
      vehicleRegistration,
      driverLicense,
      currentLocation,
      payoutMethod,
      payoutDetails,
      deliveryRadius
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Check if national ID already registered
    const existingRider = await Rider.findOne({ nationalId });
    if (existingRider) {
      return NextResponse.json(
        { error: "National ID already registered" },
        { status: 400 }
      );
    }

    // Validate referral code if provided
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique referral code for new rider
    let newReferralCode = generateReferralCode();
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const existingUser = await User.findOne({ referralCode: newReferralCode });
      if (!existingUser) {
        isUnique = true;
      } else {
        newReferralCode = generateReferralCode();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate referral code' },
        { status: 500 }
      );
    }

    // Create user with rider role
    const user = await User.create({
      name: name || fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "rider",
      isVerified: true,
      referralCode: newReferralCode,
      referredBy: referralCode || null,
      referrals: [],
      referralEarnings: 0
    });

    // Create rider profile
    const rider = await Rider.create({
      userId: user._id,
      fullName: fullName || name,
      phoneNumber,
      email,
      nationalId,
      kraPin: kraPin || undefined,
      vehicleType,
      vehicleRegistration,
      driverLicense,
      currentLocation: currentLocation || undefined,
      isActive: true,
      isAvailable: true,
      totalDeliveries: 0,
      rating: 5.0,
      totalEarned: 0,
      pendingPayout: 0,
      payoutMethod: payoutMethod || 'MPESA',
      payoutDetails: payoutDetails || {
        mpesaNumber: phoneNumber
      },
      deliveryRadius: deliveryRadius || 10
    });

    // Add user to referrer's referrals list and give commission
    if (referrer) {
      await User.findByIdAndUpdate(
        referrer._id,
        { 
          $push: { referrals: user._id },
          $inc: { referralEarnings: 300 } // Commission for referring a rider
        }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: "rider" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Rider registration successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          referralCode: user.referralCode,
          referredBy: user.referredBy
        },
        rider: {
          id: rider._id,
          fullName: rider.fullName,
          vehicleType: rider.vehicleType,
          isAvailable: rider.isAvailable,
          rating: rider.rating
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Rider registration error:", error);
    return NextResponse.json(
      { error: "Rider registration failed" },
      { status: 500 }
    );
  }
}