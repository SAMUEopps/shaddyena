/*'use client';

import { useState } from 'react';
import AdminOrdersTab from './AdminOrdersTab';
import VendorOrdersTab from './VendorOrdersTab';
import CustomerOrdersTab from './CustomerOrdersTab';


interface OrdersTabProps {
  role: 'customer' | 'vendor' | 'admin' | 'delivery';
}

export default function OrdersTab({ role }: OrdersTabProps) {
  const [viewMode, setViewMode] = useState<'vendor' | 'customer'>('vendor');

  if (role === 'admin') {
    return <AdminOrdersTab />;
  }

  if (role === 'vendor') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            {/*<h1 className="text-2xl font-bold text-gray-900">
              {viewMode === 'vendor' ? 'Vendor Orders' : 'My Orders'}
            </h1>*
            
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setViewMode('vendor')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'vendor'
                    ? 'bg-[#bf2c7e] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Vendor Orders
              </button>
              <button
                type="button"
                onClick={() => setViewMode('customer')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'customer'
                    ? 'bg-[#bf2c7e] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Orders
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'vendor' ? (
          <VendorOrdersTab />
        ) : (
          <CustomerOrdersTab isVendorAsCustomer={true} />
        )}
      </div>
    );
  }

  return <CustomerOrdersTab />;
}*/

// components/tabs/OrdersTab/OrdersTab.tsx
'use client';

import { useState } from 'react';
import AdminOrdersTab from './AdminOrdersTab';
import VendorOrdersTab from './VendorOrdersTab';
import CustomerOrdersTab from './CustomerOrdersTab';
import { Package, Store, User } from 'lucide-react';

interface OrdersTabProps {
  role: 'customer' | 'vendor' | 'admin' | 'delivery';
}

export default function OrdersTab({ role }: OrdersTabProps) {
  const [viewMode, setViewMode] = useState<'vendor' | 'customer'>('vendor');

  if (role === 'admin') {
    return <AdminOrdersTab />;
  }

  if (role === 'vendor') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <Package className="w-7 h-7 text-[var(--color-primary)]" />
              Orders Management
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Track and manage all your orders</p>
          </div>
          
          <div className="inline-flex rounded-xl border border-[var(--color-border)] p-1 bg-[var(--color-surface)]">
            <button
              type="button"
              onClick={() => setViewMode('vendor')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                viewMode === 'vendor'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-md'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
              }`}
            >
              <Store className="w-4 h-4" />
              Vendor Orders
            </button>
            <button
              type="button"
              onClick={() => setViewMode('customer')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                viewMode === 'customer'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-md'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
              }`}
            >
              <User className="w-4 h-4" />
              My Orders
            </button>
          </div>
        </div>
        
        {viewMode === 'vendor' ? (
          <VendorOrdersTab />
        ) : (
          <CustomerOrdersTab isVendorAsCustomer={true} />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <CustomerOrdersTab />
    </div>
  );
}