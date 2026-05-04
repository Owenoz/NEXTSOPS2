# Supabase Implementation Plan - Next Shops

## 🎯 Overview
Migrate from Prisma/PostgreSQL to Supabase for authentication, database, and real-time features.

---

## 📋 Implementation Phases

### Phase 1: Supabase Setup (Day 1)
- [ ] Create Supabase project
- [ ] Set up database schema
- [ ] Configure authentication
- [ ] Set up Row Level Security (RLS)
- [ ] Create database functions and triggers

### Phase 2: Authentication System (Day 1-2)
- [ ] Create unified login page with role selection
- [ ] Implement Supabase Auth
- [ ] Add role-based redirects (Admin/Vendor/Buyer)
- [ ] Create protected routes
- [ ] Add session management
- [ ] Implement logout functionality

### Phase 3: Backend Integration (Day 2-3)
- [ ] Replace Prisma with Supabase client
- [ ] Update all API endpoints
- [ ] Implement real-time subscriptions
- [ ] Add file upload to Supabase Storage
- [ ] Update authentication middleware

### Phase 4: Admin Product Management (Day 3-4)
- [ ] Create product CRUD interface
- [ ] Add image upload functionality
- [ ] Implement product approval workflow
- [ ] Add bulk product operations
- [ ] Create product categories management

### Phase 5: Frontend Real Data (Day 4-5)
- [ ] Connect frontend to Supabase
- [ ] Replace mock data with real queries
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add real-time updates

---

## 🗄️ Database Schema (Supabase)

### Tables

