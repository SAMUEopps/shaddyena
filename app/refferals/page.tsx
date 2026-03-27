"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// -------------------------------
// TYPES
// -------------------------------
interface ReferredUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface ReferralData {
  referrals: ReferredUser[];
  referredByUser?: {
    firstName: string;
    lastName: string;
    referralCode: string;
  };
}

interface ReferralPayment {
  paymentId: string;
  amount: number;
  referralBonus: number;
  user: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  referredVendor: {
    businessName: string;
    email: string;
  };
  createdAt: string;
}

interface ReferralEarningsSummary {
  totalEarnings: number;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  thisMonthEarnings: number;
  payments: ReferralPayment[];
}

// -------------------------------
// REFERRALS TAB COMPONENT
// -------------------------------
export default function ReferralsTab() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralEarnings, setReferralEarnings] = useState<ReferralEarningsSummary>({
    totalEarnings: 0,
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    thisMonthEarnings: 0,
    payments: []
  });

  // -------------------------------
  // FETCH DATA
  // -------------------------------
  const fetchAllData = async () => {
    try {
      setLoading(true);
      await fetchReferralData();
      await fetchReferralEarnings();
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referrals');
      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    }
  };

  const fetchReferralEarnings = async () => {
    try {
      const response = await fetch("/api/payments/referral-earnings", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        const data = await response.json();
        setReferralEarnings(data);
      }
    } catch (error) {
      console.error("Failed to fetch referral earnings:", error);
    }
  };

  // -------------------------------
  // UTILITY FUNCTIONS
  // -------------------------------
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const copyToClipboard = async (text: string, message: string = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register${user?.referralCode ? `?ref=${user.referralCode}` : ''}`
    : '';

  // -------------------------------
  // HANDLERS
  // -------------------------------
  const handleRefresh = async () => {
    await refreshUser();
    await fetchAllData();
    toast.success('Data updated!');
  };

  // -------------------------------
  // USE EFFECT
  // -------------------------------
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  // -------------------------------
  // LOADING STATE
  // -------------------------------
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-gray-800 font-bold">Referrals</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#bf2c7e]"></div>
        </div>
      </div>
    );
  }

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-800 font-bold">Referrals</h2>
          <p className="text-gray-600 mt-1">
            Share your referral link and earn 20% commission
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Referral Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Referrals */}
          <div className="bg-gradient-to-r from-[#bf2c7e]/10 to-[#bf2c7e]/5 p-6 rounded-xl border border-[#bf2c7e]/20">
            <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Referrals</h3>
            <p className="text-3xl font-bold text-[#bf2c7e]">{user?.referralCount || 0}</p>
            <p className="text-gray-600 text-sm mt-2">People joined using your code</p>
          </div>

          {/* Referral Earnings */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-gray-800">{formatCurrency(referralEarnings.totalEarnings)}</p>
            <p className="text-gray-600 text-sm mt-2">From {referralEarnings.completedReferrals} completed referrals</p>
          </div>

          {/* People Referred */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg text-gray-700 font-semibold mb-2">People Referred</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {referralData?.referrals?.length || 0}
            </p>
            <p className="text-gray-600 text-sm">
              Total people who joined using your code
            </p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-[#bf2c7e] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Your Referral Link & Code</h3>
          </div>

          {/* Referral Code */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Referral Code
            </label>
            <div className="flex">
              <input
                type="text"
                value={user?.referralCode || 'N/A'}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg text-gray-900 bg-gray-50 text-lg font-mono"
              />
              <button
                onClick={() => copyToClipboard(user?.referralCode || '', 'Referral code copied!')}
                className="bg-[#bf2c7e] text-white px-6 py-3 rounded-r-lg hover:bg-[#a8256c] transition-colors font-medium"
              >
                Copy Code
              </button>
            </div>
          </div>

          {/* Referral Link */}
          <div className="mb-4">
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
                onClick={() => copyToClipboard(referralLink, 'Referral link copied!')}
                className="bg-gray-800 text-white px-6 py-3 rounded-r-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Copy Link
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Share this link with friends and earn 20% of their vendor subscription!
            </p>
          </div>

          {/* Share Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join using my referral link: ${referralLink}`)}`, '_blank')}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
              </svg>
              Share on WhatsApp
            </button>
            <button
              onClick={() => window.open(`mailto:?subject=Join with my referral&body=Join using my referral link: ${referralLink}`, '_blank')}
              className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Share by Email
            </button>
          </div>
        </div>

        {/* Referred Users List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">People You've Referred</h3>
            <span className="text-sm text-gray-600">
              {referralData?.referrals?.length || 0} people
            </span>
          </div>

          {referralData?.referrals && referralData.referrals.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {referralData.referrals.map((referral) => (
                <div key={referral._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#bf2c7e]/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-[#bf2c7e]">
                        {referral.firstName.charAt(0)}{referral.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {referral.firstName} {referral.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{referral.email}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Joined {formatDate(referral.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">No one has joined using your referral code yet.</p>
              <p className="text-sm text-gray-500">Share your link to start earning rewards!</p>
            </div>
          )}
        </div>

        {/* Referred By Section */}
        {referralData?.referredByUser && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <h4 className="text-lg font-semibold text-green-800">You were referred by</h4>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Referrer Name</p>
                  <p className="font-medium text-gray-900">
                    {referralData.referredByUser.firstName} {referralData.referredByUser.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Referral Code Used</p>
                  <p className="font-medium text-[#bf2c7e] font-mono">
                    {referralData.referredByUser.referralCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">How Referral Earnings Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">Share Your Link</h4>
              <p className="text-gray-600 text-sm">
                Share your unique referral link with potential vendors
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">They Subscribe</h4>
              <p className="text-gray-600 text-sm">
                When they subscribe as vendors using your link
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#bf2c7e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#bf2c7e]">3</span>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">Earn 20% Bonus</h4>
              <p className="text-gray-600 text-sm">
                Receive 20% of their subscription amount as referral bonus
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg">
              <span className="text-gray-600 mr-2">Commission Rate:</span>
              <span className="font-bold text-green-600">20%</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Of every vendor subscription through your referral</p>
          </div>
        </div>
      </div>
    </div>
  );
}