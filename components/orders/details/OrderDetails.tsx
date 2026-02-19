'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { Order, Suborder, Rider, VendorSuborderData } from '@/components/orders/details/types/orders';
import OrderHeader from './OrderHeader';
import OrderSummary from './OrderSummary';
import ShippingInfo from './ShippingInfo';
import VendorSuborders from './VendorSuborders';
import RiderAssignment from './RiderAssignment';
import DeliveryActions from './DeliveryActions';
import OrderSidebar from './OrderSidebar';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import AuthRequired from './AuthRequired';
import OrderNotFound from './OrderNotFound';
import OrderStatusBar from '../OrderStatusBar';
import { transformSuborderForStatusBar, transformSubordersForStatusBar } from '@/utils/orderTransformers';



interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  
  // State management
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorSuborder, setVendorSuborder] = useState<VendorSuborderData | null>(null);
  const [selectedSuborderId, setSelectedSuborderId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [availableRiders, setAvailableRiders] = useState<Rider[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isAssigningRider, setIsAssigningRider] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  // URL parameters
  const vendorView = searchParams.get('vendorView') === 'true';
  const suborderId = searchParams.get('suborderId');
  const adminView = searchParams.get('adminView') === 'true';
  const viewAs = searchParams.get('viewAs'); // Add this
  
  // Determine effective role for this view
  const effectiveRole = (user?.role === 'vendor' && viewAs === 'customer') 
    ? 'customer' 
    : user?.role;
  

  // User role
  const role = user?.role;
  const isVendor = role === 'vendor';
  const isAdmin = role === 'admin';
  const isRider = role === 'delivery';

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrder();
      if (user.role === 'admin') {
        fetchAvailableRiders();
      }
    }
  }, [orderId, authLoading, user]);

  const fetchOrder = async () => {
    if (!user) {
      setError('Please log in to view order details');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order details');
      }
      
      const data = await response.json();
      setOrder(data.order);
      
      // Set vendor suborder if vendor is viewing
      if (user.role === 'vendor' && vendorView && data.order) {
        const foundSuborder = data.order.suborders.find(
          (so: Suborder) => so._id === suborderId || so.vendorId === user._id
        );
        
        if (foundSuborder) {
          const vendorItems = data.order.items.filter(
            (item: { vendorId: any; }) => item.vendorId === foundSuborder.vendorId
          );
          
          setVendorSuborder({
            suborder: foundSuborder,
            items: vendorItems
          });
          setSelectedSuborderId(foundSuborder._id);
        }
      } else if (user.role === 'admin' && data.order?.suborders?.length > 0) {
        // For admin, select the first suborder by default
        setSelectedSuborderId(data.order.suborders[0]._id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableRiders = async () => {
    try {
      const response = await fetch('/api/users?role=delivery&isActive=true');
      if (response.ok) {
        const data = await response.json();
        setAvailableRiders(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  const handleConfirmDelivery = async (suborderId?: string, code?: string) => {
    if (!order || !suborderId || !code) return;
    
    setUpdatingStatus(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orders/confirm-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order._id,
          suborderId: suborderId,
          confirmationCode: code
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Delivery confirmed successfully!');
        fetchOrder();
        setConfirmationCode('');
      } else {
        throw new Error(data.message || 'Failed to confirm delivery');
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert(error instanceof Error ? error.message : 'Failed to confirm delivery');
    } finally {
      setUpdatingStatus(false);
    }
  };

  /*const handleStatusUpdate = async (newStatus: string, isMainOrder: boolean = false, suborderId?: string) => {
    if (!order) return;
    
    setUpdatingStatus(true);
    setError(null);
    
    try {
      // SPECIAL HANDLING FOR CUSTOMER CONFIRMATION
      if (newStatus === 'CONFIRMED' && user?.role === 'customer' && suborderId) {
        // Use the confirm-delivery API for customer confirmation
        const response = await fetch('/api/orders/confirm-delivery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order._id,
            suborderId: suborderId,
            // No confirmationCode needed for customer - API will generate it
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert(`Delivery confirmed! Your code: ${data.confirmationCode}`);
          fetchOrder(); // Refresh the order
        } else {
          throw new Error(data.message || 'Failed to confirm delivery');
        }
        return; // Exit early
      }
      
      // Original logic for other status updates
      const requestBody: any = {
        orderId: order._id,
        status: newStatus,
        viewAs: effectiveRole, 
      };

      if (!isMainOrder && suborderId) {
        requestBody.suborderId = suborderId;
      } else if (user?.role === 'vendor' && vendorSuborder) {
        requestBody.suborderId = vendorSuborder.suborder._id;
      }

      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Status updated to ${newStatus} successfully!`);
        fetchOrder();
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };*/

  const handleStatusUpdate = async (newStatus: string, isMainOrder: boolean = false, suborderId?: string) => {
  if (!order) return;
  
  setUpdatingStatus(true);
  setError(null);
  
  try {
    const requestBody: any = {
      orderId: order._id,
      status: newStatus,
      viewAs: effectiveRole,
    };

    // Add riderId and deliveryFee if they exist (for assignment)
    if (selectedRiderId) {
      requestBody.riderId = selectedRiderId;
    }
    if (deliveryFee > 0) {
      requestBody.deliveryFee = deliveryFee;
    }

    if (!isMainOrder && suborderId) {
      requestBody.suborderId = suborderId;
    } else if (user?.role === 'vendor' && vendorSuborder) {
      requestBody.suborderId = vendorSuborder.suborder._id;
    }

    const response = await fetch('/api/orders/update-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Check if this is a customer confirmation that returns a code
      if (newStatus === 'CONFIRMED' && data.confirmationCode) {
        alert(`✅ Delivery confirmed! Your confirmation code is: ${data.confirmationCode}\n\nPlease share this code with the delivery rider.`);
      } else {
        alert(`Status updated to ${newStatus} successfully!`);
      }
      fetchOrder(); // Refresh the order to show the code
      
      // Clear form fields if they were used
      if (newStatus === 'ASSIGNED') {
        setSelectedRiderId('');
        setDeliveryFee(0);
      }
    } else {
      throw new Error(data.message || 'Failed to update status');
    }
  } catch (error) {
    console.error('Error updating status:', error);
    alert(error instanceof Error ? error.message : 'Failed to update order status');
  } finally {
    setUpdatingStatus(false);
  }
};

  const handleAssignRider = async () => {
    if (!order || !selectedSuborderId || !selectedRiderId || deliveryFee <= 0) {
      alert('Please select a rider and enter a valid delivery fee');
      return;
    }

    setIsAssigningRider(true);
    setError(null);
    
    try {
      const response = await fetch('/api/delivery/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order._id,
          suborderId: selectedSuborderId,
          riderId: selectedRiderId,
          deliveryFee: deliveryFee
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Rider assigned successfully!');
        fetchOrder();
        setSelectedRiderId('');
        setDeliveryFee(0);
      } else {
        throw new Error(data.message || 'Failed to assign rider');
      }
    } catch (error) {
      console.error('Error assigning rider:', error);
      alert(error instanceof Error ? error.message : 'Failed to assign rider');
    } finally {
      setIsAssigningRider(false);
    }
  };

  const getSelectedSuborder = () => {
    if (!order || !selectedSuborderId) return null;
    
    const suborder = order.suborders.find(so => so._id === selectedSuborderId);
    if (!suborder) return null;
    
    return {
      suborder,
      items: order.items.filter(item => item.vendorId === suborder.vendorId)
    };
  };

  const getDisplayItems = () => {
    if (!order) return [];
    
    if (user?.role === 'vendor' && vendorSuborder) {
      return vendorSuborder.items || [];
    }
    
    return order.items;
  };

  // Loading and error states
  if (authLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (!user) {
    return <AuthRequired />;
  }

  if (isLoading) {
    return <LoadingState message="Loading order details..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchOrder} />;
  }

  if (!order) {
    return <OrderNotFound isRider={isRider} />;
  }

  // Current state
  const displayItems = getDisplayItems();
  const selectedSuborderData = getSelectedSuborder();
  const isVendorViewingOrder = !!(vendorSuborder && role === 'vendor');
  //const isVendorViewingOrder = isVendor && vendorSuborder;
  const effectiveSuborder = isVendorViewingOrder ? vendorSuborder?.suborder : selectedSuborderData?.suborder;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <OrderHeader 
            order={order}
            isRider={isRider}
            isVendorViewingOrder={!!isVendorViewingOrder}
            displayItems={displayItems}
            role={effectiveRole}
          />
          
          {/* Order Status Bar */}
          <div className="mt-6">
            {effectiveRole && 
                <OrderStatusBar
                role={effectiveRole}
                orderStatus={order.status}
                paymentStatus={order.paymentStatus}
                vendorSuborder={vendorSuborder ? transformSuborderForStatusBar(vendorSuborder.suborder) : null}
                suborders={transformSubordersForStatusBar(order.suborders)}
                onStatusUpdate={handleStatusUpdate}
                onSuborderSelect={setSelectedSuborderId}
                selectedSuborderId={selectedSuborderId}
                isLoading={updatingStatus}
                />
            }
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <OrderSummary 
              items={displayItems}
              orderId={order.orderId}
              isVendorViewingOrder={isVendorViewingOrder}
            />

            {/* Shipping Information */}
            <ShippingInfo shipping={order.shipping} />

            {/* Vendor Suborders (for admin/customer/rider) */}
            {!isVendor && order.suborders.length > 0 && (
              <VendorSuborders
                suborders={order.suborders}
                order={order}
                selectedSuborderId={selectedSuborderId}
                onSelectSuborder={setSelectedSuborderId}
                user={user}
                onStatusUpdate={handleStatusUpdate}
                updatingStatus={updatingStatus}
              />
            )}

            {/* Admin Rider Assignment Section */}
            {isAdmin && selectedSuborderData && selectedSuborderData.suborder.status === 'READY_FOR_PICKUP' && (
              <RiderAssignment
                availableRiders={availableRiders}
                selectedRiderId={selectedRiderId}
                onSelectRider={setSelectedRiderId}
                deliveryFee={deliveryFee}
                onDeliveryFeeChange={setDeliveryFee}
                onAssignRider={handleAssignRider}
                isAssigningRider={isAssigningRider}
              />
            )}

            {/* Rider Delivery Actions */}
            {isRider && effectiveSuborder && effectiveSuborder.riderId === user._id && (
              <DeliveryActions
                suborder={effectiveSuborder}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                updatingStatus={updatingStatus}
                confirmationCode={confirmationCode}
                onConfirmationCodeChange={setConfirmationCode}
                onConfirmDelivery={handleConfirmDelivery}
              />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <OrderSidebar
            order={order}
            role={effectiveRole}
            effectiveSuborder={effectiveSuborder}
            isVendor={user?.role === 'vendor' && viewAs !== 'customer'}
            //isVendor={isVendor}
            isAdmin={isAdmin}
            isRider={isRider}
            vendorView={vendorView}
            adminView={adminView}
            vendorSuborder={vendorSuborder}
            selectedSuborderData={selectedSuborderData}
          />
        </div>
      </div>
    </div>
  );
}