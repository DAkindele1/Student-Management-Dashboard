import type { Request, Response } from 'express';
import { loginSchema } from '../validators/authValidator';
import { asyncHandler } from '../utils/asyncHandler';
import { login } from '../services/authService';

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse({ body: req.body }).body;
  const result = await login(email, password);

  res.status(200).json({
    message: 'Login successful',
    data: result,
  });
});