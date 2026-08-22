// 'use client';

// import { useState, useEffect } from 'react';

// interface Budget {
//   _id: string;
//   allocatedAmount: number;
//   spentAmount: number;
//   platformFees: number;
//   remainingAmount: number;
//   weekStart: string;
//   weekEnd: string;
// }

// export default function PettyCashDashboard() {
//   //const { data: session } = useSession();
//   const [budget, setBudget] = useState<Budget | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showRequestModal, setShowRequestModal] = useState(false);

//   useEffect(() => {
//     fetchBudget();
//   }, []);

//   const fetchBudget = async () => {
//     try {
//       const response = await fetch('/api/petty-cash/budget');
//       const data = await response.json();
//       if (data.success) {
//         setBudget(data.budget);
//       }
//     } catch (error) {
//       console.error('Error fetching budget:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createRequest = async (formData: any) => {
//     try {
//       const response = await fetch('/api/petty-cash/requests', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         // Refresh budget
//         fetchBudget();
//         setShowRequestModal(false);
//         alert('Request submitted successfully!');
//       }
//     } catch (error) {
//       console.error('Error creating request:', error);
//       alert('Failed to create request');
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-64">Loading...</div>;
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Petty Cash Dashboard</h1>
//         <button
//           onClick={() => setShowRequestModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           New Request
//         </button>
//       </div>

//       {/* Budget Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm font-medium text-gray-500">Allocated</h3>
//           <p className="text-2xl font-bold">KES {budget?.allocatedAmount?.toLocaleString() || 0}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm font-medium text-gray-500">Spent</h3>
//           <p className="text-2xl font-bold text-orange-600">KES {budget?.spentAmount?.toLocaleString() || 0}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm font-medium text-gray-500">Fees</h3>
//           <p className="text-2xl font-bold text-purple-600">KES {budget?.platformFees?.toLocaleString() || 0}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm font-medium text-gray-500">Remaining</h3>
//           <p className="text-2xl font-bold text-green-600">KES {budget?.remainingAmount?.toLocaleString() || 0}</p>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       {budget && (
//         <div className="bg-white p-6 rounded-lg shadow mb-8">
//           <div className="flex justify-between text-sm mb-2">
//             <span>Utilization</span>
//             <span>{((budget.spentAmount / budget.allocatedAmount) * 100).toFixed(1)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-blue-600 h-2 rounded-full transition-all"
//               style={{
//                 width: `${Math.min((budget.spentAmount / budget.allocatedAmount) * 100, 100)}%`
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Recent Requests */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-4 border-b">
//           <h2 className="text-lg font-semibold">Recent Requests</h2>
//         </div>
//         {/* Add requests list component here */}
//         <div className="p-4 text-center text-gray-500">
//           <p>Request list will be displayed here</p>
//         </div>
//       </div>

//       {/* Request Modal */}
//       {showRequestModal && (
//         <RequestModal
//           onClose={() => setShowRequestModal(false)}
//           onSubmit={createRequest}
//           budget={budget}
//         />
//       )}
//     </div>
//   );
// }

// // Request Modal Component
// function RequestModal({ onClose, onSubmit, budget }: any) {
//   const [formData, setFormData] = useState({
//     amount: '',
//     recipientPhone: '',
//     recipientName: '',
//     category: '',
//     description: '',
//     receiptUrl: ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit({
//       ...formData,
//       amount: parseFloat(formData.amount)
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">New Expense Request</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Amount (KES)</label>
//               <input
//                 type="number"
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({...formData, amount: e.target.value})}
//                 max={budget?.remainingAmount}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Recipient Phone</label>
//               <input
//                 type="tel"
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//                 placeholder="254700000000"
//                 value={formData.recipientPhone}
//                 onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Recipient Name</label>
//               <input
//                 type="text"
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={formData.recipientName}
//                 onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Category</label>
//               <select
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={formData.category}
//                 onChange={(e) => setFormData({...formData, category: e.target.value})}
//               >
//                 <option value="">Select category</option>
//                 <option value="Utilities">Utilities</option>
//                 <option value="Transport">Transport</option>
//                 <option value="Office Supplies">Office Supplies</option>
//                 <option value="Meals">Meals</option>
//                 <option value="Cleaning">Cleaning</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//                 rows={3}
//                 value={formData.description}
//                 onChange={(e) => setFormData({...formData, description: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Receipt URL (optional)</label>
//               <input
//                 type="url"
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={formData.receiptUrl}
//                 onChange={(e) => setFormData({...formData, receiptUrl: e.target.value})}
//               />
//             </div>
//           </div>
//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Submit Request
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Budget {
  _id: string;
  allocatedAmount: number;
  spentAmount: number;
  platformFees: number;
  remainingAmount: number;
  weekStart: string;
  weekEnd: string;
  status: 'active' | 'closed' | 'overdrawn';
  createdBy: {
    name: string;
    email: string;
  };
}

