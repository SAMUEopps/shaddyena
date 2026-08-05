
// // app/shd-pages/vendor/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useVendorData } from './components/useVendorData';
// import EditProfileModal from './components/EditProfileModal';
// import OrdersList from './components/OrdersList';
// import VendorStats from './components/VendorStats';
// import VendorHeader from './components/VendorHeader';
// import MessageBanner from './components/MessageBanner';
// import LoadingSpinner from './components/LoadingSpinner';
// import AdvertisementManager from '@/app/SHD-COMPONENTS/components/AdvertisementManager';


// interface Rider {
//   id: string;
//   name: string;
//   phone: string;
//   vehicleType: string;
//   rating: number;
//   totalDeliveries: number;
// }

// export default function VendorDashboard() {
//   const { orders, vendor, loading, refreshData, updateVendor, setOrders } = useVendorData();
//   const [availableRiders, setAvailableRiders] = useState<Rider[]>([]);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
//   const [editForm, setEditForm] = useState({
//     businessName: '',
//     ownerName: '',
//     phoneNumber: '',
//     businessLocation: '',
//     payoutMethod: 'MPESA' as 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL',
//     payoutDetails: {
//       mpesaNumber: '',
//       pochiNumber: '',
//       tillNumber: '',
//       paybillNumber: '',
//       paybillAccount: '',
//     },
//   });

//   // Fetch available riders
//   const fetchAvailableRiders = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/vendors/riders', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setAvailableRiders(data.riders || []);
//       }
//     } catch (error) {
//       console.error('Error fetching riders:', error);
//     }
//   };

//   useEffect(() => {
//     if (vendor) {
//       setEditForm({
//         businessName: vendor.businessName || '',
//         ownerName: vendor.ownerName || '',
//         phoneNumber: vendor.phoneNumber || '',
//         businessLocation: vendor.businessLocation || '',
//         payoutMethod: vendor.payoutMethod || 'MPESA',
//         payoutDetails: {
//           mpesaNumber: vendor.payoutDetails?.mpesaNumber || '',
//           pochiNumber: vendor.payoutDetails?.pochiNumber || '',
//           tillNumber: vendor.payoutDetails?.tillNumber || '',
//           paybillNumber: vendor.payoutDetails?.paybillNumber || '',
//           paybillAccount: vendor.payoutDetails?.paybillAccount || '',
//         },
//       });
//     }
//     fetchAvailableRiders();
//   }, [vendor]);

//   const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', file);
//       formData.append('type', type);

//       const response = await fetch('/api/shd-api/api/vendors/upload', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         updateVendor(data.vendor);
//         showMessage('success', `${type} image uploaded successfully!`);
//       } else {
//         const data = await response.json();
//         showMessage('error', data.error || 'Failed to upload image');
//       }
//     } catch (error) {
//       showMessage('error', 'Failed to upload image');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleImageRemove = async (type: 'profile' | 'cover') => {
//     if (!confirm(`Remove ${type} image?`)) return;

//     try {
//       const response = await fetch(`/api/shd-api/api/vendors/upload?type=${type}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         updateVendor(data.vendor);
//         showMessage('success', `${type} image removed successfully!`);
//       }
//     } catch (error) {
//       showMessage('error', 'Failed to remove image');
//     }
//   };

//   const handleProfileUpdate = async (formData: any) => {
//     setSaving(true);
//     try {
//       const response = await fetch('/api/shd-api/api/vendors/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         updateVendor(data.vendor);
//         setShowEditModal(false);
//         showMessage('success', 'Profile updated successfully!');
//         refreshData();
//       } else {
//         const data = await response.json();
//         showMessage('error', data.error || 'Failed to update profile');
//       }
//     } catch (error) {
//       showMessage('error', 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const updateOrderStatus = async (orderId: string, status: string) => {
//     try {
//       const response = await fetch('/api/shd-api/api/orders/status', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ orderId, status })
//       });

