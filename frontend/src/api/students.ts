import { apiRequest } from './client';
import type { PaginatedStudents, StudentRecord, Gender } from '../types';

export const fetchStudents = (params: { page: number; limit: number; search: string }) => {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    search: params.search,
  });

  return apiRequest<PaginatedStudents>(`/students?${searchParams.toString()}`);
};

export const fetchStudent = (id: string) => apiRequest<{ data: StudentRecord }>(`/students/${id}`);

export const createStudentRequest = (payload: {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  classId: string;
}) =>
  apiRequest<{ message: string; data: StudentRecord }>('/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateStudentRequest = (id: string, payload: Partial<{ fullName: string; email: string; phone: string; gender: Gender; dateOfBirth: string; classId: string }>) =>
  apiRequest<{ message: string; data: StudentRecord }>(`/students/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const deleteStudentRequest = (id: string) =>
  apiRequest<void>(`/students/${id}`, {
    method: 'DELETE',
  });