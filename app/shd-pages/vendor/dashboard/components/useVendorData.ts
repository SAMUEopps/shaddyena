'use client';

import { useState, useEffect } from 'react';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerId: {
    name: string;
  };
  products: any[];
  createdAt: string;
}

interface VendorProfile {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  payoutMethod: 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL';
  payoutDetails: {
    mpesaNumber?: string;
    pochiNumber?: string;
    tillNumber?: string;
    paybillNumber?: string;
    paybillAccount?: string;
  };
  profileImage?: string;
  coverImage?: string;
  totalEarned: number;
  pendingPayout: number;
  createdAt: string;
}

export function useVendorData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/shd-api/api/vendors/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchVendorProfile = async () => {
    try {
      const response = await fetch('/api/shd-api/api/vendors/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.vendor) {
        setVendor(data.vendor);
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