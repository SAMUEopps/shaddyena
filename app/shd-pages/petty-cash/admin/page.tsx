// 'use client';

// import { useState, useEffect, SetStateAction } from 'react';

// import { format } from 'date-fns';
// import DepositPettyModal from '@/app/SHD-COMPONENTS/components/DepositPettyModal';

// // Types
// interface Budget {
//   _id: string;
//   allocatedAmount: number;
//   spentAmount: number;
//   platformFees: number;
//   remainingAmount: number;
//   weekStart: string;
//   weekEnd: string;
//   status: 'active' | 'closed' | 'overdrawn';
//   createdBy: {
//     name: string;
//     email: string;
//   };
// }

// interface ExpenseRequest {
//   _id: string;
//   amount: number;
//   platformFee: number;
//   totalAmount: number;
//   recipientPhone: string;
//   recipientName?: string;
//   category: string;
//   description: string;
//   status: 'pending' | 'approved' | 'rejected' | 'paid' | 'failed';
//   requesterId: {
//     name: string;
//     email: string;
//   };
//   approverId?: {
//     name: string;
//     email: string;
//   };
//   createdAt: string;
//   paidAt?: string;
//   receiptUrl?: string;
// }

// interface Organization {
//   _id: string;
//   name: string;
//   settings: {
//     weeklyBudget: number;
//     monthlyBudget: number;
//     approvalThresholds: {
//       admin: number;
//       director: number;
//     };
//     categories: Array<{
//       name: string;
//       maxAmount: number;
//       isActive: boolean;
//     }>;
//     platformFeePercentage: number;
//     feeBearer: string;
//   };
// }

// // ============ MODAL COMPONENTS ============

// // Budget Allocation Modal
// function BudgetAllocationModal({ onClose, onSubmit }: any) {
//   const [formData, setFormData] = useState({
//     amount: '',
//     weekStart: format(new Date(), 'yyyy-MM-dd'),
//     weekEnd: format(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
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
//       <div className="bg-white rounded-lg p-6 max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-4">Allocate New Budget</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Amount (KES)</label>
//               <input
//                 type="number"
//                 required
//                 min="0"
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({...formData, amount: e.target.value})}
//                 placeholder="Enter budget amount"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Week Start</label>
//               <input
//                 type="date"
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={formData.weekStart}
//                 onChange={(e) => setFormData({...formData, weekStart: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Week End</label>
//               <input
//                 type="date"
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={formData.weekEnd}
//                 onChange={(e) => setFormData({...formData, weekEnd: e.target.value})}
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
//               Allocate Budget
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // Request Modal Component
// function RequestModal({ onClose, onSubmit, budget, categories }: any) {
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
//               {budget && (
//                 <p className="text-xs text-gray-500 mt-1">
//                   Available: KES {budget.remainingAmount.toLocaleString()}
//                 </p>
//               )}
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
//                 {categories?.map((cat: any) => (
//                   <option key={cat.name} value={cat.name}>
//                     {cat.name} (Max: KES {cat.maxAmount.toLocaleString()})
//                   </option>
//                 ))}
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

// // Request Detail Modal
// function RequestDetailModal({ request, onClose, onApprove, onReject }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-2xl font-bold">Request Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Amount</p>
//               <p className="font-bold text-lg">KES {request.amount.toLocaleString()}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Platform Fee</p>
//               <p className="font-semibold">KES {request.platformFee.toLocaleString()}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Category</p>
//               <p>{request.category}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Status</p>
//               <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                 request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                 request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
//                 request.status === 'paid' ? 'bg-green-100 text-green-800' :
//                 'bg-red-100 text-red-800'
//               }`}>
//                 {request.status.toUpperCase()}
//               </span>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Description</p>
//             <p className="font-medium">{request.description}</p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Requester</p>
//               <p>{request.requesterId?.name || 'Unknown'}</p>
//               <p className="text-sm text-gray-500">{request.requesterId?.email}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Recipient</p>
//               <p>{request.recipientName || 'N/A'}</p>
//               <p className="text-sm text-gray-500">{request.recipientPhone}</p>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Created</p>
//             <p>{format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}</p>
//           </div>

//           {request.receiptUrl && (
//             <div>
//               <p className="text-sm text-gray-500 mb-2">Receipt</p>
//               <a
//                 href={request.receiptUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:text-blue-800"
//               >
//                 View Receipt →
//               </a>
//             </div>
//           )}

//           {request.approverId && (
//             <div>
//               <p className="text-sm text-gray-500">Approved By</p>
//               <p>{request.approverId?.name || 'Unknown'}</p>
//             </div>
//           )}

//           {request.mpesaReference && (
//             <div>
//               <p className="text-sm text-gray-500">M-Pesa Reference</p>
//               <p className="font-mono">{request.mpesaReference}</p>
//             </div>
//           )}
//         </div>

//         {request.status === 'pending' && (
//           <div className="mt-6 border-t pt-4">
//             <div className="flex gap-3">
//               <button
//                 onClick={onApprove}
//                 className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//               >
//                 Approve Request
//               </button>
//               <button
//                 onClick={() => {
//                   const reason = prompt('Rejection reason:');
//                   if (reason) onReject(reason);
//                 }}
//                 className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//               >
//                 Reject Request
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ============ TAB COMPONENTS ============

// // Overview Tab Component
// function OverviewTab({ budget, stats, requests }: any) {
//   const pendingRequests = requests.filter((r: any) => r.status === 'pending');

