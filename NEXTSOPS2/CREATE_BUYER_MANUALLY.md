# 👤 Create Buyer Account Manually (Bypass Rate Limit)

## Quick Solution - Create in Supabase Dashboard

### Step 1: Create Auth User

1. Go to **Supabase Dashboard**
2. Click **Authentication** (left sidebar)
3. Click **Users** tab
4. Click **"Add User"** button (top right)
5. Fill in:
   ```
   Email: buyer@test.com
   Password: buyer123
   ```
6. ✅ **IMPORTANT**: Check the box **"Auto Confirm User"**
7. Click **"Create User"**
8. **Copy the User ID** (you'll need it next)

### Step 2: Create User Record in Database

1. Click **Table Editor** (left sidebar)
2. Select **"users"** table
3. Click **"Insert"** → **"Insert row"**
4. Fill in:
   ```
   id: [Paste the User ID from Step 1]
   email: buyer@test.com
   full_name: John Doe
   phone: +256700123456
   role: buyer
   ```
5. Leave other fields empty (they'll auto-fill)
6. Click **"Save"**

✅ **Done! Buyer account created!**

---

## Alternative: Use SQL (Faster)

### Option 1: Run This SQL

1. Go to **Supabase Dashboard**
2. Click **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Paste this code:

```sql
-- Step 1: Create auth user
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generate a new user ID
  new_user_id := gen_random_uuid();
  
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'buyer@test.com',
    crypt('buyer123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );
  
  -- Create user record
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    new_user_id,
    'buyer@test.com',
    'John Doe',
    '+256700123456',
    'buyer'
  );
  
  RAISE NOTICE 'User created successfully with ID: %', new_user_id;
END $$;
```

5. Click **"Run"**
6. ✅ Done!

### Option 2: Create Multiple Test Users

```sql
-- Create Buyer
DO $$
DECLARE new_user_id uuid;
BEGIN
  new_user_id := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 
          'buyer@test.com', crypt('buyer123', gen_salt('bf')), NOW(), NOW(), NOW());
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (new_user_id, 'buyer@test.com', 'John Doe', '+256700123456', 'buyer');
END $$;

-- Create Buyer 2
DO $$
DECLARE new_user_id uuid;
BEGIN
  new_user_id := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 
          'buyer2@test.com', crypt('buyer123', gen_salt('bf')), NOW(), NOW(), NOW());
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (new_user_id, 'buyer2@test.com', 'Jane Smith', '+256700234567', 'buyer');
END $$;

-- Create Vendor
DO $$
DECLARE new_user_id uuid;
BEGIN
  new_user_id := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 
          'vendor@test.com', crypt('vendor123', gen_salt('bf')), NOW(), NOW(), NOW());
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (new_user_id, 'vendor@test.com', 'Store Owner', '+256700345678', 'vendor');
  INSERT INTO public.vendors (user_id, business_name, business_email, status, rating, total_sales, commission_rate)
  VALUES (new_user_id, 'My Store', 'vendor@test.com', 'active', 0, 0, 10);
END $$;
```

---

## Test the Account

### Login as Buyer:

1. Go to **http://localhost:3003/login**
2. Enter:
   ```
   Email: buyer@test.com
   Password: buyer123
   ```
3. Select **"Buyer"** role
4. Click **"Sign In"**
5. ✅ Should work!

---

## Verify Account Was Created

### Check Auth Users:
1. Supabase Dashboard → **Authentication** → **Users**
2. Look for buyer@test.com
3. Should show "Confirmed" status

### Check Users Table:
1. Supabase Dashboard → **Table Editor** → **users**
2. Look for buyer@test.com
3. Should show role = 'buyer'

---

## Create More Test Accounts

Use different emails to avoid rate limit:

```
buyer@test.com / buyer123
buyer2@test.com / buyer123
john@test.com / buyer123
jane@test.com / buyer123
customer@test.com / buyer123
```

Create each one using the SQL method above (just change the email).

---

## Why This Works

- **Bypasses registration form** (no email sent)
- **Bypasses rate limit** (direct database insert)
- **Auto-confirmed** (can login immediately)
- **No waiting** (instant access)

---

## Quick Reference

| Method | Time | Difficulty |
|--------|------|------------|
| Dashboard UI | 2 min | Easy |
| SQL Script | 30 sec | Medium |
| Wait for rate limit | 1 hour | Easy |

**Recommended**: Use SQL script for fastest results!

---

## Status

✅ Buyer account created manually
✅ Can login immediately
✅ No rate limit issues
✅ Ready to shop!

Your buyer account is ready! Login and start shopping! 🛍️
