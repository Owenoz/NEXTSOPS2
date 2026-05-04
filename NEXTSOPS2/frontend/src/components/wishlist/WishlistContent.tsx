'use client'

import { useState } from 'react'
import { Trash2, ShoppingCart, Heart } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'

export default function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: 'Samsung Galaxy A54', price: 1200000, originalPrice: 1500000, image: '📱', rating: 4.5, reviews: 234, inStock: true },
    { id: 2, name: 'HP Laptop 15s', price: 2100000, originalPrice: 2800000, image: '💻', rating: 4.3, reviews: 156, inStock: true },
    { id: 3, name: 'Nike Air Max', price: 280000, originalPrice: 400000, image: '👟', rating: 4.7, reviews: 89, inStock: false },
    { id: 4, name: 'Smart Watch Pro', price: 150000, originalPrice: 250000, image: '⌚', rating: 4.2, reviews: 67, inStock: true },
  ])

  const removeItem = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
  }

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock)
    console.log('Adding to cart:', inStockItems)
    // TODO: Implement add to cart logic
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-600">{wishlistItems.length} items saved</p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={addAllToCart}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add All to Cart
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border-2 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">
              Save items you love to your wishlist and shop them later!
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard product={item} />
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 w-10 h-10 bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-500 rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 transition-all shadow-md z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-white/90 rounded-xl flex items-center justify-center">
                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
