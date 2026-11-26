// app/shd-pages/membership/withdraw/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/shd-contexts/AuthContext';

const MIN_WITHDRAWAL = 10;
const MAX_WITHDRAWAL = 50000;

export default function WithdrawPage() {
  const router = useRouter();
  const { organizationId, user: authUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState<
    { type: 'success' | 'error'; text: string } | null
  >(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await fetch('/api/shd-api/api/membership/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.user.availableBalance || 0);
        setUserName(data.user.name || '');
        setPhoneNumber(data.user.phoneNumber || authUser?.phoneNumber || '');
      }
    } catch (e) {
      console.error('Error loading withdraw page:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n: number) =>
    `KSh ${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage(null);

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (numericAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal is ${formatCurrency(MIN_WITHDRAWAL)}`);
      return;
    }
    if (numericAmount > MAX_WITHDRAWAL) {
      setError(`Maximum withdrawal is ${formatCurrency(MAX_WITHDRAWAL)}`);
      return;
    }
    if (numericAmount > balance) {
      setError(`Insufficient savings. Available: ${formatCurrency(balance)}`);
      return;
    }
    if (!phoneNumber) {
      setError('Please enter the phone number to receive the funds');
      return;
    }

    const orgId =
      organizationId ||
      localStorage.getItem('organizationId') ||
      authUser?.organizationId;

    if (!orgId) {
      setError('No organization selected. Please refresh or log in again.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/shd-api/api/withdrawals/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numericAmount,
          organizationId: orgId,
          phoneNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Withdrawal failed' });
        return;
      }

      setMessage({
        type: 'success',
        text: `💸 Withdrawal initiated. ${formatCurrency(
          numericAmount
        )} will be sent to ${phoneNumber} shortly.`,
      });
      setAmount('');

      // Refresh balance from server
      await fetchData();

      setTimeout(() => setMessage(null), 8000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'An error occurred. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-secondary">
              🏦 Withdraw Funds
            </h1>
            <p className="text-muted mt-1">
              Cash out from your savings straight to M-Pesa
            </p>
          </div>
          <Link
            href="/shd-pages/membership/dashboard"
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md text-primary font-medium transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Balance card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-green-100 text-sm">Welcome back,</p>
              <h2 className="text-xl font-bold">{userName || 'Member'}</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <p className="text-green-100 text-xs">Available Savings</p>
              <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <div className="flex items-center gap-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-surface p-6 sm:p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Amount to Withdraw
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">
                KSh
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={MIN_WITHDRAWAL}
                max={Math.min(MAX_WITHDRAWAL, balance)}
                step="1"
                required
                placeholder={`Min ${MIN_WITHDRAWAL} – Max ${Math.min(
                  MAX_WITHDRAWAL,
                  balance
                ).toLocaleString()}`}
                className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pl-16 focus:outline-none focus:border-primary focus:bg-white transition-colors text-secondary"
              />
            </div>
            <div className="flex flex-wrap justify-between text-xs text-muted mt-1.5">
              <span>Min: {formatCurrency(MIN_WITHDRAWAL)}</span>
              <span>
                Max: {formatCurrency(Math.min(MAX_WITHDRAWAL, balance))}
              </span>
            </div>

            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickAmounts.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setAmount(String(q))}
                  disabled={q > balance}
                  className="px-3 py-1.5 rounded-lg bg-surface text-secondary text-sm font-medium hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {formatCurrency(q)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(String(Math.floor(balance)))}
                disabled={balance < MIN_WITHDRAWAL}
                className="px-3 py-1.5 rounded-lg bg-surface text-secondary text-sm font-medium hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="2547XXXXXXXX or 07XXXXXXXX"
              required
              className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-colors text-secondary"
            />
            <p className="text-xs text-muted mt-1.5">
              Funds will be sent to this number via M-Pesa B2C. It can differ
              from your registered number.
            </p>
          </div>

          {/* Summary */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-surface/40 rounded-xl p-5 border border-surface">
              <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
                <span>📊</span> Withdrawal Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-surface">
                  <span className="text-muted">Amount</span>
                  <span className="font-bold text-secondary">
                    {formatCurrency(parseFloat(amount))}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface">
                  <span className="text-muted">Recipient</span>
                  <span className="font-medium text-secondary">
                    {phoneNumber || '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Balance after</span>
                  <span className="font-medium text-secondary">
                    {formatCurrency(
                      Math.max(0, balance - parseFloat(amount))
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  ⏳ Withdrawals are processed asynchronously. The funds will
                  arrive on M-Pesa within a few minutes. Your balance is
                  deducted immediately to reserve the funds.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || balance < MIN_WITHDRAWAL}
            className="w-full bg-primary hover:bg-accent-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>💸</span> Withdraw Now
              </span>
            )}
          </button>

          {balance < MIN_WITHDRAWAL && (
            <p className="text-sm text-center text-muted">
              You need at least {formatCurrency(MIN_WITHDRAWAL)} in savings to
              withdraw.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}