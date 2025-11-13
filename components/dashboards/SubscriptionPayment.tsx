// components/dashboards/SubscriptionPayment.tsx
import { useState } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

export default function SubscriptionPayment() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [phone, setPhone] = useState('');

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Vendor',
      price: 3000,
      period: 'month',
      features: [
        'Up to 50 products',
        'Basic analytics',
        'Standard support',
        'Mobile app access'
      ]
    },
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);

  const handlePayment = async () => {
    setError('');
    setSuccess('');

    if (!phone || !/^(\+?254|0)?[17]\d{8}$/.test(phone)) {
      setError('Please enter a valid M-Pesa number.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('/api/payments/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          amount: subscriptionPlans.find(plan => plan.id === selectedPlan)?.price,
          phone: phone.startsWith('+') ? phone : `+254${phone.replace(/^0/, '')}`
        }),
      });

      if (!response.ok) throw new Error('Payment failed. Please try again.');

      setSuccess('Subscription payment processed successfully!');
      setShowPaymentForm(false);
      setPhone('');
    } catch (error: any) {
      setError(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Subscription Management</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Active</span>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-[#bf2c7e] to-[#a8256c] rounded-lg p-4 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Current Plan</p>
            <h4 className="text-xl font-bold">Professional</h4>
            <p className="text-sm opacity-90">Renews on Dec 15, 2024</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatPrice(3000)}</p>
            <p className="text-sm opacity-90">per month</p>
          </div>
        </div>
      </div>

      {/* Upgrade Plans */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Upgrade Your Plan</h4>
        <div className="grid grid-cols-1 gap-4">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-[#bf2c7e] ring-2 ring-[#bf2c7e] ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center mb-4">
                <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-600 text-sm">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Section */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Payment Method</h4>
        <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-6 bg-green-500 rounded flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">M-Pesa</p>
              <p className="text-sm text-gray-600">Pay via M-Pesa</p>
            </div>
          </div>
          <span className="text-green-600 text-sm font-medium">Connected</span>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>
      )}

      {/* Payment Form or Button */}
      {!showPaymentForm ? (
        <button
          onClick={() => setShowPaymentForm(true)}
          className="w-full bg-[#bf2c7e] text-white py-3 px-4 rounded-lg hover:bg-[#a8256c] transition-all font-medium shadow-sm hover:shadow-md"
        >
          Pay {formatPrice(subscriptionPlans.find(plan => plan.id === selectedPlan)?.price || 0)} Now
        </button>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter M-Pesa Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0712345678 or +254712345678"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
          />

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowPaymentForm(false)}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-[#bf2c7e] text-white px-5 py-2 rounded-lg hover:bg-[#a8256c] transition-all font-medium disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          You will receive an M-Pesa prompt to complete the payment.
        </p>
      </div>
    </div>
  );
}
