
/*"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ShopData {
  businessName: string;
  businessType: string;
  description?: string;
  logo?: string;
  banner?: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  policies: {
    returnPolicy?: string;
    shippingPolicy?: string;
    privacyPolicy?: string;
  };
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function VendorShopPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [hasShop, setHasShop] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await fetch('/api/vendor/shop');
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setShopData(data.shop);
          setHasShop(true);
        } else if (data.prefilledData) {
          setShopData({
            businessName: data.prefilledData.businessName || '',
            businessType: data.prefilledData.businessType || '',
            location: {
              address: '',
              city: '',
              country: 'Kenya'
            },
            contact: {
              phone: data.prefilledData.phone || '',
              email: data.prefilledData.email || ''
            },
            operatingHours: daysOfWeek.map(day => ({
              day,
              open: '09:00',
              close: '17:00',
              isClosed: day === 'Sunday'
            })),
            policies: {}
          });
          setHasShop(false);
        }
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setMessage('Error loading shop data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    if (type === 'logo') {
      setUploadingLogo(true);
    } else {
      setUploadingBanner(true);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Update the shop data with the new image URL
      setShopData(prev => prev ? { ...prev, [type]: data.url } : null);
      
      setMessage(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage(`Error uploading ${type}`);
    } finally {
      if (type === 'logo') {
        setUploadingLogo(false);
      } else {
        setUploadingBanner(false);
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image must be less than 5MB');
        return;
      }

      handleImageUpload(file, 'logo');
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB for banner)
      if (file.size > 10 * 1024 * 1024) {
        setMessage('Banner image must be less than 10MB');
        return;
      }

      handleImageUpload(file, 'banner');
    }
  };

  const removeImage = (type: 'logo' | 'banner') => {
    setShopData(prev => prev ? { ...prev, [type]: undefined } : null);
    setMessage(`${type === 'logo' ? 'Logo' : 'Banner'} removed successfully!`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShopData(prev => {
      if (!prev) return prev;
      
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...((prev[parent as keyof ShopData] && typeof prev[parent as keyof ShopData] === 'object') ? prev[parent as keyof ShopData] as object : {}),
            [child]: value
          }
        };
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleOperatingHoursChange = (index: number, field: string, value: string | boolean) => {
    setShopData(prev => {
      if (!prev) return prev;
      const updatedHours = [...prev.operatingHours];
      updatedHours[index] = { ...updatedHours[index], [field]: value };
      return { ...prev, operatingHours: updatedHours };
    });
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setShopData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value
        }
      };
    });
  };

  const handlePolicyChange = (policy: string, value: string) => {
    setShopData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        policies: {
          ...prev.policies,
          [policy]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const method = hasShop ? 'PUT' : 'POST';
      const response = await fetch('/api/vendor/shop', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData)
      });

      if (response.ok) {
        setMessage('Shop saved successfully!');
        setIsEditing(false);
        fetchShopData();
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error saving shop');
      }
    } catch (error) {
      setMessage('Error saving shop');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shop Management</h1>
        <div className="flex space-x-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md hover:bg-[#e5178a]"
            >
              Edit Shop
            </button>
          )}
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Logo Upload *
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Shop Logo</h2>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {shopData?.logo ? (
                  <Image
                    src={shopData.logo}
                    alt="Shop Logo"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">No Logo</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                Upload your shop logo. Recommended size: 256x256px. Max file size: 5MB.
              </p>
              <div className="flex space-x-3">
                <label className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] cursor-pointer disabled:opacity-50">
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={!isEditing || uploadingLogo}
                    className="hidden"
                  />
                </label>
                
                {shopData?.logo && isEditing && (
                  <button
                    type="button"
                    onClick={() => removeImage('logo')}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Banner Upload *
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Shop Banner</h2>
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 h-48 flex items-center justify-center overflow-hidden">
              {shopData?.banner ? (
                <Image
                  src={shopData.banner}
                  alt="Shop Banner"
                  width={800}
                  height={192}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">No Banner Image</span>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Upload your shop banner. Recommended size: 1200x300px. Max file size: 10MB.
              </p>
              <div className="flex space-x-3">
                <label className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] cursor-pointer disabled:opacity-50">
                  {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    disabled={!isEditing || uploadingBanner}
                    className="hidden"
                  />
                </label>
                
                {shopData?.banner && isEditing && (
                  <button
                    type="button"
                    onClick={() => removeImage('banner')}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information *
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={shopData?.businessName || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
              <input
                type="text"
                name="businessType"
                value={shopData?.businessType || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={shopData?.description || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
            />
          </div>
        </div>

        {/* Rest of the form remains the same *
        {/* Location Information *
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                name="location.address"
                value={shopData?.location.address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                name="location.city"
                value={shopData?.location.city || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <input
                type="text"
                name="location.country"
                value={shopData?.location.country || 'Kenya'}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information *
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="contact.phone"
                value={shopData?.contact.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="contact.email"
                value={shopData?.contact.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              name="contact.website"
              value={shopData?.contact.website || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
            />
          </div>
        </div>

        {/* Operating Hours *
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
          <div className="space-y-3">
            {shopData?.operatingHours.map((hours, index) => (
              <div key={hours.day} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md">
                <span className="w-20 font-medium">{hours.day}</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => handleOperatingHoursChange(index, 'open', e.target.value)}
                    disabled={!isEditing || hours.isClosed}
                    className="px-2 py-1 border border-gray-300 rounded-md"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => handleOperatingHoursChange(index, 'close', e.target.value)}
                    disabled={!isEditing || hours.isClosed}
                    className="px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hours.isClosed}
                    onChange={(e) => handleOperatingHoursChange(index, 'isClosed', e.target.checked)}
                    disabled={!isEditing}
                    className="rounded"
                  />
                  <span>Closed</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media *
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['facebook', 'instagram', 'twitter', 'youtube'].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={shopData?.socialMedia?.[platform as keyof typeof shopData.socialMedia] || ''}
                  onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                  placeholder={`https://${platform}.com/yourpage`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Policies *
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Policies</h2>
          <div className="space-y-4">
            {['returnPolicy', 'shippingPolicy', 'privacyPolicy'].map((policy) => (
              <div key={policy}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {policy.replace('Policy', ' Policy')}
                </label>
                <textarea
                  value={shopData?.policies?.[policy as keyof typeof shopData.policies] || ''}
                  onChange={(e) => handlePolicyChange(policy, e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                  placeholder={`Enter your ${policy.replace('Policy', '').toLowerCase()} policy`}
                />
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}*/

