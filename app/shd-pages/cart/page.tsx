// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Cart() {
//   const [cart, setCart] = useState<any[]>([]);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [deliveryAddress, setDeliveryAddress] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // Load cart from localStorage
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);

//   const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   const handleCheckout = async () => {
//     if (!phoneNumber || !deliveryAddress) {
//       alert('Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const items = cart.map(item => ({
//         productId: item._id,
//         quantity: item.quantity
//       }));

//       const response = await fetch('/api/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           items,
//           phoneNumber,
//           deliveryAddress,
//           deliveryPhone: phoneNumber,
//           shippingMethod: 'Standard'
//         })
//       });

//       const data = await response.json();
      
//       if (response.ok) {
//         alert('Payment initiated! Check your phone for M-Pesa prompt.');
//         localStorage.removeItem('cart');
//         router.push('/orders');
//       } else {
//         alert(data.error || 'Checkout failed');
//       }
//     } catch (error) {
//       alert('Checkout failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

//       {cart.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             {cart.map((item, index) => (
//               <div key={index} className="border p-4 rounded-lg mb-4 flex justify-between">
//                 <div>
//                   <h3 className="font-semibold">{item.name}</h3>
//                   <p>Quantity: {item.quantity}</p>
//                 </div>
//                 <p className="font-bold">KSh {item.price * item.quantity}</p>
//               </div>
//             ))}
//           </div>

//           <div className="lg:col-span-1">
//             <div className="border p-4 rounded-lg">
//               <h2 className="text-xl font-bold mb-4">Checkout</h2>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Phone Number</label>
//                 <input
//                   type="text"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder="254712345678"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Delivery Address</label>
//                 <input
//                   type="text"
//                   value={deliveryAddress}
//                   onChange={(e) => setDeliveryAddress(e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder="Your delivery address"
//                 />
//               </div>

//               <div className="mb-4">
//                 <p className="text-lg font-bold">Total: KSh {totalAmount}</p>
//               </div>

//               <button
//                 onClick={handleCheckout}
//                 disabled={loading}
//                 className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
//               >
//                 {loading ? 'Processing...' : 'Pay with M-Pesa'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to load cart from localStorage
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    // Listen for storage changes (optional - for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCart();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!phoneNumber || !deliveryAddress) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items,
          phoneNumber,
          deliveryAddress,
          deliveryPhone: phoneNumber,
          shippingMethod: 'Standard'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Payment initiated! Check your phone for M-Pesa prompt.');
        localStorage.removeItem('cart');
        router.push('/orders');
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (error) {
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4 flex justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold">KSh {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Checkout</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="254712345678"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Your delivery address"
                />
              </div>

              <div className="mb-4">
                <p className="text-lg font-bold">Total: KSh {totalAmount}</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Pay with M-Pesa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCart();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!phoneNumber || !deliveryAddress) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      const response = await fetch('/api/shd-api/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items,
          phoneNumber,
          deliveryAddress,
          deliveryPhone: phoneNumber,
          shippingMethod: 'Standard'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Payment initiated! Check your phone for M-Pesa prompt.');
        localStorage.removeItem('cart');
        router.push('/orders');
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (error) {
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-3xl font-black text-secondary mb-3">Your cart is empty</h1>
          <p className="text-muted mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            href="/" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-secondary">
              🛒 Shopping Cart
            </h1>
            <p className="text-muted text-sm mt-1">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Link 
            href="/" 
            className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-surface"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-2xl">
                        📦
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-secondary truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted">
                          {item.vendorId?.businessName || 'Vendor'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-surface hover:bg-surface hover:border-primary/30 transition-all duration-200 text-secondary font-medium flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium text-secondary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-surface hover:bg-surface hover:border-primary/30 transition-all duration-200 text-secondary font-medium flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="font-bold text-primary">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted">
                        @ KSh {item.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-600 transition-colors duration-200 p-1"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-surface sticky top-24">
              <h2 className="text-xl font-bold text-secondary mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-secondary">
                    KSh {totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Delivery Fee</span>
                  <span className="font-medium text-secondary">KSh 0</span>
                </div>
                <div className="border-t border-surface pt-4 flex justify-between">
                  <span className="font-bold text-secondary">Total</span>
                  <span className="font-black text-xl text-primary">
                    KSh {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="254712345678"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Your delivery address"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
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
                    'Pay with M-Pesa'
                  )}
                </button>

                <p className="text-xs text-muted text-center">
                  You will receive an M-Pesa prompt on your phone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}