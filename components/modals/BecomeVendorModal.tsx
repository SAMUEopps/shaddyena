'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const businessTypes: string[] = [
  'Fashion & Apparel',
  'Electronics',
  'Home & Garden',
  'Beauty & Personal Care',
  'Food & Beverages',
  'Arts & Crafts',
  'Sports & Outdoors',
  'Books & Stationery',
  'Automotive',
  'Health & Wellness',
  'Other',
];

interface BecomeVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  businessName: string;
  businessType: string;
  mpesaNumber: string;
}

export default function BecomeVendorModal({
  isOpen,
  onClose,
  onSuccess,
}: BecomeVendorModalProps) {
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    mpesaNumber: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/become-vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Refresh user data to get updated role
      await refreshUser();
      onSuccess();
      onClose();

      // Reset form
      setFormData({
        businessName: '',
        businessType: '',
        mpesaNumber: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Become a Seller
              </h3>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] sm:text-sm"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] sm:text-sm"
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="mpesaNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    M-Pesa Number *
                  </label>
                  <input
                    type="tel"
                    id="mpesaNumber"
                    name="mpesaNumber"
                    required
                    value={formData.mpesaNumber}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e] sm:text-sm"
                    placeholder="07XXXXXXXX"
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your 10-digit M-Pesa number for payments
                  </p>
                </div>

                <div className="mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-[#bf2c7e] border border-transparent rounded-md shadow-sm hover:bg-[#a8256c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bf2c7e] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Registering...' : 'Become a Seller'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bf2c7e] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-800">
                  Benefits of becoming a seller:
                </h4>
                <ul className="mt-2 text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>Reach thousands of customers</li>
                  <li>Manage your products and orders</li>
                  <li>Secure payments via M-Pesa</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
