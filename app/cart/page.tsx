/*"use client";
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const router = useRouter();

  if (cartItems.length === 0) {
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
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-[#bf2c7e] rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
              🛒
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start exploring our products to find something you'll love!
            </p>
            <Link 
              href="/"
              className="bg-[#bf2c7e] text-white px-8 py-3 rounded-lg hover:bg-[#a8256c] transition-colors font-medium shadow-sm hover:shadow-md inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Start Shopping
            </Link>
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
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items *
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items ({totalItems})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-[#bf2c7e] font-bold text-lg mt-1">
                        KSh {item.price.toLocaleString()}
                      </p>
                     {/*} {item.vendor && (
                        <p className="text-sm text-gray-500 mt-1">Sold by: {item.vendor.businessName}</p>
                      )}*
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-[#bf2c7e] transition-colors shadow-sm"
                          disabled={item.quantity <= 1}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                        
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-[#bf2c7e] transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="text-right min-w-[80px]">
                        <p className="font-semibold text-gray-900">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary *
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
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
                    <span>Total</span>
                    <span className="text-[#bf2c7e]">KSh {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Link 
                    href="/checkout"
                    className="w-full bg-[#bf2c7e] text-white py-3 rounded-lg hover:bg-[#a8256c] transition-colors font-medium shadow-sm hover:shadow-md text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <Link 
                    href="/products"
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
                
                <div className="text-center text-sm text-gray-500 pt-4">
                  <p>Free delivery on orders over KSh 2,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed Suggestions *
        <div className="mt-12">
          <div className="bg-[#bf2c7e] rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">You might also like</h3>
                <p className="opacity-90">Discover more products that match your taste</p>
              </div>
              <Link 
                href="/products"
                className="bg-white text-[#bf2c7e] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/

"use client";
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Product Image Component with Error Handling
const ProductImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
 

  // If src is empty or image failed to load, show placeholder
  if (!src || imageError) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${className} bg-gray-100 rounded-lg relative`}>
      <img
        src={src}
        alt={alt}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#bf2c7e]"></div>
        </div>
      )}
    </div>
  );
};

export default function CartPage() {
  const router = useRouter();
  const { 
    cartItems, 
    removeFromCart, 
    removeAllFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    totalPrice 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <>
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
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              </div>
            </div>
          </div>
        </header>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link 
              href="/products" 
              className="bg-[#bf2c7e] text-white px-8 py-3 rounded-lg hover:bg-[#a8256c] transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
  <>
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
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              </div>
            </div>
          </div>
        </header>
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-gray-600 mt-1 sm:mt-2">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={clearCart}
            className="mt-3 sm:mt-0 flex items-center text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {cartItems.map((item) => (
                <div key={item._id} className="border-b border-gray-200 last:border-b-0">
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                              {item.name}
                            </h3>
                            {/*<p className="text-xs sm:text-sm text-gray-500 mt-1">SKU: {item.sku}</p>*/}
                            <p className="text-sm font-semibold text-[#bf2c7e] mt-1 sm:mt-2">
                              KSh {item.price.toLocaleString()}
                            </p>
                          </div>

                          {/* Delete Button - Mobile */}
                          <button
                            onClick={() => removeAllFromCart(item._id)}
                            className="sm:hidden text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3 sm:mt-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>

                            <span className="text-sm font-medium text-gray-900 min-w-8 text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className="text-sm sm:text-base font-semibold text-gray-900">
                              KSh {(item.price * item.quantity).toLocaleString()}
                            </span>

                            {/* Delete Button - Desktop */}
                            <button
                              onClick={() => removeAllFromCart(item._id)}
                              className="hidden sm:flex text-red-500 hover:text-red-700 transition-colors p-2"
                              title="Remove item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({totalItems})</span>
                  <span className="text-gray-900">KSh {totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">KSh 0</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">KSh 0</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#bf2c7e]">KSh {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

               <Link 
                    href="/checkout"
                    className="w-full bg-[#bf2c7e] text-white py-3 rounded-lg hover:bg-[#a8256c] transition-colors font-medium shadow-sm hover:shadow-md text-center block"
                  >
                    Proceed to Checkout
                  </Link>

              <Link 
                href="/products" 
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium mt-3 flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}