interface ExpenseRequest {
  _id: string;
  amount: number;
  platformFee: number;
  totalAmount: number;
  recipientPhone: string;
  recipientName?: string;
  category: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'failed';
  requesterId: {
    name: string;
    email: string;
  };
  approverId?: {
    name: string;
    email: string;
  };
  createdAt: string;
  paidAt?: string;
  approvedAt?: string;
  receiptUrl?: string;
  mpesaReference?: string;
  rejectionReason?: string;
  metadata?: any;
}

export default function PettyCashDashboard() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [requests, setRequests] = useState<ExpenseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExpenseRequest | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch budget
      const budgetResponse = await fetch('/api/shd-api/api/petty-cash/budget', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const budgetData = await budgetResponse.json();
      if (budgetData.success) {
        setBudget(budgetData.budget);
      }

      // Fetch requests
      const requestsResponse = await fetch('/api/shd-api/api/petty-cash/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const requestsData = await requestsResponse.json();
      if (requestsData.success) {
        setRequests(requestsData.requests);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/petty-cash/requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchData();
        setShowRequestModal(false);
        alert('✅ Request submitted successfully! Awaiting approval.');
      } else {
        alert(`❌ Failed to create request: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/shd-api/api/petty-cash/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchData();
        setSelectedRequest(null);
        alert(`✅ Payment sent successfully!\n\nAmount: KES ${data.request.amount.toLocaleString()}\nRecipient: ${data.request.recipientPhone}\nReference: ${data.request.mpesaReference || 'N/A'}`);
      } else {
        alert(`❌ Failed to process payment: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/petty-cash/requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchData();
        setSelectedRequest(null);
        alert('Request rejected successfully');
      } else {
        alert(data.error || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      approved: '📋',
      paid: '✅',
      rejected: '❌',
      failed: '⚠️'
    };
    return icons[status] || '📌';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Petty Cash Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {budget ? `Week ${format(new Date(budget.weekStart), 'MMM d')} - ${format(new Date(budget.weekEnd), 'MMM d, yyyy')}` : 'No active budget'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            New Request
          </button>
          <button
            onClick={fetchData}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Allocated</h3>
          <p className="text-2xl font-bold text-gray-900">KES {budget?.allocatedAmount?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Spent</h3>
          <p className="text-2xl font-bold text-orange-600">KES {budget?.spentAmount?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Platform Fees</h3>
          <p className="text-2xl font-bold text-purple-600">KES {budget?.platformFees?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Remaining</h3>
          <p className={`text-2xl font-bold ${budget?.remainingAmount && budget.remainingAmount < 100 ? 'text-red-600' : 'text-green-600'}`}>
            KES {budget?.remainingAmount?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {budget && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Budget Utilization</span>
            <span className="font-medium">
              {((budget.spentAmount / budget.allocatedAmount) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                budget.remainingAmount < budget.allocatedAmount * 0.2 ? 'bg-red-500' :
                budget.remainingAmount < budget.allocatedAmount * 0.5 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min((budget.spentAmount / budget.allocatedAmount) * 100, 100)}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Expense Requests</h2>
          <span className="text-sm text-gray-500">
            {requests.filter(r => r.status === 'pending').length} pending
          </span>
        </div>
        
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-4xl mb-2">📭</p>
            <p>No expense requests yet</p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first request →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {request.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        KES {request.amount.toLocaleString()}
                      </div>
                      {request.platformFee > 0 && (
                        <div className="text-xs text-gray-500">
                          + KES {request.platformFee.toFixed(2)} fee
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.recipientName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{request.recipientPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{request.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                        {getStatusIcon(request.status)} {request.status.toUpperCase()}
                      </span>
                      {request.status === 'paid' && request.mpesaReference && (
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-32">
                          Ref: {request.mpesaReference}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {format(new Date(request.createdAt), 'MMM d, HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={createRequest}
          budget={budget}
        />
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => handleApproveRequest(selectedRequest._id)}
          onReject={(reason: string) => handleRejectRequest(selectedRequest._id, reason)}
          processing={processing}
        />
      )}
    </div>
  );
}

// ============ REQUEST MODAL COMPONENT ============

function RequestModal({ onClose, onSubmit, budget }: any) {
  const [formData, setFormData] = useState({
    amount: '',
    recipientPhone: '',
    recipientName: '',
    category: '',
    description: '',
    receiptUrl: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 1) {
      setError('Please enter a valid amount (minimum KSh 1)');
      return;
    }

    const platformFee = amount * 0.015;
    const totalAmount = amount + platformFee;

    if (budget && totalAmount > budget.remainingAmount) {
      setError(`Insufficient budget! Required: KES ${totalAmount.toFixed(2)} (includes ${platformFee.toFixed(2)} fee), Available: KES ${budget.remainingAmount.toFixed(2)}`);
      return;
    }

    // Validate phone number
    const cleanPhone = formData.recipientPhone.replace(/[+\s]/g, '');
    if (!/^254[0-9]{9}$/.test(cleanPhone)) {
      setError('Please enter a valid Kenyan phone number (e.g., 254712345678)');
      return;
    }

    setSubmitting(true);
    await onSubmit({
      ...formData,
      recipientPhone: cleanPhone,
      amount: amount
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">New Expense Request</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={submitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Amount Input with Fee Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (KES) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                max={budget?.remainingAmount}
                placeholder="Enter amount"
                disabled={submitting}
              />
              {formData.amount && parseFloat(formData.amount) > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span>KES {parseFloat(formData.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee (1.5%):</span>
                    <span>KES {(parseFloat(formData.amount) * 0.015).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                    <span>Total Required:</span>
                    <span className="text-blue-600">KES {(parseFloat(formData.amount) * 1.015).toFixed(2)}</span>
                  </div>
                  {budget && (
                    <div className={`flex justify-between mt-1 text-sm ${parseFloat(formData.amount) * 1.015 <= budget.remainingAmount ? 'text-green-600' : 'text-red-600'}`}>
                      <span>Available Budget:</span>
                      <span>KES {budget.remainingAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recipient Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="254712345678"
                value={formData.recipientPhone}
                onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">Format: 254712345678 or 0712345678</p>
            </div>

            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.recipientName}
                onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                placeholder="Enter recipient name"
                disabled={submitting}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                disabled={submitting}
              >
                <option value="">Select category</option>
                <option value="Utilities">Utilities</option>
                <option value="Transport">Transport</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Meals">Meals</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the expense"
                disabled={submitting}
              />
            </div>

            {/* Receipt URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receipt URL (optional)
              </label>
              <input
                type="url"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.receiptUrl}
                onChange={(e) => setFormData({...formData, receiptUrl: e.target.value})}
                placeholder="https://example.com/receipt.jpg"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============ REQUEST DETAIL MODAL COMPONENT ============

function RequestDetailModal({ request, onClose, onApprove, onReject, processing }: any) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleReject = () => {
    if (showRejectInput && rejectionReason.trim()) {
      onReject(rejectionReason);
      setShowRejectInput(false);
      setRejectionReason('');
    } else if (!showRejectInput) {
      setShowRejectInput(true);
    } else {
      alert('Please enter a rejection reason');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={processing}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 inline-flex items-center gap-1 text-sm font-semibold rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
              request.status === 'paid' ? 'bg-green-100 text-green-800' :
              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-red-100 text-red-800'
            }`}>
              {request.status === 'pending' ? '⏳' :
               request.status === 'approved' ? '📋' :
               request.status === 'paid' ? '✅' :
               request.status === 'rejected' ? '❌' : '⚠️'} {request.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
            </span>
          </div>

          {/* Amount Details */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-bold text-lg">KES {request.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Platform Fee (1.5%)</p>
              <p className="font-semibold">KES {request.platformFee?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-blue-600">KES {request.totalAmount?.toFixed(2) || request.amount}</p>
            </div>
          </div>

          {/* Request Details */}
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{request.category}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium">{request.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Recipient</p>
              <p className="font-medium">{request.recipientName || 'N/A'}</p>
              <p className="text-sm text-gray-500">{request.recipientPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Requester</p>
              <p className="font-medium">{request.requesterId?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500">{request.requesterId?.email}</p>
            </div>
          </div>

          {request.receiptUrl && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Receipt</p>
              <a
                href={request.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View Receipt →
              </a>
            </div>
          )}

          {request.approvedAt && (
            <div className="text-sm text-gray-500">
              <p>Approved: {format(new Date(request.approvedAt), 'MMM d, yyyy h:mm a')}</p>
              {request.approverId?.name && (
                <p>By: {request.approverId.name}</p>
              )}
            </div>
          )}

          {request.paidAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <span className="font-semibold">✅ Paid</span> on {format(new Date(request.paidAt), 'MMM d, yyyy h:mm a')}
              </p>
              {request.mpesaReference && (
                <p className="text-xs text-green-600 mt-1">
                  M-Pesa Ref: {request.mpesaReference}
                </p>
              )}
            </div>
          )}

          {request.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <span className="font-semibold">Rejected</span>
              </p>
              <p className="text-sm text-red-700 mt-1">{request.rejectionReason}</p>
            </div>
          )}

          {request.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <span className="font-semibold">⚠️ Payment Failed</span>
              </p>
              {request.metadata?.b2cError && (
                <p className="text-sm text-red-700 mt-1">{request.metadata.b2cError}</p>
              )}
            </div>
          )}

          {/* Action Buttons for Pending Requests */}
          {request.status === 'pending' && (
            <div className="mt-6 border-t pt-4">
              {showRejectInput ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rejection Reason
                    </label>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      disabled={processing}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRejectInput(false);
                        setRejectionReason('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={processing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={processing || !rejectionReason.trim()}
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={onApprove}
                    disabled={processing}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </>
                    ) : (
                      'Approve & Send Payment'
                    )}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Reject Request
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3 text-center">
                Approving will send KES {request.amount.toLocaleString()} to {request.recipientPhone} via M-Pesa
              </p>
            </div>
          )}

          {/* Retry button for failed requests */}
          {request.status === 'failed' && (
            <div className="mt-6 border-t pt-4">
              <button
                onClick={onApprove}
                disabled={processing}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Retry Payment'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}