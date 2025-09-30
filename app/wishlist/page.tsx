/*"use client";
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      vendorId: item.vendorId,
      shopId: item.shopId,
      sku: item._id,
      quantity: 1
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h1>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❤️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start shopping to add items to your wishlist</p>
          <Link 
            href="/"
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wishlist ({wishlistItems.length} items)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlistItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
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
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
              <p className="text-[#ff199c] font-bold mb-4">KSh {item.price.toLocaleString()}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-[#182155] text-white px-3 py-2 rounded text-sm hover:bg-[#2a3170]"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}*/

"use client";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (item: any) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      vendorId: item.vendorId,
      shopId: item.shopId,
      sku: item._id,
      quantity: 1,
    });
  };

  /* ---------- Empty state ---------- */
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header – same style as Cart */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-[#bf2c7e] rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
              ❤️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explore our store and save items you love for later.
            </p>
            <Link
              href="/products"
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

  /* ---------- Populated state ---------- */
  return (
    <div className="min-h-screen bg-white">
      {/* Header – same style as Cart */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
            </div>
            <span className="text-gray-600">{wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="aspect-square relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate mb-1">{item.name}</h3>
                <p className="text-[#bf2c7e] font-bold text-lg mb-4">KSh {item.price.toLocaleString()}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-[#182155] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#2a3170] transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}