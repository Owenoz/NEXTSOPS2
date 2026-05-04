'use client'

import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Settings, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: ShoppingBag, label: 'Orders', href: '/orders' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: DollarSign, label: 'Payments', href: '/payments' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="text-xl font-bold text-primary-600">
              Next<span className="text-secondary-600">Shops</span> Vendor
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">My Store</span>
            <button className="text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2 mt-16 lg:mt-0">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
