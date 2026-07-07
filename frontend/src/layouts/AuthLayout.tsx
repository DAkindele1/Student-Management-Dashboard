import type { ReactNode } from 'react';

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-white px-4 py-8 dark:bg-slate-950">
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px] items-center justify-center">{children}</div>
  </div>
);
