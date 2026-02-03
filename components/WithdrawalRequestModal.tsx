'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface AvailableFund {
  _id: string;
  orderId: string;
  netAmount: number;
  metadata: {
    isImmediateRelease?: boolean;
    percentage?: number;
    holdUntil?: string;
    breakdown?: {
      totalAmount: number;
      commission: number;
      vendorEarnings: number;
      immediateRelease: number;
      remaining20Percent: number;
    };
  };
}

interface WithdrawalRequestModalProps {
  selectedFunds: AvailableFund[];
  onClose: () => void;
  onSuccess: () => void;
  defaultMpesaNumber?: string;
}

export default function WithdrawalRequestModal({
  selectedFunds,
  onClose,
  onSuccess,
  defaultMpesaNumber = ''
}: WithdrawalRequestModalProps) {
  const [mpesaNumber, setMpesaNumber] = useState(defaultMpesaNumber);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = selectedFunds.reduce((sum, fund) => sum + fund.netAmount, 0);
  const ledgerEntryIds = selectedFunds.map(fund => fund._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mpesaNumber) {
      toast.error('Please enter your MPESA number');
      return;
    }

    if (mpesaNumber.length !== 10) {
      toast.error('MPESA number must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/vendor/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ledgerEntryIds,
          mpesaNumber,
          reason
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit withdrawal request');
      }

      toast.success(data.message || 'Withdrawal request submitted successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Request Withdrawal</h3>
          <p className="text-sm text-gray-500 mt-1">Withdraw your available funds to your MPESA account</p>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Selected Funds ({selectedFunds.length})</p>
            <p className="text-2xl font-bold text-[#bf2c7e]">
              KSh {totalAmount.toLocaleString()}
            </p>
          </div>
          
          {selectedFunds.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {selectedFunds.map((fund) => (
                <div key={fund._id} className="flex justify-between text-sm bg-white p-2 rounded border">
                  <div>
                    <span className="text-gray-600">Order {fund.orderId}</span>
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                      fund.metadata?.isImmediateRelease 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {fund.metadata?.isImmediateRelease ? 'Immediate (80%)' : 'Regular (20%)'}
                    </span>
                  </div>
                  <span className="font-medium">
                    KSh {fund.netAmount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MPESA Number *
            </label>
            <input
              type="tel"
              value={mpesaNumber}
              onChange={(e) => setMpesaNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="0712345678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter your MPESA number to receive payment (format: 0712345678)
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional reason for withdrawal..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
            />
          </div>

          {/* Terms */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Important Information</h4>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Withdrawal requests are processed within 24-48 hours</li>
                    <li>Immediate funds (80%) are processed faster</li>
                    <li>Regular funds (20%) may take up to 72 hours</li>
                    <li>You'll receive an SMS once payment is sent</li>
                    <li>Minimum withdrawal: KSh 100</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedFunds.length === 0}
              className="px-4 py-2.5 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Withdrawal Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}