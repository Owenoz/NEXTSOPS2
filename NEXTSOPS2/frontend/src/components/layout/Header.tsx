'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, MapPin } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Deliver to: Kampala</span>
          </div>
          <div className="hidden md:flex gap-4">
            <Link href="/help" className="hover:underline">Help</Link>
            <Link href="/sell" className="hover:underline">Sell on Next Shops</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-bold text-primary-600">
              Next<span className="text-secondary-600">Shops</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/account" className="hidden md:flex items-center gap-2 hover:text-primary-600">
              <User className="w-6 h-6" />
              <span className="text-sm">Account</span>
            </Link>
            <Link href="/cart" className="relative hover:text-primary-600">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <button 
              type="button"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </form>
      </div>

      {/* Categories Nav */}
      <nav className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <ul className="flex gap-6 overflow-x-auto py-3 text-sm">
            <li><Link href="/category/phones" className="whitespace-nowrap hover:text-primary-600 font-medium">Phones</Link></li>
            <li><Link href="/category/electronics" className="whitespace-nowrap hover:text-primary-600 font-medium">Electronics</Link></li>
            <li><Link href="/category/fashion" className="whitespace-nowrap hover:text-primary-600 font-medium">Fashion</Link></li>
            <li><Link href="/category/home" className="whitespace-nowrap hover:text-primary-600 font-medium">Home & Kitchen</Link></li>
            <li><Link href="/category/beauty" className="whitespace-nowrap hover:text-primary-600 font-medium">Beauty</Link></li>
            <li><Link href="/category/supermarket" className="whitespace-nowrap hover:text-primary-600 font-medium">Supermarket</Link></li>
            <li><Link href="/search" className="whitespace-nowrap hover:text-primary-600 font-medium text-accent-600">All Products</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
