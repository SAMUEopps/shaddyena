export default function CustomerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <p className="mt-2 text-sm text-gray-500">You have 3 active orders</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Order #12345</span>
              <span className="text-green-600">Delivered</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Order #12346</span>
              <span className="text-yellow-600">Shipping</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Order #12347</span>
              <span className="text-blue-600">Processing</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Wishlist</h2>
          <p className="mt-2 text-sm text-gray-500">5 items in your wishlist</p>
          <button className="mt-4 bg-[#bf2c7e] text-white px-4 py-2 rounded-md text-sm">
            View Wishlist
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">M-Pesa Balance</h2>
          <p className="mt-2 text-2xl font-bold">KSh 5,250</p>
          <button className="mt-4 bg-[#182155] text-white px-4 py-2 rounded-md text-sm">
            Add Funds
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recommended Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Product cards would go here */}
          <div className="border rounded-lg p-4">
            <div className="bg-gray-200 h-32 mb-2"></div>
            <h3 className="font-medium">Product Name</h3>
            <p className="text-[#bf2c7e] font-bold">KSh 1,200</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="bg-gray-200 h-32 mb-2"></div>
            <h3 className="font-medium">Product Name</h3>
            <p className="text-[#bf2c7e] font-bold">KSh 1,200</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="bg-gray-200 h-32 mb-2"></div>
            <h3 className="font-medium">Product Name</h3>
            <p className="text-[#bf2c7e] font-bold">KSh 1,200</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="bg-gray-200 h-32 mb-2"></div>
            <h3 className="font-medium">Product Name</h3>
            <p className="text-[#bf2c7e] font-bold">KSh 1,200</p>
          </div>
        </div>
      </div>
    </div>
  );
}