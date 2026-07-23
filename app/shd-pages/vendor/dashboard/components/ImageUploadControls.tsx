'use client';

import { useRef } from 'react';

interface ImageUploadControlsProps {
  type: 'profile' | 'cover';
  onUpload: (file: File, type: 'profile' | 'cover') => void;
  onRemove?: () => void;
  hasImage: boolean;
  uploading: boolean;
  className?: string;
  compact?: boolean;
}

export default function ImageUploadControls({ 
  type, 
  onUpload, 
  onRemove, 
  hasImage, 
  uploading,
  className = '',
  compact = false
}: ImageUploadControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file, type);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (compact) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <label className="cursor-pointer bg-primary hover:bg-accent-dark text-white p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-200 text-xs">
          📷
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {hasImage && (
          <button
            onClick={onRemove}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-200 text-xs"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <label className="cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white text-secondary px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm">
        {uploading ? '⏳ Uploading...' : `📸 ${type === 'cover' ? 'Change Cover' : 'Update Photo'}`}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {hasImage && (
        <button
          onClick={onRemove}
          className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm"
        >
          ✕ Remove
        </button>
      )}
    </div>
  );
}