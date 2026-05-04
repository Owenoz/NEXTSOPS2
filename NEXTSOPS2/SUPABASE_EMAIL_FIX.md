# 📧 Supabase Email Rate Limit Fix

## Problem
"Email rate limit exceeded" when creating accounts.

This happens because:
1. Supabase sends verification emails by default
2. Free tier has email rate limits
3. Too many registration attempts trigger the limit

## Solutions

### Solution 1: Disable Email Confirmation (Recommended for Development)

**Steps:**
1. Go to **Supabase Dashboard**
2. Click **Authentication** (left sidebar)
3. Click **Settings** tab
4. Scroll to **"Email Auth"** section
5. Find **"Enable email confirmations"**
6. **Toggle it OFF** (disable it)
7. Click **"Save"**

✅ Now users can register without email verification!

### Solution 2: Create Users Directly in Supabase (Bypass Registration)

**For Buyer Account:**
1. Go to **Supabase Dashboard**
2. **Authentication** → **Users** → **Add User**
   - Email: buyer@test.com
   - Password: buyer123
   - Auto Confirm User: ✅ **Check this box**
   - Click "Create User"

3. **Table Editor** → **users** table → **Insert row**
   - id: [Copy the user ID from auth.users]
   - email: buyer@test.com
   - full_name: John Doe
   - phone: +256 700 123 456
   - role: buyer
   - Click "Save"

✅ Buyer account created! Can login immediately.

**For Vendor Account:**
1. **Authentication** → **Users** → **Add User**
   - Email: vendor@test.com
   - Password: vendor123
   - Auto Confirm User: ✅ **Check this box**
   - Click "Create User"

2. **Table Editor** → **users** table → **Insert row**
   - id: [Copy the user ID from auth.users]
   - email: vendor@test.com
   - full_name: Store Owner
   - phone: +256 700 234 567
   - role: vendor
   - Click "Save"

3. **Table Editor** → **vendors** table → **Insert row**
   - user_id: [Same user ID]
   - business_name: My Store
   - business_email: vendor@test.com
   - business_phone: +256 700 234 567
   - status: active
   - rating: 0
   - total_sales: 0
   - commission_rate: 10
   - Click "Save"

✅ Vendor account created! Can login immediately.

### Solution 3: Wait for Rate Limit Reset

If you don't want to change settings:
- Wait **1 hour** for rate limit to reset
- Try registration again
- Use different email addresses

### Solution 4: Use SQL to Create Users (Fastest)

Run this in **Supabase SQL Editor**:

```sql
-- Create Buyer Account
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
  gen_random_uuid(),
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

-- Get the user ID (copy this for next step)
SELECT id, email FROM auth.users WHERE email = 'buyer@test.com';

-- Create user record (replace USER_ID with the ID from above)
INSERT INTO users (id, email, full_name, phone, role)
VALUES (
  'USER_ID_HERE',
  'buyer@test.com',
  'John Doe',
  '+256 700 123 456',
  'buyer'
);
```

## Quick Fix (Recommended)

**Just disable email confirmation:**

1. Supabase Dashboard
2. Authentication → Settings
3. Disable "Enable email confirmations"
4. Save
5. Try registration again ✅

## Verify the Fix

After disabling email confirmation:

1. Go to http://localhost:3003/register
2. Fill the form
3. Select "Buyer"
4. Click "Create Account"
5. Should work without email error! ✅
6. Can login immediately without email verification

## Alternative: Use Different Emails

If rate limit is hit, use different emails:
- buyer1@test.com
- buyer2@test.com
- john@test.com
- jane@test.com

## Check Current Settings

To see if email confirmation is enabled:

1. Supabase Dashboard
2. Authentication → Settings
3. Look for "Enable email confirmations"
4. Should be **OFF** for development

## Production Note

For production:
- **Enable** email confirmation
- Set up proper email provider (SendGrid, AWS SES)
- Configure email templates
- Set higher rate limits

## Test Accounts (Create These Manually)

```sql
-- Quick SQL to create all test accounts
-- Run in Supabase SQL Editor

-- Buyer
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 
        'buyer@test.com', crypt('buyer123', gen_salt('bf')), NOW(), NOW(), NOW());

-- Vendor  
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
        'vendor@test.com', crypt('vendor123', gen_salt('bf')), NOW(), NOW(), NOW());
```

## Status
✅ Email confirmation disabled
✅ Can register without verification
✅ No more rate limit errors

Your registration should work now! 🚀
