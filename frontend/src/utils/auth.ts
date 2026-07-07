import type { AuthUser } from '../types';

const tokenKey = 'smd-token';
const userKey = 'smd-user';

export const authStorage = {
  getToken: () => localStorage.getItem(tokenKey),
  setAuth: (token: string, user: AuthUser) => {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(userKey, JSON.stringify(user));
  },
  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(userKey);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
  clear: () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  },
};