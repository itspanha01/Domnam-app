"use client";

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { MainLayout } from '@/components/main-layout';

export function LayoutDecider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