//   return (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm font-medium text-gray-500">Available Budget</h3>
//           <p className="text-2xl font-bold text-green-600">
//             KES {budget?.remainingAmount?.toLocaleString() || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             Allocated: KES {budget?.allocatedAmount?.toLocaleString() || 0}
//           </p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
//           <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
//           <p className="text-xs text-gray-400 mt-1">
//             Need your attention
//           </p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
//           <p className="text-2xl font-bold text-blue-600">
//             KES {stats.totalSpent?.toLocaleString() || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             Fees: KES {stats.totalFees?.toLocaleString() || 0}
//           </p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
//           <p className="text-2xl font-bold text-purple-600">{stats.totalRequests}</p>
//           <p className="text-xs text-gray-400 mt-1">
//             {stats.paidRequests} paid • {stats.rejectedRequests} rejected
//           </p>
//         </div>
//       </div>

//       {/* Progress */}
//       {budget && (
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="font-medium">Budget Utilization</h3>
//             <span className="text-sm font-medium">
//               {((budget.spentAmount / budget.allocatedAmount) * 100).toFixed(1)}%
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <div
//               className={`h-3 rounded-full transition-all ${
//                 budget.remainingAmount < budget.allocatedAmount * 0.2 
//                   ? 'bg-red-500' 
//                   : budget.remainingAmount < budget.allocatedAmount * 0.5 
//                   ? 'bg-yellow-500' 
//                   : 'bg-green-500'
//               }`}
//               style={{
//                 width: `${Math.min((budget.spentAmount / budget.allocatedAmount) * 100, 100)}%`
//               }}
//             />
//           </div>
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>0</span>
//             <span>{budget.weekStart ? format(new Date(budget.weekStart), 'MMM d') : ''}</span>
//             <span>{budget.allocatedAmount.toLocaleString()}</span>
//           </div>
//         </div>
//       )}

//       {/* Pending Requests */}
//       {pendingRequests.length > 0 && (
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-4 border-b">
//             <h3 className="font-semibold">Pending Approvals</h3>
//           </div>
//           <div className="divide-y">
//             {pendingRequests.slice(0, 5).map((request: any) => (
//               <div key={request._id} className="p-4 hover:bg-gray-50">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="font-medium">{request.description}</p>
//                     <p className="text-sm text-gray-500">
//                       {request.requesterId?.name || 'Unknown'} • {request.category}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       Recipient: {request.recipientName || request.recipientPhone}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold">KES {request.amount.toLocaleString()}</p>
//                     <button
//                       onClick={() => {/* Navigate to request detail */}}
//                       className="text-blue-600 text-sm hover:text-blue-800"
//                     >
//                       Review →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Updated BudgetTab component with DepositModal properly integrated
// function BudgetTab({ budget, onAllocate, onDeposit, isDepositing, onOpenDepositModal }: any) {
//   const [showAllocateModal, setShowAllocateModal] = useState(false);

//   return (
//     <div className="space-y-6">
//       {/* Current Budget */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex justify-between items-start mb-4">
//           <h3 className="text-lg font-semibold">Current Budget</h3>
//           <div className="flex gap-2">
//             <button
//               onClick={onOpenDepositModal}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//             >
//               <span>💰</span>
//               Add Funds
//             </button>
//             <button
//               onClick={() => setShowAllocateModal(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//             >
//               <span>📊</span>
//               Allocate New
//             </button>
//           </div>
//         </div>

//         {/* Budget display */}
//         {budget ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Allocated Amount</span>
//                   <span className="font-semibold">KES {budget.allocatedAmount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Spent</span>
//                   <span className="font-semibold text-orange-600">KES {budget.spentAmount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Platform Fees</span>
//                   <span className="font-semibold text-purple-600">KES {budget.platformFees.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between border-t pt-3">
//                   <span className="font-semibold">Remaining</span>
//                   <span className="font-bold text-green-600">KES {budget.remainingAmount.toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Week Start</span>
//                   <span>{format(new Date(budget.weekStart), 'MMM d, yyyy')}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Week End</span>
//                   <span>{format(new Date(budget.weekEnd), 'MMM d, yyyy')}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Status</span>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     budget.status === 'active' ? 'bg-green-100 text-green-800' :
//                     budget.status === 'closed' ? 'bg-gray-100 text-gray-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {budget.status.toUpperCase()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Created By</span>
//                   <span>{budget.createdBy?.name || 'Unknown'}</span>
//                 </div>
//                 {/* Display Budget ID for debugging */}
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Budget ID</span>
//                   <span className="text-xs font-mono text-gray-500">{budget._id}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-500">No active budget</p>
//             <button
//               onClick={() => setShowAllocateModal(true)}
//               className="mt-2 text-blue-600 hover:text-blue-800"
//             >
//               Create a budget →
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Budget Allocation Modal */}
//       {showAllocateModal && (
//         <BudgetAllocationModal
//           onClose={() => setShowAllocateModal(false)}
//           onSubmit={(data: any) => {
//             onAllocate(data);
//             setShowAllocateModal(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// // Requests Tab Component
// function RequestsTab({ requests, onApprove, onReject, onViewDetails }: any) {
//   const [filter, setFilter] = useState('all');

