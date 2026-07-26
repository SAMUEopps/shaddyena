// // C:\Users\USER\Desktop\Projects\my-app\app\admin\users\page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   role: string;
//   isMember: boolean;
//   isVerified: boolean;
//   totalSavings: number;
//   totalInvestments: number;
//   availableBalance: number;
//   referralEarnings: number;
//   createdAt: string;
// }

// export default function AdminUsers() {
//   const router = useRouter();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/admin/users', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       setUsers(data.users);
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRoleChange = async (userId: string, newRole: string) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/admin/users/update-role', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userId, role: newRole })
//       });

//       if (response.ok) {
//         alert('User role updated successfully');
//         fetchUsers();
//       } else {
//         const data = await response.json();
//         alert(data.error || 'Failed to update role');
//       }
//     } catch (error) {
//       alert('An error occurred');
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     if (!confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/admin/users/delete', {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userId })
//       });

//       if (response.ok) {
//         alert('User deleted successfully');
//         fetchUsers();
//       } else {
//         const data = await response.json();
//         alert(data.error || 'Failed to delete user');
//       }
//     } catch (error) {
//       alert('An error occurred');
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     if (filter !== 'all' && user.role !== filter) return false;
//     if (search) {
//       const searchLower = search.toLowerCase();
//       return user.name.toLowerCase().includes(searchLower) ||
//              user.email.toLowerCase().includes(searchLower) ||
//              user.phoneNumber.includes(search);
//     }
//     return true;
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex flex-wrap items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold">👥 Users</h1>
//         <div className="flex flex-wrap gap-3">
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded-lg px-4 py-2"
//           />
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="border rounded-lg px-4 py-2"
//           >
//             <option value="all">All Roles</option>
//             <option value="customer">Customers</option>
//             <option value="vendor">Vendors</option>
//             <option value="rider">Riders</option>
//             <option value="admin">Admins</option>
//           </select>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredUsers.map((user) => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="font-medium">{user.name}</div>
//                     <div className="text-sm text-gray-500">{user.email}</div>
//                   </td>
//                   <td className="px-6 py-4 text-sm">{user.phoneNumber}</td>
//                   <td className="px-6 py-4">
//                     <select
//                       value={user.role}
//                       onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                       className={`px-2 py-1 rounded-full text-xs font-semibold border ${
//                         user.role === 'admin' ? 'bg-red-100 text-red-800 border-red-200' :
//                         user.role === 'vendor' ? 'bg-green-100 text-green-800 border-green-200' :
//                         user.role === 'rider' ? 'bg-purple-100 text-purple-800 border-purple-200' :
//                         'bg-blue-100 text-blue-800 border-blue-200'
//                       }`}
//                     >
//                       <option value="customer">Customer</option>
//                       <option value="vendor">Vendor</option>
//                       <option value="rider">Rider</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                   <td className="px-6 py-4">
//                     {user.isMember ? (
//                       <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
//                         ★ Member
//                       </span>
//                     ) : (
//                       <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
//                         Non-member
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium">KSh {user.availableBalance || 0}</div>
//                     <div className="text-xs text-gray-500">Savings: KSh {user.totalSavings || 0}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <button
//                       onClick={() => handleDeleteUser(user._id)}
//                       className="text-red-600 hover:text-red-800 text-sm font-medium"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {filteredUsers.length === 0 && (
//           <div className="text-center py-8 text-gray-500">No users found</div>
//         )}
//       </div>
//     </div>
//   );
// }

// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isMember: boolean;
  isVerified: boolean;
  totalSavings: number;
  totalInvestments: number;
  availableBalance: number;
  referralEarnings: number;
  referralCommissionEarnings: number;
  referralSubscriptionEarnings: number;
  referralCode: string;
  referredBy: string | null;
  referrals: string[];
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  roles: Array<{ _id: string; count: number }>;
  members: { members: number; nonMembers: number };
  verified: { verified: number; unverified: number };
  earnings: {
    totalReferralEarnings: number;
    totalCommissionEarnings: number;
    totalSubscriptionEarnings: number;
    totalSavings: number;
    totalInvestments: number;
    totalBalance: number;
  };
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/users/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(user => 
            user._id === userId ? { ...user, role: newRole } : user
          ));
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update role');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.filter(user => user._id !== userId));
          alert('User deleted successfully');
          fetchStats(); // Refresh stats
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    const actionMessages = {
      delete: `delete ${selectedUsers.length} users`,
      updateRole: `change role for ${selectedUsers.length} users to "${value}"`,
      updateMemberStatus: `${value ? 'add' : 'remove'} membership for ${selectedUsers.length} users`
    };

    if (!confirm(`Are you sure you want to ${actionMessages[action as keyof typeof actionMessages] || action}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/users/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userIds: selectedUsers, 
          action,
          value 
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setSelectedUsers([]);
        fetchUsers();
        fetchStats();
      } else {
        alert(data.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u._id));
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter !== 'all' && user.role !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return user.name.toLowerCase().includes(searchLower) ||
             user.email.toLowerCase().includes(searchLower) ||
             user.phoneNumber.includes(search);
    }
    return true;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'vendor': return 'bg-green-100 text-green-800 border-green-200';
      case 'rider': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-primary">
            <div className="text-sm text-muted">Total Users</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalUsers}</div>
            <div className="text-xs text-muted mt-1">
              {stats.verified.verified} verified
            </div>
          </div>
          {stats.roles.map((role: any) => (
            <div key={role._id} className="bg-white rounded-xl shadow p-4 border-l-4 border-accent">
              <div className="text-sm text-muted capitalize">{role._id}s</div>
              <div className="text-2xl font-bold text-secondary">{role.count}</div>
            </div>
          ))}
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-accent-dark">
            <div className="text-sm text-muted">Members</div>
            <div className="text-2xl font-bold text-secondary">{stats.members.members}</div>
            <div className="text-xs text-muted mt-1">
              {stats.members.nonMembers} non-members
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
          👥 Users Management
        </h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="vendor">Vendors</option>
            <option value="rider">Riders</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-surface p-4 rounded-xl mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-secondary">
            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => handleBulkAction('delete')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Delete Selected
          </button>
          <select
            onChange={(e) => handleBulkAction('updateRole', e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Change Role</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="rider">Rider</option>
            <option value="admin">Admin</option>
          </select>
          <select
            onChange={(e) => handleBulkAction('updateMemberStatus', e.target.value === 'true')}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Update Membership</option>
            <option value="true">Make Member</option>
            <option value="false">Remove Member</option>
          </select>
          <button
            onClick={() => setSelectedUsers([])}
            className="text-muted hover:text-text text-sm transition"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={selectAllUsers}
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    className="rounded border-accent text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-background transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="rounded border-accent text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">{user.name}</div>
                    <div className="text-sm text-muted">{user.email}</div>
                    <div className="text-xs text-muted">
                      Ref: {user.referralCode}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    <div>{user.phoneNumber}</div>
                    <div className="text-xs text-muted">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)} focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="rider">Rider</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {user.isMember ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          ★ Member
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Non-member
                        </span>
                      )}
                      {user.isVerified ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          ⚠ Unverified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-secondary">
                      KSh {user.availableBalance?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-muted">
                      Savings: KSh {user.totalSavings?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-muted">
                      Referral: KSh {user.referralEarnings?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/shd-pages/admin/users/${user._id}`)}
                        className="text-primary hover:text-accent-dark text-sm font-medium transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted">
            No users found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-muted">
        <span>
          Showing {filteredUsers.length} of {users.length} users
          {search && ` (filtered from ${users.length} total)`}
        </span>
        <span>
          {selectedUsers.length > 0 && `${selectedUsers.length} selected`}
        </span>
      </div>
    </div>
  );
}