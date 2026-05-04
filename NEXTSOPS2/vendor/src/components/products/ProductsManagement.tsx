'use client'

import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Upload } from 'lucide-react'

export default function ProductsManagement() {
  const products = [
    {
      id: 1,
      name: 'Samsung Galaxy A54 5G',
      category: 'Phones',
      price: 1200000,
      stock: 45,
      sold: 123,
      status: 'active',
      image: '📱',
    },
    {
      id: 2,
      name: 'HP Laptop 15s',
      category: 'Electronics',
      price: 2100000,
      stock: 12,
      sold: 45,
      status: 'active',
      image: '💻',
    },
    {
      id: 3,
      name: 'Nike Air Max Shoes',
      category: 'Fashion',
      price: 280000,
      stock: 0,
      sold: 89,
      status: 'out_of_stock',
      image: '👟',
    },
    {
      id: 4,
      name: 'Smart Watch Pro',
      category: 'Electronics',
      price: 150000,
      stock: 28,
      sold: 67,
      status: 'pending',
      image: '⌚',
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload
          </button>
          <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold">89</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold text-green-600">76</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold text-red-600">8</div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold text-yellow-600">5</div>
          <div className="text-sm text-gray-600">Pending Approval</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border-2 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
          <select className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none">
            <option>All Categories</option>
            <option>Phones</option>
            <option>Electronics</option>
            <option>Fashion</option>
          </select>
          <select className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Out of Stock</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Product</th>
                <th className="text-left py-4 px-6 font-semibold">Category</th>
                <th className="text-left py-4 px-6 font-semibold">Price</th>
                <th className="text-left py-4 px-6 font-semibold">Stock</th>
                <th className="text-left py-4 px-6 font-semibold">Sold</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div className="font-semibold">{product.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6">
                    <div className="font-semibold">UGX {product.price.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div
                      className={`font-semibold ${
                        product.stock === 0 ? 'text-red-600' : product.stock < 20 ? 'text-yellow-600' : ''
                      }`}
                    >
                      {product.stock}
                    </div>
                  </td>
                  <td className="py-4 px-6">{product.sold}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.status === 'out_of_stock' ? 'Out of Stock' : product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
