export default function HomeTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Shaddyna</h1>
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#182155] to-[#bf2c7e] text-white p-8 rounded-lg mb-8">
        <h2 className="text-3xl font-bold mb-4">Discover Amazing Products</h2>
        <p className="text-lg mb-6">Shop from hundreds of vendors with secure M-Pesa payments</p>
        <button className="bg-white text-[#182155] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Start Shopping
        </button>
      </div>
      
      {/* Featured Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty'].map((category) => (
            <div key={category} className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-md">
              <div className="bg-gray-200 h-16 w-16 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-medium">{category}</h3>
            </div>
          ))}
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-4 rounded-lg shadow">
              <div className="bg-gray-200 h-40 mb-3 rounded-lg"></div>
              <h3 className="font-medium">Premium Product {item}</h3>
              <div className="flex items-center mt-1 mb-2">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#bf2c7e] font-bold">KSh 1,200</span>
                <button className="bg-[#182155] text-white text-xs px-3 py-1 rounded">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Promotional Banner */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Seller</h2>
            <p className="text-gray-600 mb-4">Join thousands of vendors selling on our platform. Start your online store today!</p>
            <button className="bg-[#bf2c7e] text-white px-6 py-2 rounded-lg font-semibold">
              Register as Vendor
            </button>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <div className="bg-gray-300 h-32 w-48 rounded-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Customer Name</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">"Great shopping experience! The M-Pesa payment was seamless and delivery was fast."</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}