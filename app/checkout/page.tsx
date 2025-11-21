/*"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface ShippingData {
  address: string;
  city: string;
  country: string;
  phone: string;
  instructions?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [shippingData, setShippingData] = useState<ShippingData>({
    address: '',
    city: '',
    country: 'Kenya',
    phone: user?.phone || '',
    instructions: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [error, setError] = useState('');
  const [orderAmount, setOrderAmount] = useState(0);

  useEffect(() => {
    if (cartItems.length === 0 && !orderRef) {
      router.push('/cart');
    }
  }, [cartItems, orderRef, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrderDraft = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shipping: shippingData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      setOrderRef(data.accountReference);
      setOrderAmount(totalPrice);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (orderRef) {
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
                <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#bf2c7e] p-6 text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Order Ready for Payment</h1>
              <p className="opacity-90">Complete your payment via M-PESA to confirm your order</p>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Payment Instructions
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">1</div>
                      <p className="text-sm font-medium text-gray-700">Go to M-PESA</p>
                      <p className="text-xs text-gray-500">Lipa na M-PESA</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">2</div>
                      <p className="text-sm font-medium text-gray-700">Enter Paybill</p>
                      <p className="text-xs text-gray-500">Business Number</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">3</div>
                      <p className="text-sm font-medium text-gray-700">Enter Details</p>
                      <p className="text-xs text-gray-500">Account & Amount</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Paybill Number:</span>
                      <span className="font-mono text-lg font-bold text-[#bf2c7e]">4184219</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="font-medium text-gray-700">Account Number:</span>
                      <span className="font-mono text-lg font-bold text-gray-900">{orderRef}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="font-medium text-gray-700">Amount:</span>
                      <span className="font-mono text-lg font-bold text-green-600">KSh {orderAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 mb-6">
                <p>Your order will be processed immediately after payment confirmation. You'll receive an SMS confirmation.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Continue Shopping
                </Link>
                <Link
                  href="/orders"
                  className="flex-1 bg-[#bf2c7e] text-white px-6 py-3 rounded-lg hover:bg-[#a8256c] transition-colors font-medium text-center flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  View My Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
            <div className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information *
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Shipping Information
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={shippingData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Nairobi"
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={shippingData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Rwanda">Rwanda</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 700 000 000"
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    rows={3}
                    value={shippingData.instructions}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions..."
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Order Items *
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items ({cartItems.length})
              </h2>
              
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-400 rounded">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-[#bf2c7e]">KSh {(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">KSh {item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary *
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>KSh {totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes</span>
                  <span>Included</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-[#bf2c7e]">KSh {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateOrderDraft}
                disabled={isLoading || !shippingData.address || !shippingData.city || !shippingData.phone}
                className="w-full bg-[#bf2c7e] text-white py-4 rounded-lg hover:bg-[#a8256c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Order...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Proceed to Payment
                  </span>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>You'll be redirected to M-PESA for payment</p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Secure Payment</p>
                    <p className="text-xs text-blue-600">Your payment is processed securely via M-PESA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/

/*"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface ShippingData {
  address: string;
  city: string;
  country: string;
  phone: string;
  instructions?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [shippingData, setShippingData] = useState<ShippingData>({
    address: '',
    city: '',
    country: 'Kenya',
    phone: user?.phone || '',
    instructions: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderAmount, setOrderAmount] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState(user?.phone || '');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !orderRef) {
      router.push('/cart');
    }
  }, [cartItems, orderRef, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrderDraft = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shipping: shippingData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      setOrderRef(data.accountReference);
      setOrderAmount(totalPrice);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSTKPayment = async () => {
    setError('');
    setSuccess('');
    setPaymentLoading(true);

    if (!paymentPhone || !/^(\+?254|0)?[17]\d{8}$/.test(paymentPhone)) {
      setError('Please enter a valid M-Pesa number.');
      setPaymentLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/orders/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: paymentPhone.startsWith('+') ? paymentPhone : `+254${paymentPhone.replace(/^0/, '')}`,
          amount: orderAmount,
          orderRef: orderRef
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed. Please try again.');
      }

      setSuccess('Payment initiated! Check your phone for M-Pesa prompt.');
      setShowPaymentForm(false);
      
      // Clear cart after successful payment initiation
      setTimeout(() => {
        clearCart();
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (orderRef) {
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
                <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#bf2c7e] p-6 text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Order Ready for Payment</h1>
              <p className="opacity-90">Complete your payment via M-PESA to confirm your order</p>
            </div>
            
            <div className="p-6">
              {/* Alerts *
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>
              )}

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Payment Instructions
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">1</div>
                      <p className="text-sm font-medium text-gray-700">Go to M-PESA</p>
                      <p className="text-xs text-gray-500">Lipa na M-PESA</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">2</div>
                      <p className="text-sm font-medium text-gray-700">Enter Paybill</p>
                      <p className="text-xs text-gray-500">Business Number</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">3</div>
                      <p className="text-sm font-medium text-gray-700">Enter Details</p>
                      <p className="text-xs text-gray-500">Account & Amount</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Paybill Number:</span>
                      <span className="font-mono text-lg font-bold text-[#bf2c7e]">4184219</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="font-medium text-gray-700">Account Number:</span>
                      <span className="font-mono text-lg font-bold text-gray-900">{orderRef}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="font-medium text-gray-700">Amount:</span>
                      <span className="font-mono text-lg font-bold text-green-600">KSh {orderAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STK Push Payment Option *
              {!showPaymentForm ? (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Quick Payment Option
                  </h3>
                  <p className="text-blue-700 mb-4">Get an STK push directly to your phone for faster payment</p>
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Pay with STK Push
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter M-Pesa Phone Number</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number for STK Push
                      </label>
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="e.g. 0712345678 or +254712345678"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You will receive an STK push on this number to complete payment
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setShowPaymentForm(false)}
                        disabled={paymentLoading}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSTKPayment}
                        disabled={paymentLoading}
                        className="bg-[#bf2c7e] text-white px-5 py-2 rounded-lg hover:bg-[#a8256c] transition-all font-medium disabled:opacity-50 flex items-center"
                      >
                        {paymentLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          'Send STK Push'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-gray-500 mb-6">
                <p>Your order will be processed immediately after payment confirmation. You'll receive an SMS confirmation.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Continue Shopping
                </Link>
                <Link
                  href="/orders"
                  className="flex-1 bg-[#bf2c7e] text-white px-6 py-3 rounded-lg hover:bg-[#a8256c] transition-colors font-medium text-center flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  View My Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ... rest of the code remains exactly the same ...
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
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
            <div className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information *
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Shipping Information
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={shippingData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Nairobi"
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={shippingData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Rwanda">Rwanda</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 700 000 000"
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    rows={3}
                    value={shippingData.instructions}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions..."
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Order Items *
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items ({cartItems.length})
              </h2>
              
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-400 rounded">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-[#bf2c7e]">KSh {(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">KSh {item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary *
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>KSh {totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes</span>
                  <span>Included</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-[#bf2c7e]">KSh {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateOrderDraft}
                disabled={isLoading || !shippingData.address || !shippingData.city || !shippingData.phone}
                className="w-full bg-[#bf2c7e] text-white py-4 rounded-lg hover:bg-[#a8256c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Order...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Proceed to Payment
                  </span>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>You'll be redirected to M-PESA for payment</p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Secure Payment</p>
                    <p className="text-xs text-blue-600">Your payment is processed securely via M-PESA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/























"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface ShippingData {
  address: string;
  city: string;
  country: string;
  phone: string;
  instructions?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [shippingData, setShippingData] = useState<ShippingData>({
    address: '',
    city: '',
    country: 'Kenya',
    phone: user?.phone || '',
    instructions: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderAmount, setOrderAmount] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState(user?.phone || '');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cartItems.length === 0 && !orderRef) {
      router.push('/cart');
    }
  }, [cartItems, orderRef, router]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Start polling when payment is initiated
  useEffect(() => {
    if (paymentStatus === 'pending' && orderRef) {
      startPolling();
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [paymentStatus, orderRef]);

  const startPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment-status/${orderRef}`);
        const data = await response.json();

        if (data.paid) {
          // Payment confirmed!
          setPaymentStatus('success');
          setSuccess('Payment confirmed! Your order has been placed successfully.');
          
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }

          // Redirect after 3 seconds
          setTimeout(() => {
            clearCart();
            router.push('/?tab=orders');
          }, 3000);
        } else if (data.status === 'FAILED') {
          // Payment failed
          setPaymentStatus('failed');
          setError('Payment failed. Please try again.');
          
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }
        }
        // If still pending, continue polling
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 3000); // Check every 3 seconds
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrderDraft = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shipping: shippingData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      setOrderRef(data.accountReference);
      setOrderAmount(totalPrice);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSTKPayment = async () => {
    setError('');
    setSuccess('');
    setPaymentLoading(true);

    if (!paymentPhone || !/^(\+?254|0)?[17]\d{8}$/.test(paymentPhone)) {
      setError('Please enter a valid M-Pesa number.');
      setPaymentLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/orders/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: paymentPhone.startsWith('+') ? paymentPhone : `+254${paymentPhone.replace(/^0/, '')}`,
          amount: orderAmount,
          orderRef: orderRef
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed. Please try again.');
      }

      setSuccess('Payment initiated! Check your phone for M-Pesa prompt. Waiting for confirmation...');
      setShowPaymentForm(false);
      setPaymentStatus('pending');
      
    } catch (error: any) {
      setError(error.message);
      setPaymentLoading(false);
    }
  };

  // Update the callback to set payment status
  const updateCallbackWebhook = async (body: any) => {
    const accountNumber = body.BillRefNumber || body.AccountNumber;
    
    if (accountNumber === orderRef) {
      if (body.ResultCode === 0) {
        setPaymentStatus('success');
        setSuccess('Payment confirmed! Your order has been placed successfully.');
        
        setTimeout(() => {
          clearCart();
          router.push('/?tab=orders');
        }, 3000);
      } else {
        setPaymentStatus('failed');
        setError(`Payment failed: ${body.ResultDesc}`);
      }
    }
  };

  if (orderRef) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
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
                <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#bf2c7e] p-6 text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Order Ready for Payment</h1>
              <p className="opacity-90">Complete your payment via M-PESA to confirm your order</p>
            </div>
            
            <div className="p-6">
              {/* Alerts */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                    {paymentStatus === 'pending' && (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin ml-2"></div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Payment Instructions
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">1</div>
                      <p className="text-sm font-medium text-gray-700">Go to M-PESA</p>
                      <p className="text-xs text-gray-500">Lipa na M-PESA</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">2</div>
                      <p className="text-sm font-medium text-gray-700">Enter Paybill</p>
                      <p className="text-xs text-gray-500">Business Number</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-[#bf2c7e] mb-1">3</div>
                      <p className="text-sm font-medium text-gray-700">Enter Details</p>
                      <p className="text-xs text-gray-500">Account & Amount</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Paybill Number:</span>
                      <span className="font-mono text-lg font-bold text-[#bf2c7e]">4184219</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="font-medium text-gray-700">Account Number:</span>
                      <span className="font-mono text-lg font-bold text-gray-900">{orderRef}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="font-medium text-gray-700">Amount:</span>
                      <span className="font-mono text-lg font-bold text-green-600">KSh {orderAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STK Push Payment Option */}
              {!showPaymentForm && paymentStatus === 'idle' && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Quick Payment Option
                  </h3>
                  <p className="text-blue-700 mb-4">Get an STK push directly to your phone for faster payment</p>
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Pay with STK Push
                  </button>
                </div>
              )}

              {showPaymentForm && paymentStatus === 'idle' && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter M-Pesa Phone Number</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number for STK Push
                      </label>
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="e.g. 0712345678 or +254712345678"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You will receive an STK push on this number to complete payment
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setShowPaymentForm(false)}
                        disabled={paymentLoading}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSTKPayment}
                        disabled={paymentLoading}
                        className="bg-[#bf2c7e] text-white px-5 py-2 rounded-lg hover:bg-[#a8256c] transition-all font-medium disabled:opacity-50 flex items-center"
                      >
                        {paymentLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          'Send STK Push'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-yellow-700 font-medium">Waiting for payment confirmation...</span>
                    <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin ml-2"></div>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-gray-500 mb-6">
                <p>Your order will be processed immediately after payment confirmation. You'll receive an SMS confirmation.</p>
                {paymentStatus === 'success' && (
                  <p className="text-green-600 font-medium mt-2">
                    Payment confirmed! Redirecting to your orders...
                  </p>
                )}
              </div>

              {paymentStatus !== 'success' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/products"
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Continue Shopping
                  </Link>
                  <Link
                    href="/?tab=orders"
                    className="flex-1 bg-[#bf2c7e] text-white px-6 py-3 rounded-lg hover:bg-[#a8256c] transition-colors font-medium text-center flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    View My Orders
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ... rest of the original checkout form code remains exactly the same ...
    return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
            <div className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Shipping Information
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={shippingData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Nairobi"
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={shippingData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Rwanda">Rwanda</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 700 000 000"
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    rows={3}
                    value={shippingData.instructions}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions..."
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] transition-colors resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items ({cartItems.length})
              </h2>
              
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-400 rounded">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-[#bf2c7e]">KSh {(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">KSh {item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#bf2c7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>KSh {totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes</span>
                  <span>Included</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-[#bf2c7e]">KSh {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateOrderDraft}
                disabled={isLoading || !shippingData.address || !shippingData.city || !shippingData.phone}
                className="w-full bg-[#bf2c7e] text-white py-4 rounded-lg hover:bg-[#a8256c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Order...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Proceed to Payment
                  </span>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>You'll be redirected to M-PESA for payment</p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Secure Payment</p>
                    <p className="text-xs text-blue-600">Your payment is processed securely via M-PESA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}