type PaymentsTabProps = {
  role: 'customer' | 'vendor' | 'admin';
};

export default function PaymentsTab({ role }: PaymentsTabProps) {
  const isCustomer = role === 'customer';
  const isVendor = role === 'vendor';
  const isAdmin = role === 'admin';
  
  const payments = [
    { id: 'PAY-78901', date: '12 Oct 2023', description: 'Order ORD-12345', amount: 'KSh 5,499', type: 'M-Pesa', status: 'Completed' },
    { id: 'PAY-78902', date: '11 Oct 2023', description: 'Order ORD-12346', amount: 'KSh 3,200', type: 'M-Pesa', status: 'Completed' },
    { id: 'PAY-78903', date: '10 Oct 2023', description: 'Vendor Payout', amount: 'KSh 4,674', type: 'Bank Transfer', status: 'Processing' },
    { id: 'PAY-78904', date: '9 Oct 2023', description: 'Subscription Renewal', amount: 'KSh 4,999', type: 'M-Pesa', status: 'Completed' },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isCustomer ? 'My Payments' : isVendor ? 'Earnings & Payouts' : 'Payment Management'}
        </h1>
        
        {isCustomer && (
          <button className="bg-[#ff199c] text-white px-4 py-2 rounded-lg font-medium">
            Add M-Pesa Funds
          </button>
        )}
      </div>
      
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isCustomer ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">M-Pesa Balance</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 5,250</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 12,480</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
              <p className="text-2xl font-bold text-yellow-600">KSh 0</p>
            </div>
          </>
        ) : isVendor ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 24,580</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 85,420</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Next Payout</h3>
              <p className="text-2xl font-bold text-green-600">KSh 24,580</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 254,800</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Commission</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 38,220</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pending Payouts</h3>
              <p className="text-2xl font-bold text-yellow-600">KSh 12,450</p>
            </div>
          </>
        )}
      </div>
      
      {/* M-Pesa Payment Section for Customers */}
      {isCustomer && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">M-Pesa Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="07XX XXX XXX" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="text" 
                  placeholder="KSh" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                />
              </div>
              <button className="bg-[#ff199c] text-white px-6 py-2 rounded-lg font-medium">
                Add Funds
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">How to Pay with M-Pesa</h3>
              <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                <li>Enter your M-Pesa registered phone number</li>
                <li>Enter the amount you want to deposit</li>
                <li>Click "Add Funds" button</li>
                <li>Check your phone for M-Pesa prompt</li>
                <li>Enter your M-Pesa PIN to complete transaction</li>
              </ol>
            </div>
          </div>
        </div>
      )}
      
      {/* Payout Request for Vendors */}
      {isVendor && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Request Payout</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Available for payout: <span className="font-bold">KSh 24,580</span></p>
              <p className="text-sm text-gray-500">Payouts are processed every Friday</p>
            </div>
            <button className="bg-[#ff199c] text-white px-6 py-2 rounded-lg font-medium">
              Request Payout
            </button>
          </div>
        </div>
      )}
      
      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
          <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
            <option>All Transactions</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {payment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    payment.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}