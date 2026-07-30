// app/SHD-COMPONENTS/components/PaymentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (amount: number, phoneNumber: string) => Promise<void>;
  isLoading: boolean;
  amount: number;
  title?: string;
  description?: string;
  purpose?: string;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onPayment, 
  isLoading,
  amount,
  title = 'Complete Payment',
  description = 'You will receive an M-Pesa STK Push on your phone to complete the payment.',
  purpose = 'payment'
}: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setPhoneNumber('');
      setError('');
    }
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., 254712345678 or +254712345678)');
      return;
    }

    setLocalLoading(true);
    try {
      await onPayment(amount, phoneNumber);
      setPhoneNumber('');
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to process ${purpose}`);
    } finally {
      setLocalLoading(false);
    }
  };

  const isProcessing = isLoading || localLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💳</span>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <p className="text-sm text-blue-700 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span>{description}</span>
          </p>
        </div>

        {/* Amount Display */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              KES {amount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Purpose:</span>
            <span className="text-xs font-medium text-gray-700 capitalize">{purpose}</span>
          </div>
        </div>

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
                disabled={isProcessing}
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

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>💳</span>
                  Pay KES {amount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}