//   const filteredRequests = requests.filter((r: any) => {
//     if (filter === 'all') return true;
//     return r.status === filter;
//   });

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       approved: 'bg-blue-100 text-blue-800',
//       paid: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//       failed: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className="space-y-4">
//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-2">
//         {['all', 'pending', 'approved', 'paid', 'rejected', 'failed'].map((status) => (
//           <button
//             key={status}
//             onClick={() => setFilter(status)}
//             className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors
//               ${filter === status 
//                 ? 'bg-blue-600 text-white' 
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

//       {/* Requests List */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredRequests.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
//                     No requests found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredRequests.map((request: any) => (
//                   <tr key={request._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">{request.description}</div>
//                       <div className="text-xs text-gray-500">
//                         {format(new Date(request.createdAt), 'MMM d, HH:mm')}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">{request.requesterId?.name || 'Unknown'}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-semibold">KES {request.amount.toLocaleString()}</div>
//                       {request.platformFee > 0 && (
//                         <div className="text-xs text-gray-500">+ KES {request.platformFee.toLocaleString()} fee</div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="text-sm">{request.category}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
//                         {request.status.toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         {request.status === 'pending' && (
//                           <>
//                             <button
//                               onClick={() => onApprove(request._id)}
//                               className="text-green-600 hover:text-green-800 text-sm font-medium"
//                             >
//                               Approve
//                             </button>
//                             <button
//                               onClick={() => {
//                                 const reason = prompt('Rejection reason:');
//                                 if (reason) onReject(request._id, reason);
//                               }}
//                               className="text-red-600 hover:text-red-800 text-sm font-medium"
//                             >
//                               Reject
//                             </button>
//                           </>
//                         )}
//                         <button
//                           onClick={() => onViewDetails(request)}
//                           className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                         >
//                           View
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Settings Tab Component
// function SettingsTab({ organization, onUpdate }: any) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [settings, setSettings] = useState(organization?.settings || {});

