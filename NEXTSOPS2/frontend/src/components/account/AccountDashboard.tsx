'use client'

import { useState } from 'react'
import { User, Package, MapPin, Heart, Settings, LogOut, Bell, CreditCard } from 'lucide-react'

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border-2 p-6">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
                  👤
                </div>
                <h3 className="font-bold text-lg">John Doe</h3>
                <p className="text-sm text-gray-600">john.doe@email.com</p>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'wishlist' && <WishlistTab />}
          </main>
        </div>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-3xl mb-2">🚚</div>
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-gray-600">In Transit</div>
        </div>
        <div className="bg-white rounded-xl border-2 p-6">
          <div className="text-3xl mb-2">❤️</div>
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-gray-600">Wishlist Items</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border-2 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-2 rounded-lg hover:border-primary-500">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                📦
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Order #NS-2026-00{i}</h3>
                <p className="text-sm text-gray-600">3 items • UGX 1,200,000</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Shipped
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrdersTab() {
  return (
    <div className="bg-white rounded-xl border-2 p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {/* Orders content */}
    </div>
  )
}

function AddressesTab() {
  return (
    <div className="bg-white rounded-xl border-2 p-6">
      <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>
      {/* Addresses content */}
    </div>
  )
}

function WishlistTab() {
  return (
    <div className="bg-white rounded-xl border-2 p-6">
      <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
      {/* Wishlist content */}
    </div>
  )
}
