'use client';

interface MessageBannerProps {
  type: 'success' | 'error';
  text: string;
}

export default function MessageBanner({ type, text }: MessageBannerProps) {
  return (
    <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border ${
      type === 'success' 
        ? 'bg-green-50 border-green-200 text-green-700' 
        : 'bg-red-50 border-red-200 text-red-700'
    }`}>
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <span className="text-lg sm:text-xl">{type === 'success' ? '✅' : '❌'}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}