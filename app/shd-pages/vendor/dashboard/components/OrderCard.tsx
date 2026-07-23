'use client';

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

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
}

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      packed: 'bg-purple-100 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusEmoji = (status: string) => {
    const emojis: Record<string, string> = {
      pending: '⏳',
      processing: '⚙️',
      packed: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return emojis[status] || '📋';
  };

  const statusOptions = [
    { value: 'pending', label: '⏳ Pending' },
    { value: 'processing', label: '⚙️ Processing' },
    { value: 'packed', label: '📦 Packed' },
    { value: 'shipped', label: '🚚 Shipped' },
    { value: 'delivered', label: '✅ Delivered' },
    { value: 'cancelled', label: '❌ Cancelled' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 border border-surface">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-bold text-sm sm:text-base text-secondary">
              Order #{order.orderNumber}
            </h3>
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(order.status)}`}>
              {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <p className="text-muted truncate">
              👤 <span className="text-secondary font-medium">{order.customerId?.name || 'Unknown'}</span>
            </p>
            <p className="text-muted truncate">
              💰 <span className="text-primary font-bold">KSh {order.totalAmount.toLocaleString()}</span>
            </p>
            <p className="text-muted truncate">
              📅 <span className="text-secondary font-medium">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </p>
            <p className="text-muted sm:col-span-2 lg:col-span-3 truncate">
              📦 <span className="text-secondary font-medium">{order.products.length} items</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto lg:min-w-[200px]">
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className="flex-1 lg:flex-none border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary text-xs sm:text-sm font-medium"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => alert('Print invoice functionality coming soon')}
            className="flex-1 lg:flex-none bg-surface hover:bg-surface/70 text-secondary px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 font-medium text-xs sm:text-sm whitespace-nowrap"
          >
            🖨️ Invoice
          </button>
        </div>
      </div>
    </div>
  );
}