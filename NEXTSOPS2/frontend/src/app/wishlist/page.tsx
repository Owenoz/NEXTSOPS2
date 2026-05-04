import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WishlistContent from '@/components/wishlist/WishlistContent'

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <WishlistContent />
      </main>
      <Footer />
    </div>
  )
}
