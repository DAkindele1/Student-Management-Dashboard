import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!parsed.success) {
    next(new AppError(400, 'Validation failed', parsed.error.flatten()));
    return;
  }

  req.body = parsed.data.body ?? req.body;
  req.params = parsed.data.params ?? req.params;
  req.query = parsed.data.query ?? req.query;
  next();
};