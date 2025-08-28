"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user || !token) {
      router.push('/sign-up');
    }
  }, [user, token, router]);

  if (!user || !token) {
    return null;
  }

  return <>{children}</>;
}