import jwt from 'jsonwebtoken';

export function verifyToken(token?: string) {
  if (!token) return null;
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      role: string;
    };
  } catch (error) {
    return null;
  }
}