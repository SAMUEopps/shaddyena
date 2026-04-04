/*import Link from 'next/link';

export default function AuthRequired() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600 mb-6">Please log in to view order details.</p>
        <div className="flex gap-3 justify-center">
          <Link 
            href="/login"
            className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors"
          >
            Log In
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
import { ShieldAlert, LogIn, Home } from 'lucide-react';

export default function AuthRequired() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* Background Decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
        
        <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-8 text-center">
          {/* Icon */}
          <div className="inline-flex p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-2xl mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center animate-bounce-subtle">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
            Authentication Required
          </h3>
          <p className="text-[var(--color-text-muted)] mb-6">
            Please log in to view order details and access your account.
          </p>
          
          <div className="flex gap-3 justify-center">
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}