// components/ReferralDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface ReferralData {
  referralCode: string;
  referralCount: number;
  referredBy?: string;
}

export default function ReferralDashboard() {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

 // In components/ReferralDashboard.tsx
const fetchReferralData = async () => {
  try {
    const response = await fetch('/api/auth/me'); // Use your existing endpoint
    if (response.ok) {
      const data = await response.json();
      setReferralData({
        referralCode: data.referralCode,
        referralCount: data.referralCount || 0,
        referredBy: data.referredBy
      });
    }
  } catch (error) {
    console.error('Failed to fetch referral data:', error);
    toast.error('Failed to load referral data');
  } finally {
    setLoading(false);
  }
};

  const referralLink = `${window.location.origin}/register${referralData?.referralCode ? `?ref=${referralData.referralCode}` : ''}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Referral Program
      </h3>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#bf2c7e] text-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{referralData?.referralCount || 0}</div>
          <div className="text-sm opacity-90">People Referred</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-900">{referralData?.referralCode || 'N/A'}</div>
          <div className="text-sm text-gray-600">Your Code</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Referral Link
        </label>
        <div className="flex">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg text-gray-900 bg-gray-50 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="bg-[#bf2c7e] text-white px-4 py-3 rounded-r-lg hover:bg-[#a8256c] transition-colors font-medium text-sm"
          >
            Copy
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this link with friends and earn rewards when they sign up!
        </p>
      </div>

      {/* Referral Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2 text-sm">How it works</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Share your unique referral link with friends</li>
          <li>• Get notified when someone signs up using your link</li>
          <li>• Earn rewards for every successful referral</li>
          <li>• Track your referrals in real-time</li>
        </ul>
      </div>

      {/* Referred By Section */}
      {referralData?.referredBy && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">You were referred by</span>
          </div>
          <p className="text-sm text-green-700 mt-1">Referral code: <strong>{referralData.referredBy}</strong></p>
        </div>
      )}
    </div>
  );
}