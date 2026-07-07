import { useMutation, useQuery } from '@tanstack/react-query';
import { createClassRequest, deleteClassRequest, fetchClasses, updateClassRequest } from '../api/classes';
import { queryClient } from '../utils/queryClient';

export const classKeys = {
  all: ['classes'] as const,
};

export const useClasses = () =>
  useQuery({
    queryKey: classKeys.all,
    queryFn: async () => (await fetchClasses()).data,
  });

export const useCreateClass = () =>
  useMutation({
    mutationFn: createClassRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

export const useUpdateClass = () =>
  useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateClassRequest>[1] }) =>
      updateClassRequest(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

export const useDeleteClass = () =>
  useMutation({
    mutationFn: deleteClassRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });