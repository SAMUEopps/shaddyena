// C:\Users\USER\Desktop\Projects\my-app\app\vendor\upgrade\page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export default function UpgradeToVendor() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Password verification
    password: '',
    
    // Vendor information
    businessName: '',
    ownerName: '',
    nationalId: '',
    kraPin: '',
    businessLocation: '',

    // Payout
    payoutMethod: 'MPESA',
    mpesaNumber: '',
    pochiNumber: '',
    tillNumber: '',
    paybillNumber: '',
    paybillAccount: ''
  });

  // Fetch current user profile
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.user);

      // Check if user is already a vendor
      if (data.user.role === 'vendor') {
        setError('You are already a vendor!');
        setTimeout(() => {
          router.push('/vendor/dashboard');
        }, 2000);
      }

      // Pre-fill phone number for M-Pesa
      setFormData(prev => ({
        ...prev,
        mpesaNumber: data.user.phoneNumber
      }));

    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate required fields
    if (!formData.password) {
      setError('Please enter your password to verify your identity');
      setLoading(false);
      return;
    }

    if (!formData.businessName || !formData.ownerName || 
        !formData.nationalId || !formData.businessLocation) {
      setError('Please fill in all required business fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const payload = {
        password: formData.password,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        nationalId: formData.nationalId,
        kraPin: formData.kraPin || '',
        businessLocation: formData.businessLocation,
        payoutMethod: formData.payoutMethod,
        payoutDetails: {
          mpesaNumber: formData.mpesaNumber || user?.phoneNumber || '',
          pochiNumber: formData.pochiNumber || '',
          tillNumber: formData.tillNumber || '',
          paybillNumber: formData.paybillNumber || '',
          paybillAccount: formData.paybillAccount || ''
        }
      };

      const response = await fetch('/api/vendors/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('🎉 Congratulations! You are now a vendor!');
        
        // Update user in localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const storedUser = JSON.parse(userStr);
          localStorage.setItem('user', JSON.stringify({
            ...storedUser,
            role: 'vendor'
          }));
        }

        // Redirect to vendor dashboard after 2 seconds
        setTimeout(() => {
          router.push('/vendor/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Upgrade failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please login to upgrade to vendor</p>
          <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/profile" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Back to Profile
            </Link>
            <h1 className="text-3xl font-bold mb-2">🏪 Upgrade to Vendor</h1>
            <p className="text-gray-600">
              Start selling on Shaddyna Marketplace
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-5">
            {success}
          </div>
        )}

        {/* User Info Summary *
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">{user.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 font-medium">{user.phoneNumber}</span>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            ⚠️ Please verify your password below to confirm your identity
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Verification *
          <div>
            <h2 className="text-xl font-bold mb-4">Verify Identity</h2>
            <div className="space-y-3">
              <input
                type="password"
                name="password"
                placeholder="Enter your current password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Business Information *
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Business Information</h2>
            <div className="space-y-3">
              <input
                name="businessName"
                placeholder="Business Name"
                required
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="ownerName"
                placeholder="Owner Name"
                required
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="nationalId"
                placeholder="National ID"
                required
                value={formData.nationalId}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="kraPin"
                placeholder="KRA PIN (Optional)"
                value={formData.kraPin}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="businessLocation"
                placeholder="Business Location"
                required
                value={formData.businessLocation}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Payout Details *
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="space-y-3">
              <select
                name="payoutMethod"
                value={formData.payoutMethod}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MPESA">M-Pesa</option>
                <option value="POCHI">Pochi</option>
                <option value="TILL">Till Number</option>
                <option value="PAYBILL">PayBill</option>
              </select>

              {formData.payoutMethod === "MPESA" && (
                <input
                  name="mpesaNumber"
                  placeholder="M-Pesa Number"
                  value={formData.mpesaNumber}
                  onChange={handleChange}
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              {formData.payoutMethod === "POCHI" && (
                <input
                  name="pochiNumber"
                  placeholder="Pochi Number"
                  value={formData.pochiNumber}
                  onChange={handleChange}
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              {formData.payoutMethod === "TILL" && (
                <input
                  name="tillNumber"
                  placeholder="Till Number"
                  value={formData.tillNumber}
                  onChange={handleChange}
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              {formData.payoutMethod === "PAYBILL" && (
                <div className="space-y-3">
                  <input
                    name="paybillNumber"
                    placeholder="PayBill Number"
                    value={formData.paybillNumber}
                    onChange={handleChange}
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    name="paybillAccount"
                    placeholder="Account Number"
                    value={formData.paybillAccount}
                    onChange={handleChange}
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Upgrading...' : '🚀 Upgrade to Vendor'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By upgrading, you agree to our terms and conditions for vendors
          </p>
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export default function UpgradeToVendor() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    password: '',
    businessName: '',
    ownerName: '',
    nationalId: '',
    kraPin: '',
    businessLocation: '',
    payoutMethod: 'MPESA',
    mpesaNumber: '',
    pochiNumber: '',
    tillNumber: '',
    paybillNumber: '',
    paybillAccount: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/shd-pages/login');
        return;
      }

      const response = await fetch('/api/shd-api/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.user);

      if (data.user.role === 'vendor') {
        setError('You are already a vendor!');
        setTimeout(() => {
          router.push('/shd-pages/vendor/dashboard');
        }, 2000);
      }

      setFormData(prev => ({
        ...prev,
        mpesaNumber: data.user.phoneNumber
      }));

    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.password) {
      setError('Please enter your password to verify your identity');
      setLoading(false);
      return;
    }

    if (!formData.businessName || !formData.ownerName || 
        !formData.nationalId || !formData.businessLocation) {
      setError('Please fill in all required business fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/shd-pages/login');
        return;
      }

      const payload = {
        password: formData.password,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        nationalId: formData.nationalId,
        kraPin: formData.kraPin || '',
        businessLocation: formData.businessLocation,
        payoutMethod: formData.payoutMethod,
        payoutDetails: {
          mpesaNumber: formData.mpesaNumber || user?.phoneNumber || '',
          pochiNumber: formData.pochiNumber || '',
          tillNumber: formData.tillNumber || '',
          paybillNumber: formData.paybillNumber || '',
          paybillAccount: formData.paybillAccount || ''
        }
      };

      const response = await fetch('/api/shd-api/api/vendors/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('🎉 Congratulations! You are now a vendor!');
        
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const storedUser = JSON.parse(userStr);
          localStorage.setItem('user', JSON.stringify({
            ...storedUser,
            role: 'vendor'
          }));
        }

        setTimeout(() => {
          router.push('/shd/pages/vendor/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Upgrade failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-muted text-lg mb-6">Please login to upgrade to vendor</p>
          <Link 
            href="/login" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <Link 
                href="/shd-pages/profile" 
                className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2 mb-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-secondary">
                🏪 Upgrade to Vendor
              </h1>
              <p className="text-muted mt-1">
                Start selling on Shaddyna Marketplace
              </p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* User Info Summary */}
          <div className="bg-surface/30 border border-surface rounded-xl p-5 mb-6">
            <h3 className="text-sm font-bold text-secondary mb-3">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-muted">Name:</span>
                <span className="ml-2 font-medium text-secondary">{user.name}</span>
              </div>
              <div>
                <span className="text-muted">Email:</span>
                <span className="ml-2 font-medium text-secondary">{user.email}</span>
              </div>
              <div>
                <span className="text-muted">Phone:</span>
                <span className="ml-2 font-medium text-secondary">{user.phoneNumber}</span>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
              <span>⚠️</span>
              <span>Please verify your password below to confirm your identity</span>
            </div>
          </div>

          {/* Upgrade Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Password Verification */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Verify Identity
              </h2>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your current password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="border-t border-surface pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Business Information
              </h2>
              <div className="space-y-4">
                <input
                  name="businessName"
                  placeholder="Business Name"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="ownerName"
                  placeholder="Owner Name"
                  required
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="nationalId"
                  placeholder="National ID"
                  required
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="kraPin"
                  placeholder="KRA PIN (Optional)"
                  value={formData.kraPin}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="businessLocation"
                  placeholder="Business Location"
                  required
                  value={formData.businessLocation}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
              </div>
            </div>

            {/* Payout Details */}
            <div className="border-t border-surface pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Payment Details
              </h2>
              <div className="space-y-4">
                <select
                  name="payoutMethod"
                  value={formData.payoutMethod}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                >
                  <option value="MPESA">M-Pesa</option>
                  <option value="POCHI">Pochi</option>
                  <option value="TILL">Till Number</option>
                  <option value="PAYBILL">PayBill</option>
                </select>

                {formData.payoutMethod === "MPESA" && (
                  <input
                    name="mpesaNumber"
                    placeholder="M-Pesa Number"
                    value={formData.mpesaNumber}
                    onChange={handleChange}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                )}

                {formData.payoutMethod === "POCHI" && (
                  <input
                    name="pochiNumber"
                    placeholder="Pochi Number"
                    value={formData.pochiNumber}
                    onChange={handleChange}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                )}

                {formData.payoutMethod === "TILL" && (
                  <input
                    name="tillNumber"
                    placeholder="Till Number"
                    value={formData.tillNumber}
                    onChange={handleChange}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                )}

                {formData.payoutMethod === "PAYBILL" && (
                  <div className="space-y-3">
                    <input
                      name="paybillNumber"
                      placeholder="PayBill Number"
                      value={formData.paybillNumber}
                      onChange={handleChange}
                      className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    />
                    <input
                      name="paybillAccount"
                      placeholder="Account Number"
                      value={formData.paybillAccount}
                      onChange={handleChange}
                      className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Upgrading...
                </span>
              ) : (
                '🚀 Upgrade to Vendor'
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-muted">
                By upgrading, you agree to our terms and conditions for vendors
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}