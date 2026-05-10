import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function useAuth(redirectTo = '/login') {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.replace(redirectTo);
    }
  }, [token, router, redirectTo]);

  return { token, user, logout, isAuthenticated: !!token };
}
