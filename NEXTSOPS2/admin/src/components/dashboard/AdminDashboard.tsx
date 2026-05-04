'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Order, Product, Vendor } from '@/types/database.types'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    vendors: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [ordersCount, usersCount, vendorsCount, ordersData, productsData, vendorsData] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount'),
        supabase.from('products').select('*, vendor:vendors(business_name)').eq('status', 'pending').order('created_at', { ascending: false }).limit(3),
        supabase.from('vendors').select('*, user:users(email)').eq('status', 'pending').order('created_at', { ascending: false }).limit(3),
      ])

      // Calculate total revenue
      const totalRevenue = ordersData.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      setStats({
        revenue: totalRevenue,
        orders: ordersCount.count || 0,
        users: usersCount.count || 0,
        vendors: vendorsCount.count || 0,
      })

      // Fetch recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          user:users(full_name, email),
          vendor:vendors(business_name)
        `)
        .order('created_at', { ascending: false })
        .limit(4)

      setRecentOrders(orders || [])

      // Combine pending approvals
      const approvals = [
        ...(vendorsData.data || []).map(v => ({
          type: 'Vendor',
          name: v.business_name,
          date: new Date(v.created_at).toLocaleDateString(),
          id: v.id,
        })),
        ...(productsData.data || []).map(p => ({
          type: 'Product',
          name: p.name,
          date: new Date(p.created_at).toLocaleDateString(),
          id: p.id,
        })),
      ].slice(0, 3)

      setPendingApprovals(approvals)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsDisplay = [
    {
      label: 'Total Revenue',
      value: `UGX ${(stats.revenue / 1000000).toFixed(1)}M`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Orders',
      value: stats.orders.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Users',
      value: stats.users.toLocaleString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Active Vendors',
      value: stats.vendors.toLocaleString(),
      change: '+5.1%',
      trend: 'up',
      icon: Store,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
      iconColor: 'text-orange-600',
    },
  ]

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
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <button 
          type="button"
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((stat) => (
          <div 
            key={stat.label} 
            className={`${stat.bgColor} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-white p-3 rounded-xl shadow-sm ${stat.iconColor}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1 text-gray-800">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <a href="/orders" className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All →
            </a>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-colors">
                      <td className="py-4 px-4 font-semibold text-gray-800">{order.order_number}</td>
                      <td className="py-4 px-4 text-gray-700">{order.user?.full_name || order.user?.email || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-700">{order.vendor?.business_name || 'N/A'}</td>
                      <td className="py-4 px-4 font-semibold text-gray-800">UGX {order.total_amount.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'processing'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Pending Approvals</h2>
          </div>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending approvals</div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((item, index) => (
                <div key={index} className="p-4 border-2 border-gray-100 rounded-xl hover:border-primary-400 hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2.5 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-semibold rounded-lg">
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{item.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-3">{item.name}</h3>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                    >
                      Approve
                    </button>
                    <button 
                      type="button"
                      className="flex-1 px-3 py-2 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a 
          href="/products"
          className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-primary-400 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left group"
        >
          <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <Package className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">Manage Products</h3>
          <p className="text-sm text-gray-600">Review and approve products</p>
        </a>
        <a 
          href="/vendors"
          className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-secondary-400 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left group"
        >
          <div className="p-3 bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <Store className="w-7 h-7 text-secondary-600" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">Manage Vendors</h3>
          <p className="text-sm text-gray-600">Approve vendor applications</p>
        </a>
        <a 
          href="/orders"
          className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left group"
        >
          <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-7 h-7 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">View Orders</h3>
          <p className="text-sm text-gray-600">Monitor all platform orders</p>
        </a>
        <button 
          type="button"
          className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-green-400 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left group"
        >
          <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <DollarSign className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">Financial Reports</h3>
          <p className="text-sm text-gray-600">View revenue and analytics</p>
        </button>
      </div>
    </div>
  )
}
