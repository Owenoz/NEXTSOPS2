'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types/database.types'
import AdminLayout from '@/components/layout/AdminLayout'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    category_id: '',
    stock: '',
    sku: '',
    is_featured: false,
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    checkAuth()
    fetchCategories()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Please login first')
      window.location.href = 'http://localhost:3003/login'
    }
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (!error && data) {
      setCategories(data)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files)
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return []
    
    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const image of images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setUploading(false)
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload images first
      const imageUrls = await uploadImages()

      // Get current user (should be admin)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get or create default admin vendor
      let vendorId = null
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('business_name', 'Admin Store')
        .limit(1)
        .single()

      if (existingVendor) {
        vendorId = existingVendor.id
      } else {
        // Create default admin vendor
        const { data: newVendor, error: vendorError } = await supabase
          .from('vendors')
          .insert({
            user_id: user.id,
            business_name: 'Admin Store',
            business_email: user.email,
            status: 'active',
            rating: 5,
            total_sales: 0,
            commission_rate: 0,
          })
          .select('id')
          .single()

        if (vendorError) throw vendorError
        vendorId = newVendor?.id
      }

      if (!vendorId) throw new Error('Failed to get or create vendor')

      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
          category_id: formData.category_id || null,
          stock: parseInt(formData.stock),
          sku: formData.sku || null,
          images: imageUrls,
          is_featured: formData.is_featured,
          status: 'approved', // Admin-created products are auto-approved
          vendor_id: vendorId,
        })
        .select()
        .single()

      if (error) throw error

      alert('Product created successfully!')
      router.push('/products')
    } catch (error: any) {
      alert('Error creating product: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-gray-600 mt-2">Create a new product for the marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                placeholder="e.g., Samsung Galaxy S24"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                placeholder="Describe the product..."
              />
            </div>

            {/* Price & Compare Price */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (UGX) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Compare Price (UGX)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.compare_price}
                  onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category & Stock */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                placeholder="e.g., SAMS24-BLK-128"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
              />
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-200"
              />
              <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                Mark as Featured Product
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : uploading ? 'Uploading Images...' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="px-8 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