"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ShopData {
  businessName: string;
  businessType: string;
  description?: string;
  logo?: string;
  banner?: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    //website?: string;
  };
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  policies: {
    returnPolicy?: string;
    shippingPolicy?: string;
    privacyPolicy?: string;
  };
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function VendorShopPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [hasShop, setHasShop] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await fetch('/api/vendor/shop');
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setShopData(data.shop);
          setHasShop(true);
        } else if (data.prefilledData) {
          setShopData({
            businessName: data.prefilledData.businessName || '',
            businessType: data.prefilledData.businessType || '',
            location: {
              address: '',
              city: '',
              country: 'Kenya'
            },
            contact: {
              phone: data.prefilledData.phone || '',
              email: data.prefilledData.email || ''
            },
            operatingHours: daysOfWeek.map(day => ({
              day,
              open: '09:00',
              close: '17:00',
              isClosed: day === 'Sunday'
            })),
            policies: {}
          });
          setHasShop(false);
        }
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setMessage('Error loading shop data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    if (type === 'logo') {
      setUploadingLogo(true);
    } else {
      setUploadingBanner(true);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setShopData(prev => prev ? { ...prev, [type]: data.url } : null);
      setMessage(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage(`Error uploading ${type}`);
    } finally {
      if (type === 'logo') {
        setUploadingLogo(false);
      } else {
        setUploadingBanner(false);
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image must be less than 5MB');
        return;
      }

      handleImageUpload(file, 'logo');
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setMessage('Banner image must be less than 10MB');
        return;
      }

      handleImageUpload(file, 'banner');
    }
  };

  const removeImage = (type: 'logo' | 'banner') => {
    setShopData(prev => prev ? { ...prev, [type]: undefined } : null);
    setMessage(`${type === 'logo' ? 'Logo' : 'Banner'} removed successfully!`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShopData(prev => {
      if (!prev) return prev;
      
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...((prev[parent as keyof ShopData] && typeof prev[parent as keyof ShopData] === 'object') ? prev[parent as keyof ShopData] as object : {}),
            [child]: value
          }
        };
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleOperatingHoursChange = (index: number, field: string, value: string | boolean) => {
    setShopData(prev => {
      if (!prev) return prev;
      const updatedHours = [...prev.operatingHours];
      updatedHours[index] = { ...updatedHours[index], [field]: value };
      return { ...prev, operatingHours: updatedHours };
    });
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setShopData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value
        }
      };
    });
  };

  const handlePolicyChange = (policy: string, value: string) => {
    setShopData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        policies: {
          ...prev.policies,
          [policy]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const method = hasShop ? 'PUT' : 'POST';
      const response = await fetch('/api/vendor/shop', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData)
      });

      if (response.ok) {
        setMessage('Shop saved successfully!');
        setIsEditing(false);
        fetchShopData();
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error saving shop');
      }
    } catch (error) {
      setMessage('Error saving shop');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

<div className="flex items-center mb-4 sm:mb-6">
  <button
    onClick={() => router.back()}
    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
  >
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span className="text-sm font-medium">Back</span>
  </button>
</div>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shop Management</h1>
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#bf2c7e] text-white px-3 sm:px-4 py-2 rounded-md hover:bg-[#e5178a] text-sm sm:text-base"
              >
                Edit Shop
              </button>
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} text-sm`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm sm:shadow p-4 sm:p-6">
          {/* Logo Upload */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-gray-700 font-semibold mb-3 sm:mb-4">Shop Logo</h2>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {shopData?.logo ? (
                    <Image
                      src={shopData.logo}
                      alt="Shop Logo"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-2 sm:p-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">No Logo</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  Upload your shop logo. Recommended size: 256x256px. Max file size: 5MB.
                </p>
                <div className="flex flex-col xs:flex-row gap-2 justify-center sm:justify-start">
                  <label className="bg-[#bf2c7e] text-white px-3 sm:px-4 py-2 rounded-md hover:bg-[#e5178a] cursor-pointer disabled:opacity-50 text-sm">
                    {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={!isEditing || uploadingLogo}
                      className="hidden"
                    />
                  </label>
                  
                  {shopData?.logo && isEditing && (
                    <button
                      type="button"
                      onClick={() => removeImage('logo')}
                      className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Banner Upload */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-gray-700 font-semibold mb-3 sm:mb-4">Shop Banner</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 h-32 sm:h-48 flex items-center justify-center overflow-hidden">
                {shopData?.banner ? (
                  <Image
                    src={shopData.banner}
                    alt="Shop Banner"
                    width={800}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">No Banner Image</span>
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  Upload your shop banner. Recommended size: 1200x300px. Max file size: 10MB.
                </p>
                <div className="flex flex-col xs:flex-row gap-2 justify-center sm:justify-start">
                  <label className="bg-[#bf2c7e] text-white px-3 sm:px-4 py-2 rounded-md hover:bg-[#e5178a] cursor-pointer disabled:opacity-50 text-sm">
                    {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      disabled={!isEditing || uploadingBanner}
                      className="hidden"
                    />
                  </label>
                  
                  {shopData?.banner && isEditing && (
                    <button
                      type="button"
                      onClick={() => removeImage('banner')}
                      className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-gray-700 font-semibold mb-3 sm:mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={shopData?.businessName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                <input
                  type="text"
                  name="businessType"
                  value={shopData?.businessType || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={shopData?.description || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-gray-700 font-semibold mb-3 sm:mb-4">Location</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="location.address"
                  value={shopData?.location.address || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="location.city"
                  value={shopData?.location.city || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <input
                  type="text"
                  name="location.country"
                  value={shopData?.location.country || 'Kenya'}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-gray-700 font-semibold mb-3 sm:mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={shopData?.contact.phone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="contact.email"
                  value={shopData?.contact.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                  required
                />
              </div>
              {/*<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  name="contact.website"
                  value={shopData?.contact.website || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                />
              </div>*/}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-gray-700 font-semibold mb-3 sm:mb-4">Operating Hours</h2>
            <div className="space-y-2 sm:space-y-3">
              {shopData?.operatingHours.map((hours, index) => (
                <div key={hours.day} className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 p-2 sm:p-3 bg-gray-50 rounded-md">
                  <span className="w-16 xs:w-20 text-gray-700 font-medium text-sm">{hours.day}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleOperatingHoursChange(index, 'open', e.target.value)}
                      disabled={!isEditing || hours.isClosed}
                      className="flex-1 px-2 py-1 text-gray-700 border border-gray-300 rounded-md text-sm"
                    />
                    <span className="text-xs text-gray-700 sm:text-sm">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleOperatingHoursChange(index, 'close', e.target.value)}
                      disabled={!isEditing || hours.isClosed}
                      className="flex-1 px-2 text-gray-700 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <label className="flex items-center text-gray-700 gap-2 mt-1 xs:mt-0">
                    <input
                      type="checkbox"
                      checked={hours.isClosed}
                      onChange={(e) => handleOperatingHoursChange(index, 'isClosed', e.target.checked)}
                      disabled={!isEditing}
                      className="rounded"
                    />
                    <span className="text-sm">Closed</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-700 sm:mb-4">Social Media</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((platform) => (
                <div key={platform}>
                  <label className="block text-sm text-gray-700 font-medium mb-1 capitalize">
                    {platform}
                  </label>
                  <input
                    type="url"
                    value={shopData?.socialMedia?.[platform as keyof typeof shopData.socialMedia] || ''}
                    onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                    disabled={!isEditing}
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                    placeholder={`https://${platform}.com/yourpage`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Policies</h2>
            <div className="space-y-3 sm:space-y-4">
              {['returnPolicy', 'shippingPolicy', 'privacyPolicy'].map((policy) => (
                <div key={policy}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {policy.replace('Policy', ' Policy')}
                  </label>
                  <textarea
                    value={shopData?.policies?.[policy as keyof typeof shopData.policies] || ''}
                    onChange={(e) => handlePolicyChange(policy, e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] text-sm sm:text-base"
                    placeholder={`Enter your ${policy.replace('Policy', '').toLowerCase()} policy`}
                  />
                </div>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}