import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg border-2 border-gray-100 hover:border-primary-500 hover:shadow-xl transition-all overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📦
          </div>
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-accent-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary-600">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <div className="text-lg font-bold text-gray-900">
              UGX {product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                UGX {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}
