'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/products/ProductCard'
import { ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types/database.types'

const categoryData: Record<string, any> = {
  phones: {
    name: 'Phones & Tablets',
    description: 'Latest smartphones, feature phones, and tablets from top brands',
    banner: '📱',
    subcategories: ['Smartphones', 'Feature Phones', 'Tablets', 'Accessories'],
  },
  electronics: {
    name: 'Electronics',
    description: 'Laptops, TVs, cameras, and more electronic devices',
    banner: '💻',
    subcategories: ['Laptops', 'TVs', 'Cameras', 'Audio', 'Gaming'],
  },
  fashion: {
    name: 'Fashion',
    description: 'Trending clothes, shoes, and accessories for men and women',
    banner: '👔',
    subcategories: ['Men\'s Fashion', 'Women\'s Fashion', 'Shoes', 'Bags', 'Watches'],
  },
}

export default function CategoryContent({ slug }: { slug: string }) {
  const category = categoryData[slug] || categoryData.phones
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    fetchProducts()
  }, [slug, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'approved')

      // Sort
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price', { ascending: false })
          break
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        default:
          query = query.order('is_featured', { ascending: false })
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50">
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span>{category.name}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-8xl">{category.banner}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              <p className="text-lg opacity-90">{category.description}</p>
              <p className="mt-2 text-sm opacity-75">{products.length} products available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subcategories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {category.subcategories.map((sub: string) => (
              <button
                type="button"
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`p-4 rounded-xl border-2 font-medium transition-all ${
                  selectedSubcategory === sub
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white hover:border-primary-300'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-xl border-2">
          <div className="flex flex-wrap gap-2">
            <button 
              type="button"
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              Price: Low to High
            </button>
            <button 
              type="button"
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              Free Delivery
            </button>
            <button 
              type="button"
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              4★ & Above
            </button>
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            aria-label="Sort products"
          >
            <option value="popular">Sort: Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No products available in this category</p>
          </div>
        ) : (
          <>
            {/* All Products */}
            <div>
              <h2 className="text-xl font-bold mb-4">All Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0] || '/placeholder.jpg',
                      rating: 4.5,
                      reviews: 0
                    }} 
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
