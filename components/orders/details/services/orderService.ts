/*import { Order, Suborder, ApiResponse } from '@/components/orders/details/types/orders';

export class OrderService {
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static formatCurrency(amount: number, currency: string = 'KES'): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  }

  static getBuyerName(buyer: string | any): string {
    if (typeof buyer === 'object' && buyer !== null) {
      return `${buyer.firstName} ${buyer.lastName}`;
    }
    return 'Customer';
  }

  static getBuyerEmail(buyer: string | any): string {
    if (typeof buyer === 'object' && buyer !== null) {
      return buyer.email;
    }
    return 'N/A';
  }

  static getRiderName(rider: string | any): string {
    if (!rider) return 'Not assigned';
    if (typeof rider === 'object' && rider !== null) {
      return `${rider.firstName} ${rider.lastName}`;
    }
    return 'Rider';
  }

  static getStatusColor(status: string): string {
    switch(status) {
      case 'DELIVERED':
      case 'COMPLETED':
      case 'PAID': 
        return 'bg-green-100 text-green-800';
      case 'SHIPPED': 
      case 'IN_TRANSIT':
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
  }

  static async fetchOrders(endpoint: string, params: Record<string, string> = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${endpoint}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    return response.json();
  }

  static async updateOrderStatus(data: {
    orderId: string;
    suborderId?: string;
    status: string;
  }): Promise<any> {
    const response = await fetch('/api/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update status');
    }
    
    return response.json();
  }
}*/

import { Order, Suborder, ApiResponse } from '@/components/orders/details/types/orders';

export class OrderService {
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static formatCurrency(amount: number, currency: string = 'KES'): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  }

  static getBuyerName(buyer: string | any): string {
    if (typeof buyer === 'object' && buyer !== null) {
      return `${buyer.firstName} ${buyer.lastName}`;
    }
    return 'Customer';
  }

  static getBuyerEmail(buyer: string | any): string {
    if (typeof buyer === 'object' && buyer !== null) {
      return buyer.email;
    }
    return 'N/A';
  }

  static getRiderName(rider: string | any): string {
    if (!rider) return 'Not assigned';
    if (typeof rider === 'object' && rider !== null) {
      return `${rider.firstName} ${rider.lastName}`;
    }
    return 'Rider';
  }

  /*static getStatusColor(status: string): string {
    switch(status) {
      case 'DELIVERED':
      case 'COMPLETED':
      case 'PAID': 
        return 'bg-green-100 text-green-800';
      case 'SHIPPED': 
      case 'IN_TRANSIT':
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
  }*/

    static getStatusColor(status: string): string {
  switch(status) {
    case 'DELIVERED':
    case 'COMPLETED':
    case 'PAID': 
      return 'bg-green-100 text-green-800';
    case 'ASSIGNED':
      return 'bg-purple-100 text-purple-800';
    case 'PICKED_UP':
    case 'IN_TRANSIT':
      return 'bg-blue-100 text-blue-800';
    case 'READY_FOR_PICKUP':
    case 'PROCESSING': 
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-teal-100 text-teal-800';
    case 'PENDING':
      return 'bg-gray-100 text-gray-800';
    case 'CANCELLED':
    case 'FAILED':
    case 'REFUNDED': 
      return 'bg-red-100 text-red-800';
    default: 
      return 'bg-gray-100 text-gray-800';
  }
}

  static async fetchOrders(endpoint: string, params: Record<string, string> = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${endpoint}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    return response.json();
  }

  static async updateOrderStatus(data: {
    orderId: string;
    suborderId?: string;
    status: string;
    riderId?: string; // Add riderId
    deliveryFee?: number; // Add deliveryFee
  }): Promise<any> {
    const response = await fetch('/api/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update status');
    }
    
    return response.json();
  }

  static async markAsReadyForPickup(orderId: string, suborderId: string): Promise<any> {
    return this.updateOrderStatus({
      orderId,
      suborderId,
      status: 'READY_FOR_PICKUP'
    });
  }

  /*static async assignRider(orderId: string, suborderId: string, riderId: string, deliveryFee?: number): Promise<any> {
    return this.updateOrderStatus({
      orderId,
      suborderId,
      status: 'SHIPPED', // SHIPPED now means assigned to rider
      riderId,
      deliveryFee: deliveryFee || 0
    });
  }*/
 static async assignRider(orderId: string, suborderId: string, riderId: string, deliveryFee?: number): Promise<any> {
  return this.updateOrderStatus({
    orderId,
    suborderId,
    status: 'ASSIGNED', // Changed from SHIPPED to ASSIGNED
    riderId,
    deliveryFee: deliveryFee || 0
  });
}
}