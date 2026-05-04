'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, Ban, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Vendor } from '@/types/database.types'

export default function VendorsManagement() {
  const [filter, setFilter] = useState('all')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
  })

  useEffect(() => {
    fetchVendors()
    fetchStats()
  }, [filter])

  const fetchVendors = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('vendors')
        .select(`
          *,
          user:users(email, phone)
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setVendors(data || [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true })

      const { count: active } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const { count: pending } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const { count: suspended } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'suspended')

      setStats({
        total: total || 0,
        active: active || 0,
        pending: pending || 0,
        suspended: suspended || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status: 'active' })
        .eq('id', id)

      if (error) throw error

      alert('Vendor approved successfully!')
      fetchVendors()
      fetchStats()
    } catch (error: any) {
      alert('Error approving vendor: ' + error.message)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status: 'suspended' })
        .eq('id', id)

      if (error) throw error

      alert('Vendor rejected successfully!')
      fetchVendors()
      fetchStats()
    } catch (error: any) {
      alert('Error rejecting vendor: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Vendors Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor all platform vendors</p>
        </div>
        <button 
          type="button"
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Total Vendors</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Active</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Pending Approval</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-red-600">{stats.suspended}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Suspended</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name, email, or phone..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter by status"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none font-medium transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button 
              type="button"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 flex items-center gap-2 font-medium transition-all"
            >
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {vendors.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No vendors found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Vendor</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Contact</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Total Sales</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Rating</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-gray-800">{vendor.business_name}</div>
                          <div className="text-sm text-gray-500 font-medium">
                            Joined {new Date(vendor.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="text-gray-700 font-medium">
                            {vendor.business_email || vendor.user?.email || 'N/A'}
                          </div>
                          <div className="text-gray-500">
                            {vendor.business_phone || vendor.user?.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">
                          UGX {vendor.total_sales.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-800">{vendor.rating.toFixed(1)}</span>
                          <span className="text-yellow-400 text-lg">★</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            vendor.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : vendor.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" 
                            title="View Details"
                            aria-label="View vendor details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {vendor.status === 'pending' && (
                            <>
                              <button 
                                type="button"
                                onClick={() => handleApprove(vendor.id)}
                                className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors" 
                                title="Approve"
                                aria-label="Approve vendor"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleReject(vendor.id)}
                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" 
                                title="Reject"
                                aria-label="Reject vendor"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {vendor.status === 'active' && (
                            <button 
                              type="button"
                              onClick={() => handleReject(vendor.id)}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" 
                              title="Suspend"
                              aria-label="Suspend vendor"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t-2 border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-600 font-medium">Showing {vendors.length} vendors</div>
              <div className="flex gap-2">
                <button 
                  type="button"
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 font-medium transition-all"
                >
                  Previous
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-md font-medium"
                >
                  1
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 font-medium transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
