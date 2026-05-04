'use client'

import { useState, useEffect } from 'react'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/database.types'

export default function ProductDetail({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendor:vendors(business_name, rating),
          category:categories(name)
        `)
        .eq('id', productId)
        .eq('status', 'approved')
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const discount = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-xl aspect-square flex items-center justify-center mb-4 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-9xl">📦</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`bg-gray-100 rounded-lg aspect-square overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-primary-500' : 'border-transparent'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          {/* Category */}
          {product.category && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                {product.category.name}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-primary-600">
                UGX {product.price.toLocaleString()}
              </span>
              {product.compare_price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    UGX {product.compare_price.toLocaleString()}
                  </span>
                  <span className="bg-accent-500 text-white px-3 py-1 rounded-md font-bold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">Tax included. Free shipping on orders over UGX 100,000</p>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border-2 rounded-lg hover:border-primary-500"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 h-10 text-center border-2 rounded-lg"
                min="1"
                max={product.stock}
                aria-label="Product quantity"
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border-2 rounded-lg hover:border-primary-500"
                aria-label="Increase quantity"
              >
                +
              </button>
              <span className="text-sm text-gray-500">{product.stock} available</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button 
              type="button"
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button 
              type="button"
              className="w-14 h-14 border-2 border-gray-300 hover:border-primary-500 rounded-lg flex items-center justify-center"
              aria-label="Add to wishlist"
            >
              <Heart className="w-6 h-6" />
            </button>
            <button 
              type="button"
              className="w-14 h-14 border-2 border-gray-300 hover:border-primary-500 rounded-lg flex items-center justify-center"
              aria-label="Share product"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
              <Truck className="w-8 h-8 text-primary-600 mb-2" />
              <span className="text-xs font-medium">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
              <Shield className="w-8 h-8 text-primary-600 mb-2" />
              <span className="text-xs font-medium">Buyer Protection</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
              <RotateCcw className="w-8 h-8 text-primary-600 mb-2" />
              <span className="text-xs font-medium">7 Days Return</span>
            </div>
          </div>

          {/* Seller */}
          {product.vendor && (
            <div className="border-2 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{product.vendor.business_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
                <button 
                  type="button"
                  className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium"
                >
                  Visit Store
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="border-t pt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description || 'No description available.'}
          </p>
        </div>

        {product.sku && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <div className="border-b py-3">
              <span className="font-medium">SKU: </span>
              <span className="text-gray-700">{product.sku}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
