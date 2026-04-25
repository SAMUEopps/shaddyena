// app/orders/page.tsx
'use client';

import OrdersTab from '@/components/tabs/OrdersTab/OrdersTab';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function OrdersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mx-auto mb-3" />
          <p className="text-[var(--color-text-muted)]">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Authentication Required</h1>
          <p className="text-[var(--color-text-muted)] mb-6">Please log in to view your orders</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300"
          >
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <OrdersTab role={user.role as 'customer' | 'vendor' | 'admin' | 'delivery'} />
    </div>
  );
}