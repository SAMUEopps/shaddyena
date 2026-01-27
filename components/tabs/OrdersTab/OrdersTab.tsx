'use client';

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
            </h1>*/}
            
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
}