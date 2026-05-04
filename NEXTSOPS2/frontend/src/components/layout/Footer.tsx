import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Next Shops</h3>
            <p className="text-sm mb-4">
              Next Level Shopping in Uganda. Your trusted marketplace for phones, fashion, electronics, and more.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-400"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-400"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-400"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-primary-400">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400">Contact Us</Link></li>
              <li><Link href="/returns" className="hover:text-primary-400">Returns & Refunds</Link></li>
              <li><Link href="/shipping" className="hover:text-primary-400">Shipping Info</Link></li>
              <li><Link href="/track" className="hover:text-primary-400">Track Order</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-white font-semibold mb-4">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary-400">About Next Shops</Link></li>
              <li><Link href="/careers" className="hover:text-primary-400">Careers</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-400">Privacy Policy</Link></li>
              <li><Link href="/sell" className="hover:text-primary-400">Sell on Next Shops</Link></li>
            </ul>
          </div>

          {/* Payment & Delivery */}
          <div>
            <h4 className="text-white font-semibold mb-4">Payment Methods</h4>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-900">MTN MoMo</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-900">Airtel Money</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-900">Cash on Delivery</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-900">Visa/Mastercard</div>
              </div>
              <p className="text-xs mt-4">
                📱 Download our app (Coming Soon)<br />
                📞 Call: 0800 123 456<br />
                📧 Email: support@nextshops.ug
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 Next Shops Uganda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
