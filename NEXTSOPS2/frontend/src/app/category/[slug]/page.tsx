import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CategoryContent from '@/components/category/CategoryContent'

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryContent slug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}