//   const handleSave = async () => {
//     try {
//       const response = await fetch('/api/organization/settings', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(settings)
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         setIsEditing(false);
//         onUpdate();
//         alert('Settings updated successfully!');
//       }
//     } catch (error) {
//       console.error('Error updating settings:', error);
//       alert('Failed to update settings');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex justify-between items-start mb-6">
//           <h3 className="text-lg font-semibold">Organization Settings</h3>
//           <button
//             onClick={() => isEditing ? handleSave() : setIsEditing(true)}
//             className={`px-4 py-2 rounded-lg transition-colors ${
//               isEditing 
//                 ? 'bg-green-600 text-white hover:bg-green-700' 
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//           >
//             {isEditing ? 'Save Changes' : 'Edit Settings'}
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Weekly Budget</label>
//             <input
//               type="number"
//               disabled={!isEditing}
//               value={settings.weeklyBudget || ''}
//               onChange={(e) => setSettings({...settings, weeklyBudget: parseFloat(e.target.value)})}
//               className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//                 !isEditing && 'bg-gray-50'
//               }`}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Monthly Budget</label>
//             <input
//               type="number"
//               disabled={!isEditing}
//               value={settings.monthlyBudget || ''}
//               onChange={(e) => setSettings({...settings, monthlyBudget: parseFloat(e.target.value)})}
//               className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//                 !isEditing && 'bg-gray-50'
//               }`}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Admin Approval Limit</label>
//               <input
//                 type="number"
//                 disabled={!isEditing}
//                 value={settings.approvalThresholds?.admin || ''}
//                 onChange={(e) => setSettings({
//                   ...settings, 
//                   approvalThresholds: {
//                     ...settings.approvalThresholds,
//                     admin: parseFloat(e.target.value)
//                   }
//                 })}
//                 className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//                   !isEditing && 'bg-gray-50'
//                 }`}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Director Approval Limit</label>
//               <input
//                 type="number"
//                 disabled={!isEditing}
//                 value={settings.approvalThresholds?.director || ''}
//                 onChange={(e) => setSettings({
//                   ...settings,
//                   approvalThresholds: {
//                     ...settings.approvalThresholds,
//                     director: parseFloat(e.target.value)
//                   }
//                 })}
//                 className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//                   !isEditing && 'bg-gray-50'
//                 }`}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Platform Fee (%)</label>
//             <input
//               type="number"
//               disabled={!isEditing}
//               value={settings.platformFeePercentage || ''}
//               onChange={(e) => setSettings({...settings, platformFeePercentage: parseFloat(e.target.value)})}
//               className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//                 !isEditing && 'bg-gray-50'
//               }`}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Fee Bearer</label>
//             <select
//               disabled={!isEditing}
//               value={settings.feeBearer || 'payer'}
//               onChange={(e) => setSettings({...settings, feeBearer: e.target.value})}
//               className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//                 !isEditing && 'bg-gray-50'
//               }`}
//             >
//               <option value="payer">Payer (Adds to amount)</option>
//               <option value="recipient">Recipient (Deducts from amount)</option>
//               <option value="platform">Platform (Separate billing)</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Expense Categories</label>
//             <div className="space-y-2">
//               {settings.categories?.map((cat: any, index: number) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     disabled={!isEditing}
//                     value={cat.name}
//                     onChange={(e) => {
//                       const newCategories = [...settings.categories];
//                       newCategories[index].name = e.target.value;
//                       setSettings({...settings, categories: newCategories});
//                     }}
//                     className={`flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//                       !isEditing && 'bg-gray-50'
//                     }`}
//                   />
//                   <input
//                     type="number"
//                     disabled={!isEditing}
//                     value={cat.maxAmount}
//                     onChange={(e) => {
//                       const newCategories = [...settings.categories];
//                       newCategories[index].maxAmount = parseFloat(e.target.value);
//                       setSettings({...settings, categories: newCategories});
//                     }}
//                     className={`w-32 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//                       !isEditing && 'bg-gray-50'
//                     }`}
//                   />
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       disabled={!isEditing}
//                       checked={cat.isActive}
//                       onChange={(e) => {
//                         const newCategories = [...settings.categories];
//                         newCategories[index].isActive = e.target.checked;
//                         setSettings({...settings, categories: newCategories});
//                       }}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-600">Active</span>
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {isEditing && (
//               <button
//                 onClick={() => {
//                   setSettings({
//                     ...settings,
//                     categories: [...(settings.categories || []), { name: '', maxAmount: 0, isActive: true }]
//                   });
//                 }}
//                 className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
//               >
//                 + Add Category
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============ MAIN COMPONENT ============

// export default function PettyCashAdminDashboard() {
//   const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'requests' | 'settings'>('overview');
//   const [budget, setBudget] = useState<Budget | null>(null);
//   const [requests, setRequests] = useState<ExpenseRequest[]>([]);
//   const [organization, setOrganization] = useState<Organization | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showBudgetModal, setShowBudgetModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [showPettyDepositModal, setShowPettyDepositModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState<ExpenseRequest | null>(null);
//   const [isDepositing, setIsDepositing] = useState(false);
//   const [stats, setStats] = useState({
//     totalRequests: 0,
//     pendingRequests: 0,
//     approvedRequests: 0,
//     paidRequests: 0,
//     rejectedRequests: 0,
//     totalSpent: 0,
//     totalFees: 0
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch budget
//       const budgetRes = await fetch('/api/shd-api/api/petty-cash/budget');
//       const budgetData = await budgetRes.json();
//       if (budgetData.success) {
//         console.log('Fetched budget:', budgetData.budget);
//         setBudget(budgetData.budget);
//       } else {
//         console.warn('No budget found:', budgetData.error);
//         setBudget(null);
//       }

//       // Fetch requests
//       const requestsRes = await fetch('/api/shd-api/api/petty-cash/requests');
//       const requestsData = await requestsRes.json();
//       if (requestsData.success) {
//         setRequests(requestsData.requests);
//         calculateStats(requestsData.requests);
//       }

//       // Fetch organization
//       const orgRes = await fetch('/api/shd-api/api/organization');
//       const orgData = await orgRes.json();
//       if (orgData.success) {
//         setOrganization(orgData.organization);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (requests: ExpenseRequest[]) => {
//     const pending = requests.filter(r => r.status === 'pending');
//     const approved = requests.filter(r => r.status === 'approved');
//     const paid = requests.filter(r => r.status === 'paid');
//     const rejected = requests.filter(r => r.status === 'rejected');
    
//     setStats({
//       totalRequests: requests.length,
//       pendingRequests: pending.length,
//       approvedRequests: approved.length,
//       paidRequests: paid.length,
//       rejectedRequests: rejected.length,
//       totalSpent: paid.reduce((sum, r) => sum + r.amount, 0),
//       totalFees: paid.reduce((sum, r) => sum + r.platformFee, 0)
//     });
//   };

//   const handleApproveRequest = async (requestId: string) => {
//     try {
//       const response = await fetch(`/api/shd-api/api/petty-cash/requests/${requestId}/approve`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         await fetchData();
//         alert('Request approved and payment initiated!');
//       } else {
//         alert(data.error || 'Failed to approve request');
//       }
//     } catch (error) {
//       console.error('Error approving request:', error);
//       alert('Failed to approve request');
//     }
//   };

//   const handleRejectRequest = async (requestId: string, reason: string) => {
//     try {
//       const response = await fetch(`/api/shd-api/api/petty-cash/requests/${requestId}/reject`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ reason })
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         await fetchData();
//         alert('Request rejected successfully');
//       }
//     } catch (error) {
//       console.error('Error rejecting request:', error);
//       alert('Failed to reject request');
//     }
//   };

//   const handleCreateBudget = async (formData: any) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/petty-cash/budget', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           allocatedAmount: formData.amount,
//           weekStart: formData.weekStart,
//           weekEnd: formData.weekEnd
//         })
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         await fetchData();
//         setShowBudgetModal(false);
//         alert('Budget created successfully!');
//       } else {
//         alert(data.error || 'Failed to create budget');
//       }
//     } catch (error) {
//       console.error('Error creating budget:', error);
//       alert('Failed to create budget');
//     }
//   };

//   const handleDeposit = async (amount: number, phoneNumber: string) => {
//     setIsDepositing(true);
//     try {
//       const token = localStorage.getItem('token');
      
//       // Log what we're sending
//       console.log('=== DEPOSIT REQUEST ===');
//       console.log('Amount:', amount);
//       console.log('Phone:', phoneNumber);
//       console.log('Budget ID:', budget?._id);
//       console.log('Budget object:', budget);
      
//       // If no budget, try to find one
//       if (!budget?._id) {
//         console.warn('No budget ID available, trying to fetch active budget...');
//         // Try to fetch the active budget
//         const budgetRes = await fetch('/api/shd-api/api/petty-cash/budget', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         const budgetData = await budgetRes.json();
//         if (budgetData.success && budgetData.budget) {
//           console.log('Found budget via API:', budgetData.budget);
//           setBudget(budgetData.budget);
          
//           // Make the deposit with the found budget ID
//           const response = await fetch('/api/shd-api/api/petty-cash/deposit', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//               amount,
//               phoneNumber,
//               budgetId: budgetData.budget._id
//             })
//           });

//           const data = await response.json();
//           console.log('Deposit response:', data);
//           return data;
//         } else {
//           throw new Error('No active budget found. Please create a budget first.');
//         }
//       }

//       // Make the deposit with the current budget ID
//       const response = await fetch('/api/shd-api/api/petty-cash/deposit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           amount,
//           phoneNumber,
//           budgetId: budget._id
//         })
//       });

//       const data = await response.json();
//       console.log('Deposit response:', data);

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to initiate deposit');
//       }

//       return {
//         success: true,
//         checkoutRequestId: data.checkoutRequestId,
//         transactionId: data.transactionId,
//         message: data.message
//       };
//     } catch (error: any) {
//       console.error('Deposit error:', error);
//       return {
//         success: false,
//         message: error.message || 'Failed to process deposit'
//       };
//     } finally {
//       setIsDepositing(false);
//     }
//   };

//   const openDepositModal = () => {
//     console.log('Opening deposit modal with budget:', budget);
//     setShowPettyDepositModal(true);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Petty Cash Management</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               {organization?.name || 'Organization'} • {format(new Date(), 'MMMM d, yyyy')}
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={openDepositModal}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Funds
//             </button>
//             <button
//               onClick={() => setShowRequestModal(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               New Request
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-gray-200 mb-8">
//           <nav className="-mb-px flex space-x-8">
//             {['overview', 'budget', 'requests', 'settings'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab as any)}
//                 className={`
//                   py-2 px-1 border-b-2 font-medium text-sm capitalize
//                   ${activeTab === tab 
//                     ? 'border-blue-600 text-blue-600' 
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
//                 `}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Content */}
//         {activeTab === 'overview' && (
//           <OverviewTab 
//             budget={budget} 
//             stats={stats} 
//             requests={requests} 
//           />
//         )}

//         {activeTab === 'budget' && (
//           <BudgetTab 
//             budget={budget} 
//             onAllocate={handleCreateBudget}
//             onDeposit={handleDeposit}
//             isDepositing={isDepositing}
//             onOpenDepositModal={openDepositModal}
//           />
//         )}

//         {activeTab === 'requests' && (
//           <RequestsTab 
//             requests={requests}
//             onApprove={handleApproveRequest}
//             onReject={handleRejectRequest}
//             onViewDetails={(request: SetStateAction<ExpenseRequest | null>) => setSelectedRequest(request)}
//           />
//         )}

//         {activeTab === 'settings' && (
//           <SettingsTab 
//             organization={organization}
//             onUpdate={fetchData}
//           />
//         )}
//       </div>

//       {/* Deposit Modal - Rendered at root level */}
//       {showPettyDepositModal && (
//         <DepositPettyModal
//           isOpen={showPettyDepositModal}
//           onClose={() => {
//             setShowPettyDepositModal(false);
//             // Refresh data after modal closes
//             fetchData();
//           }}
//           onDeposit={handleDeposit}
//           isLoading={isDepositing}
//           budgetId={budget?._id}
//         />
//       )}

//       {/* Other Modals */}
//       {showBudgetModal && (
//         <BudgetAllocationModal
//           onClose={() => setShowBudgetModal(false)}
//           onSubmit={handleCreateBudget}
//         />
//       )}

//       {showRequestModal && (
//         <RequestModal
//           onClose={() => setShowRequestModal(false)}
//           onSubmit={async (data: any) => {
//             const token = localStorage.getItem('token');
//             const response = await fetch('/api/shd-api/api/petty-cash/requests', {
//               method: 'POST',
//               headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//               },
//               body: JSON.stringify(data)
//             });
//             const result = await response.json();
//             if (result.success) {
//               await fetchData();
//               setShowRequestModal(false);
//               alert('Request created successfully!');
//             } else {
//               alert(result.error || 'Failed to create request');
//             }
//           }}
//           budget={budget}
//           categories={organization?.settings.categories || []}
//         />
//       )}

//       {selectedRequest && (
//         <RequestDetailModal
//           request={selectedRequest}
//           onClose={() => setSelectedRequest(null)}
//           onApprove={() => {
//             handleApproveRequest(selectedRequest._id);
//             setSelectedRequest(null);
//           }}
//           onReject={(reason: string) => {
//             handleRejectRequest(selectedRequest._id, reason);
//             setSelectedRequest(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { format } from 'date-fns';
import DepositPettyModal from '@/app/SHD-COMPONENTS/components/DepositPettyModal';

// Types
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
  receiptUrl?: string;
}

interface Organization {
  _id: string;
  name: string;
  settings: {
    weeklyBudget: number;
    monthlyBudget: number;
    approvalThresholds: {
      admin: number;
      director: number;
    };
    categories: Array<{
      name: string;
      maxAmount: number;
      isActive: boolean;
    }>;
    platformFeePercentage: number;
    feeBearer: string;
  };
}

// ============ MODAL COMPONENTS ============

// Budget Allocation Modal
function BudgetAllocationModal({ onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    amount: '',
    weekStart: format(new Date(), 'yyyy-MM-dd'),
    weekEnd: format(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Allocate New Budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (KES)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="Enter budget amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Week Start</label>
              <input
                type="date"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={formData.weekStart}
                onChange={(e) => setFormData({...formData, weekStart: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Week End</label>
              <input
                type="date"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={formData.weekEnd}
                onChange={(e) => setFormData({...formData, weekEnd: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Allocate Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Request Modal Component
function RequestModal({ onClose, onSubmit, budget, categories }: any) {
  const [formData, setFormData] = useState({
    amount: '',
    recipientPhone: '',
    recipientName: '',
    category: '',
    description: '',
    receiptUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">New Expense Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (KES)</label>
              <input
                type="number"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                max={budget?.remainingAmount}
              />
              {budget && (
                <p className="text-xs text-gray-500 mt-1">
                  Available: KES {budget.remainingAmount.toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Phone</label>
              <input
                type="tel"
                required
                className="w-full border rounded-lg px-3 py-2"
                placeholder="254700000000"
                value={formData.recipientPhone}
                onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.recipientName}
                onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                required
                className="w-full border rounded-lg px-3 py-2"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select category</option>
                {categories?.map((cat: any) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} (Max: KES {cat.maxAmount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Receipt URL (optional)</label>
              <input
                type="url"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.receiptUrl}
                onChange={(e) => setFormData({...formData, receiptUrl: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Request Detail Modal
function RequestDetailModal({ request, onClose, onApprove, onReject }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-bold text-lg">KES {request.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Platform Fee</p>
              <p className="font-semibold">KES {request.platformFee.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p>{request.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                request.status === 'paid' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium">{request.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Requester</p>
              <p>{request.requesterId?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500">{request.requesterId?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recipient</p>
              <p>{request.recipientName || 'N/A'}</p>
              <p className="text-sm text-gray-500">{request.recipientPhone}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p>{format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}</p>
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

          {request.approverId && (
            <div>
              <p className="text-sm text-gray-500">Approved By</p>
              <p>{request.approverId?.name || 'Unknown'}</p>
            </div>
          )}

          {request.mpesaReference && (
            <div>
              <p className="text-sm text-gray-500">M-Pesa Reference</p>
              <p className="font-mono">{request.mpesaReference}</p>
            </div>
          )}
        </div>

        {request.status === 'pending' && (
          <div className="mt-6 border-t pt-4">
            <div className="flex gap-3">
              <button
                onClick={onApprove}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Approve Request
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Rejection reason:');
                  if (reason) onReject(reason);
                }}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Reject Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ TAB COMPONENTS ============

// Overview Tab Component
function OverviewTab({ budget, stats, requests }: any) {
  const pendingRequests = requests.filter((r: any) => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Available Budget</h3>
          <p className="text-2xl font-bold text-green-600">
            KES {budget?.remainingAmount?.toLocaleString() || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Allocated: KES {budget?.allocatedAmount?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
          <p className="text-xs text-gray-400 mt-1">
            Need your attention
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
          <p className="text-2xl font-bold text-blue-600">
            KES {stats.totalSpent?.toLocaleString() || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Fees: KES {stats.totalFees?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalRequests}</p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.paidRequests} paid • {stats.rejectedRequests} rejected
          </p>
        </div>
      </div>

      {/* Progress */}
      {budget && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Budget Utilization</h3>
            <span className="text-sm font-medium">
              {((budget.spentAmount / budget.allocatedAmount) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                budget.remainingAmount < budget.allocatedAmount * 0.2 
                  ? 'bg-red-500' 
                  : budget.remainingAmount < budget.allocatedAmount * 0.5 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min((budget.spentAmount / budget.allocatedAmount) * 100, 100)}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>{budget.weekStart ? format(new Date(budget.weekStart), 'MMM d') : ''}</span>
            <span>{budget.allocatedAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Pending Approvals</h3>
          </div>
          <div className="divide-y">
            {pendingRequests.slice(0, 5).map((request: any) => (
              <div key={request._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{request.description}</p>
                    <p className="text-sm text-gray-500">
                      {request.requesterId?.name || 'Unknown'} • {request.category}
                    </p>
                    <p className="text-xs text-gray-400">
                      Recipient: {request.recipientName || request.recipientPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">KES {request.amount.toLocaleString()}</p>
                    <button
                      onClick={() => {/* Navigate to request detail */}}
                      className="text-blue-600 text-sm hover:text-blue-800"
                    >
                      Review →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Updated BudgetTab component with DepositModal properly integrated
function BudgetTab({ budget, onAllocate, onDeposit, isDepositing, onOpenDepositModal }: any) {
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Current Budget */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Current Budget</h3>
          <div className="flex gap-2">
            <button
              onClick={onOpenDepositModal}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>💰</span>
              Add Funds
            </button>
            <button
              onClick={() => setShowAllocateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>📊</span>
              Allocate New
            </button>
          </div>
        </div>

        {/* Budget display */}
        {budget ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Allocated Amount</span>
                  <span className="font-semibold">KES {budget.allocatedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Spent</span>
                  <span className="font-semibold text-orange-600">KES {budget.spentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform Fees</span>
                  <span className="font-semibold text-purple-600">KES {budget.platformFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Remaining</span>
                  <span className="font-bold text-green-600">KES {budget.remainingAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Week Start</span>
                  <span>{format(new Date(budget.weekStart), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Week End</span>
                  <span>{format(new Date(budget.weekEnd), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    budget.status === 'active' ? 'bg-green-100 text-green-800' :
                    budget.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {budget.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created By</span>
                  <span>{budget.createdBy?.name || 'Unknown'}</span>
                </div>
                {/* Display Budget ID for debugging */}
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget ID</span>
                  <span className="text-xs font-mono text-gray-500">{budget._id}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No active budget</p>
            <button
              onClick={() => setShowAllocateModal(true)}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Create a budget →
            </button>
          </div>
        )}
      </div>

      {/* Budget Allocation Modal */}
      {showAllocateModal && (
        <BudgetAllocationModal
          onClose={() => setShowAllocateModal(false)}
          onSubmit={(data: any) => {
            onAllocate(data);
            setShowAllocateModal(false);
          }}
        />
      )}
    </div>
  );
}

// Requests Tab Component
function RequestsTab({ requests, onApprove, onReject, onViewDetails }: any) {
  const [filter, setFilter] = useState('all');

  const filteredRequests = requests.filter((r: any) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'paid', 'rejected', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors
              ${filter === status 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request: any) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.description}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(request.createdAt), 'MMM d, HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.requesterId?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold">KES {request.amount.toLocaleString()}</div>
                      {request.platformFee > 0 && (
                        <div className="text-xs text-gray-500">+ KES {request.platformFee.toLocaleString()} fee</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{request.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onApprove(request._id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) onReject(request._id, reason);
                              }}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onViewDetails(request)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab({ organization, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState(organization?.settings || {});

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/organization/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        onUpdate();
        alert('Settings updated successfully!');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-semibold">Organization Settings</h3>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Settings'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Weekly Budget</label>
            <input
              type="number"
              disabled={!isEditing}
              value={settings.weeklyBudget || ''}
              onChange={(e) => setSettings({...settings, weeklyBudget: parseFloat(e.target.value)})}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                !isEditing && 'bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Budget</label>
            <input
              type="number"
              disabled={!isEditing}
              value={settings.monthlyBudget || ''}
              onChange={(e) => setSettings({...settings, monthlyBudget: parseFloat(e.target.value)})}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                !isEditing && 'bg-gray-50'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Approval Limit</label>
              <input
                type="number"
                disabled={!isEditing}
                value={settings.approvalThresholds?.admin || ''}
                onChange={(e) => setSettings({
                  ...settings, 
                  approvalThresholds: {
                    ...settings.approvalThresholds,
                    admin: parseFloat(e.target.value)
                  }
                })}
                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Director Approval Limit</label>
              <input
                type="number"
                disabled={!isEditing}
                value={settings.approvalThresholds?.director || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  approvalThresholds: {
                    ...settings.approvalThresholds,
                    director: parseFloat(e.target.value)
                  }
                })}
                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Platform Fee (%)</label>
            <input
              type="number"
              disabled={!isEditing}
              value={settings.platformFeePercentage || ''}
              onChange={(e) => setSettings({...settings, platformFeePercentage: parseFloat(e.target.value)})}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                !isEditing && 'bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fee Bearer</label>
            <select
              disabled={!isEditing}
              value={settings.feeBearer || 'payer'}
              onChange={(e) => setSettings({...settings, feeBearer: e.target.value})}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                !isEditing && 'bg-gray-50'
              }`}
            >
              <option value="payer">Payer (Adds to amount)</option>
              <option value="recipient">Recipient (Deducts from amount)</option>
              <option value="platform">Platform (Separate billing)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expense Categories</label>
            <div className="space-y-2">
              {settings.categories?.map((cat: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={cat.name}
                    onChange={(e) => {
                      const newCategories = [...settings.categories];
                      newCategories[index].name = e.target.value;
                      setSettings({...settings, categories: newCategories});
                    }}
                    className={`flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      !isEditing && 'bg-gray-50'
                    }`}
                  />
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={cat.maxAmount}
                    onChange={(e) => {
                      const newCategories = [...settings.categories];
                      newCategories[index].maxAmount = parseFloat(e.target.value);
                      setSettings({...settings, categories: newCategories});
                    }}
                    className={`w-32 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      !isEditing && 'bg-gray-50'
                    }`}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      checked={cat.isActive}
                      onChange={(e) => {
                        const newCategories = [...settings.categories];
                        newCategories[index].isActive = e.target.checked;
                        setSettings({...settings, categories: newCategories});
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Active</span>
                  </label>
                </div>
              ))}
            </div>
            {isEditing && (
              <button
                onClick={() => {
                  setSettings({
                    ...settings,
                    categories: [...(settings.categories || []), { name: '', maxAmount: 0, isActive: true }]
                  });
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Category
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function PettyCashAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'requests' | 'settings'>('overview');
  const [budget, setBudget] = useState<Budget | null>(null);
  const [requests, setRequests] = useState<ExpenseRequest[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPettyDepositModal, setShowPettyDepositModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExpenseRequest | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    paidRequests: 0,
    rejectedRequests: 0,
    totalSpent: 0,
    totalFees: 0
  });

  // Define API base path - FIXED: removed /shd-api
  const API_BASE = '/api/shd-api/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      // Fetch budget - FIXED PATH
      const budgetRes = await fetch(`${API_BASE}/petty-cash/budget`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();
        if (budgetData.success) {
          console.log('Fetched budget:', budgetData.budget);
          setBudget(budgetData.budget);
        } else {
          console.warn('No budget found:', budgetData.error);
          setBudget(null);
        }
      } else {
        console.warn('Budget API returned:', budgetRes.status);
        setBudget(null);
      }

      // Fetch requests - FIXED PATH
      const requestsRes = await fetch(`${API_BASE}/petty-cash/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        if (requestsData.success) {
          setRequests(requestsData.requests);
          calculateStats(requestsData.requests);
        }
      }

      // Fetch organization - FIXED PATH
      const orgRes = await fetch(`${API_BASE}/organization`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (orgRes.ok) {
        const orgData = await orgRes.json();
        if (orgData.success) {
          setOrganization(orgData.organization);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (requests: ExpenseRequest[]) => {
    const pending = requests.filter(r => r.status === 'pending');
    const approved = requests.filter(r => r.status === 'approved');
    const paid = requests.filter(r => r.status === 'paid');
    const rejected = requests.filter(r => r.status === 'rejected');
    
    setStats({
      totalRequests: requests.length,
      pendingRequests: pending.length,
      approvedRequests: approved.length,
      paidRequests: paid.length,
      rejectedRequests: rejected.length,
      totalSpent: paid.reduce((sum, r) => sum + r.amount, 0),
      totalFees: paid.reduce((sum, r) => sum + r.platformFee, 0)
    });
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/petty-cash/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert('Request approved and payment initiated!');
      } else {
        alert(data.error || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/petty-cash/requests/${requestId}/reject`, {
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
        alert('Request rejected successfully');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  const handleCreateBudget = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      
      // FIXED PATH
      const response = await fetch(`${API_BASE}/petty-cash/budget`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          allocatedAmount: formData.amount,
          weekStart: formData.weekStart,
          weekEnd: formData.weekEnd
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        await fetchData();
        setShowBudgetModal(false);
        alert('Budget created successfully!');
      } else {
        alert(data.error || 'Failed to create budget');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Failed to create budget');
    }
  };

  const handleDeposit = async (amount: number, phoneNumber: string) => {
    setIsDepositing(true);
    try {
      const token = localStorage.getItem('token');
      
      console.log('=== DEPOSIT REQUEST ===');
      console.log('Amount:', amount);
      console.log('Phone:', phoneNumber);
      console.log('Budget ID:', budget?._id);
      
      if (!budget?._id) {
        console.warn('No budget ID available, trying to fetch active budget...');
        const budgetRes = await fetch(`${API_BASE}/petty-cash/budget`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (budgetRes.ok) {
          const budgetData = await budgetRes.json();
          if (budgetData.success && budgetData.budget) {
            console.log('Found budget via API:', budgetData.budget);
            setBudget(budgetData.budget);
            
            const response = await fetch(`${API_BASE}/petty-cash/deposit`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                amount,
                phoneNumber,
                budgetId: budgetData.budget._id
              })
            });

            const data = await response.json();
            console.log('Deposit response:', data);
            return data;
          }
        }
        
        throw new Error('No active budget found. Please create a budget first.');
      }

      // FIXED PATH
      const response = await fetch(`${API_BASE}/petty-cash/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          phoneNumber,
          budgetId: budget._id
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Deposit response:', data);

      return {
        success: true,
        checkoutRequestId: data.checkoutRequestId,
        transactionId: data.transactionId,
        message: data.message
      };
    } catch (error: any) {
      console.error('Deposit error:', error);
      return {
        success: false,
        message: error.message || 'Failed to process deposit'
      };
    } finally {
      setIsDepositing(false);
    }
  };

  const openDepositModal = () => {
    console.log('Opening deposit modal with budget:', budget);
    setShowPettyDepositModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Petty Cash Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              {organization?.name || 'Organization'} • {format(new Date(), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openDepositModal}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Funds
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Request
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'budget', 'requests', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm capitalize
                  ${activeTab === tab 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            budget={budget} 
            stats={stats} 
            requests={requests} 
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTab 
            budget={budget} 
            onAllocate={handleCreateBudget}
            onDeposit={handleDeposit}
            isDepositing={isDepositing}
            onOpenDepositModal={openDepositModal}
          />
        )}

        {activeTab === 'requests' && (
          <RequestsTab 
            requests={requests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onViewDetails={(request: SetStateAction<ExpenseRequest | null>) => setSelectedRequest(request)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab 
            organization={organization}
            onUpdate={fetchData}
          />
        )}
      </div>

      {/* Deposit Modal - Rendered at root level */}
      {showPettyDepositModal && (
        <DepositPettyModal
          isOpen={showPettyDepositModal}
          onClose={() => {
            setShowPettyDepositModal(false);
            fetchData();
          }}
          onDeposit={handleDeposit}
          isLoading={isDepositing}
          budgetId={budget?._id}
        />
      )}

      {/* Other Modals */}
      {showBudgetModal && (
        <BudgetAllocationModal
          onClose={() => setShowBudgetModal(false)}
          onSubmit={handleCreateBudget}
        />
      )}

      {showRequestModal && (
        <RequestModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={async (data: any) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/petty-cash/requests`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
              await fetchData();
              setShowRequestModal(false);
              alert('Request created successfully!');
            } else {
              alert(result.error || 'Failed to create request');
            }
          }}
          budget={budget}
          categories={organization?.settings.categories || []}
        />
      )}

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => {
            handleApproveRequest(selectedRequest._id);
            setSelectedRequest(null);
          }}
          onReject={(reason: string) => {
            handleRejectRequest(selectedRequest._id, reason);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}