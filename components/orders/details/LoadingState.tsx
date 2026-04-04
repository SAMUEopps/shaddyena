/*interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e] mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}*/

'use client';

import { Loader2, Package } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="relative">
        {/* Animated Background */}
        <div className="absolute -inset-10 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary-soft)]/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="relative text-center">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl flex items-center justify-center mx-auto animate-bounce-subtle">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          
          {/* Spinner */}
          <div className="relative mb-4">
            <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mx-auto" />
          </div>
          
          {/* Loading Text */}
          <p className="text-[var(--color-text-muted)] font-medium">
            {message}
          </p>
          
          {/* Animated Dots */}
          <div className="flex justify-center gap-1 mt-3">
            <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse-slow" style={{ animationDelay: '0s' }} />
            <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse-slow" style={{ animationDelay: '0.3s' }} />
            <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse-slow" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}