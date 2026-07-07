import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button, Card, FormError, Input, Label } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useLogin } from '../../hooks/useLogin';
import { useToast } from '../../hooks/useToast';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof schema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login: setSession, token } = useAuth();
  const { showToast } = useToast();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@school.com',
      password: 'Password123!',
    },
  });

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, token]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      setSession(response.data.token, response.data.user);
      showToast({ tone: 'success', title: 'Welcome back', description: 'You are now signed in.' });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      showToast({ tone: 'error', title: 'Login failed', description: error instanceof Error ? error.message : 'Please try again.' });
    }
  });

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Student Hub</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Use your admin credentials to manage students and classes.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="admin@school.com" {...register('email')} />
          <FormError message={errors.email?.message} />
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" {...register('password')} />
          <FormError message={errors.password?.message} />
        </div>

        <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing in...' : 'Login'}
        </Button>
      </form>
    </Card>
  );
};