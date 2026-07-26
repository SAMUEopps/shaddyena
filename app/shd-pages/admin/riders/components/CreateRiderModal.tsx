// app/admin/riders/components/CreateRiderModal.tsx
'use client';

import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface CreateRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRiderModal({ isOpen, onClose, onSuccess }: CreateRiderModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    nationalId: '',
    kraPin: '',
    vehicleType: 'MOTORCYCLE',
    vehicleRegistration: '',
    driverLicense: '',
    deliveryRadius: 10,
    payoutMethod: 'MPESA',
    payoutDetails: {
      mpesaNumber: '',
      pochiNumber: '',
      tillNumber: '',
      paybillNumber: '',
      paybillAccount: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/users?role=customer', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/riders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Rider created successfully!');
        onSuccess();
        onClose();
        setFormData({
          userId: '',
          fullName: '',
          phoneNumber: '',
          email: '',
          nationalId: '',
          kraPin: '',
          vehicleType: 'MOTORCYCLE',
          vehicleRegistration: '',
          driverLicense: '',
          deliveryRadius: 10,
          payoutMethod: 'MPESA',
          payoutDetails: {
            mpesaNumber: '',
            pochiNumber: '',
            tillNumber: '',
            paybillNumber: '',
            paybillAccount: ''
          }
        });
      } else {
        alert(data.error || 'Failed to create rider');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-secondary">Create New Rider</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-text text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Select User *
              </label>
              <select
                required
                value={formData.userId}
                onChange={(e) => {
                  const user = users.find(u => u._id === e.target.value);
                  setFormData({
                    ...formData,
                    userId: e.target.value,
                    fullName: user?.name || '',
                    email: user?.email || '',
                    phoneNumber: user?.phoneNumber || ''
                  });
                }}
                className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  National ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nationalId}
                  onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  KRA PIN
                </label>
                <input
                  type="text"
                  value={formData.kraPin}
                  onChange={(e) => setFormData({...formData, kraPin: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Vehicle Type *
                </label>
                <select
                  required
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="MOTORCYCLE">🏍️ Motorcycle</option>
                  <option value="BICYCLE">🚲 Bicycle</option>
                  <option value="CAR">🚗 Car</option>
                  <option value="VAN">🚐 Van</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Vehicle Registration *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicleRegistration}
                  onChange={(e) => setFormData({...formData, vehicleRegistration: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Driver License *
                </label>
                <input
                  type="text"
                  required
                  value={formData.driverLicense}
                  onChange={(e) => setFormData({...formData, driverLicense: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Delivery Radius (km) *
              </label>
              <input
                type="number"
                required
                min="1"
                max="50"
                value={formData.deliveryRadius}
                onChange={(e) => setFormData({...formData, deliveryRadius: parseInt(e.target.value)})}
                className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Payout Method *
              </label>
              <select
                required
                value={formData.payoutMethod}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    payoutMethod: e.target.value,
                    payoutDetails: {
                      mpesaNumber: '',
                      pochiNumber: '',
                      tillNumber: '',
                      paybillNumber: '',
                      paybillAccount: ''
                    }
                  });
                }}
                className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="MPESA">M-PESA</option>
                <option value="POCHI">Pochi</option>
                <option value="TILL">Till</option>
                <option value="PAYBILL">Paybill</option>
              </select>
            </div>

            {/* Payout Details based on method */}
            {formData.payoutMethod === 'MPESA' && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  M-PESA Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.payoutDetails.mpesaNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    payoutDetails: {...formData.payoutDetails, mpesaNumber: e.target.value}
                  })}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {formData.payoutMethod === 'POCHI' && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Pochi Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.payoutDetails.pochiNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    payoutDetails: {...formData.payoutDetails, pochiNumber: e.target.value}
                  })}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {formData.payoutMethod === 'TILL' && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Till Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.payoutDetails.tillNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    payoutDetails: {...formData.payoutDetails, tillNumber: e.target.value}
                  })}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {formData.payoutMethod === 'PAYBILL' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Paybill Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.payoutDetails.paybillNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      payoutDetails: {...formData.payoutDetails, paybillNumber: e.target.value}
                    })}
                    className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.payoutDetails.paybillAccount}
                    onChange={(e) => setFormData({
                      ...formData,
                      payoutDetails: {...formData.payoutDetails, paybillAccount: e.target.value}
                    })}
                    className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Rider'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-accent rounded-lg px-6 py-2 hover:bg-background transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}