/*"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ReferralDashboard from '@/components/dashboards/RefferalDasboard';
import SubscriptionPayment from '@/components/dashboards/SubscriptionPayment';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  businessName: string;
  businessType: string;
  mpesaNumber: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    businessName: '',
    businessType: '',
    mpesaNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        businessName: user.businessName || '',
        businessType: user.businessType || '',
        mpesaNumber: user.mpesaNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatar: formData.avatar
      };

      // Add vendor-specific fields if user is a vendor
      if (user?.role === 'vendor') {
        updateData.businessName = formData.businessName;
        updateData.businessType = formData.businessType;
        updateData.mpesaNumber = formData.mpesaNumber;
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess('Profile updated successfully!');
      window.location.reload();
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      await logout();
      router.push('/');
    } catch (error) {
      setError('Failed to delete account');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'vendor': return 'bg-[#bf2c7e] text-white';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'delivery': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header *
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar *
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-[#bf2c7e] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer border border-gray-200 hover:shadow-xl transition-shadow">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)} capitalize`}>
                    {user.role}
                  </span>
                </div>
                {user.businessName && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {user.businessName}
                    </span>
                  </div>
                )}
              </div>

              <nav className="mt-8 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-[#bf2c7e] text-white font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'password'
                      ? 'bg-[#bf2c7e] text-white font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Change Password
                </button>
                {/*<button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'security'
                      ? 'bg-[#bf2c7e] text-white font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Security
                </button>*
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content *
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>

                  {user.role === 'vendor' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className="w-full px-4 py- text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type *
                          </label>
                          <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                            required
                          >
                            <option className='text-gray-500' value="">Select business type</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="grocery">Grocery Store</option>
                            <option value="pharmacy">Pharmacy</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          M-Pesa Number *
                        </label>
                        <input
                          type="tel"
                          name="mpesaNumber"
                          value={formData.mpesaNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                          placeholder="254 700 000 000"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">Used for receiving payments</p>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <span className="capitalize text-gray-700 font-medium">{user.role}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Account type cannot be changed</p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#bf2c7e] text-white px-8 py-3 rounded-lg hover:bg-[#a8256c] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#bf2c7e] text-white px-8 py-3 rounded-lg hover:bg-[#a8256c] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">Login Activity</h4>
                      <p className="text-sm text-gray-600">View your recent login activity</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                      View Logs
                    </button>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>     
          <div className="xl:col-span-1">
            <ReferralDashboard />
          </div>
          {user.role === 'vendor' && (
            <div className="xl:col-span-1">
              <SubscriptionPayment />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}*/


