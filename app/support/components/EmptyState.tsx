interface EmptyStateProps {
  icon: string;
  message: string;
}

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-surface">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-muted text-lg">{message}</p>
    </div>
  );
}