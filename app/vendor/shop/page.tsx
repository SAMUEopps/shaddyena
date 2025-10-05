/*"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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


  useEffect(() => {
    fetchShopData();
  }, []);

  /*const fetchShopData = async () => {
    try {
      const response = await fetch('/api/vendor/shop');
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setShopData(data.shop);
        } else if (data.prefilledData) {
          // Prefill with user data for new shop
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
        }
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setMessage('Error loading shop data');
    } finally {
      setIsLoading(false);
    }
  };*

 const fetchShopData = async () => {
  try {
    const response = await fetch('/api/vendor/shop');
    if (response.ok) {
      const data = await response.json();
      if (data.exists) {
        setShopData(data.shop);
        setHasShop(true);   // ✅ shop exists in DB
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
        setHasShop(false);  // ✅ only prefilled, no shop yet
      }
    }
  } catch (error) {
    console.error('Error fetching shop data:', error);
    setMessage('Error loading shop data');
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShopData(prev => {
      if (!prev) return prev;
      
      // Handle nested objects
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

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const method = shopData ? 'PUT' : 'POST';
      const response = await fetch('/api/vendor/shop', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData)
      });

      if (response.ok) {
        setMessage('Shop saved successfully!');
        setIsEditing(false);
        fetchShopData(); // Refresh data
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error saving shop');
      }
    } catch (error) {
      setMessage('Error saving shop');
    } finally {
      setIsSaving(false);
    }
  };*

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);
  setMessage('');

  try {
    const method = hasShop ? 'PUT' : 'POST';  // ✅ now works
    const response = await fetch('/api/vendor/shop', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData)
    });

    if (response.ok) {
      setMessage('Shop saved successfully!');
      setIsEditing(false);
      fetchShopData(); // Refresh data
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff199c]" />
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
              className="bg-[#ff199c] text-white px-4 py-2 rounded-md hover:bg-[#e5178a]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>
        </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
              className="bg-[#ff199c] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] disabled:opacity-50"
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff199c]" />
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
              className="bg-[#ff199c] text-white px-4 py-2 rounded-md hover:bg-[#e5178a]"
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
        {/* Logo Upload */}
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
                <label className="bg-[#ff199c] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] cursor-pointer disabled:opacity-50">
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

        {/* Banner Upload */}
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
                <label className="bg-[#ff199c] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] cursor-pointer disabled:opacity-50">
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

        {/* Basic Information */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>
        </div>

        {/* Rest of the form remains the same */}
        {/* Location Information */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>
        </div>

        {/* Operating Hours */}
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

        {/* Social Media */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
                  placeholder={`https://${platform}.com/yourpage`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
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
              className="bg-[#ff199c] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}