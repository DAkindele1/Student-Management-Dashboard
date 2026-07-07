import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getDashboardSummary } from '../services/dashboardService';

export const dashboardController = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getDashboardSummary();

  res.status(200).json({
    data,
  });
});