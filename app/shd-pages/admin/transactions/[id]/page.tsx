// // app/admin/transactions/[id]/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';

// interface Transaction {
//   _id: string;
//   transactionId: string;
//   receiptNumber: string;
//   phoneNumber: string;
//   amount: number;
//   status: 'pending' | 'success' | 'failed' | 'cancelled';
//   type: 'collection' | 'payout' | 'refund';
//   orderId?: {
//     _id: string;
//     orderNumber: string;
//     totalAmount: number;
//     customerName: string;
//     customerPhone: string;
//     status: string;
//   };
//   vendorId?: {
//     _id: string;
//     businessName: string;
//     businessEmail: string;
//     phoneNumber: string;
//     businessType: string;
//   };
//   metadata: any;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function TransactionDetail() {
//   const router = useRouter();
//   const params = useParams();
//   const [transaction, setTransaction] = useState<Transaction | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState<any>({});

//   useEffect(() => {
//     fetchTransaction();
//   }, []);

//   const fetchTransaction = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/shd-api/api/admin/transactions/${params.id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       if (data.success) {
//         setTransaction(data.transaction);
//         setFormData(data.transaction);
//       }
//     } catch (error) {
//       console.error('Failed to fetch transaction:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/shd-api/api/admin/transactions/${params.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           setTransaction(data.transaction);
//           setEditing(false);
//           alert('Transaction updated successfully');
//         }
//       } else {
//         const data = await response.json();
//         alert(data.error || 'Failed to update transaction');
//       }
//     } catch (error) {
//       alert('An error occurred');
//     }
//   };