//       if (response.ok) {
//         const updatedOrders = orders.map(order => 
//           order._id === orderId ? { ...order, status } : order
//         );
//         setOrders(updatedOrders);
//         showMessage('success', 'Order updated successfully!');
//       }
//     } catch (error) {
//       showMessage('error', 'Failed to update order');
//     }
//   };

//   const assignRiderToOrder = async (orderId: string, riderId: string) => {
//     try {
//       const response = await fetch('/api/shd-api/api/orders/assign-rider', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ orderId, riderId })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const updatedOrders = orders.map(order => 
//           order._id === orderId ? { 
//             ...order, 
//             rider: data.order.rider,
//             deliveryStatus: 'assigned',
//             riderAssignedAt: new Date()
//           } : order
//         );
//         setOrders(updatedOrders);
//         showMessage('success', 'Rider assigned successfully!');
//         fetchAvailableRiders();
//       } else {
//         const data = await response.json();
//         showMessage('error', data.error || 'Failed to assign rider');
//       }
//     } catch (error) {
//       showMessage('error', 'Failed to assign rider');
//     }
//   };

//   const showMessage = (type: 'success' | 'error', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 3000);
//   };

//   if (loading) {
//     return <LoadingSpinner message="Loading dashboard..." />;
//   }

//   const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
//   const pendingOrders = orders.filter(o => o.status === 'pending').length;
//   const processingOrders = orders.filter(o => o.status === 'processing').length;

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10">
//         {/* Messages */}
//         {message && <MessageBanner type={message.type} text={message.text} />}

//         {/* Vendor Header */}
//         <VendorHeader
//           vendor={vendor}
//           uploading={uploading}
//           onImageUpload={handleImageUpload}
//           onImageRemove={handleImageRemove}
//           onEditClick={() => setShowEditModal(true)}
//         />

//         {/* Stats */}
//         <VendorStats
//           totalOrders={orders.length}
//           totalRevenue={totalRevenue}
//           pendingOrders={pendingOrders}
//           processingOrders={processingOrders}
//         />

//         {/* Advertisement Manager - NEW */}
//         <AdvertisementManager 
//           vendorId={vendor?._id}
//           vendorName={vendor?.businessName}
//           onShowMessage={showMessage}
//         />

//         {/* Orders List */}
//         <OrdersList 
//           orders={orders} 
//           onStatusChange={updateOrderStatus}
//           onAssignRider={assignRiderToOrder}
//           availableRiders={availableRiders}
//         />

//         {/* Edit Profile Modal */}
//         <EditProfileModal
//           isOpen={showEditModal}
//           onClose={() => setShowEditModal(false)}
//           onSave={handleProfileUpdate}
//           initialData={editForm}
//           saving={saving}
//         />
//       </div>
//     </div>
//   );
// }



// app/shd-pages/vendor/page.tsx - Update the totalRevenue calculation
'use client';

import { useState, useEffect } from 'react';
import { useVendorData } from './components/useVendorData';
import EditProfileModal from './components/EditProfileModal';
import OrdersList from './components/OrdersList';
import VendorStats from './components/VendorStats';
import VendorHeader from './components/VendorHeader';
import MessageBanner from './components/MessageBanner';
import LoadingSpinner from './components/LoadingSpinner';
import AdvertisementManager from '@/app/SHD-COMPONENTS/components/AdvertisementManager';

interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  rating: number;
  totalDeliveries: number;
}

