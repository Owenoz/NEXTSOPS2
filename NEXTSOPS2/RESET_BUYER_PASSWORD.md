# 🔑 Reset Buyer Password (Simple Fix)

## The account exists, just reset the password!

### Run This SQL:

```sql
-- Simply update the password for existing buyer account
UPDATE auth.users 
SET 
  encrypted_password = crypt('buyer123', gen_salt('bf')),
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'buyer@test.com';

-- Verify it worked
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'buyer@test.com';
```

### Then Login:

1. Go to **http://localhost:3003/login**
2. Email: **buyer@test.com**
3. Password: **buyer123**
4. Select: **Buyer**
5. Click "Sign In"

✅ Should work now!

---

## If Still Doesn't Work - Check Users Table

```sql
-- Check if user record exists
SELECT * FROM public.users WHERE email = 'buyer@test.com';

-- If no record, get the auth user ID and create it
SELECT id FROM auth.users WHERE email = 'buyer@test.com';

-- Then insert (replace USER_ID with the ID from above)
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
VALUES ('USER_ID_HERE', 'buyer@test.com', 'John Doe', 'buyer', NOW(), NOW())
ON CONFLICT (id) DO UPDATE 
SET email = 'buyer@test.com', role = 'buyer';
```

---

## Alternative - Use Dashboard

1. **Supabase Dashboard** → **Authentication** → **Users**
2. Find **buyer@test.com**
3. Click **"..."** menu → **"Send password recovery"**
4. Or click **"..."** → **"Reset password"**
5. Set password to: **buyer123**
6. Make sure user is confirmed

---

## Create New Account with Different Email

If you want a fresh start:

```sql
-- Create with different email
DO $$
DECLARE new_user_id uuid;
BEGIN
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'john@test.com',
    crypt('buyer123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  );
  
  INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
  VALUES (new_user_id, 'john@test.com', 'John Smith', 'buyer', NOW(), NOW());
END $$;
```

Then login with: **john@test.com / buyer123**

---

## Quick Test

After running the password reset SQL, try:
- Email: buyer@test.com
- Password: buyer123
- Role: Buyer

Should work! 🎉
