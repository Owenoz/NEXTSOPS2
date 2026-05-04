'use client'

import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    { label: 'Total Sales', value: 'UGX 12.5M', change: '+12.5%', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Orders', value: '234', change: '+8.2%', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Products', value: '89', change: '+3', icon: Package, color: 'bg-purple-100 text-purple-600' },
    { label: 'Conversion', value: '3.2%', change: '+0.5%', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', product: 'Samsung Galaxy A54', amount: 1200000, status: 'Pending' },
    { id: 'ORD-002', customer: 'Jane Smith', product: 'HP Laptop', amount: 2100000, status: 'Shipped' },
    { id: 'ORD-003', customer: 'Bob Wilson', product: 'Nike Shoes', amount: 280000, status: 'Delivered' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border-2">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border-2 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 font-semibold">Product</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.product}</td>
                  <td className="py-3 px-4">UGX {order.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
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
