import { apiRequest } from './client';
import type { DashboardSummary } from '../types';

export const fetchDashboard = () => apiRequest<{ data: DashboardSummary }>('/dashboard');