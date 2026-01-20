
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import OrderStatusBar from '@/components/orders/OrderStatusBar';

interface OrderItem {
  productId: string;
  vendorId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StatusBarSuborder {
  _id?: string;
  vendorId: string;
  status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'CONFIRMED';
  amount: number;
  commission: number;
  netAmount: number;
  deliveryFee?: number;
  riderId?: string; 
}


interface Suborder {
  _id?: string;
  vendorId: string;
  shopId: string;
  riderId?: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  deliveryFee: number;
  riderPayoutStatus: 'PENDING' | 'PAID' | 'HOLD';
  items: OrderItem[];
  amount: number;
  commission: number;
  netAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'CONFIRMED';
  deliveryDetails?: {
    pickupAddress?: string;
    dropoffAddress: string;
    estimatedTime?: string;
    actualTime?: string;
    notes?: string;
    confirmationCode?: string;
     riderConfirmedAt?: string | Date;
  };
}

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  buyerId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  suborders: Suborder[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
  deliveryFeeTotal: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'CONFIRMED';
  mpesaTransactionId?: string;
}

interface OrderDetailsProps {
  orderId: string;
}

interface VendorSuborderData {
  suborder: Suborder;
  items: OrderItem[];
}

interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorSuborder, setVendorSuborder] = useState<VendorSuborderData | null>(null);
  const [selectedSuborderId, setSelectedSuborderId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [availableRiders, setAvailableRiders] = useState<Rider[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isAssigningRider, setIsAssigningRider] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const vendorView = searchParams.get('vendorView') === 'true';
  const suborderId = searchParams.get('suborderId');
  const adminView = searchParams.get('adminView') === 'true';

  // Add function to handle delivery confirmation
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
            (item: OrderItem) => item.vendorId === foundSuborder.vendorId
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

  const generatePDF = async () => {
    if (!order) return;

    setIsGeneratingPDF(true);
    try {
      const [html2canvas, jsPDF] = await Promise.all([
        import('html2canvas').then(module => module.default),
        import('jspdf').then(module => module.default)
      ]);

      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '794px';
      pdfContainer.style.padding = '20px';
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.color = 'black';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      
      const displayItems = getDisplayItems();
      
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="margin: 0; color: #333; font-size: 28px;">Shaddyna Order Invoice</h1>
          <p style="margin: 5px 0; color: #666;">Order ID: ${order.orderId}</p>
          <p style="margin: 5px 0; color: #666;">Date: ${formatDate(order.createdAt)}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="flex: 1;">
            <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Customer Information</h2>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${getBuyerName(order.buyerId)}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${getBuyerEmail(order.buyerId)}</p>
          </div>
          <div style="flex: 1;">
            <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Shipping Address</h2>
            <p style="margin: 5px 0;">${order.shipping.address}</p>
            <p style="margin: 5px 0;">${order.shipping.city}, ${order.shipping.country}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shipping.phone}</p>
            ${order.shipping.instructions ? `<p style="margin: 5px 0;"><strong>Instructions:</strong> ${order.shipping.instructions}</p>` : ''}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Product</th>
                <th style="text-align: center; padding: 12px; border: 1px solid #ddd;">Qty</th>
                <th style="text-align: right; padding: 12px; border: 1px solid #ddd;">Price</th>
                <th style="text-align: right; padding: 12px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${displayItems.map((item, index) => `
                <tr key="${index}" style="${index % 2 === 0 ? 'background-color: #f8f9fa;' : ''}">
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="text-align: center; padding: 12px; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${formatCurrency(item.price, order.currency)}</td>
                  <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${formatCurrency(item.price * item.quantity, order.currency)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="border-top: 2px solid #333; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Subtotal:</strong></span>
            <span>${formatCurrency(order.totalAmount - order.shippingFee - order.platformFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Shipping Fee:</strong></span>
            <span>${formatCurrency(order.shippingFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Platform Fee:</strong></span>
            <span>${formatCurrency(order.platformFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
            <span>Total Amount:</span>
            <span>${formatCurrency(order.totalAmount, order.currency)}</span>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #ddd; padding-top: 20px;">
          <p>Thank you for your order!</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.fontFamily = 'Arial, sans-serif';
          }
        }
      });

      document.body.removeChild(pdfContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 5;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`order-${order.orderId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Add this function to transform suborders for OrderStatusBar
/*const transformSubordersForStatusBar = (suborders: Suborder[]): StatusBarSuborder[] => {
  return suborders.map(suborder => ({
    _id: suborder._id,
    vendorId: suborder.vendorId,
    status: suborder.status,
    amount: suborder.amount,
    commission: suborder.commission,
    netAmount: suborder.netAmount,
    deliveryFee: suborder.deliveryFee,
    // Transform riderId to string only
    riderId: typeof suborder.riderId === 'string' 
      ? suborder.riderId 
      : suborder.riderId?._id
  }));
};*/

// Also transform vendorSuborder
const transformVendorSuborderForStatusBar = (vendorSuborder: Suborder): StatusBarSuborder => {
  return {
    _id: vendorSuborder._id,
    vendorId: vendorSuborder.vendorId,
    status: vendorSuborder.status,
    amount: vendorSuborder.amount,
    commission: vendorSuborder.commission,
    netAmount: vendorSuborder.netAmount,
    deliveryFee: vendorSuborder.deliveryFee,
    riderId: typeof vendorSuborder.riderId === 'string' 
      ? vendorSuborder.riderId 
      : vendorSuborder.riderId?._id
  };
};

const transformAllSubordersForStatusBar = (suborders: Suborder[]): StatusBarSuborder[] => {
  return suborders.map(suborder => ({
    _id: suborder._id,
    vendorId: suborder.vendorId,
    status: suborder.status,
    amount: suborder.amount,
    commission: suborder.commission,
    netAmount: suborder.netAmount,
    deliveryFee: suborder.deliveryFee,
    riderId: typeof suborder.riderId === 'string' 
      ? suborder.riderId 
      : suborder.riderId?._id,
    deliveryDetails: suborder.deliveryDetails
  }));
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getBuyerName = (buyer: string | any): string => {
    if (typeof buyer === 'object' && buyer !== null) {
      return `${buyer.firstName} ${buyer.lastName}`;
    }
    return 'Customer';
  };

  const getBuyerEmail = (buyer: string | any): string => {
    if (typeof buyer === 'object' && buyer !== null) {
      return buyer.email;
    }
    return 'N/A';
  };

  const getRiderName = (rider: string | any): string => {
    if (!rider) return 'Not assigned';
    if (typeof rider === 'object' && rider !== null) {
      return `${rider.firstName} ${rider.lastName}`;
    }
    return 'Rider';
  };

  const getDisplayItems = () => {
    if (!order) return [];
    
    if (user?.role === 'vendor' && vendorSuborder) {
      return vendorSuborder.items || [];
    }
    
    return order.items;
  };

  /*const handleStatusUpdate = async (newStatus: string, isMainOrder: boolean = false, suborderId?: string) => {
    if (!order) return;
    
    setUpdatingStatus(true);
    setError(null);
    
    try {
      const requestBody: any = {
        orderId: order._id,
        status: newStatus
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
      status: newStatus
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

  const getPaymentSummary = () => {
    if (!order) return null;
    
    const selectedSuborderData = getSelectedSuborder();
    const isVendorView = user?.role === 'vendor' && vendorSuborder;
    const suborderData = isVendorView ? vendorSuborder : selectedSuborderData;
    
    if (suborderData && (user?.role === 'vendor' || (user?.role === 'admin' && adminView))) {
      return (
        <>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm text-gray-900">
              {formatCurrency(suborderData.suborder.amount, order.currency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Commission</span>
            <span className="text-sm text-gray-900">
              {formatCurrency(suborderData.suborder.commission, order.currency)}
            </span>
          </div>
          {suborderData.suborder.deliveryFee > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Delivery Fee</span>
              <span className="text-sm text-gray-900">
                {formatCurrency(suborderData.suborder.deliveryFee, order.currency)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-base font-semibold text-gray-900">Net Amount</span>
            <span className="text-base font-semibold text-gray-900">
              {formatCurrency(suborderData.suborder.netAmount, order.currency)}
            </span>
          </div>
        </>
      );
    }
    
    return (
      <>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm text-gray-900">
            {formatCurrency(order.totalAmount - order.shippingFee - order.platformFee, order.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Shipping</span>
          <span className="text-sm text-gray-900">
            {formatCurrency(order.shippingFee, order.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Platform Fee</span>
          <span className="text-sm text-gray-900">
            {formatCurrency(order.platformFee, order.currency)}
          </span>
        </div>
        {order.deliveryFeeTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Delivery Total</span>
            <span className="text-sm text-gray-900">
              {formatCurrency(order.deliveryFeeTotal, order.currency)}
            </span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">
            {formatCurrency(order.totalAmount, order.currency)}
          </span>
        </div>
      </>
    );
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED':
      case 'COMPLETED':
      case 'PAID': 
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
      case 'SHIPPED': 
        return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP':
      case 'ASSIGNED':
        return 'bg-purple-100 text-purple-800';
      case 'READY_FOR_PICKUP':
      case 'PROCESSING': 
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
      case 'FAILED':
      case 'REFUNDED': 
        return 'bg-red-100 text-red-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-6">Please log in to view order details.</p>
          <div className="flex gap-3 justify-center">
            <Link 
              href="/login"
              className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const role = user.role;
  const isVendor = role === 'vendor';
  const isAdmin = role === 'admin';
  const isRider = role === 'delivery';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Order</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={fetchOrder}
              className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors"
            >
              Try Again
            </button>
            <Link 
              href="/?tab=orders"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link 
            href="/?tab=orders"
            className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors inline-block"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const displayItems = getDisplayItems();
  const selectedSuborderData = getSelectedSuborder();
  const isVendorViewingOrder = isVendor && vendorSuborder;
  const effectiveSuborder = isVendorViewingOrder ? vendorSuborder?.suborder : selectedSuborderData?.suborder;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <Link 
              href={isRider ? "/delivery/dashboard" : "/?tab=orders"}
              className="inline-flex items-center text-[#bf2c7e] hover:text-[#a8246e] transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {isRider ? "Back to Dashboard" : "Back to Orders"}
            </Link>
            
            {!isRider && (
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-2">Order placed on {formatDate(order.createdAt)}</p>
              <p className="text-sm text-gray-500 mt-1">
                Viewing as: <span className="capitalize font-medium">{role}</span>
                {isVendorViewingOrder && ' (Vendor View)'}
              </p>
              {isVendorViewingOrder && (
                <p className="text-sm text-gray-500 mt-1">
                  Showing your items only ({displayItems.length} item{displayItems.length !== 1 ? 's' : ''})
                </p>
              )}
            </div>
          </div>

          {/* Order Status Bar */}
          <div className="mt-6">
            {/*<OrderStatusBar
              role={role}
              orderStatus={order.status}
              paymentStatus={order.paymentStatus}
              vendorSuborder={effectiveSuborder || null}
              suborders={order.suborders}
              onStatusUpdate={handleStatusUpdate}
              onSuborderSelect={setSelectedSuborderId}
              selectedSuborderId={selectedSuborderId}
              isLoading={updatingStatus}
            />*/}
            {/*<OrderStatusBar
              role={role}
              orderStatus={order.status}
              paymentStatus={order.paymentStatus}
              vendorSuborder={vendorSuborder ? transformVendorSuborderForStatusBar(vendorSuborder.suborder) : null}
              suborders={transformSubordersForStatusBar(order.suborders)}
              onStatusUpdate={handleStatusUpdate}
              onSuborderSelect={setSelectedSuborderId}
              selectedSuborderId={selectedSuborderId}
              isLoading={updatingStatus}
            />*/}

            <OrderStatusBar
              role={role}
              orderStatus={order.status}
              paymentStatus={order.paymentStatus}
              vendorSuborder={vendorSuborder ? transformVendorSuborderForStatusBar(vendorSuborder.suborder) : null}
              suborders={transformAllSubordersForStatusBar(order.suborders)} // Pass ALL suborders for customers too
              onStatusUpdate={handleStatusUpdate}
              onSuborderSelect={setSelectedSuborderId}
              selectedSuborderId={selectedSuborderId}
              isLoading={updatingStatus}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isVendorViewingOrder ? 'Your Order Items' : 'Order Summary'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isVendorViewingOrder 
                    ? `Showing ${displayItems.length} item${displayItems.length !== 1 ? 's' : ''} from your store`
                    : `Order ID: ${order.orderId}`}
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {displayItems.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-500">No items found</p>
                    </div>
                  ) : (
                    displayItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {!isVendor && (
                            <p className="text-xs text-gray-400">Vendor ID: {item.vendorId.substring(0, 8)}...</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.price * item.quantity, order.currency)}
                          </p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.price, order.currency)} each</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-900">{order.shipping.address}</p>
                    <p className="text-sm text-gray-900">{order.shipping.city}, {order.shipping.country}</p>
                    <p className="text-sm text-gray-600 mt-2">Phone: {order.shipping.phone}</p>
                  </div>
                  {order.shipping.instructions && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Instructions</h3>
                      <p className="text-sm text-gray-900">{order.shipping.instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vendor Suborders (for admin/customer/rider) */}
            {!isVendor && order.suborders.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Vendor Orders</h2>
                  <p className="text-sm text-gray-600">{order.suborders.length} vendor{order.suborders.length !== 1 ? 's' : ''} involved</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {order.suborders.map((suborder, index) => {
                      const isSelected = suborder._id === selectedSuborderId;
                      const vendorItems = order.items.filter(item => item.vendorId === suborder.vendorId);
                      const isAssignedToCurrentRider = isRider && suborder.riderId === user._id;
                      
                      return (
                        <div 
                          key={index} 
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                            isSelected ? 'border-[#bf2c7e] bg-pink-50' : 
                            isAssignedToCurrentRider ? 'border-blue-300 bg-blue-50' : 
                            'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedSuborderId(suborder._id || null)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900">
                                  Vendor Order #{index + 1} 
                                  {isSelected && ' (Selected)'}
                                  {isAssignedToCurrentRider && ' (Your Delivery)'}
                                </h3>
                                {isSelected && (
                                  <span className="text-xs bg-[#bf2c7e] text-white px-2 py-0.5 rounded">Active</span>
                                )}
                                {isAssignedToCurrentRider && (
                                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Your Assignment</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">Vendor ID: {suborder.vendorId.substring(0, 8)}...</p>
                              <p className="text-xs text-gray-500">{vendorItems.length} item{vendorItems.length !== 1 ? 's' : ''}</p>
                              {suborder.riderId && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Rider: {getRiderName(suborder.riderId)}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(suborder.status)}`}>
                                {suborder.status.replace('_', ' ')}
                              </span>
                              {isAdmin && suborder.status === 'READY_FOR_PICKUP' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSuborderId(suborder._id || null);
                                  }}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                >
                                  Assign Rider
                                </button>
                              )}
                              {isRider && isAssignedToCurrentRider && suborder.status === 'ASSIGNED' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate('PICKED_UP', false, suborder._id);
                                  }}
                                  disabled={updatingStatus}
                                  className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors disabled:opacity-50"
                                >
                                  {updatingStatus ? 'Processing...' : 'Mark as Picked Up'}
                                </button>
                              )}
                              {isRider && isAssignedToCurrentRider && suborder.status === 'PICKED_UP' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate('IN_TRANSIT', false, suborder._id);
                                  }}
                                  disabled={updatingStatus}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                  {updatingStatus ? 'Processing...' : 'Mark as In Transit'}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="text-gray-900">{formatCurrency(suborder.amount, order.currency)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Commission:</span>
                              <span className="text-red-600">-{formatCurrency(suborder.commission, order.currency)}</span>
                            </div>
                            {suborder.deliveryFee > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Fee:</span>
                                <span className="text-green-600">+{formatCurrency(suborder.deliveryFee, order.currency)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold pt-2 border-t">
                              <span className="text-gray-900">Net Amount:</span>
                              <span className="text-green-700">{formatCurrency(suborder.netAmount, order.currency)}</span>
                            </div>
                            {suborder.deliveryDetails && (
                              <div className="pt-2 border-t mt-2">
                                <p className="text-xs text-gray-600">
                                  <strong>Pickup:</strong> {suborder.deliveryDetails.pickupAddress || 'Vendor Shop'}
                                </p>
                                <p className="text-xs text-gray-600">
                                  <strong>Dropoff:</strong> {suborder.deliveryDetails.dropoffAddress}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Admin Rider Assignment Section */}
            {isAdmin && selectedSuborderData && selectedSuborderData.suborder.status === 'READY_FOR_PICKUP' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Assign Delivery Rider</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Rider
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={selectedRiderId}
                        onChange={(e) => setSelectedRiderId(e.target.value)}
                      >
                        <option value="">Select a rider</option>
                        {availableRiders.map(rider => (
                          <option key={rider._id} value={rider._id}>
                            {rider.firstName} {rider.lastName} ({rider.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Fee (KES)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter delivery fee"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        onClick={handleAssignRider}
                        disabled={isAssigningRider || !selectedRiderId || deliveryFee <= 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAssigningRider ? 'Assigning...' : 'Assign Rider'}
                      </button>
                      <p className="text-sm text-gray-600 mt-2">
                        Assigning a rider will change the status to "ASSIGNED" and notify the rider.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rider Delivery Actions */}
            {isRider && effectiveSuborder && effectiveSuborder.riderId === user._id && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Delivery Actions</h2>
                  <p className="text-sm text-gray-600">Manage your delivery assignment</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                  {effectiveSuborder.status === 'DELIVERED' && !effectiveSuborder.deliveryDetails?.riderConfirmedAt && (
                      <div className="space-y-3">
                        <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                          ⏳ Waiting for customer confirmation. Ask customer for confirmation code.
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Enter Confirmation Code
                          </label>
                          <input
                            type="text"
                            placeholder="Enter 8-digit code from customer"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-mono text-lg tracking-wider"
                            maxLength={8}
                          />
                          <button
                            onClick={() => handleConfirmDelivery(effectiveSuborder._id, confirmationCode)}
                            disabled={updatingStatus || !confirmationCode || confirmationCode.length !== 8}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            {updatingStatus ? 'Verifying...' : 'Verify & Complete Delivery'}
                          </button>
                        </div>
                      </div>
                    )}


                    {effectiveSuborder.status === 'CONFIRMED' && (
                      <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
                        ✅ Delivery confirmed by customer!
                        {effectiveSuborder.deliveryDetails?.riderConfirmedAt && (
                          <p className="mt-1 text-xs">
                            Verified at: {new Date(effectiveSuborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
        
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Pickup Location</h3>
                        <p className="text-sm text-gray-900">
                          {effectiveSuborder.deliveryDetails?.pickupAddress || `Vendor Shop: ${effectiveSuborder.shopId}`}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Fee</h3>
                        <p className="text-sm font-semibold text-green-700">
                          {formatCurrency(effectiveSuborder.deliveryFee, order.currency)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {effectiveSuborder.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleStatusUpdate('PICKED_UP', false, effectiveSuborder._id)}
                          disabled={updatingStatus}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          {updatingStatus ? 'Processing...' : 'Mark as Picked Up'}
                        </button>
                      )}
                      
                      {effectiveSuborder.status === 'PICKED_UP' && (
                        <button
                          onClick={() => handleStatusUpdate('IN_TRANSIT', false, effectiveSuborder._id)}
                          disabled={updatingStatus}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {updatingStatus ? 'Processing...' : 'Mark as In Transit'}
                        </button>
                      )}
                      
                      {effectiveSuborder.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleStatusUpdate('DELIVERED', false, effectiveSuborder._id)}
                          disabled={updatingStatus}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {updatingStatus ? 'Processing...' : 'Confirm Delivery'}
                        </button>
                      )}
                      
                      {effectiveSuborder.status === 'DELIVERED' && (
                        <div className="text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                          ✓ Delivery completed. Payment will be processed soon.
                        </div>
                      )}
                    </div>
                    
                    {effectiveSuborder.deliveryDetails?.notes && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Notes</h3>
                        <p className="text-sm text-gray-600">{effectiveSuborder.deliveryDetails.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Order Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Order ID</h3>
                    <p className="text-sm text-gray-900 font-mono">{order.orderId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Order Date</h3>
                    <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
                    <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                  </div>
                  {order.mpesaTransactionId && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">MPESA Transaction ID</h3>
                      <p className="text-sm text-gray-900 font-mono">{order.mpesaTransactionId}</p>
                    </div>
                  )}
                  {effectiveSuborder && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          {role === 'vendor' ? 'Your Net Amount' : 
                           role === 'delivery' ? 'Your Delivery Fee' :
                           'Selected Vendor Net Amount'}
                        </h3>
                        <p className={`text-sm font-semibold ${
                          role === 'delivery' ? 'text-blue-700' : 'text-green-700'
                        }`}>
                          {formatCurrency(
                            role === 'delivery' ? effectiveSuborder.deliveryFee : effectiveSuborder.netAmount, 
                            order.currency
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.paymentStatus === 'PAID' 
                            ? 'Payment received - Earnings available 24h after delivery'
                            : 'Pending payment'}
                        </p>
                      </div>
                      {effectiveSuborder.riderId && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Assigned Rider</h3>
                          <p className="text-sm text-gray-900">{getRiderName(effectiveSuborder.riderId)}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {(role === 'admin' || isVendor || isRider) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Name</h3>
                      <p className="text-sm text-gray-900">{getBuyerName(order.buyerId)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Email</h3>
                      <p className="text-sm text-gray-900">{getBuyerEmail(order.buyerId)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Contact Phone</h3>
                      <p className="text-sm text-gray-900">{order.shipping.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {role === 'vendor' ? 'Vendor Payment Summary' : 
                   role === 'delivery' ? 'Delivery Payment Summary' :
                   role === 'admin' && effectiveSuborder ? 'Selected Vendor Payment' : 'Payment Summary'}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {getPaymentSummary()}
                </div>
              </div>
            </div>

            {/* Delivery Tracking (for riders and assigned orders) */}
            {(isRider || (effectiveSuborder?.riderId)) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Delivery Tracking</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${effectiveSuborder?.status === 'READY_FOR_PICKUP' || effectiveSuborder?.status === 'ASSIGNED' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Order Ready</span>
                      </div>
                      {effectiveSuborder?.status === 'READY_FOR_PICKUP' || effectiveSuborder?.status === 'ASSIGNED' ? (
                        <span className="text-xs text-green-600">✓ Complete</span>
                      ) : null}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${effectiveSuborder?.status === 'PICKED_UP' || effectiveSuborder?.status === 'IN_TRANSIT' || effectiveSuborder?.status === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Picked Up</span>
                      </div>
                      {effectiveSuborder?.status === 'PICKED_UP' || effectiveSuborder?.status === 'IN_TRANSIT' || effectiveSuborder?.status === 'DELIVERED' ? (
                        <span className="text-xs text-green-600">✓ Complete</span>
                      ) : null}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${effectiveSuborder?.status === 'IN_TRANSIT' || effectiveSuborder?.status === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">In Transit</span>
                      </div>
                      {effectiveSuborder?.status === 'IN_TRANSIT' || effectiveSuborder?.status === 'DELIVERED' ? (
                        <span className="text-xs text-green-600">✓ Complete</span>
                      ) : null}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${effectiveSuborder?.status === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Delivered</span>
                      </div>
                      {effectiveSuborder?.status === 'DELIVERED' ? (
                        <span className="text-xs text-green-600">✓ Complete</span>
                      ) : null}
                    </div>
                    
                    {effectiveSuborder?.deliveryDetails?.estimatedTime && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-600">
                          <strong>Estimated Delivery:</strong>{' '}
                          {new Date(effectiveSuborder.deliveryDetails.estimatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}