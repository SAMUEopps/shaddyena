// app/dashboard/member/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Shield,
  Gift,
  Target,
  Truck,
  Rocket,
  Plus,
  Eye,
  History,
  LogOut,
  User,
  Settings,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardData {
  user: {
    name: string;
    email: string;
    membershipNumber: string;
  };
  savingsAccount: {
    totalSaved: number;
    availableBalance: number;
    investedBalance: number;
    contributionType: string;
    contributionAmount: number;
  };
  investments?: Array<{
    _id: string;
    fund: {
      title: string;
      category: string;
    };
    investedAmount: number;
    expectedReturn: number;
    maturityDate: string;
    status: string;
    isMatured: boolean;
  }>;
  summary?: {
    totalInvested: number;
    totalExpectedReturns: number;
    activeInvestments: number;
  };
}

export default function MemberDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(100);
  const [depositing, setDepositing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, investmentsRes] = await Promise.all([
        fetch('/api/membership/profile'),
        fetch('/api/investments/my-investments'),
      ]);

      if (!profileRes.ok) {
        if (profileRes.status === 401) {
          router.push('/membership/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const profileData = await profileRes.json();
      const investmentsData = investmentsRes.ok ? await investmentsRes.json() : { investments: [], summary: {} };

      setDashboardData({
        user: profileData.user,
        savingsAccount: profileData.savingsAccount,
        investments: investmentsData.investments,
        summary: investmentsData.summary,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  /*const handleDeposit = async () => {
    if (depositAmount < 100) {
      toast.error('Minimum deposit is KES 100');
      return;
    }

    setDepositing(true);
    try {
      const response = await fetch('/api/savings/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depositAmount, paymentMethod: 'mpesa' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Deposit failed');
      }

      toast.success(`Successfully deposited KES ${depositAmount.toLocaleString()}`);
      setShowDepositModal(false);
      setDepositAmount(100);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDepositing(false);
    }
  };*/

  const handleDeposit = async () => {
    if (depositAmount < 100) {
      toast.error('Minimum deposit is KES 100');
      return;
    }

    // Validate phone number
    const phoneRegex = /^(?:254|0)[17]\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Please enter a valid phone number (e.g., 0712345678 or 254712345678)');
      return;
    }

    setDepositing(true);
    try {
      const response = await fetch('/api/savings/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: depositAmount, 
          phoneNumber: phoneNumber,
          paymentMethod: 'mpesa' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Deposit failed');
      }

      toast.success(data.message || 'STK Push sent to your phone. Please complete the payment.');
      setShowDepositModal(false);
      setDepositAmount(100);
      setPhoneNumber('');
      
      // Don't refresh immediately - wait for callback
      // Show pending status
      toast.loading('Waiting for payment confirmation...', { duration: 30000 });
      
      // Poll for transaction status or refresh after delay
      setTimeout(() => {
        fetchDashboardData();
      }, 15000);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDepositing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/membership/logout', { method: 'POST' });
      router.push('/membership');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-[var(--color-primary)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h2>
          <p className="text-[var(--color-text-muted)] mb-4">Please login to access your dashboard</p>
          <Link href="/membership/login" className="text-[var(--color-primary)] hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const { user, savingsAccount, investments, summary } = dashboardData;

  return (
    <div className="min-h-screen bg-[var(--color-background-soft)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">Member Dashboard</h1>
              <p className="text-sm text-[var(--color-text-muted)]">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-[var(--color-text-muted)]">Member No.</p>
                <p className="text-sm font-mono font-semibold text-[var(--color-text)]">{user.membershipNumber}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
              >
                <LogOut className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8 opacity-80" />
              <span className="text-xs opacity-80">Available</span>
            </div>
            <p className="text-3xl font-bold">KES {savingsAccount.availableBalance.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-2">Available Balance</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-[var(--color-primary-soft)]/20 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">KES {savingsAccount.totalSaved.toLocaleString()}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Total Saved</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">KES {savingsAccount.investedBalance.toLocaleString()}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Invested Balance</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">
              {summary?.activeInvestments || 0}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Active Investments</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Deposit Funds
          </button>
          <Link
            href="/membership/investments"
            className="flex items-center justify-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] py-3 rounded-xl font-semibold hover:border-[var(--color-primary)]/50 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            Invest Funds
          </Link>
          <Link
            href="/dashboard/member/withdraw"
            className="flex items-center justify-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] py-3 rounded-xl font-semibold hover:border-[var(--color-primary)]/50 transition-colors"
          >
            <ArrowDownRight className="w-5 h-5" />
            Withdraw Funds
          </Link>
          <Link
            href="/dashboard/member/statements"
            className="flex items-center justify-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] py-3 rounded-xl font-semibold hover:border-[var(--color-primary)]/50 transition-colors"
          >
            <Eye className="w-5 h-5" />
            View Statements
          </Link>
        </div>

        {/* Active Investments */}
        {investments && investments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Active Investments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments.map((investment) => (
                <div key={investment._id} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-[var(--color-text)]">{investment.fund.title}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Invested: KES {investment.investedAmount.toLocaleString()}
                      </p>
                    </div>
                    {investment.isMatured ? (
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full">Matured</span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs rounded-full">Active</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Expected Return:</span>
                      <span className="font-semibold text-green-600">KES {investment.expectedReturn.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Maturity Date:</span>
                      <span className="text-[var(--color-text)]">{new Date(investment.maturityDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contribution Info */}
        <div className="bg-gradient-to-r from-[var(--color-primary-alt)]/10 to-[var(--color-primary)]/10 rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-[var(--color-text)] mb-1">Your Contribution Plan</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {savingsAccount.contributionType.charAt(0).toUpperCase() + savingsAccount.contributionType.slice(1)} • 
                KES {savingsAccount.contributionAmount.toLocaleString()} per contribution
              </p>
            </div>
            <Link
              href="/dashboard/member/update-plan"
              className="text-[var(--color-primary)] hover:underline text-sm"
            >
              Update Plan →
            </Link>
          </div>
        </div>
      </main>

      {/* Deposit Modal */}
      {/*{showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Deposit Funds</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Amount (KES)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Math.max(100, parseInt(e.target.value) || 0))}
                min={100}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Minimum KES 100</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={depositing}
                className="flex-1 bg-[var(--color-primary)] text-white py-2 rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
              >
                {depositing ? 'Processing...' : 'Deposit'}
              </button>
            </div>
          </div>
        </div>
      )}*/}
            {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Deposit Funds</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Amount (KES)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Math.max(100, parseInt(e.target.value) || 0))}
                min={100}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Minimum KES 100</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0712345678"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Enter the M-Pesa number you want to pay from
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setPhoneNumber('');
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={depositing || !phoneNumber}
                className="flex-1 bg-[var(--color-primary)] text-white py-2 rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {depositing ? 'Processing...' : 'Send STK Push'}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
              <p className="text-xs text-[var(--color-text-muted)]">
                <strong>Note:</strong> You will receive a prompt on your phone to complete the payment. 
                This may take a few seconds.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}