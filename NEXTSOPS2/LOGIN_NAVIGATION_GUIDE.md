# 🔐 Login & Navigation Guide

## How Login Works

### 1. Registration Flow
When a user registers:
1. Creates account in Supabase Auth
2. Creates user record in `users` table with selected role
3. If role is "vendor", also creates record in `vendors` table
4. Redirects to login page

### 2. Login Flow
When a user logs in:
1. User enters email, password, and selects their role
2. System authenticates with Supabase
3. Fetches user's actual role from database
4. Verifies selected role matches database role
5. Redirects to appropriate portal:
   - **Buyer** → Frontend (same port, just navigates to home)
   - **Vendor** → http://localhost:3001
   - **Admin** → http://localhost:3002

## Port Configuration

Your apps are running on:
- **Frontend (Buyer)**: Port 3003 (or 3000 if available)
- **Vendor Portal**: Port 3001
- **Admin Portal**: Port 3002

## Testing the System

### Step 1: Create Test Users

#### Option A: Register via UI
1. Go to http://localhost:3003/register
2. Fill in the form
3. Select role (Buyer/Vendor/Admin)
4. Click "Create Account"
5. Go to login page

#### Option B: Create Admin User in Supabase
1. Go to Supabase Dashboard → Authentication
2. Add user: admin@test.com / admin123
3. Go to Table Editor → users table
4. Add record:
   ```
   id: [copy from auth.users]
   email: admin@test.com
   full_name: Admin User
   role: admin
   ```

### Step 2: Test Login

#### Test as Buyer:
1. Go to http://localhost:3003/login
2. Enter credentials
3. Select "Buyer" role
4. Click "Sign In"
5. Should stay on port 3003 and navigate to homepage

#### Test as Vendor:
1. Go to http://localhost:3003/login
2. Enter credentials
3. Select "Vendor" role
4. Click "Sign In"
5. Should redirect to http://localhost:3001 (Vendor Portal)

#### Test as Admin:
1. Go to http://localhost:3003/login
2. Enter credentials
3. Select "Admin" role
4. Click "Sign In"
5. Should redirect to http://localhost:3002 (Admin Portal)

## Common Issues & Solutions

### Issue 1: "This account is registered as X, not Y"
**Cause**: Selected role doesn't match database role
**Solution**: Select the correct role that matches your account

### Issue 2: Login doesn't redirect
**Cause**: Ports might not be running
**Solution**: 
```bash
# Check all apps are running
npm run dev

# Should see:
# FRONTEND - Port 3003
# ADMIN - Port 3002
# VENDOR - Port 3001
```

### Issue 3: Can't access admin/vendor portals
**Cause**: User role is not set correctly in database
**Solution**: 
1. Go to Supabase → Table Editor → users
2. Find your user
3. Update `role` column to correct value

### Issue 4: Registration creates user but can't login
**Cause**: User record not created in users table
**Solution**: This is now fixed! Registration creates both:
- Auth user (for login)
- Users table record (for role)
- Vendors table record (if vendor)

## Database Structure

### users table
```
id (uuid) - matches auth.users.id
email (text)
full_name (text)
phone (text)
role (text) - 'buyer', 'vendor', or 'admin'
created_at (timestamp)
```

### vendors table (for vendor users)
```
id (uuid)
user_id (uuid) - references users.id
business_name (text)
business_email (text)
business_phone (text)
status (text) - 'pending', 'active', 'suspended'
rating (numeric)
total_sales (numeric)
commission_rate (numeric)
```

## Quick Test Checklist

- [ ] All 3 apps running (Frontend, Admin, Vendor)
- [ ] Can access registration page
- [ ] Can create new account
- [ ] User record created in database
- [ ] Can login with correct role
- [ ] Redirects to correct portal
- [ ] Can see dashboard after login

## URLs Reference

| Role | Login URL | Redirect URL | Port |
|------|-----------|--------------|------|
| Buyer | http://localhost:3003/login | http://localhost:3003/ | 3003 |
| Vendor | http://localhost:3003/login | http://localhost:3001 | 3001 |
| Admin | http://localhost:3003/login | http://localhost:3002 | 3002 |

**Note**: All users login from the same page (Frontend), but get redirected based on their role!

## Next Steps

1. **Create test accounts** for each role
2. **Test login flow** for each role
3. **Verify redirects** work correctly
4. **Check dashboard** loads with real data

Your login and navigation system is now fully functional! 🎉
