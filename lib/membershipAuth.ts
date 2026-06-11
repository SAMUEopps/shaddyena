import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

type MembershipUser = string | JwtPayload;

type MembershipHandler<TUser = MembershipUser> = (
  req: NextRequest,
  user: TUser
) => Promise<NextResponse> | NextResponse;

export async function getMembershipUser(
  req: NextRequest
): Promise<MembershipUser | null> {
  const token = req.cookies.get('membershipToken')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as MembershipUser;

    return decoded;
  } catch {
    return null;
  }
}

export function requireMembershipAuth<TUser = MembershipUser>(
  handler: MembershipHandler<TUser>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const user = await getMembershipUser(req);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(req, user as TUser);
  };
}