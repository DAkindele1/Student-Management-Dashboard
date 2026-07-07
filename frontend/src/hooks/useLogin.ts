import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '../api/auth';

export const useLogin = () =>
  useMutation({
    mutationFn: loginRequest,
  });