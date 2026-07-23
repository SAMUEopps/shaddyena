// C:\Users\USER\Desktop\Projects\my-app\app\membership\invest\page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const INVESTMENT_TYPES = [
  {
    id: 'TRANSPORT',
    name: '🚚 Transport',
    description: 'Invest in logistics and transportation services',
    minAmount: 1000,
    maxAmount: 100000,
    returnRate: '15%',
    duration: '6 months'
  },
  {
    id: 'MARKETING',
    name: '📢 Marketing',
    description: 'Invest in digital marketing and advertising',
    minAmount: 500,
    maxAmount: 50000,
    returnRate: '12%',
    duration: '4 months'
  },
  {
    id: 'TECHNOLOGY',
    name: '💻 Technology',
    description: 'Invest in tech startups and innovation',
    minAmount: 2000,
    maxAmount: 200000,
    returnRate: '20%',
    duration: '12 months'
  },
  {
    id: 'STARTUP',
    name: '🚀 Startup',
    description: 'Invest in promising startups and new businesses',
    minAmount: 5000,
    maxAmount: 500000,
    returnRate: '25%',
    duration: '18 months'
  }
];

export default function Invest() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/membership/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.user.availableBalance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const selectedInvestment = INVESTMENT_TYPES.find(t => t.id === selectedType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const investmentAmount = parseFloat(amount);
    if (!selectedType) {
      setError('Please select an investment type');
      setLoading(false);
      return;
    }

    if (!selectedInvestment) {
      setError('Invalid investment type');
      setLoading(false);
      return;
    }

    if (investmentAmount < selectedInvestment.minAmount) {
      setError(`Minimum investment is KSh ${selectedInvestment.minAmount}`);
      setLoading(false);
      return;
    }

    if (investmentAmount > selectedInvestment.maxAmount) {
      setError(`Maximum investment is KSh ${selectedInvestment.maxAmount}`);
      setLoading(false);
      return;
    }

    if (investmentAmount > balance) {
      setError(`Insufficient balance. Available: KSh ${balance}`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selectedType,
          amount: investmentAmount
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Investment created successfully!');
        router.push('/membership/dashboard');
      } else {
        setError(data.error || 'Investment failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">💼 Make an Investment</h1>
          <Link href="/membership/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Available Balance</p>
            <p className="text-2xl font-bold text-purple-600">KSh {balance}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {INVESTMENT_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`bg-white rounded-xl shadow p-6 cursor-pointer transition ${
                selectedType === type.id
                  ? 'ring-2 ring-purple-600 shadow-lg'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{type.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
                {selectedType === type.id && (
                  <span className="text-purple-600">✓</span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Return Rate</p>
                  <p className="font-semibold text-green-600">{type.returnRate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-semibold">{type.duration}</p>
                </div>
                <div>
                  <p className="text-gray-500">Min Amount</p>
                  <p className="font-semibold">KSh {type.minAmount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Max Amount</p>
                  <p className="font-semibold">KSh {type.maxAmount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedInvestment && (
          <div className="bg-white rounded-xl shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">KSh</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={selectedInvestment.minAmount}
                    max={selectedInvestment.maxAmount}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 pl-12 focus:ring-2 focus:ring-purple-500"
                    placeholder={`Min ${selectedInvestment.minAmount} - Max ${selectedInvestment.maxAmount}`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Min: KSh {selectedInvestment.minAmount} | Max: KSh {selectedInvestment.maxAmount}
                </p>
              </div>

              {selectedInvestment && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Investment Summary</h4>
                  <div className="space-y-1 text-sm text-purple-700">
                    <p>Type: {selectedInvestment.name}</p>
                    <p>Expected Return: {selectedInvestment.returnRate}</p>
                    <p>Duration: {selectedInvestment.duration}</p>
                    {amount && parseFloat(amount) > 0 && (
                      <p className="font-bold">
                        Expected Return Amount: KSh {(parseFloat(amount) * (1 + parseFloat(selectedInvestment.returnRate) / 100)).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Processing...' : '💰 Invest Now'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}*/


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const INVESTMENT_TYPES = [
  {
    id: 'TRANSPORT',
    name: '🚚 Transport',
    description: 'Invest in logistics and transportation services',
    minAmount: 1000,
    maxAmount: 100000,
    returnRate: '15%',
    duration: '6 months'
  },
  {
    id: 'MARKETING',
    name: '📢 Marketing',
    description: 'Invest in digital marketing and advertising',
    minAmount: 500,
    maxAmount: 50000,
    returnRate: '12%',
    duration: '4 months'
  },
  {
    id: 'TECHNOLOGY',
    name: '💻 Technology',
    description: 'Invest in tech startups and innovation',
    minAmount: 2000,
    maxAmount: 200000,
    returnRate: '20%',
    duration: '12 months'
  },
  {
    id: 'STARTUP',
    name: '🚀 Startup',
    description: 'Invest in promising startups and new businesses',
    minAmount: 5000,
    maxAmount: 500000,
    returnRate: '25%',
    duration: '18 months'
  }
];

export default function Invest() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/membership/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.user.availableBalance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const selectedInvestment = INVESTMENT_TYPES.find(t => t.id === selectedType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage(null);
    setLoading(true);

    const investmentAmount = parseFloat(amount);
    if (!selectedType) {
      setError('Please select an investment type');
      setLoading(false);
      return;
    }

    if (!selectedInvestment) {
      setError('Invalid investment type');
      setLoading(false);
      return;
    }

    if (investmentAmount < selectedInvestment.minAmount) {
      setError(`Minimum investment is KSh ${selectedInvestment.minAmount.toLocaleString()}`);
      setLoading(false);
      return;
    }

    if (investmentAmount > selectedInvestment.maxAmount) {
      setError(`Maximum investment is KSh ${selectedInvestment.maxAmount.toLocaleString()}`);
      setLoading(false);
      return;
    }

    if (investmentAmount > balance) {
      setError(`Insufficient balance. Available: KSh ${balance.toLocaleString()}`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selectedType,
          amount: investmentAmount
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '🎉 Investment created successfully!' });
        setTimeout(() => {
          router.push('/membership/dashboard');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Investment failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-secondary">
              💼 Make an Investment
            </h1>
            <p className="text-muted mt-1">
              Grow your money with our investment opportunities
            </p>
          </div>
          <Link 
            href="/membership/dashboard" 
            className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 mb-6 border border-surface">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-muted font-medium">Available Balance</p>
            <p className="text-2xl sm:text-3xl font-black text-primary">
              KSh {balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Investment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {INVESTMENT_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => {
                setSelectedType(type.id);
                setError('');
                setMessage(null);
              }}
              className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border-2 ${
                selectedType === type.id
                  ? 'border-primary shadow-md'
                  : 'border-surface hover:border-primary/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-secondary">{type.name}</h3>
                  <p className="text-sm text-muted mt-1">{type.description}</p>
                </div>
                {selectedType === type.id && (
                  <span className="text-primary text-2xl">✓</span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted">Return Rate</p>
                  <p className="font-bold text-green-600">{type.returnRate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Duration</p>
                  <p className="font-bold text-secondary">{type.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Min Amount</p>
                  <p className="font-bold text-secondary">KSh {type.minAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Max Amount</p>
                  <p className="font-bold text-secondary">KSh {type.maxAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Investment Form */}
        {selectedInvestment && (
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 border border-surface">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">KSh</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={selectedInvestment.minAmount}
                    max={selectedInvestment.maxAmount}
                    required
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 pl-16 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder={`Min ${selectedInvestment.minAmount.toLocaleString()} - Max ${selectedInvestment.maxAmount.toLocaleString()}`}
                  />
                </div>
                <div className="flex flex-wrap justify-between text-xs text-muted mt-1.5">
                  <span>Min: KSh {selectedInvestment.minAmount.toLocaleString()}</span>
                  <span>Max: KSh {selectedInvestment.maxAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Investment Summary */}
              <div className="bg-surface/30 rounded-xl p-5 border border-surface">
                <h4 className="font-bold text-secondary mb-3">Investment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Type</span>
                    <span className="font-medium text-secondary">{selectedInvestment.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Expected Return</span>
                    <span className="font-medium text-green-600">{selectedInvestment.returnRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Duration</span>
                    <span className="font-medium text-secondary">{selectedInvestment.duration}</span>
                  </div>
                  {amount && parseFloat(amount) > 0 && (
                    <div className="border-t border-surface pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Investment Amount</span>
                        <span className="font-bold text-secondary">KSh {parseFloat(amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Expected Return Amount</span>
                        <span className="font-bold text-primary">
                          KSh {(parseFloat(amount) * (1 + parseFloat(selectedInvestment.returnRate) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <div className="flex items-center gap-2">
                    <span>❌</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

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
                  '💰 Invest Now'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}