'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function MarketerRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    payoutMethod: 'mpesa' as 'mpesa' | 'bank',
    payoutPhone: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate payout details
    if (formData.payoutMethod === 'mpesa' && !formData.payoutPhone) {
      setError('Please provide your M-Pesa phone number');
      setLoading(false);
      return;
    }
    if (
      formData.payoutMethod === 'bank' &&
      (!formData.bankName || !formData.accountNumber || !formData.accountName)
    ) {
      setError('Please complete your bank payout details');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/shd-api/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          role: 'marketer',
          referralCode: formData.referralCode || undefined,
          payoutDetails:
            formData.payoutMethod === 'mpesa'
              ? { phoneNumber: formData.payoutPhone }
              : {
                  bankName: formData.bankName,
                  accountNumber: formData.accountNumber,
                  accountName: formData.accountName,
                },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          'Marketer registration successful! Your account is pending approval.'
        );
        router.push('/shd-pages/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📣</div>
            <h2 className="text-2xl sm:text-3xl font-black text-secondary">
              Become a Marketer
            </h2>
            <p className="mt-2 text-muted">
              Earn commissions by referring vendors, riders & customers to
              Shaddyna
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="254712345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Payout Method */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Preferred Payout Method
              </label>
              <select
                name="payoutMethod"
                value={formData.payoutMethod}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {formData.payoutMethod === 'mpesa' ? (
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  M-Pesa Phone Number
                </label>
                <input
                  type="text"
                  name="payoutPhone"
                  value={formData.payoutPhone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="254712345678"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Equity Bank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="0123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Referral Code{' '}
                <span className="text-muted font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full border-2 border-surface bg-background/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                placeholder="Enter referral code"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting application...
                </span>
              ) : (
                'Apply as Marketer'
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="text-center">
              <Link
                href="/shd-pages/login"
                className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium"
              >
                Already have an account? Login →
              </Link>
            </div>
            <div className="border-t border-surface pt-6 text-center">
              <Link
                href="/shd-pages/register"
                className="text-muted hover:text-secondary transition-colors duration-200 text-sm"
              >
                ← Back to customer registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}