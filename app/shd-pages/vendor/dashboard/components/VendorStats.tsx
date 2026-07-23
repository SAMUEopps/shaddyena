'use client';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  iconBg: string;
}

function StatCard({ label, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 border border-surface">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-muted font-medium truncate">{label}</p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-secondary mt-0.5 sm:mt-1 truncate">
            {value}
          </p>
        </div>
        <div className={`${iconBg} p-2.5 sm:p-3.5 rounded-xl flex-shrink-0`}>
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

interface VendorStatsProps {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
}

export default function VendorStats({ 
  totalOrders, 
  totalRevenue, 
  pendingOrders, 
  processingOrders 
}: VendorStatsProps) {
  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: '📋',
      iconBg: 'bg-blue-100'
    },
    {
      label: 'Revenue',
      value: `KSh ${totalRevenue.toLocaleString()}`,
      icon: '💰',
      iconBg: 'bg-green-100'
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: '⏳',
      iconBg: 'bg-yellow-100'
    },
    {
      label: 'Processing',
      value: processingOrders,
      icon: '⚙️',
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}