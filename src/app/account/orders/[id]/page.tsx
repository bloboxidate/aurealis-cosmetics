import OrderDetails from '@/components/account/order-details';

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  return <OrderDetails orderId={params.id} />;
}

export const metadata = {
  title: 'Order Details - Aurealis Cosmetics',
  description: 'View detailed information about your order',
};
