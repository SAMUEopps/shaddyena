"use client";
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
          <Link 
            href="/products"
            className="bg-[#ff199c] text-white px-6 py-2 rounded-md hover:bg-[#e5178a]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({totalItems} items)</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center p-4 border-b border-gray-100">
            {item.image ? (
            <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
            />
            ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-400 rounded">
                No Image
            </div>
            )}
            
            <div className="flex-1 ml-4">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-[#ff199c] font-bold">KSh {item.price.toLocaleString()}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
            
            <button
              onClick={() => removeFromCart(item._id)}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-[#ff199c]">
              KSh {totalPrice.toLocaleString()}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="/products"
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-md text-center hover:bg-gray-400"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/checkout"
              className="flex-1 bg-[#ff199c] text-white px-6 py-2 rounded-md text-center hover:bg-[#e5178a]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}