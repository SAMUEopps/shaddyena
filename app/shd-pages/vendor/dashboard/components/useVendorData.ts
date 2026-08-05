// 'use client';

// import { Order } from '@/types/vendor';
// import { useState, useEffect } from 'react';

// interface VendorProfile {
//   _id: string;
//   businessName: string;
//   ownerName: string;
//   phoneNumber: string;
//   businessLocation: string;
//   payoutMethod: 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL';
//   payoutDetails: {
//     mpesaNumber?: string;
//     pochiNumber?: string;
//     tillNumber?: string;
//     paybillNumber?: string;
//     paybillAccount?: string;
//   };
//   profileImage?: string;
//   coverImage?: string;
//   totalEarned: number;
//   pendingPayout: number;
//   createdAt: string;
// }

// export function useVendorData() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [vendor, setVendor] = useState<VendorProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch('/api/shd-api/api/vendors/orders', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setOrders(data.orders || []);
//     } catch (error) {
//       console.error('Failed to fetch orders:', error);
//     }
//   };

//   const fetchVendorProfile = async () => {
//     try {
//       const response = await fetch('/api/shd-api/api/vendors/profile', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       if (data.vendor) {
//         setVendor(data.vendor);
//       }
//     } catch (error) {
//       console.error('Failed to fetch vendor profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     fetchVendorProfile();
//   }, []);

//   const refreshData = () => {
//     fetchOrders();
//     fetchVendorProfile();
//   };

//   const updateVendor = (updatedVendor: VendorProfile) => {
//     setVendor(updatedVendor);
//   };

//   return {
//     orders,
//     vendor,
//     loading,
//     refreshData,
//     updateVendor,
//     setOrders
//   };
// }

// app/shd-pages/vendor/components/useVendorData.ts
'use client';

import { Order, VendorProfile } from '@/types/vendor';
import { useState, useEffect } from 'react';

export function useVendorData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found');
        return;
      }

      const response = await fetch('/api/shd-api/api/vendors/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchVendorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/shd-api/api/vendors/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.vendor) {
        // Ensure all fields exist with defaults
        const vendorData: VendorProfile = {
          ...data.vendor,
          totalRevenue: data.vendor.totalRevenue || 0,
          availableBalance: data.vendor.availableBalance || 0,
          pendingBalance: data.vendor.pendingBalance || 0,
          totalWithdrawn: data.vendor.totalWithdrawn || 0,
          lifetimeEarnings: data.vendor.lifetimeEarnings || 0,
          totalEarned: data.vendor.totalEarned || data.vendor.totalRevenue || 0,
          pendingPayout: data.vendor.pendingPayout || data.vendor.pendingBalance || 0,
        };
        setVendor(vendorData);
      }
    } catch (error) {
      console.error('Failed to fetch vendor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchVendorProfile();
  }, []);

  const refreshData = () => {
    fetchOrders();
    fetchVendorProfile();
  };

  const updateVendor = (updatedVendor: VendorProfile) => {
    setVendor(updatedVendor);
  };

  return {
    orders,
    vendor,
    loading,
    refreshData,
    updateVendor,
    setOrders
  };
}