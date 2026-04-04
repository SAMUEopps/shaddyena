/*'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Store,
  Truck,
  Clock,
  CheckCircle} from 'lucide-react';

interface DeliveryItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface DeliveryDetails {
  _id: string;
  orderId: string;
  createdAt: string;
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  suborder: {
    _id: string;
    vendorId: string;
    shopId: string;
    status: 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CONFIRMED';
    deliveryFee: number;
    deliveryDetails?: {
      pickupAddress?: string;
      dropoffAddress: string;
      estimatedTime?: string;
      notes?: string;
      confirmationCode?: string;
      confirmedAt?: string;
      riderConfirmedAt?: string;
    };
    items: DeliveryItem[];
    amount: number;
  };
}

export default function DeliveryDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const suborderId = params.suborderId as string;

  const [delivery, setDelivery] = useState<DeliveryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
  // Form states
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [pickupNotes, setPickupNotes] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchDeliveryDetails();
    }
  }, [orderId, suborderId, user]);

  const fetchDeliveryDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/delivery/rider/details?orderId=${orderId}&suborderId=${suborderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch delivery details');
      }
      
      const data = await response.json();
      setDelivery(data);
      setDeliveryPrice(data.suborder.deliveryFee || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickup = async () => {
    if (deliveryPrice <= 0) {
      alert('Please enter a valid delivery price');
      return;
    }

    setActiveAction('pickup');
    
    try {
      const response = await fetch('/api/delivery/rider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          suborderId,
          action: 'pickup',
          deliveryPrice,
          notes: pickupNotes,
        }),
      });
      
      if (response.ok) {
        alert('Package picked up successfully!');
        fetchDeliveryDetails();
        setShowPriceForm(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to pickup delivery');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update delivery');
    } finally {
      setActiveAction(null);
    }
  };

  const handleInTransit = async () => {
    setActiveAction('in_transit');
    
    try {
      const response = await fetch('/api/delivery/rider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          suborderId,
          action: 'in_transit',
        }),
      });
      
      if (response.ok) {
        alert('Package marked as in transit');
        fetchDeliveryDetails();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update delivery');
    } finally {
      setActiveAction(null);
    }
  };

  /*const handleDeliver = async () => {
    setActiveAction('deliver');
    
    try {
      const response = await fetch('/api/delivery/rider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          suborderId,
          action: 'deliver',
          otp: otp || undefined,
        }),
      });
      
      if (response.ok) {
        alert('Package delivered successfully!');
        fetchDeliveryDetails();
        setOtp('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark as delivered');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update delivery');
    } finally {
      setActiveAction(null);
    }
  };*

  const handleDeliver = async () => {
  setActiveAction('deliver');
  
  try {
    const response = await fetch('/api/delivery/rider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        suborderId,
        action: 'deliver',
      }),
    });
    
    if (response.ok) {
      alert('Package marked as delivered! Waiting for customer confirmation.');
      fetchDeliveryDetails();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark as delivered');
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to update delivery');
  } finally {
    setActiveAction(null);
  }
};

const handleConfirmWithCode = async () => {
  if (!confirmationCode) {
    alert('Please enter the confirmation code');
    return;
  }

  setActiveAction('confirm');
  
  try {
    const response = await fetch('/api/orders/confirm-delivery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        suborderId,
        confirmationCode: confirmationCode.toUpperCase().trim(),
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('✅ Delivery confirmed successfully! Payment will be processed.');
      fetchDeliveryDetails();
      setConfirmationCode('');
      setShowConfirmationForm(false);
    } else {
      throw new Error(data.message || 'Invalid confirmation code');
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to confirm delivery');
  } finally {
    setActiveAction(null);
  }
};

  const handleConfirmDelivery = async () => {
    if (!confirmationCode) {
      alert('Please enter the confirmation code');
      return;
    }

    setActiveAction('confirm');
    
    try {
      const response = await fetch('/api/orders/confirm-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          suborderId,
          confirmationCode: confirmationCode.toUpperCase(),
        }),
      });
      
      if (response.ok) {
        alert('Delivery confirmed successfully!');
        fetchDeliveryDetails();
        setConfirmationCode('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to confirm delivery');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to confirm delivery');
    } finally {
      setActiveAction(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-emerald-100 text-emerald-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP': return 'bg-purple-100 text-purple-800';
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">Error: {error || 'Delivery not found'}</p>
        <button 
          onClick={() => router.back()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { suborder } = delivery;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header *
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Details</h1>
          <p className="text-gray-600">Order #{delivery.orderId}</p>
        </div>
        <div className="ml-auto">
          <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(suborder.status)}`}>
            {suborder.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Action Buttons *
      {/*<div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Actions</h2>
        
        {suborder.status === 'ASSIGNED' && !showPriceForm && (
          <button
            onClick={() => setShowPriceForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Pickup Process
          </button>
        )}

        {showPriceForm && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-gray-900">Enter Delivery Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Price (KES) *
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={deliveryPrice}
                onChange={(e) => setDeliveryPrice(Number(e.target.value))}
                className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff199c] focus:border-transparent"
                placeholder="Enter delivery price"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Set the price you'll charge for this delivery after assessing the package
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Notes (Optional)
              </label>
              <textarea
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff199c] focus:border-transparent"
                placeholder="Any notes about the package condition, pickup location, etc."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePickup}
                disabled={activeAction === 'pickup' || deliveryPrice <= 0}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {activeAction === 'pickup' ? 'Processing...' : 'Confirm Pickup'}
              </button>
              <button
                onClick={() => setShowPriceForm(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {suborder.status === 'PICKED_UP' && (
          <button
            onClick={handleInTransit}
            disabled={activeAction === 'in_transit'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {activeAction === 'in_transit' ? 'Processing...' : 'Mark as In Transit'}
          </button>
        )}

        {suborder.status === 'IN_TRANSIT' && (
          <div className="space-y-4">
            <button
              onClick={handleDeliver}
              disabled={activeAction === 'deliver'}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {activeAction === 'deliver' ? 'Processing...' : 'Mark as Delivered'}
            </button>
            
            {suborder.deliveryDetails?.confirmationCode && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                  This delivery requires a confirmation code from the customer
                </p>
                <input
                  type="text"
                  placeholder="Enter 8-digit confirmation code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg"
                  maxLength={8}
                />
              </div>
            )}
          </div>
        )}

        {suborder.status === 'DELIVERED' && suborder.deliveryDetails?.confirmationCode && !suborder.deliveryDetails?.riderConfirmedAt && (
          <div className="space-y-4">
            <p className="text-sm text-emerald-600 font-medium">
              Awaiting confirmation code from customer
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg"
                maxLength={8}
              />
              <button
                onClick={handleConfirmDelivery}
                disabled={activeAction === 'confirm' || !confirmationCode}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {activeAction === 'confirm' ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </div>*
      
      {/* Action Buttons *
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Actions</h2>
        
        {suborder.status === 'ASSIGNED' && !showPriceForm && (
          <button
            onClick={() => setShowPriceForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Pickup Process
          </button>
        )}

        {showPriceForm && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-gray-900">Enter Delivery Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Price (KES) *
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={deliveryPrice}
                onChange={(e) => setDeliveryPrice(Number(e.target.value))}
                className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff199c] focus:border-transparent"
                placeholder="Enter delivery price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Notes (Optional)
              </label>
              <textarea
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff199c] focus:border-transparent"
                placeholder="Any notes about the package condition, pickup location, etc."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePickup}
                disabled={activeAction === 'pickup' || deliveryPrice <= 0}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {activeAction === 'pickup' ? 'Processing...' : 'Confirm Pickup'}
              </button>
              <button
                onClick={() => setShowPriceForm(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {suborder.status === 'PICKED_UP' && (
          <button
            onClick={handleInTransit}
            disabled={activeAction === 'in_transit'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {activeAction === 'in_transit' ? 'Processing...' : 'Mark as In Transit'}
          </button>
        )}

        {suborder.status === 'IN_TRANSIT' && (
          <button
            onClick={handleDeliver}
            disabled={activeAction === 'deliver'}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {activeAction === 'deliver' ? 'Processing...' : 'Mark as Delivered'}
          </button>
        )}

        {/* Show confirmation form when customer has generated code *
        {/*{suborder.status === 'DELIVERED' && suborder.deliveryDetails?.confirmationCode && !suborder.deliveryDetails?.riderConfirmedAt && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800 mb-2">
                  📋 Confirmation Code Required
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  The customer has confirmed receipt. Ask them for the 8-digit confirmation code to complete the delivery.
                </p>
                
                {!showConfirmationForm ? (
                  <button
                    onClick={() => setShowConfirmationForm(true)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Enter Confirmation Code
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter 8-digit code (e.g., ABC123XY)"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-lg"
                      maxLength={8}
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleConfirmWithCode}
                        disabled={activeAction === 'confirm' || confirmationCode.length !== 8}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {activeAction === 'confirm' ? 'Verifying...' : 'Verify & Complete'}
                      </button>
                      <button
                        onClick={() => {
                          setShowConfirmationForm(false);
                          setConfirmationCode('');
                        }}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      The code is case-sensitive and should be 8 characters long.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {suborder.status === 'CONFIRMED' && (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <div>
                <h3 className="font-medium text-emerald-800">Delivery Complete!</h3>
                <p className="text-sm text-emerald-600">
                  Payment will be processed within 24 hours.
                </p>
                {suborder.deliveryDetails?.riderConfirmedAt && (
                  <p className="text-xs text-emerald-500 mt-1">
                    Verified at: {new Date(suborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}*
        {suborder.status === 'CONFIRMED' && suborder.deliveryDetails?.confirmationCode && !suborder.deliveryDetails?.riderConfirmedAt && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800 mb-2">
                📋 Confirmation Code Required
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                The customer has confirmed receipt. Ask them for the 8-digit confirmation code to complete the delivery.
              </p>
              
              {!showConfirmationForm ? (
                <button
                  onClick={() => setShowConfirmationForm(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Enter Confirmation Code
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter 8-digit code (e.g., ABC123XY)"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-lg"
                    maxLength={8}
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirmWithCode}
                      disabled={activeAction === 'confirm' || confirmationCode.length !== 8}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {activeAction === 'confirm' ? 'Verifying...' : 'Verify & Complete'}
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmationForm(false);
                        setConfirmationCode('');
                      }}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    The code is case-sensitive and should be 8 characters long.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Show success message only when fully confirmed *
      {suborder.status === 'CONFIRMED' && (
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            <div>
              <h3 className="font-medium text-emerald-800">Delivery Complete!</h3>
              <p className="text-sm text-emerald-600">
                Payment will be processed within 24 hours.
              </p>
              {suborder.deliveryDetails?.riderConfirmedAt && (
                <p className="text-xs text-emerald-500 mt-1">
                  Verified at: {new Date(suborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Delivery Information *
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Info *
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-5 w-5 text-[#bf2c7e]" />
            <h2 className="text-lg font-semibold text-gray-900">Pickup Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Vendor</p>
              <p className="text-gray-900">Shop ID: {suborder.shopId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pickup Address</p>
              <p className="text-gray-900">
                {suborder.deliveryDetails?.pickupAddress || 'Address will be provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Dropoff Info *
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-[#bf2c7e]" />
            <h2 className="text-lg font-semibold text-gray-900">Delivery Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Delivery Address</p>
              <p className="text-gray-900">
                {suborder.deliveryDetails?.dropoffAddress || delivery.shipping.address}
              </p>
              <p className="text-sm text-gray-600 mt-1">{delivery.shipping.city}, {delivery.shipping.country}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <p className="text-gray-900">{delivery.shipping.phone}</p>
            </div>
            {delivery.shipping.instructions && (
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Instructions</p>
                <p className="text-gray-700 text-sm">{delivery.shipping.instructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline *
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-[#bf2c7e]" />
            <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Placed</p>
              <p className="text-gray-900">{formatDate(delivery.createdAt)}</p>
            </div>
            {suborder.deliveryDetails?.confirmedAt && (
              <div>
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-gray-900">{formatDate(suborder.deliveryDetails.confirmedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Info *
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-[#bf2c7e]" />
            <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Delivery Fee</p>
              <p className="text-2xl font-bold text-[#bf2c7e]">{formatCurrency(suborder.deliveryFee)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Order Total</p>
              <p className="text-gray-900">{formatCurrency(suborder.amount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items List *
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-[#bf2c7e]" />
          <h2 className="text-lg font-semibold text-gray-900">Items to Deliver</h2>
          <span className="ml-auto text-sm text-gray-500">
            {suborder.items.length} item(s) • {suborder.items.reduce((sum, item) => sum + item.quantity, 0)} units
          </span>
        </div>
        
        <div className="space-y-4">
          {suborder.items.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: {formatCurrency(item.price)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section *
      {suborder.deliveryDetails?.notes && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Delivery Notes</h2>
          <p className="text-gray-700">{suborder.deliveryDetails.notes}</p>
        </div>
      )}
    </div>
  );
}*/

