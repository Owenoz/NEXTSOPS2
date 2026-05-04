export type UserRole = 'buyer' | 'vendor' | 'admin'
export type ProductStatus = 'pending' | 'approved' | 'rejected'
export type VendorStatus = 'pending' | 'active' | 'suspended'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  user_id: string
  business_name: string
  business_email?: string
  business_phone?: string
  description?: string
  logo_url?: string
  status: VendorStatus
  rating: number
  total_sales: number
  commission_rate: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  created_at: string
}

export interface Product {
  id: string
  vendor_id: string
  name: string
  description?: string
  price: number
  compare_price?: number
  category_id?: string
  images: string[]
  stock: number
  sku?: string
  status: ProductStatus
  rejection_reason?: string
  is_featured: boolean
  created_at: string
  updated_at: string
  vendor?: Vendor
  category?: Category
}

export interface Order {
  id: string
  user_id: string
  vendor_id: string
  order_number: string
  status: OrderStatus
  total_amount: number
  payment_method: string
  payment_status: PaymentStatus
  shipping_address: any
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  subtotal: number
  product?: Product
}
