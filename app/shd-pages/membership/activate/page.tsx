// C:\Users\USER\Desktop\Projects\my-app\app\membership\activate\page.tsx
/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ActivateMembership() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    initialDeposit: '100'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const depositAmount = parseFloat(formData.initialDeposit);
    if (depositAmount < 100) {
      setError('Minimum initial deposit is KSh 100');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/membership/activate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: formData.password,
          initialDeposit: depositAmount
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Membership activated successfully!');
        router.push('/membership/dashboard');
      } else {
        setError(data.error || 'Failed to activate membership');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-10">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold text-gray-900">Become a Member</h1>
          <p className="text-gray-600 mt-2">
            Unlock exclusive benefits and investment opportunities
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-2">✨ Membership Benefits:</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>✅ Access to investment opportunities</li>
            <li>✅ Earn up to 25% returns on investments</li>
            <li>✅ Save and grow your money</li>
            <li>✅ Exclusive member perks</li>
            <li>✅ Referral bonuses</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Deposit (Minimum KSh 100)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">KSh</span>
              <input
                type="number"
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleChange}
                required
                min="100"
                className="w-full border border-gray-300 rounded-lg p-3 pl-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum deposit of KSh 100 required</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Processing...' : '💰 Activate Membership'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ActivateMembership() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    initialDeposit: '100'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const depositAmount = parseFloat(formData.initialDeposit);
    if (depositAmount < 100) {
      setError('Minimum initial deposit is KSh 100');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/membership/activate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: formData.password,
          initialDeposit: depositAmount
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Membership activated successfully!');
        router.push('/membership/dashboard');
      } else {
        setError(data.error || 'Failed to activate membership');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-2xl sm:text-3xl font-black text-secondary">Become a Member</h1>
            <p className="text-muted mt-2">
              Unlock exclusive benefits and investment opportunities
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Benefits Card */}
          <div className="bg-surface/50 rounded-xl p-5 mb-6 border border-surface">
            <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
              <span className="text-primary">✨</span>
              Membership Benefits:
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                Access to investment opportunities
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                Earn up to 25% returns on investments
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                Save and grow your money
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                Exclusive member perks
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                Referral bonuses
              </li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                placeholder="Enter your current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Initial Deposit <span className="text-muted font-normal">(Minimum KSh 100)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">KSh</span>
                <input
                  type="number"
                  name="initialDeposit"
                  value={formData.initialDeposit}
                  onChange={handleChange}
                  required
                  min="100"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 pl-16 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter amount"
                />
              </div>
              <p className="text-xs text-muted mt-1.5">
                💰 Minimum deposit of KSh 100 required
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                '💰 Activate Membership'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}