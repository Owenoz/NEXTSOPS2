'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Vendor } from '@/types/database.types'

export default function OfficialStores() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('status', 'active')
        .limit(4)

      if (error) throw error
      setVendors(data || [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">🏪 Official Stores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl h-32 animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  if (vendors.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">🏪 Official Stores</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vendors.map((vendor) => (
          <Link
            key={vendor.id}
            href={`/vendor/${vendor.id}`}
            className="bg-gray-50 p-6 rounded-xl border-2 border-transparent hover:border-primary-500 hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-3">🏪</div>
            <h3 className="font-bold text-lg mb-1 truncate">{vendor.business_name}</h3>
            <p className="text-sm text-gray-600">Rating: {vendor.rating.toFixed(1)}★</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
