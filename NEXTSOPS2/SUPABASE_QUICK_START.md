# 🚀 Supabase Integration - Quick Start Guide

## 📋 What We're Building

1. **Unified Login** - One login page with role selection (Buyer/Vendor/Admin)
2. **Real Database** - Replace mock data with Supabase
3. **Admin Product Management** - Add/Edit/Approve products
4. **Frontend Real Data** - Display actual products from database

---

## ⚡ Quick Start (30 Minutes)

### Step 1: Create Supabase Project (5 min)

1. Go to https://supabase.com
2. Click "Start your project"
3. Create new organization (if needed)
4. Create new project:
   - **Name:** next-shops
   - **Database Password:** (save this!)
   - **Region:** Choose closest to Uganda
5. Wait for project to be ready (~2 minutes)

### Step 2: Get Your Credentials (2 min)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (keep secret!)

### Step 3: Set Up Database (10 min)

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the schema below
4. Click **Run**

---

## 🗄️ Database Schema (Copy & Paste)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('buyer', 'vendor', 'admin');
CREATE TYPE product_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE vendor_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'buyer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_email TEXT,
  business_phone TEXT,
  description TEXT,
  logo_url TEXT,
  status vendor_status DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 0,
  total_sales DECIMAL(12,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  compare_price DECIMAL(12,2),
  category_id UUID REFERENCES public.categories(id),
  images TEXT[],
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  status product_status DEFAULT 'pending',
  rejection_reason TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  vendor_id UUID REFERENCES public.vendors(id),
  order_number TEXT UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method TEXT,
  payment_status payment_status DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for products
CREATE POLICY "Anyone can view approved products"
  ON public.products FOR SELECT
  USING (status = 'approved' OR auth.uid() IN (
    SELECT user_id FROM public.vendors WHERE id = vendor_id
  ));

CREATE POLICY "Vendors can insert own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.vendors WHERE id = vendor_id
  ));

CREATE POLICY "Vendors can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.vendors WHERE id = vendor_id
  ));

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  TO public
  USING (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Phones, laptops, and gadgets'),
  ('Fashion', 'fashion', 'Clothing, shoes, and accessories'),
  ('Home & Kitchen', 'home-kitchen', 'Furniture and appliances'),
  ('Beauty', 'beauty', 'Cosmetics and personal care'),
  ('Sports', 'sports', 'Sports equipment and fitness');
```

---

## 📦 Step 4: Install Dependencies (5 min)

```bash
# In your project root
npm install @supabase/supabase-js

# In each app folder
cd frontend && npm install @supabase/auth-helpers-nextjs @supabase/ssr
cd ../admin && npm install @supabase/auth-helpers-nextjs @supabase/ssr
cd ../vendor && npm install @supabase/auth-helpers-nextjs @supabase/ssr
cd ..
```

---

## 🔧 Step 5: Configure Environment Variables (3 min)

Create `.env.local` in each app folder:

**frontend/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**admin/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**vendor/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**backend/.env:**
```env
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## ✅ Verify Setup

1. Go to Supabase dashboard
2. Click **Table Editor**
3. You should see: users, vendors, products, categories, orders, order_items
4. Click **Authentication** → Should be enabled

---

## 🎯 Next Steps

Now that Supabase is set up, we need to:

1. **Create shared Supabase client** (I'll do this)
2. **Build login page with role selection** (I'll do this)
3. **Update admin to manage products** (I'll do this)
4. **Connect frontend to real data** (I'll do this)

---

## 📝 What You Need to Provide

Please provide your Supabase credentials:

1. **Project URL:** `https://xxxxx.supabase.co`
2. **Anon Key:** `eyJhbGc...`
3. **Service Role Key:** `eyJhbGc...` (keep secret!)

Once you provide these, I'll:
- Create the Supabase client
- Build the login system
- Implement product management
- Connect everything to real data

---

## 🚀 Ready to Continue?

After you've:
- ✅ Created Supabase project
- ✅ Run the SQL schema
- ✅ Installed dependencies
- ✅ Added e