import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetail from '@/components/products/ProductDetail'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetail productId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
