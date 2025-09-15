"use client";
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
}