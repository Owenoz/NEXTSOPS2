# 🔒 Supabase RLS (Row Level Security) Fix

## Problem
Error: "new row violates row-level security policy for table 'products'"

This happens because Supabase has Row Level Security enabled but no policies are configured.

## Solution Options

### Option 1: Disable RLS (Quick Fix for Development)

**Steps:**
1. Go to Supabase Dashboard
2. Click on "Table Editor" in the left sidebar
3. Select the `products` table
4. Click the "..." menu (top right)
5. Click "Edit table"
6. **Uncheck "Enable Row Level Security (RLS)"**
7. Click "Save"

**Repeat for all tables:**
- `products` ✅
- `categories` ✅
- `vendors` ✅
- `orders` ✅
- `order_items` ✅
- `users` ✅

### Option 2: Create RLS Policies (Recommended for Production)

Run these SQL commands in Supabase SQL Editor:

```sql
-- ============================================
-- PRODUCTS TABLE POLICIES
-- ============================================

-- Allow authenticated users to read approved products
CREATE POLICY "Anyone can view approved products"
ON products FOR SELECT
USING (status = 'approved' OR auth.uid() IN (
  SELECT id FROM users WHERE role IN ('admin', 'vendor')
));

-- Allow admins to insert products
CREATE POLICY "Admins can insert products"
ON products FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Allow admins and product owners to update
CREATE POLICY "Admins and vendors can update their products"
ON products FOR UPDATE
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
);

-- Allow admins to delete
CREATE POLICY "Admins can delete products"
ON products FOR DELETE
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- ============================================
-- CATEGORIES TABLE POLICIES
-- ============================================

-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
ON categories FOR SELECT
USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories"
ON categories FOR ALL
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- ============================================
-- VENDORS TABLE POLICIES
-- ============================================

-- Anyone can view active vendors
CREATE POLICY "Anyone can view active vendors"
ON vendors FOR SELECT
USING (status = 'active' OR auth.uid() IN (
  SELECT id FROM users WHERE role = 'admin'
));

-- Admins can manage vendors
CREATE POLICY "Admins can manage vendors"
ON vendors FOR ALL
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Vendors can update their own info
CREATE POLICY "Vendors can update their info"
ON vendors FOR UPDATE
USING (user_id = auth.uid());

-- ============================================
-- ORDERS TABLE POLICIES
-- ============================================

-- Users can view their own orders
CREATE POLICY "Users can view their orders"
ON orders FOR SELECT
USING (
  user_id = auth.uid()
  OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Users can create orders
CREATE POLICY "Users can create orders"
ON orders FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admins and vendors can update orders
CREATE POLICY "Admins and vendors can update orders"
ON orders FOR UPDATE
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
);

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view their own data
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (
  id = auth.uid()
  OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Users can update their own data
CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
USING (id = auth.uid());

-- Anyone can insert (for registration)
CREATE POLICY "Anyone can register"
ON users FOR INSERT
WITH CHECK (true);
```

## Quick Fix (Recommended for Now)

**Just disable RLS for development:**

1. Go to Supabase Dashboard
2. SQL Editor (left sidebar)
3. Run this command:

```sql
-- Disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

4. Click "Run"
5. Done! ✅

## Verify the Fix

After disabling RLS or adding policies:

1. Go to http://localhost:3002/login
2. Login as admin
3. Products → Add Product
4. Fill form and submit
5. Should work without RLS error! ✅

## Important Notes

### For Development:
- **Disable RLS** - Quick and easy
- No security restrictions
- Perfect for testing

### For Production:
- **Enable RLS with policies** - Secure
- Proper access control
- Prevents unauthorized access

## Status Check

Run this in Supabase SQL Editor to check RLS status:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

If `rls_enabled` is `true`, RLS is ON.
If `rls_enabled` is `false`, RLS is OFF.

## Next Steps

1. **Now**: Disable RLS to get system working
2. **Later**: Enable RLS and add proper policies before production
3. **Test**: Create products, orders, etc.

Your system will work perfectly once RLS is disabled! 🚀
