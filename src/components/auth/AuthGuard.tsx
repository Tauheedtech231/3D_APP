'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import type { RootState } from '@/store/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { user, token } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/sign-in');
    }
  }, [user, token, router]);

  if (!user || !token) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;