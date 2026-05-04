'use client'

import { useState } from 'react'
import { Search, Filter, Package, Truck, CheckCircle, Phone, MapPin, Upload } from 'lucide-react'

export default function OrdersManagement() {
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null)

  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customer: 'John Doe',
      phone: '+256 700 123 456',
      address: 'Plot 123, Kampala Road, Kampala',
      products: [{ name: 'Samsung Galaxy A54', quantity: 1, price: 1200000 }],
      total: 1200000,
      status: 'pending',
      payment: 'MTN MoMo',
      paymentStatus: 'paid',
      date: '2026-05-04 10:30 AM',
      deadline: '2026-05-06',
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customer: 'Jane Smith',
      phone: '+256 700 234 567',
      address: 'Plot 456, Entebbe Road, Kampala',
      products: [{ name: 'HP Laptop 15s', quantity: 1, price: 2100000 }],
      total: 2100000,
      status: 'processing',
      payment: 'COD',
      paymentStatus: 'pending',
      date: '2026-05-03 02:15 PM',
      deadline: '2026-05-05',
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      customer: 'Bob Wilson',
      phone: '+256 700 345 678',
      address: 'Plot 789, Jinja Road, Kampala',
      products: [{ name: 'Nike Air Max', quantity: 2, price: 280000 }],
      total: 560000,
      status: 'shipped',
      payment: 'Card',
      paymentStatus: 'paid',
      date: '2026-05-02 09:00 AM',
      deadline: '2026-05-04',
      trackingNumber: 'TRK-123456',
    },
    {
      id: 4,
      orderNumber: 'ORD-004',
      customer: 'Alice Brown',
      phone: '+256 700 456 789',
      address: 'Plot 321, Masaka Road, Kampala',
      products: [{ name: 'Smart Watch Pro', quantity: 1, price: 150000 }],
      total: 150000,
      status: 'delivered',
      payment: 'Airtel Money',
      paymentStatus: 'paid',
      date: '2026-05-01 08:45 AM',
      deadline: '2026-05-03',
      deliveredDate: '2026-05-03 02:30 PM',
    },
  ]

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const handleConfirmOrder = (id: number) => {
    console.log('Confirming order:', id)
    // TODO: Implement confirm logic
  }

  const handleShipOrder = (id: number) => {
    setSelectedOrder(id)
    // TODO: Show shipping modal
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-gray-600 mt-1">Manage and fulfill customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold">234</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold text-yellow-600">12</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold text-blue-600">45</div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold text-purple-600">34</div>
          <div className="text-sm text-gray-600">Shipped</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-2xl font-bold text-green-600">143</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border-2 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <button className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-primary-500 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              More
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
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
                </div>

                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer</h4>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {order.phone}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Delivery Address</h4>
                    <p className="text-sm text-gray-600 flex items-start gap-1">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {order.address}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Products</h4>
                  {order.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {product.name} × {product.quantity}
                      </span>
                      <span className="font-medium">UGX {product.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Payment Info */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Payment: </span>
                      <span className="font-medium">{order.payment}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-xl font-bold text-primary-600">
                      UGX {order.total.toLocaleString()}
                    </div>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Tracking: </span>
                    <span className="font-mono font-bold text-purple-600">{order.trackingNumber}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="lg:w-48 flex flex-col gap-3">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleConfirmOrder(order.id)}
                    className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirm Order
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => handleShipOrder(order.id)}
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Truck className="w-5 h-5" />
                    Mark as Shipped
                  </button>
                )}
                <button className="px-4 py-3 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  Print Label
                </button>
                <button className="px-4 py-3 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold">
                  Contact Customer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button className="px-4 py-2 border-2 rounded-lg hover:border-primary-500">Previous</button>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">1</button>
        <button className="px-4 py-2 border-2 rounded-lg hover:border-primary-500">2</button>
        <button className="px-4 py-2 border-2 rounded-lg hover:border-primary-500">3</button>
        <button className="px-4 py-2 border-2 rounded-lg hover:border-primary-500">Next</button>
      </div>
    </div>
  )
}
