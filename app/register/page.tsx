/*"use client";
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type RegisterProps = {
  onSwitchToLogin?: () => void;
};

function ReferralPreloader({ onReferral }: { onReferral: (code: string) => void }) {
  const sp = useSearchParams();
  const ref = sp?.get("ref");

  useEffect(() => {
    if (ref) onReferral(ref);
  }, [ref, onReferral]);

  return null;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: '',
    businessName: '',
    businessType: '',
    mpesaNumber: '',
    referralCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReferralSection, setShowReferralSection] = useState(false);

  const setReferralCode = (code: string) =>
    setFormData((p) => ({ ...p, referralCode: code }));

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };*/

  // components/Register.tsx
"use client";
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type RegisterProps = {
  onSwitchToLogin?: () => void;
};

function ReferralPreloader({ onReferral }: { onReferral: (code: string) => void }) {
  const sp = useSearchParams();
  const ref = sp?.get("ref");

  useEffect(() => {
    if (ref) onReferral(ref);
  }, [ref, onReferral]);

  return null;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: '',
    businessName: '',
    businessType: '',
    mpesaNumber: '',
    referralCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReferralSection, setShowReferralSection] = useState(false);

  // FIX: Use useCallback to memoize the function
  const setReferralCode = useCallback((code: string) => {
    setFormData((p) => ({ ...p, referralCode: code }));
  }, []); // Empty dependency array means this function never changes

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'vendor' && (!formData.businessName || !formData.businessType)) {
      setError('Business name and type are required for vendor registration');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const businessTypes = [
    'Restaurant & Food',
    'Fashion & Apparel',
    'Electronics & Gadgets',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Grocery & Supermarket',
    'Pharmacy & Health',
    'Sports & Outdoors',
    'Toys & Games',
    'Books & Stationery',
    'Automotive',
    'Other'
  ];

  const EyeOpen = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosed = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

  return (
    <>
      {/* ✅ Wrap in Suspense */}
      <Suspense fallback={null}>
        <ReferralPreloader onReferral={setReferralCode} />
      </Suspense>
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Join Our Marketplace
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start your journey with us
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Referral Notice */}
          {formData.referralCode && (
            <div className="bg-[#bf2c7e] text-white p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">You're joining with a referral link!</span>
              </div>
              <p className="text-sm opacity-90 mt-1">
                Referral code: <strong>{formData.referralCode}</strong>
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      placeholder="+254 700 000 000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="mpesaNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Number (for payments)
                  </label>
                  <input
                    id="mpesaNumber"
                    name="mpesaNumber"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    placeholder="254 700 000 000"
                    value={formData.mpesaNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Account Type
              </h3>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  I want to join as a *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor/Seller</option>
                  <option value="delivery">Delivery Partner</option>
                </select>
              </div>
            </div>

            {/* Vendor-specific fields */}
            {formData.role === 'vendor' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Business Information
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-blue-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your business name"
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-blue-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      required
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.businessType}
                      onChange={handleChange}
                    >
                      <option value="">Select your business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="bg-blue-100 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Vendor accounts require verification before you can start selling. 
                      You'll be approved by the admin once your application is received.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Referral Section */}
            {!formData.referralCode && (
              <div className="border border-gray-200 rounded-lg p-4">
                <button
                  type="button"
                  onClick={() => setShowReferralSection(!showReferralSection)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Have a referral code? 
                    <span className="text-[#bf2c7e] ml-1">
                      {showReferralSection ? 'Hide' : 'Add it here'}
                    </span>
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${showReferralSection ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showReferralSection && (
                  <div className="mt-4">
                    <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Code (Optional)
                    </label>
                    <input
                      id="referralCode"
                      name="referralCode"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a referral code if you were invited by a friend
                    </p>
                  </div>
                )}
              </div>
            )}
            <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security
            </h3>

            <div className="space-y-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Create a strong password (min. 8 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  />
                  <button
                    type="button"
                    aria-label="Toggle confirm-password visibility"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirm ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>
            </div>
          </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#bf2c7e] text-white py-4 rounded-lg hover:bg-[#a8256c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </span>
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>
                By creating an account, you agree to our{' '}
                <Link href="" className="text-[#bf2c7e] hover:text-[#a8256c]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="" className="text-[#bf2c7e] hover:text-[#a8256c]">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                {onSwitchToLogin ? (
                  <button
                    onClick={onSwitchToLogin}
                    className="text-[#bf2c7e] hover:text-[#a8256c] font-medium transition-colors"
                  >
                    Sign in here
                  </button>
                ) : (
                  <Link href="/login" className="text-[#bf2c7e] hover:text-[#a8256c] font-medium transition-colors">
                    Sign in here
                  </Link>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}