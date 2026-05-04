Failed to run sql query: ERROR:  23505: duplicate key value violates unique constraint "users_pkey"

DETAIL:  Key (id)=(722be6e9-4e8c-4732-8b88-bd615e8b2ebe) already exists.

CONTEXT:  SQL statement "INSERT INTO public.users (id, email, full_name, phone, role)

  VALUES (

    new_user_id,

    'buyer@test.com',

    'John Doe',

    '+256700123456',

    'buyer'

  )"

PL/pgSQL function inline_code_block line 24 at SQL statement# 👥 Complete User Login Guide

## 🛍️ Login as Buyer (Customer)

### Step 1: Register as Buyer
1. Go to **http://localhost:3003/register**
2. Fill in your details:
   - Full Name: Your Name
   - Email: buyer@test.com
   - Phone: +256 700 123 456
   - Password: buyer123
   - Confirm Password: buyer123
3. Select **"Buyer"** role (🛍️)
4. Click **"Create Account"**
5. Wait for success message

### Step 2: Login as Buyer
1. Go to **http://localhost:3003/login**
2. Enter credentials:
   - Email: buyer@test.com
   - Password: buyer123
3. Select **"Buyer"** role (🛍️)
4. Click **"Sign In"**
5. ✅ You'll be redirected to the homepage
6. You can now browse and shop!

### What Buyers Can Do:
- ✅ Browse products
- ✅ View product details
- ✅ Add to cart
- ✅ Place orders
- ✅ Track orders
- ✅ Manage wishlist
- ✅ Update profile

---

## 🏪 Login as Vendor (Seller)

### Step 1: Register as Vendor
1. Go to **http://localhost:3003/register**
2. Fill in your details:
   - Full Name: Store Owner
   - Email: vendor@test.com
   - Phone: +256 700 234 567
   - Password: vendor123
   - Confirm Password: vendor123
3. Select **"Vendor"** role (🏪)
4. Click **"Create Account"**
5. Wait for success message

### Step 2: Login as Vendor (Two-Step Process)
1. Go to **http://localhost:3003/login**
2. Enter credentials:
   - Email: vendor@test.com
   - Password: vendor123
3. Select **"Vendor"** role (🏪)
4. Click **"Sign In"**
5. You'll be redirected to **http://localhost:3001/login**
6. **Login again** with same credentials
7. ✅ Access vendor dashboard

### What Vendors Can Do:
- ✅ Add products
- ✅ Manage inventory
- ✅ View orders
- ✅ Update product prices
- ✅ View analytics
- ✅ Manage store profile

---

## 👤 Login as Admin

### Step 1: Create Admin User in Supabase
Since admin is a special role, create it manually:

1. Go to **Supabase Dashboard**
2. **Authentication** → **Add User**
   - Email: admin@test.com
   - Password: admin123
   - Click "Create User"

3. **Table Editor** → **users** table → **Insert row**
   - id: [Copy from auth.users table]
   - email: admin@test.com
   - full_name: Admin User
   - role: admin
   - Click "Save"

### Step 2: Login as Admin (Two-Step Process)
1. Go to **http://localhost:3003/login**
2. Enter credentials:
   - Email: admin@test.com
   - Password: admin123
3. Select **"Admin"** role (👤)
4. Click **"Sign In"**
5. You'll be redirected to **http://localhost:3002/login**
6. **Login again** with same credentials
7. ✅ Access admin dashboard

### What Admins Can Do:
- ✅ Manage all products
- ✅ Approve/reject products
- ✅ Manage vendors
- ✅ Manage users
- ✅ Monitor orders
- ✅ View analytics
- ✅ Full system control

---

## 📊 Quick Reference Table

| Role | Register URL | Login URL | Final Destination | Port |
|------|-------------|-----------|-------------------|------|
| **Buyer** | http://localhost:3003/register | http://localhost:3003/login | Homepage (same port) | 3003 |
| **Vendor** | http://localhost:3003/register | http://localhost:3003/login → http://localhost:3001/login | Vendor Dashboard | 3001 |
| **Admin** | Manual (Supabase) | http://localhost:3003/login → http://localhost:3002/login | Admin Dashboard | 3002 |

---

## 🎯 Testing All Roles

### Create Test Accounts:

```bash
# Buyer Account
Email: buyer@test.com
Password: buyer123
Role: Buyer

# Vendor Account
Email: vendor@test.com
Password: vendor123
Role: Vendor

# Admin Account (Create in Supabase)
Email: admin@test.com
Password: admin123
Role: Admin
```

### Test Each Role:

#### Test 1: Buyer Flow
```
1. Register at /register as Buyer
2. Login at /login as Buyer
3. Browse products on homepage
4. Add product to cart
5. View cart
✅ Buyer experience working!
```

#### Test 2: Vendor Flow
```
1. Register at /register as Vendor
2. Login at /login as Vendor
3. Redirected to vendor login
4. Login again
5. Access vendor dashboard
6. Add a product
✅ Vendor experience working!
```

#### Test 3: Admin Flow
```
1. Create admin in Supabase
2. Login at /login as Admin
3. Redirected to admin login
4. Login again
5. Access admin dashboard
6. Approve products
7. Manage users
✅ Admin experience working!
```

---

## 🔑 Why Different Login Flows?

### Buyer (Simple):
- Stays on same port (3003)
- One login only
- Direct access

### Vendor & Admin (Two-Step):
- Different ports (3001, 3002)
- Need to login twice (cross-port limitation)
- Secure access

---

## 🐛 Troubleshooting

### Issue: "This account is registered as X, not Y"
**Solution**: Select the correct role that matches your account

### Issue: Can't login as buyer
**Solution**: 
1. Make sure you registered as "Buyer"
2. Select "Buyer" role when logging in
3. Check email/password are correct

### Issue: Redirected but can't access dashboard
**Solution**: 
1. Make sure all apps are running (`npm run dev`)
2. Check the correct port is accessible
3. Login again on the redirected page

### Issue: Registration successful but can't login
**Solution**: 
1. Check Supabase → Table Editor → users
2. Verify your user record exists
3. Check the role is set correctly

---

## ✅ Success Checklist

- [ ] All 3 apps running (Frontend, Admin, Vendor)
- [ ] Can register as Buyer
- [ ] Can login as Buyer and browse products
- [ ] Can register as Vendor
- [ ] Can login as Vendor (two-step)
- [ ] Can access vendor dashboard
- [ ] Admin user created in Supabase
- [ ] Can login as Admin (two-step)
- [ ] Can access admin dashboard

---

## 🎉 You're All Set!

Now you can:
- **Shop** as a Buyer
- **Sell** as a Vendor
- **Manage** as an Admin

Your complete e-commerce system is ready! 🚀
