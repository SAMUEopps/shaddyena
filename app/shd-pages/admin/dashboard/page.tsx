// 'use client';

// import { useEffect, useState } from 'react';

// interface Reconciliation {
//   date: string;
//   totalCollected: number;
//   totalPayouts: number;
//   totalPendingPayouts: number;
//   commissions: number;
//   netBalance: number;
//   collectionsCount: number;
//   payoutsCount: number;
//   pendingCount: number;
//   failedCount: number;
// }

// export default function AdminDashboard() {
//   const [reconciliation, setReconciliation] = useState<Reconciliation | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchReconciliation();
//   }, []);

//   const fetchReconciliation = async () => {
//     try {
//       const response = await fetch('/api/admin/reconcile', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setReconciliation(data);
//     } catch (error) {
//       console.error('Failed to fetch reconciliation:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

//       {reconciliation && (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <div className="bg-blue-100 p-4 rounded">
//               <h3>Total Collected</h3>
//               <p className="text-2xl font-bold">KSh {reconciliation.totalCollected}</p>
//             </div>
//             <div className="bg-green-100 p-4 rounded">
//               <h3>Total Payouts</h3>
//               <p className="text-2xl font-bold">KSh {reconciliation.totalPayouts}</p>
//             </div>
//             <div className="bg-yellow-100 p-4 rounded">
//               <h3>Pending Payouts</h3>
//               <p className="text-2xl font-bold">KSh {reconciliation.totalPendingPayouts}</p>
//             </div>
//             <div className="bg-purple-100 p-4 rounded">
//               <h3>Commissions</h3>
//               <p className="text-2xl font-bold">KSh {reconciliation.commissions}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//             <div className="bg-gray-100 p-4 rounded">
//               <h3>Collections</h3>
//               <p>{reconciliation.collectionsCount} transactions</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded">
//               <h3>Payouts</h3>
//               <p>{reconciliation.payoutsCount} completed</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded">
//               <h3>Failed</h3>
//               <p>{reconciliation.failedCount} payouts failed</p>
//             </div>
//           </div>

//           <div className="bg-green-50 border p-4 rounded">
//             <h2 className="text-xl font-bold">Net Balance</h2>
//             <p className="text-3xl font-bold text-green-600">
//               KSh {reconciliation.netBalance}
//             </p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// C:\Users\USER\Desktop\Projects\my-app\app\admin\dashboard\page.tsx
/*'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalRiders: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalMembers: number;
  totalInvestments: number;
  totalDeliveries: number;
  pendingPayouts: number;
  recentOrders: any[];
  recentUsers: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load dashboard</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { label: 'Vendors', value: stats.totalVendors, icon: '🏪', color: 'bg-green-500' },
    { label: 'Riders', value: stats.totalRiders, icon: '🏍️', color: 'bg-purple-500' },
    { label: 'Products', value: stats.totalProducts, icon: '📦', color: 'bg-orange-500' },
    { label: 'Orders', value: stats.totalOrders, icon: '📋', color: 'bg-indigo-500' },
    { label: 'Revenue', value: `KSh ${stats.totalRevenue?.toLocaleString() || 0}`, icon: '💰', color: 'bg-emerald-500' },
    { label: 'Members', value: stats.totalMembers, icon: '🌟', color: 'bg-rose-500' },
    { label: 'Investments', value: `KSh ${stats.totalInvestments?.toLocaleString() || 0}`, icon: '📈', color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Grid *
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders *
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {stats.recentOrders?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent orders</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders?.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">KSh {order.totalAmount}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users *
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Link href="/admin/users" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {stats.recentUsers?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent users</p>
          ) : (
            <div className="space-y-3">
              {stats.recentUsers?.map((user: any) => (
                <div key={user._id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'vendor' ? 'bg-green-100 text-green-800' :
                    user.role === 'rider' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalRiders: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalMembers: number;
  totalInvestments: number;
  totalDeliveries: number;
  pendingPayouts: number;
  recentOrders: any[];
  recentUsers: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-muted">Failed to load dashboard data</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { label: 'Vendors', value: stats.totalVendors, icon: '🏪', color: 'bg-green-500' },
    { label: 'Riders', value: stats.totalRiders, icon: '🏍️', color: 'bg-purple-500' },
    { label: 'Products', value: stats.totalProducts, icon: '📦', color: 'bg-orange-500' },
    { label: 'Orders', value: stats.totalOrders, icon: '📋', color: 'bg-indigo-500' },
    { label: 'Revenue', value: `KSh ${stats.totalRevenue?.toLocaleString() || 0}`, icon: '💰', color: 'bg-emerald-500' },
    { label: 'Members', value: stats.totalMembers, icon: '🌟', color: 'bg-rose-500' },
    { label: 'Investments', value: `KSh ${stats.totalInvestments?.toLocaleString() || 0}`, icon: '📈', color: 'bg-amber-500' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      vendor: 'bg-green-100 text-green-700 border-green-200',
      rider: 'bg-purple-100 text-purple-700 border-purple-200',
      customer: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            📊 Admin Dashboard
          </h1>
          <p className="text-muted mt-1">
            Overview of your platform's performance
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/settings"
            className="bg-surface hover:bg-surface/70 text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium"
          >
            ⚙️ Settings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-black text-secondary mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary">Recent Orders</h2>
            <Link 
              href="/admin/orders" 
              className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium text-sm"
            >
              View All →
            </Link>
          </div>
          {stats.recentOrders?.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-muted text-sm">No recent orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders?.map((order: any) => (
                <div 
                  key={order._id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-surface/30 hover:bg-surface/50 transition-colors duration-200"
                >
                  <div>
                    <p className="font-medium text-secondary">Order #{order.orderNumber}</p>
                    <p className="text-sm text-muted">KSh {order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary">Recent Users</h2>
            <Link 
              href="/admin/users" 
              className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium text-sm"
            >
              View All →
            </Link>
          </div>
          {stats.recentUsers?.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-muted text-sm">No recent users</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentUsers?.map((user: any) => (
                <div 
                  key={user._id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-surface/30 hover:bg-surface/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-secondary">{user.name}</p>
                      <p className="text-sm text-muted">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}