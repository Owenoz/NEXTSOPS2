import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CheckoutForm from '@/components/checkout/CheckoutForm'

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CheckoutForm />
      </main>
      <Footer />
    </div>
  )
}
