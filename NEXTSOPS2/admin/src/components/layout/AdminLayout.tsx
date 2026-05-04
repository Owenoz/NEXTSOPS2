'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Settings,
  BarChart3,
  Tag,
  MessageSquare,
  Bell,
  Menu,
  LogOut,
  Search,
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: Store, label: 'Vendors', href: '/vendors' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: ShoppingBag, label: 'Orders', href: '/orders' },
    { icon: Tag, label: 'Categories', href: '/categories' },
    { icon: DollarSign, label: 'Payments', href: '/payments' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: MessageSquare, label: 'Reviews', href: '/reviews' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Top Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-md backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-3">
              <div className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Next</span>
                <span className="bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent">Shops</span>
              </div>
              <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-lg shadow-sm">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, orders, products..."
                className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l-2 border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-lg">👤</span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-bold text-gray-800">Admin User</div>
                <div className="text-xs text-gray-500 font-medium">admin@nextshops.ug</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r shadow-lg lg:shadow-none transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        >
          <nav className="p-4 space-y-1 mt-16 lg:mt-0 h-full overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-200 text-gray-700 font-medium group"
              >
                <div className="p-1.5 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                  <item.icon className="w-5 h-5" />
                </div>
                <span>{item.label}</span>
              </Link>
            ))}
            <button 
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 text-red-600 transition-all duration-200 mt-4 font-medium group"
            >
              <div className="p-1.5 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                <LogOut className="w-5 h-5" />
              </div>
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
