'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Order } from '@/types/database.types'

export default function OrdersMonitoring() {
  const [filter, setFilter] = useState('all')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  })

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          user:users(full_name, email),
          vendor:vendors(business_name)
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      const { count: pending } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const { count: processing } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'processing')

      const { count: shipped } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shipped')

      const { count: delivered } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered')

      setStats({
        total: total || 0,
        pending: pending || 0,
        processing: processing || 0,
        shipped: shipped || 0,
        delivered: delivered || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Orders Monitoring
          </h1>
          <p className="text-gray-600 mt-2">Monitor all platform orders in real-time</p>
        </div>
        <button 
          type="button"
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Download className="w-5 h-5" />
          Export Orders
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Total Orders</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-blue-600">{stats.processing}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Processing</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-purple-600">{stats.shipped}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Shipped</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-green-600">{stats.delivered}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Delivered</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or vendor..."
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
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <select 
              aria-label="Filter by payment method"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none font-medium transition-all"
            >
              <option>All Payment Methods</option>
              <option>COD</option>
              <option>MTN MoMo</option>
              <option>Airtel Money</option>
              <option>Card</option>
            </select>
            <button 
              type="button"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 flex items-center gap-2 font-medium transition-all"
            >
              <Filter className="w-5 h-5" />
              More
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No orders found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Order ID</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Customer</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Vendor</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Amount</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Payment</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Date</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">{order.order_number}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {order.user?.full_name || order.user?.email || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {order.vendor?.business_name || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">UGX {order.total_amount.toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600 font-medium">
                          {new Date(order.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'shipped'
                              ? 'bg-purple-100 text-purple-700'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button 
                          type="button"
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" 
                          title="View Details"
                          aria-label="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t-2 border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-600 font-medium">Showing {orders.length} orders</div>
              <div className="flex gap-2">
                <button 
                  type="button"
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 font-medium transition-all"
                >
                  Previous
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-md font-medium"
                >
                  1
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 font-medium transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
