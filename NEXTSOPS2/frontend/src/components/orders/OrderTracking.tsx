'use client'

import { Package, Truck, CheckCircle, MapPin, Phone, Mail } from 'lucide-react'

export default function OrderTracking({ orderId }: { orderId: string }) {
  const order = {
    id: orderId,
    orderNumber: 'NS-2026-001',
    status: 'shipped',
    date: '2026-05-01',
    estimatedDelivery: '2026-05-05',
    total: 1200000,
    items: [
      { id: 1, name: 'Samsung Galaxy A54', quantity: 1, price: 1200000, image: '📱' },
    ],
    address: {
      name: 'John Doe',
      phone: '+256 700 123 456',
      address: 'Plot 123, Kampala Road, Kampala, Uganda',
    },
    vendor: {
      name: 'Tech Electronics Store',
      phone: '+256 700 234 567',
    },
    trackingNumber: 'TRK-123456789',
  }

  const timeline = [
    { status: 'Order Placed', date: '2026-05-01 10:30 AM', completed: true },
    { status: 'Order Confirmed', date: '2026-05-01 11:00 AM', completed: true },
    { status: 'Processing', date: '2026-05-02 09:00 AM', completed: true },
    { status: 'Shipped', date: '2026-05-03 02:00 PM', completed: true, active: true },
    { status: 'Out for Delivery', date: 'Pending', completed: false },
    { status: 'Delivered', date: 'Pending', completed: false },
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-xl border-2 p-6">
              <h2 className="text-xl font-bold mb-6">Order Status</h2>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.completed
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        } ${item.active ? 'ring-4 ring-green-100' : ''}`}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-16 ${
                            item.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3
                        className={`font-semibold ${
                          item.active ? 'text-green-600' : item.completed ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {item.status}
                      </h3>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border-2 p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border-2 rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-lg font-bold text-primary-600 mt-1">
                        UGX {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-xl border-2 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                Delivery Address
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{order.address.name}</p>
                <p className="text-gray-600">{order.address.phone}</p>
                <p className="text-gray-600">{order.address.address}</p>
              </div>
            </div>

            {/* Tracking Number */}
            <div className="bg-primary-50 rounded-xl border-2 border-primary-200 p-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-600" />
                Tracking Number
              </h3>
              <p className="text-lg font-mono font-bold text-primary-600">
                {order.trackingNumber}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
              </p>
            </div>

            {/* Vendor Info */}
            <div className="bg-white rounded-xl border-2 p-6">
              <h3 className="font-bold mb-4">Seller Information</h3>
              <div className="space-y-3">
                <p className="font-semibold">{order.vendor.name}</p>
                <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                  <Phone className="w-4 h-4" />
                  {order.vendor.phone}
                </button>
                <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                  <Mail className="w-4 h-4" />
                  Contact Seller
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold">
                Download Invoice
              </button>
              <button className="w-full px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold">
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
