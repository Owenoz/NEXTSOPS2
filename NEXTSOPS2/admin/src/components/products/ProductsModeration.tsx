'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, CheckCircle, XCircle, Eye, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/database.types'
import Link from 'next/link'

export default function ProductsModeration() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Product>>({})

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [filter])

  useEffect(() => {
    filterProducts()
  }, [searchQuery, filter, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          vendor:vendors(business_name),
          category:categories(name)
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor?.business_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      const { count: pending } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const { count: approved } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')

      const { count: rejected } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected')

      setStats({
        total: total || 0,
        pending: pending || 0,
        approved: approved || 0,
        rejected: rejected || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'approved', rejection_reason: null })
        .eq('id', id)

      if (error) throw error

      alert('Product approved successfully!')
      fetchProducts()
      fetchStats()
    } catch (error: any) {
      alert('Error approving product: ' + error.message)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', id)

      if (error) throw error

      alert('Product rejected successfully!')
      fetchProducts()
      fetchStats()
    } catch (error: any) {
      alert('Error rejecting product: ' + error.message)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditData(product)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editData.name,
          description: editData.description,
          price: editData.price,
          compare_price: editData.compare_price,
          stock: editData.stock,
          sku: editData.sku,
        })
        .eq('id', editingId)

      if (error) throw error

      alert('Product updated successfully!')
      setEditingId(null)
      fetchProducts()
    } catch (error: any) {
      alert('Error updating product: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Product deleted successfully!')
      fetchProducts()
      fetchStats()
    } catch (error: any) {
      alert('Error deleting product: ' + error.message)
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Products Management
          </h1>
          <p className="text-gray-600 mt-2">Manage all products in stock</p>
        </div>
        <Link
          href="/products/new"
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Total Products</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Pending Review</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Approved</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Rejected</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter by status"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none font-medium transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Product</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Vendor</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Price</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Stock</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-xl border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-200">
                              📦
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-800">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.sku || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {product.vendor?.business_name || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">UGX {product.price.toLocaleString()}</div>
                        {product.compare_price && (
                          <div className="text-xs text-gray-500 line-through">UGX {product.compare_price.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {product.stock}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            product.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : product.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="Edit"
                            aria-label="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {product.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(product.id)}
                                className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                                title="Approve"
                                aria-label="Approve product"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(product.id)}
                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                title="Reject"
                                aria-label="Reject product"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t-2 border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-600 font-medium">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-gray-100">
              <h2 className="text-2xl font-bold">Edit Product</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price (UGX)</label>
                  <input
                    type="number"
                    value={editData.price || ''}
                    onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Compare Price (UGX)</label>
                  <input
                    type="number"
                    value={editData.compare_price || ''}
                    onChange={(e) => setEditData({ ...editData, compare_price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={editData.stock || ''}
                    onChange={(e) => setEditData({ ...editData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={editData.sku || ''}
                    onChange={(e) => setEditData({ ...editData, sku: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t-2 border-gray-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-6 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
