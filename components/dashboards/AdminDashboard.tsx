export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Platform Revenue</h2>
          <p className="mt-2 text-2xl font-bold">KSh 254,800</p>
          <p className="text-sm text-green-600">+18% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Total Orders</h2>
          <p className="mt-2 text-2xl font-bold">1,242</p>
          <p className="text-sm text-gray-500">Completed: 1,120</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Vendors</h2>
          <p className="mt-2 text-2xl font-bold">86</p>
          <p className="text-sm text-gray-500">Pending approval: 5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Customers</h2>
          <p className="mt-2 text-2xl font-bold">5,421</p>
          <p className="text-sm text-green-600">+324 this month</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Vendor: TechGadgets</p>
                <p className="text-sm text-gray-500">Commission: KSh 1,250</p>
              </div>
              <span className="text-green-600 text-sm">Completed</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Vendor: FashionHub</p>
                <p className="text-sm text-gray-500">Commission: KSh 2,140</p>
              </div>
              <span className="text-green-600 text-sm">Completed</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Subscription: HomeEssentials</p>
                <p className="text-sm text-gray-500">KSh 4,999</p>
              </div>
              <span className="text-blue-600 text-sm">Processing</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vendor Approvals</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Nairobi Crafts</p>
                <p className="text-sm text-gray-500">Applied: 2 days ago</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Approve</button>
                <button className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Reject</button>
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Eco Foods Kenya</p>
                <p className="text-sm text-gray-500">Applied: 1 day ago</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Approve</button>
                <button className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Reject</button>
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">TechDeals Ltd</p>
                <p className="text-sm text-gray-500">Applied: Today</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Approve</button>
                <button className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">Top Categories</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Electronics</span>
                <span>24%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fashion</span>
                <span>19%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Home & Kitchen</span>
                <span>15%</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">Commission Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Commission</span>
                <span>KSh 42,580</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subscription Fees</span>
                <span>KSh 125,400</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transaction Fees</span>
                <span>KSh 86,820</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">M-Pesa Transactions</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Successful</span>
                <span>98.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Failed</span>
                <span>1.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending</span>
                <span>0.6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}