'use client';

import { useState, useEffect, JSX } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Store,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  User,
  Calendar,
  ChevronRight,
  CreditCard,
  Navigation,
  Home,
  Building2,
  Timer,
  Receipt,
  Hash,
  Info
} from 'lucide-react';

interface DeliveryItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface DeliveryDetails {
  _id: string;
  orderId: string;
  createdAt: string;
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  suborder: {
    _id: string;
    vendorId: string;
    shopId: string;
    status: 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CONFIRMED';
    deliveryFee: number;
    deliveryDetails?: {
      pickupAddress?: string;
      dropoffAddress: string;
      estimatedTime?: string;
      notes?: string;
      confirmationCode?: string;
      confirmedAt?: string;
      riderConfirmedAt?: string;
    };
    items: DeliveryItem[];
    amount: number;
  };
}

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string; icon: JSX.Element; label: string }> = {
    ASSIGNED: { 
      color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', 
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Assigned'
    },
    PICKED_UP: { 
      color: 'bg-purple-500/10 text-purple-600 border-purple-200', 
      icon: <Package className="w-3.5 h-3.5" />,
      label: 'Picked Up'
    },
    IN_TRANSIT: { 
      color: 'bg-blue-500/10 text-blue-600 border-blue-200', 
      icon: <Truck className="w-3.5 h-3.5" />,
      label: 'In Transit'
    },
    DELIVERED: { 
      color: 'bg-green-500/10 text-green-600 border-green-200', 
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: 'Delivered'
    },
    CONFIRMED: { 
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', 
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: 'Confirmed'
    }
  };
  
  const { color, icon, label } = config[status] || config.ASSIGNED;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${color}`}>
      {icon}
      {label}
    </span>
  );
};

// Info Card Component
const InfoCard = ({ title, icon: Icon, children, className = "" }: any) => (
  <div className={`bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
          <Icon className="w-4 h-4 text-[var(--color-primary)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Timeline Step Component
