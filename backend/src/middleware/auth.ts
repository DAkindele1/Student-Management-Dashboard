import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
  };
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    next(new AppError(401, 'Authentication required'));
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(new AppError(500, 'JWT secret is not configured'));
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthenticatedRequest['user'];
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
};