'use client';

import { ReactNode } from 'react';
import { Header } from '@/app/components/layout/Header';
import { Sidebar } from '@/app/components/layout/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  activeItem?: string;
}

export function DashboardLayout({ children, activeItem = 'dashboard' }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background dark">
      <Header />
      
      <div className="flex min-h-[calc(100vh-80px)]">
        <Sidebar activeItem={activeItem} />
        
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
