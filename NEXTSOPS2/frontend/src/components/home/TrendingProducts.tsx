'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/database.types'

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching trending products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🔥 Trending Products</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🔥 Trending Products</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          No trending products available yet
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🔥 Trending Products</h2>
        <a href="/search" className="text-primary-600 hover:text-primary-700 font-medium">
          View All →
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
    </section>
  )
}
