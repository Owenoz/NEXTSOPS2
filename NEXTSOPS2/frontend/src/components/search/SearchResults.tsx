'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/products/ProductCard'
import { SlidersHorizontal, Grid, List } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types/database.types'

interface SearchParams {
  q?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export default function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(5000000)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('popular')

  const query = searchParams.q || ''

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [query, selectedCategories, minPrice, maxPrice, sortBy])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let queryBuilder = supabase
        .from('products')
        .select('*')
        .eq('status', 'approved')

      // Search by name
      if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`)
      }

      // Filter by categories
      if (selectedCategories.length > 0) {
        queryBuilder = queryBuilder.in('category_id', selectedCategories)
      }

      // Filter by price range
      queryBuilder = queryBuilder
        .gte('price', minPrice)
        .lte('price', maxPrice)

      // Sort
      switch (sortBy) {
        case 'price_asc':
          queryBuilder = queryBuilder.order('price', { ascending: true })
          break
        case 'price_desc':
          queryBuilder = queryBuilder.order('price', { ascending: false })
          break
        case 'newest':
          queryBuilder = queryBuilder.order('created_at', { ascending: false })
          break
        default:
          queryBuilder = queryBuilder.order('is_featured', { ascending: false })
          queryBuilder = queryBuilder.order('created_at', { ascending: false })
      }

      const { data, error } = await queryBuilder

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched products:', data)
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setMinPrice(0)
    setMaxPrice(5000000)
    setSortBy('popular')
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="text-sm text-gray-600 mb-4">Loading...</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          Home / Search {query && <span>/ <span className="text-gray-900 font-medium">"{query}"</span></span>}
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {query ? `Search Results for "${query}"` : 'All Products'}
            </h1>
            <p className="text-gray-600">{products.length} products found</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
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

            {/* View Mode */}
            <div className="hidden md:flex border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                aria-label="Grid view"
                title="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                aria-label="List view"
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg bg-white"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`
            ${showFilters ? 'block' : 'hidden'} md:block
            w-full md:w-64 flex-shrink-0
            fixed md:static inset-0 z-40 md:z-0
            bg-white md:bg-transparent
            p-4 md:p-0
            overflow-y-auto
          `}>
            <div className="bg-white rounded-xl border-2 p-6 space-y-6">
              {/* Close button (mobile) */}
              <div className="flex justify-between items-center md:hidden mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <button 
                  type="button"
                  onClick={() => setShowFilters(false)} 
                  className="text-gray-500"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Category */}
              <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="w-4 h-4 rounded border-gray-300" 
                        aria-label={`Filter by ${cat.name}`}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range (UGX)</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label htmlFor="min-price" className="text-xs text-gray-600">Min</label>
                      <input
                        id="min-price"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="max-price" className="text-xs text-gray-600">Max</label>
                      <input
                        id="max-price"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="5000000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Filters */}
              <button 
                type="button"
                onClick={() => setShowFilters(false)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold"
              >
                Apply Filters
              </button>
              <button 
                type="button"
                onClick={handleClearFilters}
                className="w-full border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {(selectedCategories.length > 0 || minPrice > 0 || maxPrice < 5000000) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(catId => {
                  const cat = categories.find(c => c.id === catId)
                  return cat ? (
                    <span key={catId} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                      {cat.name}
                      <button 
                        type="button"
                        onClick={() => handleCategoryToggle(catId)}
                        className="hover:text-primary-900"
                        aria-label={`Remove ${cat.name} filter`}
                      >
                        ✕
                      </button>
                    </span>
                  ) : null
                })}
                {(minPrice > 0 || maxPrice < 5000000) && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                    UGX {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
                    <button 
                      type="button"
                      onClick={() => {
                        setMinPrice(0)
                        setMaxPrice(5000000)
                      }}
                      className="hover:text-primary-900"
                      aria-label="Remove price filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {products.length > 0 ? (
              <div className={`
                grid gap-4
                ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}
              `}>
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
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No products found</p>
                <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
