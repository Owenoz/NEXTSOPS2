'use client'

import { useState } from 'react'
import { Store, User, Bell, Lock, CreditCard, MapPin, Save } from 'lucide-react'

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('business')

  const tabs = [
    { id: 'business', label: 'Business Info', icon: Store },
    { id: 'account', label: 'Account', icon: User },
    { id: 'payment', label: 'Payment Details', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border-2 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'business' && <BusinessInfoTab />}
          {activeTab === 'account' && <AccountTab />}
          {activeTab === 'payment' && <PaymentTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  )
}

function BusinessInfoTab() {
  return (
    <div className="bg-white rounded-xl border-2 p-6">
      <h2 className="text-xl font-bold mb-6">Business Information</h2>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
          <input
            type="text"
            defaultValue="Tech Electronics Store"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
          <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none">
            <option>Individual</option>
            <option>Company</option>
            <option>Partnership</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
          <textarea
            rows={4}
            defaultValue="We sell quality electronics and gadgets at affordable prices."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+256 700 123 456"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue="tech@store.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
          <input
            type="text"
            defaultValue="Plot 123, Kampala Road, Kampala"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </form>
    </div>
  )
}

function AccountTab() {
  return (
    <div className="bg-white rounded-xl border-2 p-6">
      <h2 className="text-xl font-bold mb-6">Account Settings</h2>
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              defaultValue="John"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            defaultValue="john@techstore.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            defaultValue="+256 700 123 456"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </form>
    </div>
  )
}

function PaymentTab() {
  return (
    <div className="bg-white rounded-xl border-2 p-6">
      <h2 className="text-xl font-bold mb-6">Payment Details</h2>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
          <input
            type="text"
            defaultValue="Stanbic Bank Uganda"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
          <input
            type="text"
            defaultValue="1234567890"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
          <input
            type="text"
            defaultValue="Tech Electronics Store"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Mobile Money (Alternative)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none">
                <option>MTN Mobile Money</option>
                <option>Airtel Money</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="+256 700 123 456"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </form>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="bg-white rounded-xl border-2 p-6">
      <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h3 className="font-semibold">New Orders</h3>
            <p className="text-sm text-gray-600">Get notified when you receive new orders</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
        </div>

        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h3 className="font-semibold">Low Stock Alerts</h3>
            <p className="text-sm text-gray-600">Alert when product stock is running low</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
        </div>

        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h3 className="font-semibold">Customer Reviews</h3>
            <p className="text-sm text-gray-600">Notify when customers leave reviews</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
        </div>

        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h3 className="font-semibold">Payment Received</h3>
            <p className="text-sm text-gray-600">Notify when payments are processed</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="font-semibold">Marketing Updates</h3>
            <p className="text-sm text-gray-600">Receive tips and platform updates</p>
          </div>
          <input type="checkbox" className="w-5 h-5 rounded" />
        </div>

        <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Preferences
        </button>
      </div>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="bg-white rounded-xl border-2 p-6">
      <h2 className="text-xl font-bold mb-6">Security Settings</h2>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2"
        >
          <Lock className="w-5 h-5" />
          Update Password
        </button>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add an extra layer of security to your account
          </p>
          <button className="px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold">
            Enable 2FA
          </button>
        </div>
      </form>
    </div>
  )
}
