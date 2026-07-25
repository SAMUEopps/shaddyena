// 'use client';

// import EmptyState from './EmptyState';
// import OrderCard from './OrderCard';

// interface Order {
//   _id: string;
//   orderNumber: string;
//   totalAmount: number;
//   status: string;
//   customerId: {
//     name: string;
//   };
//   products: any[];
//   createdAt: string;
// }

// interface OrdersListProps {
//   orders: Order[];
//   onStatusChange: (orderId: string, status: string) => void;
// }

// export default function OrdersList({ orders, onStatusChange }: OrdersListProps) {
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4 sm:mb-6">
//         <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">
//           Recent Orders
//           <span className="text-sm sm:text-base font-medium text-muted ml-2">
//             ({orders.length} orders)
//           </span>
//         </h2>
//       </div>

//       {orders.length === 0 ? (
//         <EmptyState 
//           icon="📭" 
//           title="No orders yet" 
//           message="When customers place orders, they will appear here" 
//         />
//       ) : (
//         <div className="space-y-3 sm:space-y-4">
//           {orders.map((order) => (
//             <OrderCard 
//               key={order._id} 
//               order={order} 
//               onStatusChange={onStatusChange} 
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// app/shd-pages/vendor/components/OrdersList.tsx
'use client';

import { Order, Rider } from '@/types/vendor';
import EmptyState from './EmptyState';
import OrderCard from './OrderCard';


/*interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  rating: number;
  totalDeliveries: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  deliveryStatus: string;
  customerId: {
    name: string;
    phone: string;
  };
  products: any[];
  createdAt: string;
  deliveryAddress: string;
  deliveryPhone: string;
  rider: Rider | null;
  riderAssignedAt?: Date;
}*/

interface OrdersListProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: string) => void;
  onAssignRider: (orderId: string, riderId: string) => void;
  availableRiders: Rider[];
}

export default function OrdersList({ 
  orders, 
  onStatusChange, 
  onAssignRider,
  availableRiders 
}: OrdersListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">
          Orders
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
              onAssignRider={onAssignRider}
              availableRiders={availableRiders}
            />
          ))}
        </div>
      )}
    </div>
  );
}