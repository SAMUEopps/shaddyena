"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface WithdrawalRequest {
  _id: string;
  vendorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName?: string;
  };
  vendor: {
    firstName: string;
    lastName: string;
    businessName?: string;
    mpesaNumber?: string;
  };
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminWithdrawalRequestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    fetchRequests();
  }, [user, filter]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/earnings/admin/withdrawal-requests?status=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'APPROVE' | 'REJECT' | 'PROCESS') => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/earnings/admin/withdrawal-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          action,
          notes: notes || undefined
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Request ${action.toLowerCase()}d successfully!`);
        setSelectedRequest(null);
        setNotes('');
        fetchRequests();
      } else {
        alert(data.error || `Failed to ${action.toLowerCase()} request`);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      alert('Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PROCESSED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
  
    <div className="p-8 bg-gray-50 min-h-screen flex-grow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Withdrawal Requests Management</h1>
      
      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      
      {/* Requests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Vendor</th>
                <th className="py-3 px-4 text-left text-gray-600">Business</th>
                <th className="py-3 px-4 text-left text-gray-600">M-Pesa</th>
                <th className="py-3 px-4 text-left text-gray-600">Amount</th>
                <th className="py-3 px-4 text-left text-gray-600">Status</th>
                <th className="py-3 px-4 text-left text-gray-600">Date</th>
                <th className="py-3 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className="py-3 px-4">
                    <div>
                      {/*<p className="font-medium">
                        {request.vendor.firstName} {request.vendor.lastName}
                      </p>*/}
                      <p className="text-sm text-gray-500">{request.vendorId?.email}</p>
                    </div>
                  </td>
                  {/*<td className="py-3 px-4">
                    {request.vendor.businessName || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {request.vendor.mpesaNumber || 'Not set'}
                  </td>*/}
                  <td className="py-3 px-4 font-bold text-green-700">
                    KSh {request.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {request.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRequest(request._id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                        >
                          Manage
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Action Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Process Withdrawal Request</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Admin Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                rows={3}
                placeholder="Add notes about this withdrawal request..."
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                disabled={isProcessing}
              >
                Cancel
              </button>
              
              <button
                onClick={() => handleAction(selectedRequest, 'REJECT')}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Reject'}
              </button>
              
              <button
                onClick={() => handleAction(selectedRequest, 'APPROVE')}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
              
              <button
                onClick={() => handleAction(selectedRequest, 'PROCESS')}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Mark as Processed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  
  );
}