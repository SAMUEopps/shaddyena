// app/SHD-COMPONENTS/components/DepositModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, phoneNumber: string) => Promise<{
    success: boolean;
    message?: string;
    checkoutRequestId?: string;
    transactionId?: string;
  }>;
  isLoading: boolean;
  budgetId?: string;
}

export default function DepositPettyModal({ 
  isOpen, 
  onClose, 
  onDeposit, 
  isLoading,
  budgetId
}: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkStatus, setStkStatus] = useState<'idle' | 'sent' | 'pending' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  if (!isOpen) return null;

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[+\s]/g, '');
    return /^254[0-9]{9}$/.test(cleanPhone);
  };

  const formatPhoneNumber = (value: string): string => {
    let cleaned = value.replace(/[^0-9+]/g, '');
    
    if (cleaned.startsWith('0') && cleaned.length > 1) {
      cleaned = '254' + cleaned.substring(1);
    }
    
    if (!cleaned.startsWith('+') && !cleaned.startsWith('254') && cleaned.length > 0) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const checkTransactionStatus = async () => {
    if (!transactionId && !checkoutRequestId) return;

    try {
      const url = `/api/petty-cash/deposit?${transactionId ? `transactionId=${transactionId}` : `checkoutRequestId=${checkoutRequestId}`}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (data.status === 'success') {
          setStkStatus('success');
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
          // Auto close after success
          setTimeout(() => {
            handleClose();
          }, 3000);
        } else if (data.status === 'failed') {
          setStkStatus('failed');
          setError('Transaction failed. Please try again.');
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
        }
      }
    } catch (err) {
      console.error('Status check failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStkStatus('idle');

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < 1) {
      setError('Please enter a valid amount (minimum KSh 1)');
      return;
    }

    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., 254712345678 or +254712345678)');
      return;
    }

    setIsProcessing(true);
    setStkStatus('sent');

    try {
      const result = await onDeposit(depositAmount, phoneNumber);
      
      if (result.success) {
        setStkStatus('pending');
        setCheckoutRequestId(result.checkoutRequestId || '');
        setTransactionId(result.transactionId || '');
        
        // Start checking status every 5 seconds
        const interval = setInterval(checkTransactionStatus, 5000);
        setStatusCheckInterval(interval);
        
        // Also check immediately
        setTimeout(checkTransactionStatus, 2000);
      } else {
        setStkStatus('failed');
        setError(result.message || 'Failed to initiate STK push');
      }
    } catch (err: any) {
      setStkStatus('failed');
      setError(err.message || 'Failed to process deposit');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
      setAmount('');
      setPhoneNumber('');
      setError('');
      setStkStatus('idle');
      setCheckoutRequestId('');
      setTransactionId('');
      onClose();
    }
  };

  const renderStatusMessage = () => {
    switch (stkStatus) {
      case 'sent':
        return (
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200 animate-pulse">
            <p className="text-yellow-800 flex items-center gap-2">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Sending STK push to your phone...</span>
            </p>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <p className="text-blue-800 flex items-center gap-2">
              <Clock className="w-5 h-5 animate-spin" />
              <span>STK push sent! Please check your phone and enter your M-Pesa PIN.</span>
            </p>
            {checkoutRequestId && (
              <p className="text-xs text-blue-600 mt-2">
                Reference: {checkoutRequestId}
              </p>
            )}
            <div className="flex gap-3 mt-3">
              <button
                onClick={checkTransactionStatus}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <span>🔄</span> Check Status
              </button>
              <button
                onClick={handleClose}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
            <p className="text-green-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Deposit successful! Funds have been added to your budget.</span>
            </p>
          </div>
        );
      case 'failed':
        return (
          <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-200">
            <p className="text-red-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Failed to process deposit. Please try again.</span>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <h2 className="text-2xl font-bold text-gray-900">Deposit Money</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            disabled={isProcessing || isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <p className="text-sm text-blue-700 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span>
              You will receive an M-Pesa STK Push on your phone to complete the deposit.
              Please ensure your phone is ready and has sufficient balance.
            </span>
          </p>
        </div>

        {/* Status Messages */}
        {renderStatusMessage()}

        {/* Only show form if not pending or success */}
        {stkStatus !== 'pending' && stkStatus !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  📱
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  required
                  disabled={isLoading || isProcessing}
                  placeholder="254712345678 or +254712345678"
                  className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-gray-500">
                  Enter the phone number to receive M-Pesa prompt
                </p>
                {phoneNumber && validatePhoneNumber(phoneNumber) && (
                  <span className="text-xs text-green-600">✓ Valid number</span>
                )}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Examples: 254712345678, +254712345678, 0712345678
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount <span className="text-gray-400">(KSh)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  KSh
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="1"
                  required
                  disabled={isLoading || isProcessing}
                  placeholder="Enter amount"
                  className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pl-16 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Minimum deposit: KSh 1
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading || isProcessing}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending STK...
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    Pay with M-Pesa
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Success/Pending actions */}
        {stkStatus === 'success' && (
          <button
            onClick={handleClose}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all duration-200"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}