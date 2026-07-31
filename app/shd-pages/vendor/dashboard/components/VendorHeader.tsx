'use client';

import Image from 'next/image';
import ImageUploadControls from './ImageUploadControls';

interface VendorProfile {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  profileImage?: string;
  coverImage?: string;
}

interface VendorHeaderProps {
  vendor: VendorProfile | null;
  uploading: boolean;
  onImageUpload: (file: File, type: 'profile' | 'cover') => void;
  onImageRemove: (type: 'profile' | 'cover') => void;
  onEditClick: () => void;
}

export default function VendorHeader({
  vendor,
  uploading,
  onImageUpload,
  onImageRemove,
  onEditClick,
}: VendorHeaderProps) {
  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden mb-6 sm:mb-8 border border-surface">
      {/* Cover Image */}
      <div className="relative h-36 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20">
        {vendor?.coverImage ? (
          <Image
            src={vendor.coverImage}
            alt="Shop cover"
            fill
            priority
            className="object-cover pointer-events-none select-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl">
            🏪
          </div>
        )}

        {/* Cover Controls */}
        <div className="absolute bottom-4 right-4 z-50">
          <ImageUploadControls
            type="cover"
            onUpload={onImageUpload}
            onRemove={() => onImageRemove('cover')}
            hasImage={!!vendor?.coverImage}
            uploading={uploading}
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-10 sm:-mt-12 gap-3 sm:gap-4">
          {/* Profile Image */}
          <div className="relative flex-shrink-0 z-20">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl border-4 border-white bg-surface shadow-md overflow-hidden">
              {vendor?.profileImage ? (
                <Image
                  src={vendor.profileImage}
                  alt="Shop profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🏪
                </div>
              )}
            </div>

            {/* Profile Controls */}
            <div className="absolute -bottom-2 -right-2 z-30">
              <ImageUploadControls
                type="profile"
                onUpload={onImageUpload}
                onRemove={() => onImageRemove('profile')}
                hasImage={!!vendor?.profileImage}
                uploading={uploading}
                compact
              />
            </div>
          </div>

          {/* Shop Info */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-secondary truncate">
                  {vendor?.businessName || 'My Shop'}
                </h1>

                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted truncate flex items-center gap-2">
                    <span>📍</span>
                    {vendor?.businessLocation || 'Location not set'}
                  </p>

                  <p className="text-sm text-muted truncate flex items-center gap-2">
                    <span>👤</span>
                    {vendor?.ownerName || 'Owner name not set'}
                  </p>

                  <p className="text-sm text-muted truncate flex items-center gap-2">
                    <span>📞</span>
                    {vendor?.phoneNumber || 'Phone not set'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onEditClick}
                className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium whitespace-nowrap"
              >
                ✏️ Edit Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}