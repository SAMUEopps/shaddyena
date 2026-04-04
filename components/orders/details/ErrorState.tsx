/*import Link from 'next/link';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Order</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/?tab=orders"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}*/

'use client';

import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* Background Decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-8 text-center">
          {/* Icon */}
          <div className="inline-flex p-4 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-2xl mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-amber-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
            Error Loading Order
          </h3>
          <p className="text-[var(--color-text-muted)] mb-4">
            {error}
          </p>
          
          <div className="flex gap-3 justify-center flex-wrap">
            <button 
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <Link 
              href="/?tab=orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </Link>
          </div>
          
          {/* Help Text */}
          <p className="text-xs text-[var(--color-text-muted)] mt-6">
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}