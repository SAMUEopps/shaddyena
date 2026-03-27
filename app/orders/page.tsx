'use client';

import OrdersTab from '@/components/tabs/OrdersTab/OrdersTab';
import { useAuth } from '@/contexts/AuthContext';


export default function OrdersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Please log in to view orders</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrdersTab role={user.role} />
    </div>
  );
}