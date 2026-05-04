# 🎉 Setup & Test Guide - Supabase Integration

## ✅ What's Been Implemented (50% Complete!)

### 1. Authentication System ✅
- **Login Page** with role selection (Buyer/Vendor/Admin)
- **Registration Page** with role selection
- **Auth Hook** for session management
- **Role-based Redirects** working

### 2. Admin Product Management ✅
- **Add Product Page** with image upload
- **Products List** with real Supabase data
- **Approve/Reject** functionality
- **Real-time stats** (total, pending, approved, rejected)
- **Category selection**
- **Image upload to Supabase Storage**

### 3. Shared Libraries ✅
- Supabase client setup
- TypeScript types
- Authentication hooks

---

## 🚀 Quick Setup (15 Minutes)

### Step 1: Create Storage Bucket in Supabase (5 min)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in sidebar
4. Click **New bucket**
5. Name: `products`
6. **Make it PUBLIC** ✅
7. Click Create

### Step 2: Create Test Admin User (3 min)

1. In Supabase Dashboard → **Authentication**
2. Click **Add user** → **Create new user**
3. Email: `admin@test.com`
4. Password: `admin123`
5. Click **Create user**

6. Go to **Table Editor** → **users** table
7. Find the user you just created
8. Click to edit
9. Set `role` = `admin`
10. Save

### Step 3: Install Dependencies (5 min)

```bash
# Frontend
cd frontend
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr

# Admin
cd ../admin
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr

# Vendor
cd ../vendor
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr

cd ..
```

### Step 4: Add Environment Variables (2 min)

Create `.env.local` in **frontend**, **admin**, and **vendor** folders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vydvmmalqldpjvrtadbd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZHZtbWFscWxkcGp2cnRhZGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NTI0NjQsImV4cCI6MjA5MzQyODQ2NH0.5YVJeUVT2Ufb57u_K6Uu_VESa3h_jPZIIQjMcO3uICs
```

---

## 🧪 Testing Guide

### Test 1: Registration (2 min)

1. Start frontend: `cd frontend && npm run dev`
2. Go to http://localhost:3000/register
3. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Select role: **Buyer**
4. Click **Create Account**
5. Should see success message

### Test 2: Login as Admin (2 min)

1. Go to http://localhost:3000/login
2. Email: `admin@test.com`
3. Password: `admin123`
4. Select role: **Admin**
5. Click **Sign In**
6. Should redirect to http://localhost:3002 (Admin Portal)

### Test 3: Add Product (5 min)

1. In Admin Portal (http://localhost:3002)
2. Click **Products** in sidebar
3. Click **Add Product** button
4. Fill form:
   - Name: Test Product
   - Description: This is a test
   - Price: 100000
   - Stock: 10
   - Select category
   - Upload image (optional)
5. Click **Create Product**
6. Should see success message
7. Product appears in list

### Test 4: Approve/Reject Products (2 min)

1. Go to Products page
2. Filter by **Pending**
3. Click ✅ to approve OR ❌ to reject
4. For reject, enter reason
5. Product status updates immediately
6. Stats update automatically

---

## 📊 What's Working Now

### ✅ Fully Functional:
- User registration with role selection
- Login with role-based redirects
- Admin can add products
- Admin can view all products
- Admin can approve/reject products
- Real-time stats from database
- Image upload to Supabase Storage
- Category selection
- Product filtering by status

### 🚧 Partially Working:
- Frontend (needs product display)
- Vendor dashboard (needs implementation)
- Admin dashboard (needs real data)

### ⏳ Not Yet Implemented:
- Frontend product listing
- Product detail pages
- Shopping cart
- Checkout
- Vendor product management
- Order management

---

## 🎯 Next Steps (Priority Order)

### Priority 1: Frontend Product Display (1 hour)
- Show products on homepage
- Product detail page
- Category pages
- Search functionality

### Priority 2: Complete Admin (30 min)
- Dashboard with real stats
- Users management with real data
- Orders monitoring with real data

### Priority 3: Vendor Dashboard (1 hour)
- Vendor product management
- Order management
- Analytics

---

## 🐛 Troubleshooting

### Issue: "Storage bucket not found"
**Solution:** Create `products` bucket in Supabase Storage (see Step 1)

### Issue: "Cannot upload images"
**Solution:** Make sure bucket is PUBLIC in Supabase Storage settings

### Issue: "User not found" on login
**Solution:** Create admin user in Supabase Auth (see Step 2)

### Issue: "Role mismatch" error
**Solution:** Update user role in `users` table to match login selection

### Issue: Dependencies not found
**Solution:** Run `npm install` in each folder (frontend, admin, vendor)

### Issue: Environment variables not working
**Solution:** 
1. Make sure `.env.local` exists in each app folder
2. Restart dev servers after adding env vars
3. Check file is named exactly `.env.local` (not `.env`)

---

## 📁 Files Created/Modified

### New Files:
- `shared/lib/supabase.ts` - Supabase client
- `shared/lib/supabaseAdmin.ts` - Admin client
- `shared/types/database.types.ts` - TypeScript types
- `shared/hooks/useAuth.ts` - Auth hook
- `frontend/src/app/login/page.tsx` - Login page
- `frontend/src/app/register/page.tsx` - Registration page
- `admin/src/app/products/new/page.tsx` - Add product page

### Modified Files:
- `admin/src/components/products/ProductsModeration.tsx` - Now uses real data

---

## 🎉 Success Criteria

You'll know everything is working when:

- ✅ You can register a new user
- ✅ You can login as admin
- ✅ You get redirected to admin portal (port 3002)
- ✅ You can see products list (even if empty)
- ✅ You can add a new product
- ✅ Product appears in the list
- ✅ You can approve/reject products
- ✅ Stats update automatically
- ✅ Images upload successfully

---

## 💡 Pro Tips

1. **Use Supabase Dashboard** to view data in real-time
2. **Check browser console** for errors (F12)
3. **Use Table Editor** in Supabase to manually edit data
4. **Test with multiple users** to see role-based access
5. **Upload small images** (< 1MB) for faster testing

---

## 📞 Need Help?

### Common Commands:
```bash
# Start frontend
cd frontend && npm run dev

# Start admin
cd admin && npm run dev

# Start vendor
cd vendor && npm run dev

# View Supabase logs
# Go to Supabase Dashboard → Logs
```

### Check Status:
- Supabase Dashboard: https://supabase.com/dashboard
- Frontend: http://localhost:3000
- Admin: http://localhost:3002
- Vendor: http://localhost:3001

---

**Current Status**: 50% Complete ✅
**Time to Full Implementation**: 2-3 hours remaining
**Priority**: Complete frontend product display next

**You're halfway there! 🎉**
