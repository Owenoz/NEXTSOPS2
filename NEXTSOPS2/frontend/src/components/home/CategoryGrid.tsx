'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Smartphone, Laptop, Shirt, Home, Sparkles, ShoppingBag, Utensils, Baby } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types/database.types'

const iconMap: Record<string, any> = {
  phones: Smartphone,
  electronics: Laptop,
  fashion: Shirt,
  home: Home,
  beauty: Sparkles,
  supermarket: ShoppingBag,
  groceries: Utensils,
  baby: Baby,
}

const colorMap: Record<number, string> = {
  0: 'bg-blue-100 text-blue-600',
  1: 'bg-purple-100 text-purple-600',
  2: 'bg-pink-100 text-pink-600',
  3: 'bg-green-100 text-green-600',
  4: 'bg-yellow-100 text-yellow-600',
  5: 'bg-red-100 text-red-600',
  6: 'bg-orange-100 text-orange-600',
  7: 'bg-indigo-100 text-indigo-600',
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name')
        .limit(8)

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="text-center py-12 text-gray-500">
          No categories available yet
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category, index) => {
          const Icon = iconMap[category.slug] || ShoppingBag
          const color = colorMap[index % 8]
          
          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-100 hover:border-primary-500 hover:shadow-lg transition-all group"
            >
              <div className={`${color} p-4 rounded-full mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
