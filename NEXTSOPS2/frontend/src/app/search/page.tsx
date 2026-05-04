import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SearchResults from '@/components/search/SearchResults'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SearchResults searchParams={params} />
      </main>
      <Footer />
    </div>
  )
}
