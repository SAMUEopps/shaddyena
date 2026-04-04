/*import Link from 'next/link';

interface OrderNotFoundProps {
  isRider?: boolean;
}

export default function OrderNotFound({ isRider = false }: OrderNotFoundProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
        <p className="text-gray-600 mb-6">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <div className="flex gap-3 justify-center">
          <Link 
            href={isRider ? "/delivery/dashboard" : "/?tab=orders"}
            className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors inline-block"
          >
            {isRider ? "Back to Dashboard" : "Back to Orders"}
          </Link>
          <Link 
            href="/"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}*/

'use client';

import Link from 'next/link';
import { PackageX, ArrowLeft, Home, Truck } from 'lucide-react';

interface OrderNotFoundProps {
  isRider?: boolean;
}

export default function OrderNotFound({ isRider = false }: OrderNotFoundProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* Background Decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
        
        <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-8 text-center">
          {/* Icon */}
          <div className="inline-flex p-4 bg-gradient-to-r from-gray-500/10 to-slate-500/10 rounded-2xl mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full flex items-center justify-center">
              <PackageX className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
            Order Not Found
          </h3>
          <p className="text-[var(--color-text-muted)] mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          
          <div className="flex gap-3 justify-center flex-wrap">
            <Link 
              href={isRider ? "/delivery/dashboard" : "/?tab=orders"}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              {isRider ? <Truck className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isRider ? "Back to Dashboard" : "Back to Orders"}</span>
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          </div>
          
          {/* Help Suggestion */}
          <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)]">
              Need help? <Link href="/contact" className="text-[var(--color-primary)] hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}