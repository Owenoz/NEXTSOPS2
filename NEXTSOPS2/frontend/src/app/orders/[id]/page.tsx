import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import OrderTracking from '@/components/orders/OrderTracking'

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <OrderTracking orderId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
