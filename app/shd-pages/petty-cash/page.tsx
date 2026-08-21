'use client';

import { useState, useEffect } from 'react';

interface Budget {
  _id: string;
  allocatedAmount: number;
  spentAmount: number;
  platformFees: number;
  remainingAmount: number;
  weekStart: string;
  weekEnd: string;
}

export default function PettyCashDashboard() {
  //const { data: session } = useSession();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      const response = await fetch('/api/petty-cash/budget');
      const data = await response.json();
      if (data.success) {
        setBudget(data.budget);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (formData: any) => {
    try {
      const response = await fetch('/api/petty-cash/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh budget
        fetchBudget();
        setShowRequestModal(false);
        alert('Request submitted successfully!');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Petty Cash Dashboard</h1>
        <button
          onClick={() => setShowRequestModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          New Request
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Allocated</h3>
          <p className="text-2xl font-bold">KES {budget?.allocatedAmount?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Spent</h3>
          <p className="text-2xl font-bold text-orange-600">KES {budget?.spentAmount?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Fees</h3>
          <p className="text-2xl font-bold text-purple-600">KES {budget?.platformFees?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Remaining</h3>
          <p className="text-2xl font-bold text-green-600">KES {budget?.remainingAmount?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {budget && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Utilization</span>
            <span>{((budget.spentAmount / budget.allocatedAmount) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((budget.spentAmount / budget.allocatedAmount) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Requests</h2>
        </div>
        {/* Add requests list component here */}
        <div className="p-4 text-center text-gray-500">
          <p>Request list will be displayed here</p>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={createRequest}
          budget={budget}
        />
      )}
    </div>
  );
}

// Request Modal Component
function RequestModal({ onClose, onSubmit, budget }: any) {
  const [formData, setFormData] = useState({
    amount: '',
    recipientPhone: '',
    recipientName: '',
    category: '',
    description: '',
    receiptUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">New Expense Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (KES)</label>
              <input
                type="number"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                max={budget?.remainingAmount}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Phone</label>
              <input
                type="tel"
                required
                className="w-full border rounded-lg px-3 py-2"
                placeholder="254700000000"
                value={formData.recipientPhone}
                onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.recipientName}
                onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                required
                className="w-full border rounded-lg px-3 py-2"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select category</option>
                <option value="Utilities">Utilities</option>
                <option value="Transport">Transport</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Meals">Meals</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Receipt URL (optional)</label>
              <input
                type="url"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.receiptUrl}
                onChange={(e) => setFormData({...formData, receiptUrl: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}