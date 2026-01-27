import OrderDetails from "@/components/orders/details/OrderDetails";


interface OrderPageProps {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  return <OrderDetails orderId={params.id} />;
}