import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
