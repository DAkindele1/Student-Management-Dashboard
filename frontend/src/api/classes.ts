import { apiRequest } from './client';
import type { ClassRecord } from '../types';

export const fetchClasses = () => apiRequest<{ data: ClassRecord[] }>('/classes');

export const createClassRequest = (payload: { name: string; section: string; capacity: number }) =>
  apiRequest<{ message: string; data: ClassRecord }>('/classes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateClassRequest = (id: string, payload: Partial<{ name: string; section: string; capacity: number }>) =>
  apiRequest<{ message: string; data: ClassRecord }>(`/classes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const deleteClassRequest = (id: string) =>
  apiRequest<void>(`/classes/${id}`, {
    method: 'DELETE',
  });