//   const handleStatusChange = async (newStatus: string) => {
//     if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/shd-api/api/admin/transactions/${params.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: newStatus })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           setTransaction(data.transaction);
//           alert('Status updated successfully');
//         }
//       } else {
//         const data = await response.json();
//         alert(data.error || 'Failed to update status');
//       }
//     } catch (error) {
//       alert('An error occurred');
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this transaction?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/shd-api/api/admin/transactions/${params.id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           alert('Transaction deleted successfully');
//           router.push('/admin/transactions');
//         }
//       } else {
//         const data = await response.json();
//         alert(data.error || 'Failed to delete transaction');
//       }
//     } catch (error) {
//       alert('An error occurred');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       success: 'bg-green-100 text-green-800 border-green-200',
//       failed: 'bg-red-100 text-red-800 border-red-200',
//       cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getTypeColor = (type: string) => {
//     const colors: Record<string, string> = {
//       collection: 'bg-blue-100 text-blue-800 border-blue-200',
//       payout: 'bg-purple-100 text-purple-800 border-purple-200',
//       refund: 'bg-orange-100 text-orange-800 border-orange-200'
//     };
//     return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getTypeIcon = (type: string) => {
//     const icons: Record<string, string> = {
//       collection: '💰',
//       payout: '💸',
//       refund: '↩️'
//     };
//     return icons[type] || '💳';
//   };

//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('en-KE', {
//       style: 'currency',
//       currency: 'KES'
//     }).format(amount);
//   };

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleString('en-KE', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!transaction) {
//     return (
//       <div className="p-8 text-center text-muted">
//         <div className="text-4xl mb-4">💳</div>
//         <h2 className="text-xl font-semibold text-secondary">Transaction not found</h2>
//         <button
//           onClick={() => router.push('/shd-pages/admin/transactions')}
//           className="mt-4 text-primary hover:text-accent-dark transition"
//         >
//           ← Back to Transactions
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="mb-6">
//         <button
//           onClick={() => router.push('/shd-pages/admin/transactions')}
//           className="text-primary hover:text-accent-dark transition mb-4 inline-block"
//         >
//           ← Back to Transactions
//         </button>
//         <div className="flex flex-wrap justify-between items-start gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
//               Transaction Details
//             </h1>
//             <div className="flex flex-wrap gap-2 mt-2">
//               <span className="font-mono text-sm bg-surface px-3 py-1 rounded-lg">
//                 {transaction.transactionId}
//               </span>
//               <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(transaction.status)}`}>
//                 {transaction.status.toUpperCase()}
//               </span>
//               <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(transaction.type)}`}>
//                 {getTypeIcon(transaction.type)} {transaction.type.toUpperCase()}
//               </span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={() => setEditing(!editing)}
//               className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-dark transition"
//             >
//               {editing ? 'Cancel' : 'Edit'}
//             </button>
//             <button
//               onClick={handleDelete}
//               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Details */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Transaction Details */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h2 className="text-lg font-semibold text-secondary mb-4">Transaction Information</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs text-muted">Transaction ID</label>
//                 <div className="font-mono text-sm font-medium text-secondary">
//                   {transaction.transactionId}
//                 </div>
//               </div>
//               <div>
//                 <label className="text-xs text-muted">Receipt Number</label>
//                 <div className="font-mono text-sm font-medium text-secondary">
//                   {transaction.receiptNumber || 'N/A'}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label className="text-xs text-muted">Phone Number</label>
//                 <div className="font-medium text-secondary">{transaction.phoneNumber}</div>
//               </div>
//               <div>
//                 <label className="text-xs text-muted">Amount</label>
//                 <div className="text-2xl font-bold text-secondary">
//                   {formatAmount(transaction.amount)}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label className="text-xs text-muted">Type</label>
//                 <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(transaction.type)}`}>
//                   {getTypeIcon(transaction.type)} {transaction.type.toUpperCase()}
//                 </div>
//               </div>
//               <div>
//                 <label className="text-xs text-muted">Status</label>
//                 <select
//                   value={transaction.status}
//                   onChange={(e) => handleStatusChange(e.target.value)}
//                   className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(transaction.status)} focus:outline-none focus:ring-2 focus:ring-primary`}
//                 >
//                   <option value="pending">⏳ Pending</option>
//                   <option value="success">✅ Success</option>
//                   <option value="failed">❌ Failed</option>
//                   <option value="cancelled">🚫 Cancelled</option>
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label className="text-xs text-muted">Created At</label>
//                 <div className="text-sm text-secondary">{formatDate(transaction.createdAt)}</div>
//               </div>
//               <div>
//                 <label className="text-xs text-muted">Updated At</label>
//                 <div className="text-sm text-secondary">{formatDate(transaction.updatedAt)}</div>
//               </div>
//             </div>
//           </div>

//           {/* Related Order */}
//           {transaction.orderId && (
//             <div className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-lg font-semibold text-secondary mb-4">Related Order</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs text-muted">Order Number</label>
//                   <Link 
//                     href={`/admin/orders/${transaction.orderId._id}`}
//                     className="font-medium text-primary hover:text-accent-dark transition"
//                   >
//                     #{transaction.orderId.orderNumber}
//                   </Link>
//                 </div>
//                 <div>
//                   <label className="text-xs text-muted">Customer</label>
//                   <div className="font-medium text-secondary">{transaction.orderId.customerName}</div>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <label className="text-xs text-muted">Customer Phone</label>
//                   <div className="text-secondary">{transaction.orderId.customerPhone}</div>
//                 </div>
//                 <div>
//                   <label className="text-xs text-muted">Order Status</label>
//                   <div className="text-secondary capitalize">{transaction.orderId.status}</div>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <label className="text-xs text-muted">Order Total</label>
//                 <div className="text-xl font-bold text-secondary">
//                   {formatAmount(transaction.orderId.totalAmount)}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Related Vendor */}
//           {transaction.vendorId && (
//             <div className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-lg font-semibold text-secondary mb-4">Related Vendor</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs text-muted">Business Name</label>
//                   <Link 
//                     href={`/admin/vendors/${transaction.vendorId._id}`}
//                     className="font-medium text-primary hover:text-accent-dark transition"
//                   >
//                     {transaction.vendorId.businessName}
//                   </Link>
//                 </div>
//                 <div>
//                   <label className="text-xs text-muted">Business Type</label>
//                   <div className="font-medium text-secondary">{transaction.vendorId.businessType}</div>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <label className="text-xs text-muted">Email</label>
//                   <div className="text-secondary">{transaction.vendorId.businessEmail}</div>
//                 </div>
//                 <div>
//                   <label className="text-xs text-muted">Phone</label>
//                   <div className="text-secondary">{transaction.vendorId.phoneNumber}</div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Column - Sidebar */}
//         <div className="space-y-6">
//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
//             <div className="space-y-2">
//               <select
//                 onChange={(e) => handleStatusChange(e.target.value)}
//                 className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 value={transaction.status}
//               >
//                 <option value="pending">⏳ Pending</option>
//                 <option value="success">✅ Success</option>
//                 <option value="failed">❌ Failed</option>
//                 <option value="cancelled">🚫 Cancelled</option>
//               </select>
              
//               {transaction.receiptNumber && (
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(transaction.receiptNumber || '');
//                     alert('Receipt number copied to clipboard!');
//                   }}
//                   className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition text-secondary"
//                 >
//                   📋 Copy Receipt Number
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Metadata */}
//           {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
//             <div className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-lg font-semibold text-secondary mb-4">Metadata</h2>
//               <div className="space-y-2">
//                 {Object.entries(transaction.metadata).map(([key, value]) => (
//                   <div key={key} className="flex justify-between border-b border-accent py-1">
//                     <span className="text-xs text-muted capitalize">{key.replace(/_/g, ' ')}</span>
//                     <span className="text-sm text-secondary">
//                       {typeof value === 'object' ? JSON.stringify(value) : String(value)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-bold text-secondary">Edit Transaction</h2>
//               <button
//                 onClick={() => setEditing(false)}
//                 className="text-muted hover:text-text text-2xl"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-secondary mb-1">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.phoneNumber || ''}
//                   onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
//                   className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary mb-1">
//                   Amount (KSh) *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   min="0"
//                   step="0.01"
//                   value={formData.amount || 0}
//                   onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
//                   className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary mb-1">
//                   Receipt Number
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.receiptNumber || ''}
//                   onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
//                   className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary mb-1">
//                   Status *
//                 </label>
//                 <select
//                   required
//                   value={formData.status || 'pending'}
//                   onChange={(e) => setFormData({...formData, status: e.target.value})}
//                   className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="pending">⏳ Pending</option>
//                   <option value="success">✅ Success</option>
//                   <option value="failed">❌ Failed</option>
//                   <option value="cancelled">🚫 Cancelled</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary mb-1">
//                   Type *
//                 </label>
//                 <select
//                   required
//                   value={formData.type || 'collection'}
//                   onChange={(e) => setFormData({...formData, type: e.target.value})}
//                   className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="collection">💰 Collection</option>
//                   <option value="payout">💸 Payout</option>
//                   <option value="refund">↩️ Refund</option>
//                 </select>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={handleUpdate}
//                   className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition"
//                 >
//                   Save Changes
//                 </button>
//                 <button
//                   onClick={() => {
//                     setEditing(false);
//                     setFormData(transaction);
//                   }}
//                   className="flex-1 border border-accent rounded-lg px-6 py-2 hover:bg-background transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// app/admin/transactions/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Transaction {
  _id: string;
  transactionId: string;
  receiptNumber?: string;
  phoneNumber?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  type: 'payment' | 'deposit' | 'payout' | 'refund';
  category: 'order' | 'membership' | 'savings' | 'investment' | 'petty_cash' | 'advertisement' | 'subscription' | 'vendor_payout' | 'customer_payment' | 'other';
  provider?: 'mpesa' | 'paystack' | 'stripe' | 'paypal' | 'other';
  providerTransactionId?: string;
  checkoutRequestId?: string;
  accountReference?: string;
  externalReference?: string;
  externalEntityId?: string;
  externalEntityType?: string;
  purpose?: string;
  metadata?: Record<string, any>;
  errorMessage?: string;
  order?: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    customerPhone?: string;
    status: string;
  };
  vendor?: {
    _id: string;
    businessName: string;
    businessEmail: string;
    phoneNumber: string;
    businessType: string;
  };
  organizationId?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TransactionDetail() {
  const router = useRouter();
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/transactions/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTransaction(data.transaction);
        setFormData(data.transaction);
      }
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/transactions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransaction(data.transaction);
          setEditing(false);
          alert('Transaction updated successfully');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update transaction');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/transactions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransaction(data.transaction);
          alert('Status updated successfully');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/transactions/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Transaction deleted successfully');
          router.push('/shd-pages/admin/transactions');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete transaction');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      processing: '🔄',
      success: '✅',
      failed: '❌',
      cancelled: '🚫'
    };
    return icons[status] || '❓';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      payment: 'bg-green-100 text-green-800 border-green-200',
      deposit: 'bg-blue-100 text-blue-800 border-blue-200',
      payout: 'bg-purple-100 text-purple-800 border-purple-200',
      refund: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      payment: '💰',
      deposit: '📥',
      payout: '💸',
      refund: '↩️'
    };
    return icons[type] || '💳';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      order: 'bg-indigo-100 text-indigo-800',
      membership: 'bg-pink-100 text-pink-800',
      savings: 'bg-teal-100 text-teal-800',
      investment: 'bg-amber-100 text-amber-800',
      petty_cash: 'bg-cyan-100 text-cyan-800',
      advertisement: 'bg-red-100 text-red-800',
      subscription: 'bg-violet-100 text-violet-800',
      vendor_payout: 'bg-purple-100 text-purple-800',
      customer_payment: 'bg-emerald-100 text-emerald-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatAmount = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency || 'KES'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-8 text-center text-muted">
        <div className="text-4xl mb-4">💳</div>
        <h2 className="text-xl font-semibold text-secondary">Transaction not found</h2>
        <button
          onClick={() => router.push('/shd-pages/admin/transactions')}
          className="mt-4 text-primary hover:text-accent-dark transition"
        >
          ← Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/shd-pages/admin/transactions')}
          className="text-primary hover:text-accent-dark transition mb-4 inline-block"
        >
          ← Back to Transactions
        </button>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              Transaction Details
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="font-mono text-sm bg-surface px-3 py-1 rounded-lg">
                {transaction.transactionId}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(transaction.status)}`}>
                {getStatusIcon(transaction.status)} {transaction.status.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(transaction.type)}`}>
                {getTypeIcon(transaction.type)} {transaction.type.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(transaction.category)}`}>
                {transaction.category.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-dark transition"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Details */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Transaction Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted">Transaction ID</label>
                <div className="font-mono text-sm font-medium text-secondary">
                  {transaction.transactionId}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Receipt Number</label>
                <div className="font-mono text-sm font-medium text-secondary">
                  {transaction.receiptNumber || 'N/A'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Phone Number</label>
                <div className="font-medium text-secondary">{transaction.phoneNumber || 'N/A'}</div>
              </div>
              <div>
                <label className="text-xs text-muted">Amount</label>
                <div className="text-2xl font-bold text-secondary">
                  {formatAmount(transaction.amount, transaction.currency)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Type</label>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(transaction.type)}`}>
                  {getTypeIcon(transaction.type)} {transaction.type.toUpperCase()}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Category</label>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(transaction.category)}`}>
                  {transaction.category.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Status</label>
                <select
                  value={transaction.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(transaction.status)} focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="processing">🔄 Processing</option>
                  <option value="success">✅ Success</option>
                  <option value="failed">❌ Failed</option>
                  <option value="cancelled">🚫 Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted">Provider</label>
                <div className="text-sm text-secondary">{transaction.provider || 'N/A'}</div>
              </div>
            </div>

            {transaction.providerTransactionId && (
              <div className="mt-4">
                <label className="text-xs text-muted">Provider Transaction ID</label>
                <div className="font-mono text-sm text-secondary">{transaction.providerTransactionId}</div>
              </div>
            )}

            {transaction.checkoutRequestId && (
              <div className="mt-4">
                <label className="text-xs text-muted">Checkout Request ID</label>
                <div className="font-mono text-sm text-secondary">{transaction.checkoutRequestId}</div>
              </div>
            )}

            {transaction.purpose && (
              <div className="mt-4">
                <label className="text-xs text-muted">Purpose</label>
                <div className="text-sm text-secondary">{transaction.purpose}</div>
              </div>
            )}

            {transaction.errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <label className="text-xs text-red-600 font-semibold">Error Message</label>
                <div className="text-sm text-red-700">{transaction.errorMessage}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-accent">
              <div>
                <label className="text-xs text-muted">Created At</label>
                <div className="text-sm text-secondary">{formatDate(transaction.createdAt)}</div>
              </div>
              <div>
                <label className="text-xs text-muted">Updated At</label>
                <div className="text-sm text-secondary">{formatDate(transaction.updatedAt)}</div>
              </div>
            </div>

            {transaction.organizationId && (
              <div className="mt-4 pt-4 border-t border-accent">
                <label className="text-xs text-muted">Organization</label>
                <div className="text-sm text-secondary">{transaction.organizationId.name}</div>
                <div className="text-xs text-muted">{transaction.organizationId.email}</div>
              </div>
            )}
          </div>

          {/* External References */}
          {(transaction.externalReference || transaction.externalEntityId || transaction.accountReference) && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">External References</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.accountReference && (
                  <div>
                    <label className="text-xs text-muted">Account Reference</label>
                    <div className="font-mono text-sm text-secondary">{transaction.accountReference}</div>
                  </div>
                )}
                {transaction.externalReference && (
                  <div>
                    <label className="text-xs text-muted">External Reference</label>
                    <div className="font-mono text-sm text-secondary">{transaction.externalReference}</div>
                  </div>
                )}
                {transaction.externalEntityId && (
                  <div>
                    <label className="text-xs text-muted">External Entity</label>
                    <div className="text-sm text-secondary">
                      {transaction.externalEntityType || 'Entity'}: {transaction.externalEntityId}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Order */}
          {transaction.order && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">Related Order</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Order Number</label>
                  <Link 
                    href={`/shd-pages/admin/orders/${transaction.order._id}`}
                    className="font-medium text-primary hover:text-accent-dark transition"
                  >
                    #{transaction.order.orderNumber}
                  </Link>
                </div>
                <div>
                  <label className="text-xs text-muted">Customer</label>
                  <div className="font-medium text-secondary">{transaction.order.customerName}</div>
                </div>
              </div>
              {transaction.order.customerPhone && (
                <div className="mt-4">
                  <label className="text-xs text-muted">Customer Phone</label>
                  <div className="text-secondary">{transaction.order.customerPhone}</div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs text-muted">Order Status</label>
                  <div className="text-secondary capitalize">{transaction.order.status}</div>
                </div>
                <div>
                  <label className="text-xs text-muted">Order Total</label>
                  <div className="text-xl font-bold text-secondary">
                    {formatAmount(transaction.order.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Vendor */}
          {transaction.vendor && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">Related Vendor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Business Name</label>
                  <Link 
                    href={`/shd-pages/admin/vendors/${transaction.vendor._id}`}
                    className="font-medium text-primary hover:text-accent-dark transition"
                  >
                    {transaction.vendor.businessName}
                  </Link>
                </div>
                <div>
                  <label className="text-xs text-muted">Business Type</label>
                  <div className="font-medium text-secondary">{transaction.vendor.businessType}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs text-muted">Email</label>
                  <div className="text-secondary">{transaction.vendor.businessEmail}</div>
                </div>
                <div>
                  <label className="text-xs text-muted">Phone</label>
                  <div className="text-secondary">{transaction.vendor.phoneNumber}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <select
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={transaction.status}
              >
                <option value="pending">⏳ Pending</option>
                <option value="processing">🔄 Processing</option>
                <option value="success">✅ Success</option>
                <option value="failed">❌ Failed</option>
                <option value="cancelled">🚫 Cancelled</option>
              </select>
              
              {transaction.receiptNumber && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.receiptNumber || '');
                    alert('Receipt number copied to clipboard!');
                  }}
                  className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition text-secondary"
                >
                  📋 Copy Receipt Number
                </button>
              )}

              {transaction.transactionId && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.transactionId);
                    alert('Transaction ID copied to clipboard!');
                  }}
                  className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition text-secondary"
                >
                  📋 Copy Transaction ID
                </button>
              )}
            </div>
          </div>

          {/* Provider Details */}
          {transaction.provider && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">Provider Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-accent py-1">
                  <span className="text-xs text-muted">Provider</span>
                  <span className="text-sm text-secondary capitalize">{transaction.provider}</span>
                </div>
                {transaction.providerTransactionId && (
                  <div className="flex justify-between border-b border-accent py-1">
                    <span className="text-xs text-muted">Provider TXN ID</span>
                    <span className="text-sm text-secondary font-mono">{transaction.providerTransactionId}</span>
                  </div>
                )}
                {transaction.checkoutRequestId && (
                  <div className="flex justify-between border-b border-accent py-1">
                    <span className="text-xs text-muted">Checkout Request</span>
                    <span className="text-sm text-secondary font-mono">{transaction.checkoutRequestId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">Metadata</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(transaction.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-accent py-1">
                    <span className="text-xs text-muted capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-sm text-secondary max-w-[60%] truncate">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-secondary">Edit Transaction</h2>
              <button
                onClick={() => setEditing(false)}
                className="text-muted hover:text-text text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Amount * (KSh)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount || 0}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  value={formData.currency || 'KES'}
                  onChange={(e) => setFormData({...formData, currency: e.target.value.toUpperCase()})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="KES"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={formData.receiptNumber || ''}
                  onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  value={formData.purpose || ''}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Status *
                </label>
                <select
                  required
                  value={formData.status || 'pending'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="processing">🔄 Processing</option>
                  <option value="success">✅ Success</option>
                  <option value="failed">❌ Failed</option>
                  <option value="cancelled">🚫 Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Type *
                </label>
                <select
                  required
                  value={formData.type || 'payment'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="payment">💰 Payment</option>
                  <option value="deposit">📥 Deposit</option>
                  <option value="payout">💸 Payout</option>
                  <option value="refund">↩️ Refund</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category || 'other'}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="order">📦 Order</option>
                  <option value="membership">👤 Membership</option>
                  <option value="savings">💰 Savings</option>
                  <option value="investment">📈 Investment</option>
                  <option value="petty_cash">💵 Petty Cash</option>
                  <option value="advertisement">📢 Advertisement</option>
                  <option value="subscription">🔄 Subscription</option>
                  <option value="vendor_payout">🏪 Vendor Payout</option>
                  <option value="customer_payment">👤 Customer Payment</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Provider
                </label>
                <select
                  value={formData.provider || ''}
                  onChange={(e) => setFormData({...formData, provider: e.target.value || undefined})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">None</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="paystack">Paystack</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Provider Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.providerTransactionId || ''}
                  onChange={(e) => setFormData({...formData, providerTransactionId: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Account Reference
                </label>
                <input
                  type="text"
                  value={formData.accountReference || ''}
                  onChange={(e) => setFormData({...formData, accountReference: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  External Reference
                </label>
                <input
                  type="text"
                  value={formData.externalReference || ''}
                  onChange={(e) => setFormData({...formData, externalReference: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(transaction);
                  }}
                  className="flex-1 border border-accent rounded-lg px-6 py-2 hover:bg-background transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}