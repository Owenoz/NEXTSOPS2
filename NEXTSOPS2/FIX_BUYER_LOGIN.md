# 🔧 Fix Buyer Login - Invalid Credentials

## Quick Fix - Reset Password in Supabase

### Step 1: Check if User Exists

Run this in **Supabase SQL Editor**:

```sql
-- Check auth user
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'buyer@test.com';

-- Check users table
SELECT id, email, role 
FROM public.users 
WHERE email = 'buyer@test.com';
```

### Step 2: Delete and Recreate (Clean Start)

```sql
-- Delete from users table first
DELETE FROM public.users WHERE email = 'buyer@test.com';

-- Delete from auth
DELETE FROM auth.users WHERE email = 'buyer@test.com';

-- Now create fresh account
DO $$
DECLARE new_user_id uuid;
BEGIN
  new_user_id := gen_random_uuid();
  
  -- Create auth user with proper password
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
    ''
  );
  
  -- Create user record
  INSERT INTO public.users (id, email, full_name, phone, role, created_at, updated_at)
  VALUES (
    new_user_id,
    'buyer@test.com',
    'John Doe',
    '+256700123456',
    'buyer',
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'User created with ID: %', new_user_id;
END $$;
```

### Step 3: Verify Creation

```sql
-- Verify auth user
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'buyer@test.com';

-- Verify users table
SELECT id, email, role 
FROM public.users 
WHERE email = 'buyer@test.com';
```

Both should return results!

---

## Alternative: Use Dashboard to Set Password

### Method 1: Reset Password via Dashboard

1. **Supabase Dashboard** → **Authentication** → **Users**
2. Find **buyer@test.com**
3. Click the **"..."** menu
4. Click **"Reset Password"**
5. Set new password: **buyer123**
6. Make sure **"Auto Confirm User"** is checked
7. Save

### Method 2: Create New User via Dashboard

1. **Authentication** → **Users** → **"Add User"**
2. Email: **testbuyer@test.com** (use different email)
3. Password: **buyer123**
4. ✅ Check **"Auto Confirm User"**
5. Click "Create User"
6. Copy the User ID

7. **Table Editor** → **users** → **"Insert row"**
8. Fill:
   - id: [paste User ID]
   - email: testbuyer@test.com
   - full_name: Test Buyer
   - role: buyer
9. Save

Now login with: **testbuyer@test.com / buyer123**

---

## Test Login

After running the SQL:

1. Go to **http://localhost:3003/login**
2. Email: **buyer@test.com**
3. Password: **buyer123**
4. Select: **Buyer**
5. Click "Sign In"

Should work now! ✅

---

## If Still Not Working

### Check Supabase Auth Settings:

1. **Authentication** → **Settings**
2. Verify:
   - ✅ "Enable email confirmations" is **OFF**
   - ✅ "Enable sign ups" is **ON**
   - ✅ "Minimum password length" is 6 or less

### Try Different Email:

Use a completely new email:
- john@test.com
- customer@test.com
- user@test.com

---

## Create Multiple Test Accounts

```sql
-- Create 3 buyer accounts at once
DO $$
DECLARE 
  user1_id uuid := gen_random_uuid();
  user2_id uuid := gen_random_uuid();
  user3_id uuid := gen_random_uuid();
BEGIN
  -- Buyer 1
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', user1_id, 'authenticated', 'authenticated', 
          'john@test.com', crypt('buyer123', gen_salt('bf')), NOW(), NOW(), NOW());
  INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
  VALUES (user1_id, 'john@test.com', 'John Smith', 'buyer', NOW(), NOW());
  
  -- Buyer 2
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', user2_id, 'authenticated', 'authenticated', 
          'jane@test.com', crypt('buyer123', gen_salt('bf')), NOW(), NOW(), NOW());
  INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
  VALUES (user2_id, 'jane@test.com', 'Jane Doe', 'buyer', NOW(), NOW());
  
  -- Buyer 3
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', user3_id, 'authenticated', 'authenticated', 
          'customer@test.com', crypt('buyer123', gen_salt('bf')), NOW(), NOW(), NOW());
  INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
  VALUES (user3_id, 'customer@test.com', 'Customer Test', 'buyer', NOW(), NOW());
  
  RAISE NOTICE 'Created 3 buyer accounts';
END $$;
```

Then try logging in with any of these:
- john@test.com / buyer123
- jane@test.com / buyer123
- customer@test.com / buyer123

---

## Status

Run the delete and recreate SQL above, then try logging in. It should work! 🚀
