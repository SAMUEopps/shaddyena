
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
  const [checkoutRequestID, setCheckoutRequestID] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [error, setError] = useState('');

  useEffect(() => {
  if (cartItems.length === 0 && !orderRef) {
    router.push('/cart');
  }
}, [cartItems, orderRef, router]);

  useEffect(() => {
    // Poll for payment status if we have a checkout request ID
    if (checkoutRequestID && paymentStatus === 'processing') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('/api/mpesa/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ checkoutRequestID })
          });

          const data = await response.json();
          
          if (data.ResultCode === 0) {
            setPaymentStatus('success');
            clearInterval(interval);
            clearCart();
          } else if (data.ResultCode !== 1032) { // 1032 means still processing
            setPaymentStatus('failed');
            setError('Payment failed or was cancelled');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [checkoutRequestID, paymentStatus, clearCart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  /*const handleCreateOrderDraft = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          shipping: shippingData,
          phoneNumber: shippingData.phone.replace(/^0/, '254') // Convert to international format
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      setOrderRef(data.ref);
      setCheckoutRequestID(data.checkoutRequestID);
      setPaymentStatus('processing');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };*


  const [orderAmount, setOrderAmount] = useState(0);

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

    setOrderRef(data.ref);
    setOrderAmount(totalPrice); // ✅ Save amount before clearing cart
    clearCart();
  } catch (error: any) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Order Confirmed</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully. Order reference:
            </p>
            <div className="bg-white p-3 rounded border">
              <code className="font-mono text-sm">{orderRef}</code>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            You will receive an order confirmation shortly. Vendors have been notified and will process your items.
          </p>

          <div className="flex space-x-4 justify-center">
            <Link
              href="/products"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="bg-[#ff199c] text-white px-6 py-2 rounded-md hover:bg-[#e5178a]"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff199c] mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h1>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Complete Payment on Your Phone</h2>
            <p className="text-gray-600 mb-4">
              Please check your phone and enter your M-PESA PIN to complete the payment.
            </p>
            <div className="bg-white p-3 rounded border">
              <code className="font-mono text-sm">Reference: {orderRef}</code>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Waiting for payment confirmation...
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-red-600 mb-4">{error || 'Payment was not completed successfully.'}</p>
            <div className="bg-white p-3 rounded border">
              <code className="font-mono text-sm">Reference: {orderRef}</code>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => {
                setPaymentStatus('pending');
                setError('');
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
            >
              Try Again
            </button>
            <Link
              href="/cart"
              className="bg-[#ff199c] text-white px-6 py-2 rounded-md hover:bg-[#e5178a]"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={shippingData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={shippingData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                id="country"
                name="country"
                required
                value={shippingData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              >
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Rwanda">Rwanda</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (M-PESA) *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={shippingData.phone}
              onChange={handleInputChange}
              placeholder="07XX XXX XXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
            <p className="text-sm text-gray-500 mt-1">
              This number will receive the M-PESA payment prompt
            </p>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows={3}
              value={shippingData.instructions}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-2 mb-4">
          {cartItems.map(item => (
            <div key={item._id} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>KSh {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleCreateOrderDraft}
          disabled={isLoading || !shippingData.address || !shippingData.city || !shippingData.phone}
          className="w-full bg-[#ff199c] text-white py-3 rounded-md hover:bg-[#e5178a] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Processing...' : 'Pay with M-PESA'}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          You will receive a payment prompt on your phone to complete the transaction
        </p>
      </div>
    </div>
  );
}*/

"use client";
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

  useEffect(() => {
  if (cartItems.length === 0 && !orderRef) {
    router.push('/cart');
  }
}, [cartItems, orderRef, router]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

const [orderAmount, setOrderAmount] = useState(0);
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

    setOrderRef(data.accountReference); // ✅ use API's ref field
    setOrderAmount(totalPrice); 
    // ❌ don’t clearCart() here
  } catch (error: any) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};


  if (orderRef) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Ready for Payment</h1>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Payment Instructions</h2>
            <p className="text-gray-600 mb-4">
              Please make payment via M-PESA using the details below:
            </p>
            
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="font-medium">Paybill Number:</span>
                <span className="font-mono">4184219</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Number:</span>
                <span className="font-mono">{orderRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span className="font-mono">KSh {orderAmount.toLocaleString()}</span>
                {/*<span className="font-mono">KSh {totalPrice.toLocaleString()}</span>*/}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Your order will be processed once payment is confirmed. You'll receive a confirmation message shortly.
          </p>

          <div className="flex space-x-4 justify-center">
            <Link
              href="/products"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="bg-[#ff199c] text-white px-6 py-2 rounded-md hover:bg-[#e5178a]"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={shippingData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={shippingData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                id="country"
                name="country"
                required
                value={shippingData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              >
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Rwanda">Rwanda</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={shippingData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows={3}
              value={shippingData.instructions}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-2 mb-4">
          {cartItems.map(item => (
            <div key={item._id} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>KSh {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleCreateOrderDraft}
          disabled={isLoading || !shippingData.address || !shippingData.city || !shippingData.phone}
          className="w-full bg-[#ff199c] text-white py-3 rounded-md hover:bg-[#e5178a] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
}