// app/profile/page.tsx
/*"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ReferralDashboard from '@/components/dashboards/RefferalDasboard';
import SubscriptionPayment from '@/components/dashboards/SubscriptionPayment';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  businessName: string;
  businessType: string;
  mpesaNumber: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    businessName: '',
    businessType: '',
    mpesaNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        businessName: user.businessName || '',
        businessType: user.businessType || '',
        mpesaNumber: user.mpesaNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatar: formData.avatar
      };

      // Add vendor-specific fields if user is a vendor
      if (user?.role === 'vendor') {
        updateData.businessName = formData.businessName;
        updateData.businessType = formData.businessType;
        updateData.mpesaNumber = formData.mpesaNumber;
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess('Profile updated successfully!');
      window.location.reload();
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      await logout();
      router.push('/');
    } catch (error) {
      setError('Failed to delete account');
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect via useEffect)
  if (!user) {
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'vendor': return 'bg-[#bf2c7e] text-white';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'delivery': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header *
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar *
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-[#bf2c7e] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer border border-gray-200 hover:shadow-xl transition-shadow">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)} capitalize`}>
                    {user.role}
                  </span>
                </div>
                {user.businessName && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {user.businessName}
                    </span>
                  </div>
                )}
              </div>

              <nav className="mt-8 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-[#bf2c7e] text-white font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'password'
                      ? 'bg-[#bf2c7e] text-white font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Change Password
                </button>
                {/*<button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'security'
                      ? 'bg-[#bf2c7e] text-white font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Security
                </button>*
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content *
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>

                  {user.role === 'vendor' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className="w-full px-4 py- text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type *
                          </label>
                          <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                            required
                          >
                            <option className='text-gray-500' value="">Select business type</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="grocery">Grocery Store</option>
                            <option value="pharmacy">Pharmacy</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          M-Pesa Number *
                        </label>
                        <input
                          type="tel"
                          name="mpesaNumber"
                          value={formData.mpesaNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                          placeholder="254 700 000 000"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">Used for receiving payments</p>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <span className="capitalize text-gray-700 font-medium">{user.role}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Account type cannot be changed</p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#bf2c7e] text-white px-8 py-3 rounded-lg hover:bg-[#a8256c] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#bf2c7e] text-white px-8 py-3 rounded-lg hover:bg-[#a8256c] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">Login Activity</h4>
                      <p className="text-sm text-gray-600">View your recent login activity</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                      View Logs
                    </button>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>     
          {/*<div className="xl:col-span-1">
            <ReferralDashboard />
          </div>
          {user.role === 'vendor' && (
            <div className="xl:col-span-1">
              <SubscriptionPayment />
            </div>
          )}*
        </div>
      </div>
    </div>
  );
}*/

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, User, Lock, Shield, LogOut, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import ReferralDashboard from '@/components/dashboards/RefferalDasboard';
import SubscriptionPayment from '@/components/dashboards/SubscriptionPayment';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  businessName: string;
  businessType: string;
  mpesaNumber: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    businessName: '',
    businessType: '',
    mpesaNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        businessName: user.businessName || '',
        businessType: user.businessType || '',
        mpesaNumber: user.mpesaNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatar: formData.avatar
      };

      if (user?.role === 'vendor') {
        updateData.businessName = formData.businessName;
        updateData.businessType = formData.businessType;
        updateData.mpesaNumber = formData.mpesaNumber;
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess('Profile updated successfully!');
      window.location.reload();
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/account', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete account');
      await logout();
      router.push('/');
    } catch (error) {
      setError('Failed to delete account');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="animate-spin rounded-full h-10 w-10 xs:h-12 xs:w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'vendor': return 'bg-[var(--color-primary)] text-white';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'delivery': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-border)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12 xs:h-14 sm:h-16">
            <button
              onClick={() => router.back()}
              className="mr-2 xs:mr-3 sm:mr-4 p-1.5 xs:p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/50 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5" />
            </button>
            <h1 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-primary-alt)]">
              Profile Settings
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
          {/* Sidebar - Full width on mobile, 1/3 on desktop */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 lg:p-6">
              {/* Profile Avatar */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center text-white text-base xs:text-xl sm:text-2xl font-bold mx-auto mb-2 xs:mb-3 sm:mb-4 shadow-lg">
                    {formData.avatar ? (
                      <Image
                        src={formData.avatar}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
                    )}
                  </div>
                  <label className="absolute -bottom-1 right-0 xs:bottom-0 xs:right-0 sm:bottom-1 sm:right-1 bg-[var(--color-surface)] rounded-full p-1 xs:p-1.5 sm:p-2 shadow-md cursor-pointer border border-[var(--color-border)] hover:shadow-lg transition-all">
                    <Camera className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <h2 className="text-sm xs:text-base sm:text-lg lg:text-xl font-semibold text-[var(--color-text)]">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5 xs:mt-1">{user.email}</p>
                
                <div className="mt-2 xs:mt-2.5 sm:mt-3 flex flex-wrap justify-center gap-1.5 xs:gap-2">
                  <span className={`inline-flex items-center px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-0.5 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                  {user.businessName && (
                    <span className="inline-flex items-center px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-0.5 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                      {user.businessName}
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="mt-4 xs:mt-5 sm:mt-6 lg:mt-8 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg text-[10px] xs:text-xs sm:text-sm transition-all flex items-center gap-2 xs:gap-2.5 sm:gap-3 ${
                    activeTab === 'profile'
                      ? 'bg-[var(--color-primary)] text-white font-medium shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/30 hover:text-[var(--color-text)]'
                  }`}
                >
                  <User className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg text-[10px] xs:text-xs sm:text-sm transition-all flex items-center gap-2 xs:gap-2.5 sm:gap-3 ${
                    activeTab === 'password'
                      ? 'bg-[var(--color-primary)] text-white font-medium shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/30 hover:text-[var(--color-text)]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  Change Password
                </button>
              </nav>

              {/* Sign Out Button */}
              <div className="mt-4 xs:mt-5 sm:mt-6 lg:mt-8 pt-4 xs:pt-5 sm:pt-6 border-t border-[var(--color-border)]">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-600 rounded-lg transition-all flex items-center gap-2 xs:gap-2.5 sm:gap-3 text-[10px] xs:text-xs sm:text-sm"
                >
                  <LogOut className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Full width on mobile, 2/3 on desktop */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 xs:px-4 py-2 xs:py-3 rounded-lg mb-4 xs:mb-5 sm:mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0" />
                  <span className="text-[10px] xs:text-xs sm:text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 xs:px-4 py-2 xs:py-3 rounded-lg mb-4 xs:mb-5 sm:mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0" />
                  <span className="text-[10px] xs:text-xs sm:text-sm">{success}</span>
                </div>
              </div>
            )}

            {/* Profile Form */}
            {activeTab === 'profile' && (
              <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] p-4 xs:p-5 sm:p-6">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-4 xs:mb-5 sm:mb-6">
                  Personal Information
                </h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                    <div>
                      <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)] bg-[var(--color-border)]/30 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>

                  {user.role === 'vendor' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                        <div>
                          <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                            Business Type *
                          </label>
                          <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                            required
                          >
                            <option value="">Select business type</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="grocery">Grocery Store</option>
                            <option value="pharmacy">Pharmacy</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                          M-Pesa Number *
                        </label>
                        <input
                          type="tel"
                          name="mpesaNumber"
                          value={formData.mpesaNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                          placeholder="254 700 000 000"
                          required
                        />
                        <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] mt-1">Used for receiving payments</p>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                      Account Type
                    </label>
                    <div className="px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-border)]/30">
                      <span className="capitalize text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] font-medium">{user.role}</span>
                    </div>
                    <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] mt-1">Account type cannot be changed</p>
                  </div>

                  <div className="flex justify-end pt-2 xs:pt-3 sm:pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[var(--color-primary-alt)] text-white px-4 xs:px-5 sm:px-6 lg:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-3 w-3 xs:h-4 xs:w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Form */}
            {activeTab === 'password' && (
              <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] p-4 xs:p-5 sm:p-6">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-4 xs:mb-5 sm:mb-6">
                  Change Password
                </h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
                  <div>
                    <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-2 xs:pt-3 sm:pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[var(--color-primary-alt)] text-white px-4 xs:px-5 sm:px-6 lg:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-3 w-3 xs:h-4 xs:w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}