'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading dashboard...' }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted font-medium">{message}</p>
      </div>
    </div>
  );
}