const TimelineStep = ({ status, currentStatus, label, icon: Icon, date }: any) => {
  const isCompleted = currentStatus === status || 
    (status === 'ASSIGNED' && ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED'].includes(currentStatus)) ||
    (status === 'PICKED_UP' && ['IN_TRANSIT', 'DELIVERED', 'CONFIRMED'].includes(currentStatus)) ||
    (status === 'IN_TRANSIT' && ['DELIVERED', 'CONFIRMED'].includes(currentStatus)) ||
    (status === 'DELIVERED' && ['CONFIRMED'].includes(currentStatus));
  
  const isCurrent = currentStatus === status;
  
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10
          ${isCompleted 
            ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-md' 
            : isCurrent
              ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-2 border-[var(--color-primary)]'
              : 'bg-[var(--color-background-soft)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
          }
        `}>
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        {!isCompleted && !isCurrent && (
          <div className="w-0.5 h-12 bg-[var(--color-border)] my-1" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <p className={`font-semibold ${isCompleted || isCurrent ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
          {label}
        </p>
        {date && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{date}</p>
        )}
        {isCurrent && (
          <p className="text-xs text-[var(--color-primary)] mt-1">Current status</p>
        )}
      </div>
    </div>
  );
};

export default function DeliveryDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const suborderId = params.suborderId as string;

  const [delivery, setDelivery] = useState<DeliveryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [pickupNotes, setPickupNotes] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchDeliveryDetails();
    }
  }, [orderId, suborderId, user]);

  const fetchDeliveryDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/delivery/rider/details?orderId=${orderId}&suborderId=${suborderId}`);
      if (!response.ok) throw new Error('Failed to fetch delivery details');
      const data = await response.json();
      setDelivery(data);
      setDeliveryPrice(data.suborder.deliveryFee || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickup = async () => {
    if (deliveryPrice <= 0) {
      alert('Please enter a valid delivery price');
      return;
    }

    setActiveAction('pickup');
    try {
      const response = await fetch('/api/delivery/rider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, suborderId, action: 'pickup', deliveryPrice: deliveryPrice, notes: pickupNotes }),
      });
      
      if (response.ok) {
        alert('Package picked up successfully!');
        fetchDeliveryDetails();
        setShowPriceForm(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to pickup delivery');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update delivery');
    } finally {
      setActiveAction(null);
    }
  };

  const handleInTransit = async () => {
    setActiveAction('in_transit');
    try {
      const response = await fetch('/api/delivery/rider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, suborderId, action: 'in_transit' }),
      });
      
      if (response.ok) {
        alert('Package marked as in transit');
        fetchDeliveryDetails();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update delivery');
    } finally {
      setActiveAction(null);
    }
  };

  const handleDeliver = async () => {
    setActiveAction('deliver');
    try {
      const response = await fetch('/api/delivery/rider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, suborderId, action: 'deliver' }),
      });
      
      if (response.ok) {
        alert('Package marked as delivered! Waiting for customer confirmation.');
        fetchDeliveryDetails();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark as delivered');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update delivery');
    } finally {
      setActiveAction(null);
    }
  };

  const handleConfirmWithCode = async () => {
    if (!confirmationCode) {
      alert('Please enter the confirmation code');
      return;
    }

    setActiveAction('confirm');
    try {
      const response = await fetch('/api/orders/confirm-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, suborderId, confirmationCode: confirmationCode.toUpperCase().trim() }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Delivery confirmed successfully! Payment will be processed.');
        fetchDeliveryDetails();
        setConfirmationCode('');
        setShowConfirmationForm(false);
      } else {
        throw new Error(data.message || 'Invalid confirmation code');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to confirm delivery');
    } finally {
      setActiveAction(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-12 h-12 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Delivery not found'}</p>
          <button onClick={() => router.back()} className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { suborder } = delivery;
  const totalItems = suborder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent rounded-2xl p-6 md:p-8 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-[var(--color-primary)]/10 rounded-xl transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--color-text)] group-hover:text-[var(--color-primary)]" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                    <Truck className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">Delivery Details</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <p className="text-sm text-[var(--color-text-muted)]">Order #{delivery.orderId}</p>
                </div>
              </div>
            </div>
            <StatusBadge status={suborder.status} />
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Delivery Actions</h2>
            </div>
          </div>
          
          <div className="p-6">
            {/* ASSIGNED - Show pickup form */}
            {suborder.status === 'ASSIGNED' && !showPriceForm && (
              <button
                onClick={() => setShowPriceForm(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
              >
                Start Pickup Process
              </button>
            )}

            {showPriceForm && (
              <div className="space-y-5">
                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-500" />
                    Enter Delivery Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Delivery Price (KES) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={deliveryPrice}
                        onChange={(e) => setDeliveryPrice(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Enter delivery price"
                      />
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Set the price you'll charge for this delivery
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Pickup Notes (Optional)
                      </label>
                      <textarea
                        value={pickupNotes}
                        onChange={(e) => setPickupNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Any notes about the package condition, pickup location, etc."
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handlePickup}
                    disabled={activeAction === 'pickup' || deliveryPrice <= 0}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                  >
                    {activeAction === 'pickup' ? 'Processing...' : 'Confirm Pickup'}
                  </button>
                  <button
                    onClick={() => setShowPriceForm(false)}
                    className="px-6 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium hover:border-[var(--color-primary)] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* PICKED_UP - Mark in transit */}
            {suborder.status === 'PICKED_UP' && (
              <button
                onClick={handleInTransit}
                disabled={activeAction === 'in_transit'}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                {activeAction === 'in_transit' ? 'Processing...' : 'Mark as In Transit'}
              </button>
            )}

            {/* IN_TRANSIT - Mark delivered */}
            {suborder.status === 'IN_TRANSIT' && (
              <button
                onClick={handleDeliver}
                disabled={activeAction === 'deliver'}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                {activeAction === 'deliver' ? 'Processing...' : 'Mark as Delivered'}
              </button>
            )}

            {/* DELIVERED - Show confirmation form */}
            {suborder.status === 'DELIVERED' && suborder.deliveryDetails?.confirmationCode && !suborder.deliveryDetails?.riderConfirmedAt && (
              <div className="p-5 bg-yellow-500/10 rounded-xl border-2 border-yellow-500/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Confirmation Code Required
                    </h3>
                    <p className="text-sm text-yellow-700 mb-4">
                      The customer has confirmed receipt. Ask them for the 8-digit confirmation code to complete the delivery.
                    </p>
                    
                    {!showConfirmationForm ? (
                      <button
                        onClick={() => setShowConfirmationForm(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-medium hover:opacity-90 transition-all"
                      >
                        Enter Confirmation Code
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Enter 8-digit code (e.g., ABC123XY)"
                          value={confirmationCode}
                          onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border-2 border-yellow-500 rounded-xl text-center font-mono text-lg tracking-wider text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                          maxLength={8}
                          autoFocus
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={handleConfirmWithCode}
                            disabled={activeAction === 'confirm' || confirmationCode.length !== 8}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            {activeAction === 'confirm' ? 'Verifying...' : 'Verify & Complete'}
                          </button>
                          <button
                            onClick={() => {
                              setShowConfirmationForm(false);
                              setConfirmationCode('');
                            }}
                            className="px-6 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium hover:border-[var(--color-primary)] transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          The code is case-sensitive and should be 8 characters long.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CONFIRMED - Success state */}
            {suborder.status === 'CONFIRMED' && (
              <div className="p-5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">Delivery Complete!</h3>
                    <p className="text-sm text-emerald-700">Payment will be processed within 24 hours.</p>
                    {suborder.deliveryDetails?.riderConfirmedAt && (
                      <p className="text-xs text-emerald-600 mt-1">
                        Verified at: {new Date(suborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pickup Info */}
          <InfoCard title="Pickup Information" icon={Store}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                  <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Vendor Shop</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">Shop ID: {suborder.shopId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Pickup Address</p>
                  <p className="text-sm text-[var(--color-text)]">
                    {suborder.deliveryDetails?.pickupAddress || 'Address will be provided'}
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Delivery Info */}
          <InfoCard title="Delivery Information" icon={MapPin}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                  <Home className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Delivery Address</p>
                  <p className="text-sm text-[var(--color-text)]">
                    {suborder.deliveryDetails?.dropoffAddress || delivery.shipping.address}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {delivery.shipping.city}, {delivery.shipping.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                  <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Contact Phone</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">{delivery.shipping.phone}</p>
                </div>
              </div>
              {delivery.shipping.instructions && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                    <Info className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Delivery Instructions</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{delivery.shipping.instructions}</p>
                  </div>
                </div>
              )}
            </div>
          </InfoCard>

          {/* Timeline */}
          <InfoCard title="Timeline" icon={Clock}>
            <div className="space-y-0">
              <TimelineStep status="ASSIGNED" currentStatus={suborder.status} label="Order Assigned" icon={Clock} />
              <TimelineStep status="PICKED_UP" currentStatus={suborder.status} label="Picked Up" icon={Package} />
              <TimelineStep status="IN_TRANSIT" currentStatus={suborder.status} label="In Transit" icon={Truck} />
              <TimelineStep status="DELIVERED" currentStatus={suborder.status} label="Delivered" icon={CheckCircle} />
              <TimelineStep status="CONFIRMED" currentStatus={suborder.status} label="Confirmed" icon={CheckCircle} />
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Order placed: {formatDate(delivery.createdAt)}
              </p>
            </div>
          </InfoCard>

          {/* Payment Info */}
          <InfoCard title="Payment Information" icon={CreditCard}>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent rounded-xl">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Delivery Fee</p>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">{formatCurrency(suborder.deliveryFee)}</p>
                </div>
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-full">
                  <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[var(--color-text-muted)]">Order Total</p>
                <p className="text-lg font-semibold text-[var(--color-text)]">{formatCurrency(suborder.amount)}</p>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Items List */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                  <Package className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">Items to Deliver</h2>
              </div>
              <span className="text-sm text-[var(--color-text-muted)] bg-[var(--color-background-soft)] px-3 py-1 rounded-full">
                {suborder.items.length} item(s) • {totalItems} units
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {suborder.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-[var(--color-background-soft)] rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 rounded-xl flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Package className="w-8 h-8 text-[var(--color-text-muted)]/50" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--color-text)]">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-text-muted)]">
                      <span>Qty: {item.quantity}</span>
                      <span>Price: {formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-primary)]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {suborder.deliveryDetails?.notes && (
          <div className="mt-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="text-lg font-semibold text-[var(--color-text)]">Delivery Notes</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[var(--color-text-muted)]">{suborder.deliveryDetails.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}