export default function VendorDashboard() {
  const { orders, vendor, loading, refreshData, updateVendor, setOrders } = useVendorData();
  const [availableRiders, setAvailableRiders] = useState<Rider[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editForm, setEditForm] = useState({
    businessName: '',
    ownerName: '',
    phoneNumber: '',
    businessLocation: '',
    payoutMethod: 'MPESA' as 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL',
    payoutDetails: {
      mpesaNumber: '',
      pochiNumber: '',
      tillNumber: '',
      paybillNumber: '',
      paybillAccount: '',
    },
  });

  // Fetch available riders
  const fetchAvailableRiders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/vendors/riders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableRiders(data.riders || []);
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  useEffect(() => {
    if (vendor) {
      setEditForm({
        businessName: vendor.businessName || '',
        ownerName: vendor.ownerName || '',
        phoneNumber: vendor.phoneNumber || '',
        businessLocation: vendor.businessLocation || '',
        payoutMethod: vendor.payoutMethod || 'MPESA',
        payoutDetails: {
          mpesaNumber: vendor.payoutDetails?.mpesaNumber || '',
          pochiNumber: vendor.payoutDetails?.pochiNumber || '',
          tillNumber: vendor.payoutDetails?.tillNumber || '',
          paybillNumber: vendor.payoutDetails?.paybillNumber || '',
          paybillAccount: vendor.payoutDetails?.paybillAccount || '',
        },
      });
    }
    fetchAvailableRiders();
  }, [vendor]);

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const response = await fetch('/api/shd-api/api/vendors/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateVendor(data.vendor);
        showMessage('success', `${type} image uploaded successfully!`);
      } else {
        const data = await response.json();
        showMessage('error', data.error || 'Failed to upload image');
      }
    } catch (error) {
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = async (type: 'profile' | 'cover') => {
    if (!confirm(`Remove ${type} image?`)) return;

    try {
      const response = await fetch(`/api/shd-api/api/vendors/upload?type=${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        updateVendor(data.vendor);
        showMessage('success', `${type} image removed successfully!`);
      }
    } catch (error) {
      showMessage('error', 'Failed to remove image');
    }
  };

  const handleProfileUpdate = async (formData: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/shd-api/api/vendors/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        updateVendor(data.vendor);
        setShowEditModal(false);
        showMessage('success', 'Profile updated successfully!');
        refreshData();
      } else {
        const data = await response.json();
        showMessage('error', data.error || 'Failed to update profile');
      }
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/shd-api/api/orders/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId, status })
      });

      if (response.ok) {
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, status } : order
        );
        setOrders(updatedOrders);
        showMessage('success', 'Order updated successfully!');
      }
    } catch (error) {
      showMessage('error', 'Failed to update order');
    }
  };

  const assignRiderToOrder = async (orderId: string, riderId: string) => {
    try {
      const response = await fetch('/api/shd-api/api/orders/assign-rider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId, riderId })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { 
            ...order, 
            rider: data.order.rider,
            deliveryStatus: 'assigned',
            riderAssignedAt: new Date()
          } : order
        );
        setOrders(updatedOrders);
        showMessage('success', 'Rider assigned successfully!');
        fetchAvailableRiders();
      } else {
        const data = await response.json();
        showMessage('error', data.error || 'Failed to assign rider');
      }
    } catch (error) {
      showMessage('error', 'Failed to assign rider');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Use vendor available balance for revenue display
  const totalRevenue = vendor?.totalRevenue || orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* Messages */}
        {message && <MessageBanner type={message.type} text={message.text} />}

        {/* Vendor Header */}
        <VendorHeader
          vendor={vendor}
          uploading={uploading}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          onEditClick={() => setShowEditModal(true)}
        />

        {/* Stats - Pass revenue data */}
        <VendorStats
          totalOrders={orders.length}
          totalRevenue={vendor?.totalRevenue || totalRevenue}
          pendingOrders={pendingOrders}
          processingOrders={processingOrders}
          availableBalance={vendor?.availableBalance || 0}
          pendingBalance={vendor?.pendingBalance || 0}
        />

        {/* Advertisement Manager */}
        <AdvertisementManager 
          vendorId={vendor?._id}
          vendorName={vendor?.businessName}
          onShowMessage={showMessage}
        />

        {/* Orders List */}
        <OrdersList 
          orders={orders} 
          onStatusChange={updateOrderStatus}
          onAssignRider={assignRiderToOrder}
          availableRiders={availableRiders}
        />

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
          initialData={editForm}
          saving={saving}
        />
      </div>
    </div>
  );
}