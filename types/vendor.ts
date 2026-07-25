export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  rating: number;
  totalDeliveries: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  deliveryStatus?: string;

  customerId: {
    name: string;
    phone: string;
  };

  products: any[];

  createdAt: string;

  deliveryAddress?: string;
  deliveryPhone?: string;

  rider?: Rider | null;
  riderAssignedAt?: Date;
}