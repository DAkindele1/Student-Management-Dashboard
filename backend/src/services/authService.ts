import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError(401, 'Invalid email or password');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(500, 'JWT secret is not configured');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    secret,
    { expiresIn: '7d' },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};