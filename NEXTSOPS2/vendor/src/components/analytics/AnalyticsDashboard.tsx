'use client'

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package, Users, Eye, Star } from 'lucide-react'

export default function AnalyticsDashboard() {
  const stats = [
    {
      label: 'Total Revenue',
      value: 'UGX 12.5M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Orders',
      value: '234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Products Sold',
      value: '456',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Avg Order Value',
      value: 'UGX 53,419',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  const topProducts = [
    { name: 'Samsung Galaxy A54', sold: 45, revenue: 54000000, views: 1234, rating: 4.5 },
    { name: 'HP Laptop 15s', sold: 23, revenue: 48300000, views: 890, rating: 4.3 },
    { name: 'Nike Air Max', sold: 67, revenue: 18760000, views: 2345, rating: 4.7 },
    { name: 'Smart Watch Pro', sold: 34, revenue: 5100000, views: 567, rating: 4.2 },
  ]

  const recentActivity = [
    { type: 'sale', message: 'New order #ORD-234', time: '5 minutes ago' },
    { type: 'review', message: 'New 5-star review on Samsung Galaxy A54', time: '1 hour ago' },
    { type: 'stock', message: 'Low stock alert: Nike Air Max (5 left)', time: '2 hours ago' },
    { type: 'sale', message: 'New order #ORD-233', time: '3 hours ago' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">Track your store performance and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl border-2 p-6">
          <h2 className="text-xl font-bold mb-6">Revenue Overview</h2>
          <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600">Revenue chart will be displayed here</p>
              <p className="text-sm text-gray-500 mt-2">(Integration with charting library needed)</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border-2 p-6">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'sale'
                      ? 'bg-green-100 text-green-600'
                      : activity.type === 'review'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {activity.type === 'sale' ? '💰' : activity.type === 'review' ? '⭐' : '📦'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border-2 p-6">
        <h2 className="text-xl font-bold mb-6">Top Performing Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Product</th>
                <th className="text-left py-3 px-4 font-semibold">Units Sold</th>
                <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold">Views</th>
                <th className="text-left py-3 px-4 font-semibold">Rating</th>
                <th className="text-left py-3 px-4 font-semibold">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">{product.sold}</td>
                  <td className="py-3 px-4 font-semibold">UGX {product.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      {product.views}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {product.rating}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">
                      {((product.sold / product.views) * 100).toFixed(1)}%
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
