'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/database.types'

export default function FlashSales() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 45 })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchFlashSales()
  }, [])

  const fetchFlashSales = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'approved')
        .not('compare_price', 'is', null)
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching flash sales:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">⚡ Flash Sales</h2>
            <p className="text-sm text-gray-600">Limited time offers - Hurry up!</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">⚡ Flash Sales</h2>
            <p className="text-sm text-gray-600">Limited time offers - Hurry up!</p>
          </div>
        </div>
        <div className="text-center py-12 text-gray-500">
          No flash sales available at the moment
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">⚡ Flash Sales</h2>
          <p className="text-sm text-gray-600">Limited time offers - Hurry up!</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">Ends in:</span>
          <div className="flex gap-1">
            <div className="bg-white px-3 py-2 rounded-lg text-center min-w-[50px]">
              <div className="text-xl font-bold text-accent-600">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">Hours</div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg text-center min-w-[50px]">
              <div className="text-xl font-bold text-accent-600">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">Mins</div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg text-center min-w-[50px]">
              <div className="text-xl font-bold text-accent-600">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">Secs</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.compare_price,
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