#### 1. users (extends auth.users)
```sql
- id (uuid, primary key, references auth.users)
- email (text, unique)
- full_name (text)
- phone (text)
- role (enum: 'buyer', 'vendor', 'admin')
- avatar_url (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. vendors
```sql
- id (uuid, primary key)
- user_id (uuid, references users)
- business_name (text)
- business_email (text)
- business_phone (text)
- description (text)
- logo_url (text)
- status (enum: 'pending', 'active', 'suspended')
- rating (decimal)
- total_sales (decimal)
- commission_rate (decimal)
- created_at (timestamp)
```

#### 3. products
```sql
- id (uuid, primary key)
- vendor_id (uuid, references vendors)
- name (text)
- description (text)
- price (decimal)
- compare_price (decimal)
- category_id (uuid, references categories)
- images (text[])
- stock (integer)
- sku (text, unique)
- status (enum: 'pending', 'approved', 'rejected')
- rejection_reason (text)
- is_featured (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 4. categories
```sql
- id (uuid, primary key)
- name (text)
- slug (text, unique)
- description (text)
- image_url (text)
- parent_id (uuid, references categories)
- created_at (timestamp)
```

#### 5. orders
```sql
- id (uuid, primary key)
- user_id (uuid, references users)
- vendor_id (uuid, references vendors)
- order_number (text, unique)
- status (enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- total_amount (decimal)
- payment_method (text)
- payment_status (enum: 'pending', 'paid', 'failed')
- shipping_address (jsonb)
- created_at (timestamp)
```

#### 6. order_items
```sql
- id (uuid, primary key)
- order_id (uuid, references orders)
- product_id (uuid, references products)
- quantity (integer)
- price (decimal)
- subtotal (decimal)
```

---

## 🔐 Authentication Flow

### Login Page Structure
```
┌─────────────────────────────────┐
│     Next Shops Login            │
├─────────────────────────────────┤
│  Email: [____________]          │
│  Password: [____________]       │
│                                 │
│  Login As:                      │
│  ○ Buyer   ○ Vendor   ○ Admin  │
│                                 │
│  [        Login        ]        │
│                                 │
│  Don't have account? Register   │
└─────────────────────────────────┘
```

### Role-Based Redirects
- **Buyer** → http://localhost:3000 (Frontend)
- **Vendor** → http://localhost:3001 (Vendor Dashboard)
- **Admin** → http://localhost:3002 (Admin Portal)

---

## 🔧 Technical Implementation

### 1. Supabase Client Setup

**Install Dependencies:**
```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
```

**Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Supabase Client (shared/lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 3. Authentication Hook
```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  
  // Login, logout, session management
}
```

### 4. Protected Route Component
```typescript
// components/ProtectedRoute.tsx
export function ProtectedRoute({ 
  children, 
  allowedRoles 
}) {
  // Check auth and role
  // Redirect if unauthorized
}
```

---

## 📦 File Structure

```
shared/
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── supabaseAdmin.ts     # Admin client
├── hooks/
│   ├── useAuth.ts           # Auth hook
│   └── useSupabase.ts       # Supabase hook
└── types/
    └── database.types.ts    # Generated types

auth/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx     # Unified login
│   │   └── register/
│   │       └── page.tsx     # Registration
│   └── components/
│       ├── LoginForm.tsx
│       └── RoleSelector.tsx

admin/
├── src/
│   ├── app/
│   │   └── products/
│   │       ├── page.tsx     # Product list
│   │       ├── new/
│   │       │   └── page.tsx # Add product
│   │       └── [id]/
│   │           └── page.tsx # Edit product
│   └── components/
│       └── products/
│           ├── ProductForm.tsx
│           ├── ProductList.tsx
│           └── ImageUpload.tsx
```

---

## 🚀 Implementation Steps

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Save credentials
4. Set up database schema

### Step 2: Database Migration
```sql
-- Run in Supabase SQL Editor
-- Create tables, RLS policies, functions
```

### Step 3: Install Dependencies
```bash
# Root
npm install @supabase/supabase-js

# Each app
cd frontend && npm install @supabase/auth-helpers-nextjs
cd admin && npm install @supabase/auth-helpers-nextjs
cd vendor && npm install @supabase/auth-helpers-nextjs
```

### Step 4: Create Shared Library
```bash
mkdir -p shared/lib shared/hooks shared/types
```

### Step 5: Implement Authentication
- Create login page
- Add role selection
- Implement redirects

### Step 6: Update Backend
- Replace Prisma with Supabase
- Update all endpoints
- Test API calls

### Step 7: Admin Product Management
- Create product CRUD UI
- Add image upload
- Implement approval workflow

### Step 8: Frontend Integration
- Connect to Supabase
- Replace mock data
- Add real-time updates

---

## 📊 Progress Tracking

### Phase 1: Supabase Setup
- [ ] Project created
- [ ] Schema deployed
- [ ] RLS configured
- [ ] Storage buckets created

### Phase 2: Authentication
- [ ] Login page created
- [ ] Role selection implemented
- [ ] Redirects working
- [ ] Session management

### Phase 3: Backend
- [ ] Supabase client integrated
- [ ] API endpoints updated
- [ ] File upload working
- [ ] Real-time enabled

### Phase 4: Admin Products
- [ ] Product list page
- [ ] Add product form
- [ ] Edit product form
- [ ] Image upload
- [ ] Approval workflow

### Phase 5: Frontend
- [ ] Real data queries
- [ ] Loading states
- [ ] Error handling
- [ ] Real-time updates

---

## 🔒 Security Considerations

### Row Level Security (RLS)
```sql
-- Example: Products table
CREATE POLICY "Vendors can view own products"
ON products FOR SELECT
USING (auth.uid() = vendor_id);

CREATE POLICY "Admins can view all products"
ON products FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

### API Security
- Use service role key only on server
- Validate user roles on every request
- Sanitize all inputs
- Use prepared statements

---

## 📝 Next Steps

1. **Create Supabase project** and get credentials
2. **Run database schema** in Supabase SQL editor
3. **Install dependencies** in all apps
4. **Create shared library** for Supabase client
5. **Implement authentication** with role selection
6. **Update backend** to use Supabase
7. **Build admin product management**
8. **Connect frontend** to real data

---

## 🎯 Success Criteria

- [ ] Users can login with role selection
- [ ] Admins can add/edit/approve products
- [ ] Vendors can manage their products
- [ ] Buyers see real products on frontend
- [ ] All data persists in Supabase
- [ ] Real-time updates work
- [ ] File uploads work
- [ ] Authentication is secure

---

**Estimated Time: 5-7 days**
**Priority: High**
**Status: Planning Complete - Ready to Implement**
