'use client';

import EmptyState from './EmptyState';
import OrderCard from './OrderCard';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerId: {
    name: string;
  };
  products: any[];
  createdAt: string;
}

interface OrdersListProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: string) => void;
}

export default function OrdersList({ orders, onStatusChange }: OrdersListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">
          Recent Orders
          <span className="text-sm sm:text-base font-medium text-muted ml-2">
            ({orders.length} orders)
          </span>
        </h2>
      </div>

      {orders.length === 0 ? (
        <EmptyState 
          icon="📭" 
          title="No orders yet" 
          message="When customers place orders, they will appear here" 
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <OrderCard 
              key={order._id} 
              order={order} 
              onStatusChange={onStatusChange} 
            />
          ))}
        </div>
      )}
    </div>
  );
}