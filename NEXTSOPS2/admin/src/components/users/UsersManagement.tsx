'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, Ban, CheckCircle, Mail, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/database.types'

export default function UsersManagement() {
  const [filter, setFilter] = useState('all')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    suspended: 0,
  })

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [filter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      const { count: buyers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'buyer')

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: newThisMonth } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      setStats({
        total: total || 0,
        active: buyers || 0,
        newThisMonth: newThisMonth || 0,
        suspended: 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
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
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor all platform users</p>
        </div>
        <button 
          type="button"
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Download className="w-5 h-5" />
          Export Users
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Total Users</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">Active Users</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="text-3xl font-bold text-blue-600">{stats.newThisMonth}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">New This Month</div>
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
              placeholder="Search users by name, email, or phone..."
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
              <option value="all">All Roles</option>
              <option value="buyer">Buyers</option>
              <option value="vendor">Vendors</option>
              <option value="admin">Admins</option>
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

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No users found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">User</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Contact</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Role</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Joined</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-gray-800">{user.full_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500 font-medium">ID: {user.id.slice(0, 8)}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'vendor' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600 font-medium">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" 
                            title="View Details"
                            aria-label="View user details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" 
                            title="Suspend"
                            aria-label="Suspend user"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t-2 border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-600 font-medium">Showing {users.length} users</div>
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
