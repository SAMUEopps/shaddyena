/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import SellerRequest from '@/models/SellerRequest';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Look up user in DB and check if admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user is admin
    if (adminUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get seller requests with user data
    const requests = await SellerRequest.find(query)
      .populate('user', 'firstName lastName email phone avatar')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await SellerRequest.countDocuments(query);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Get seller requests error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import SellerRequest from "@/models/SellerRequest";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Verify user
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Filter
    const query: any = {};
    if (status && status !== "all") query.status = status;

    // Fetch requests
    const requests = await SellerRequest.find(query)
      .populate("user", "firstName lastName email phone avatar")
      .populate("reviewedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await SellerRequest.countDocuments(query);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET seller requests error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
