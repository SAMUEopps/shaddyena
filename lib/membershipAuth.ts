// lib/membershipAuth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function getMembershipUser(req: NextRequest) {
  const token = req.cookies.get('membershipToken')?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    return decoded;
  } catch {
    return null;
  }
}

export function requireMembershipAuth(handler: Function) {
  return async (req: NextRequest) => {
    const user = await getMembershipUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return handler(req, user);
  };
}