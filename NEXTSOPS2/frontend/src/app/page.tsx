import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/home/HeroSlider'
import CategoryGrid from '@/components/home/CategoryGrid'
import FlashSales from '@/components/home/FlashSales'
import TrendingProducts from '@/components/home/TrendingProducts'
import OfficialStores from '@/components/home/OfficialStores'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <div className="container mx-auto px-4 py-8 space-y-12">
          <CategoryGrid />
          <FlashSales />
          <TrendingProducts />
          <OfficialStores />
        </div>
      </main>
      <Footer />
    </div>
  )
}
