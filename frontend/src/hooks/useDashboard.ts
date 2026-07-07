import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../api/dashboard';

export const dashboardKeys = ['dashboard'] as const;

export const useDashboard = () =>
  useQuery({
    queryKey: dashboardKeys,
    queryFn: async () => (await fetchDashboard()).data,
  });