'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Withdrawal {
  _id: string;
  orderId: string;
  amount: number;
  vendorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName?: string;
  };
  vendor: {
    mpesaNumber: string;
    name: string;
  };
  type: 'IMMEDIATE' | 'REGULAR';
  reason?: string;
}

interface WithdrawalActionModalProps {
  withdrawal: Withdrawal;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WithdrawalActionModal({
  withdrawal,
  onClose,
  onSuccess
}: WithdrawalActionModalProps) {
  const [action, setAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [mpesaReceipt, setMpesaReceipt] = useState('');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (action === 'REJECT' && !rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    if (action === 'APPROVE' && !mpesaReceipt) {
      toast.error('Please provide M-PESA receipt number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId: withdrawal._id,
          action,
          notes,
          mpesaReceipt: action === 'APPROVE' ? mpesaReceipt : undefined,
          rejectionReason: action === 'REJECT' ? rejectionReason : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process withdrawal');
      }

      toast.success(data.message || 'Withdrawal processed successfully');
      onSuccess();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Process Withdrawal</h3>
          <p className="text-sm text-gray-600 mt-1">
            Order: {withdrawal.orderId} | Vendor: {withdrawal.vendorId.businessName || `${withdrawal.vendorId.firstName} ${withdrawal.vendorId.lastName}`}
          </p>
        </div>

        {/* Withdrawal Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Amount</p>
            <p className="text-2xl font-bold text-[#bf2c7e]">
              KSh {withdrawal.amount.toLocaleString()}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">MPESA Number</p>
              <p className="font-medium">{withdrawal.vendor.mpesaNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <span className={`px-2 py-1 text-xs rounded-full ${
                withdrawal.type === 'IMMEDIATE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {withdrawal.type}
              </span>
            </div>
          </div>

          {withdrawal.reason && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Vendor Reason</p>
              <p className="text-sm text-gray-900">{withdrawal.reason}</p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Action Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Action
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="action"
                  value="APPROVE"
                  checked={action === 'APPROVE'}
                  onChange={() => setAction('APPROVE')}
                  className="h-4 w-4 text-[#bf2c7e] focus:ring-[#bf2c7e]"
                />
                <span className="ml-2 text-sm text-gray-900">Approve & Pay</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="action"
                  value="REJECT"
                  checked={action === 'REJECT'}
                  onChange={() => setAction('REJECT')}
                  className="h-4 w-4 text-red-600 focus:ring-red-600"
                />
                <span className="ml-2 text-sm text-gray-900">Reject</span>
              </label>
            </div>
          </div>

          {/* M-PESA Receipt (for approval) */}
          {action === 'APPROVE' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                M-PESA Receipt Number *
              </label>
              <input
                type="text"
                value={mpesaReceipt}
                onChange={(e) => setMpesaReceipt(e.target.value)}
                placeholder="RF45GHJ89K"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
                required={action === 'APPROVE'}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the M-PESA transaction receipt number
              </p>
            </div>
          )}

          {/* Rejection Reason (for rejection) */}
          {action === 'REJECT' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide reason for rejection..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
                required={action === 'REJECT'}
              />
            </div>
          )}

          {/* Admin Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                action === 'APPROVE'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Processing...' : action === 'APPROVE' ? 'Approve & Pay' : 'Reject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}