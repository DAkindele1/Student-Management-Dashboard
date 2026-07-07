import { useMutation, useQuery } from '@tanstack/react-query';
import { createStudentRequest, deleteStudentRequest, fetchStudent, fetchStudents, updateStudentRequest } from '../api/students';
import { queryClient } from '../utils/queryClient';

export const studentKeys = {
  all: ['students'] as const,
  list: (page: number, limit: number, search: string) => ['students', 'list', page, limit, search] as const,
  detail: (id: string) => ['students', 'detail', id] as const,
};

export const useStudents = (params: { page: number; limit: number; search: string }) =>
  useQuery({
    queryKey: studentKeys.list(params.page, params.limit, params.search),
    queryFn: () => fetchStudents(params),
  });

export const useStudent = (id: string) =>
  useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: async () => (await fetchStudent(id)).data,
    enabled: Boolean(id),
  });

export const useCreateStudent = () =>
  useMutation({
    mutationFn: createStudentRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });

export const useUpdateStudent = () =>
  useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateStudentRequest>[1] }) =>
      updateStudentRequest(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });

export const useDeleteStudent = () =>
  useMutation({
    mutationFn: deleteStudentRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });