'use client';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center border border-surface">
      <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-base sm:text-lg font-bold text-secondary mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted">{message}</p>
    </div>
  );
}