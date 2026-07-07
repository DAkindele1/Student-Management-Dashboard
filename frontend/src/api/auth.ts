import { apiRequest } from './client';
import type { AuthResponse } from '../types';

export const loginRequest = (payload: { email: string; password: string }) =>
  apiRequest<{ message: string; data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });