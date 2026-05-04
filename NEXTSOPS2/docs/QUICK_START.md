# Next Shops - Quick Start Guide

Get Next Shops running on your local machine in under 10 minutes! 🚀

## ⚡ Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 20+** - [Download](https://nodejs.org/)
- ✅ **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- ✅ **Redis 7+** - [Download](https://redis.io/download/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **Code Editor** - VS Code recommended

## 🎯 5-Minute Setup

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/your-org/next-shops.git
cd next-shops

# Install all dependencies (root + all workspaces)
npm install
```

### Step 2: Setup Database (1 minute)

```bash
# Create PostgreSQL database
createdb nextshops

# Or using psql
psql -U postgres
CREATE DATABASE nextshops;
\q
```

### Step 3: Configure Environment (1 minute)

```bash
# Backend environment
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database URL:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nextshops"
```

```bash
# Frontend environment
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Run Migrations (30 seconds)

```bash
cd ../backend
npx prisma migrate dev --name init
npx prisma generate
```

### Step 5: Start Everything (30 seconds)

```bash
# From root directory
cd ..
npm run dev
```

This starts:
- ✅ Frontend (Port 3000)
- ✅ Vendor Dashboard (Port 3001)
- ✅ Admin Panel (Port 3002)
- ✅ Backend API (Port 4000)

## 🎉 You're Done!

Open your browser:

- **Buyer App**: http://localhost:3000
- **Vendor Dashboard**: http://localhost:3001
- **Admin Panel**: http://localhost:3002
- **API Docs**: http://localhost:4000/health

## 🔍 Verify Installation

### Check Frontend
```bash
curl http://localhost:3000
# Should return HTML
```

### Check Backend
```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","message":"Next Shops API is running"}
```

### Check Database
```bash
cd backend
npx prisma studio
# Opens database GUI at http://localhost:5555
```

## 🛠️ Development Workflow

### Running Individual Services

```bash
# Frontend only
cd frontend && npm run dev

# Vendor dashboard only
cd vendor && npm run dev

# Admin panel only
cd admin && npm run dev

# Backend only
cd backend && npm run dev
```

### Database Commands

```bash
cd backend

# View database in browser
npx prisma studio

# Create new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### Useful Scripts

```bash
# From root directory

# Start all services
npm run dev

# Build all services
npm run build

# Lint all code
npm run lint

# Run tests (when available)
npm test
```

## 📝 Making Your First Changes

### 1. Modify Homepage

Edit `frontend/src/app/page.tsx`:
```tsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to My Custom Shop!</h1>
      {/* Your changes here */}
    </div>
  )
}
```

Save and see changes instantly at http://localhost:3000

### 2. Add New API Endpoint

Create `backend/src/routes/custom.ts`:
```typescript
import { Router } from 'express'

const router = Router()

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from custom endpoint!' })
})

module.exports = router
```

Register in `backend/src/index.ts`:
```typescript
app.use('/api/custom', require('./routes/custom'))
```

Test: http://localhost:4000/api/custom/hello

### 3. Add Database Model

Edit `backend/prisma/schema.prisma`:
```prisma
model CustomModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}
```

Run migration:
```bash
cd backend
npx prisma migrate dev --name add_custom_model
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
# macOS
brew services restart postgresql

# Linux
sudo systemctl restart postgresql
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Start Redis
# macOS
brew services start redis

# Linux
sudo systemctl start redis
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf frontend/.next
rm -rf vendor/.next
rm -rf admin/.next
```

### Prisma Client Error

```bash
cd backend
npx prisma generate
```

## 📚 Next Steps

### 1. Explore the Codebase
- Read `docs/ARCHITECTURE.md` for system overview
- Check `docs/USER_FLOWS.md` for user journeys
- Review `docs/DESIGN_SYSTEM.md` for UI guidelines

### 2. Add Sample Data
```bash
cd backend
# Create seed file: prisma/seed.ts
npx prisma db seed
```

### 3. Setup Payment Gateways
- Get MTN Mobile Money API keys
- Get Airtel Money credentials
- Setup Flutterwave/Paystack account

### 4. Configure Email/SMS
- Setup SendGrid for emails
- Setup Africa's Talking for SMS

### 5. Deploy to Staging
- Follow `docs/SETUP.md` deployment section
- Setup CI/CD pipeline
- Configure environment variables

## 🎓 Learning Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Project Docs
- `README.md` - Project overview
- `docs/ARCHITECTURE.md` - System design
- `docs/USER_FLOWS.md` - User journeys
- `docs/DESIGN_SYSTEM.md` - UI specs
- `docs/MVP_FEATURES.md` - Features list
- `docs/FILE_TREE.md` - File structure

## 💡 Pro Tips

### 1. Use Prisma Studio
```bash
cd backend && npx prisma studio
```
Visual database editor - super helpful!

### 2. Hot Reload
All services support hot reload. Just save and see changes instantly.

### 3. TypeScript Errors
```bash
# Check types without running
cd frontend && npx tsc --noEmit
```

### 4. Tailwind IntelliSense
Install "Tailwind CSS IntelliSense" VS Code extension for autocomplete.

### 5. Database Backups
```bash
# Backup
pg_dump nextshops > backup.sql

# Restore
psql nextshops < backup.sql
```

## 🚀 Ready to Build?

You're all set! Start building amazing features for Next Shops.

### Common Tasks

**Add a new page:**
```bash
# Create file
touch frontend/src/app/my-page/page.tsx

# Add content
# Visit http://localhost:3000/my-page
```

**Add a new component:**
```bash
# Create file
touch frontend/src/components/MyComponent.tsx

# Import and use in pages
```

**Add API endpoint:**
```bash
# Edit backend/src/routes/
# Register in backend/src/index.ts
```

**Modify database:**
```bash
# Edit backend/prisma/schema.prisma
# Run: npx prisma migrate dev
```

## 📞 Need Help?

- 📖 Check documentation in `docs/` folder
- 🐛 Found a bug? Create an issue
- 💬 Questions? Contact the team
- 📧 Email: dev@nextshops.ug

## ✅ Checklist

Before you start developing:

- [ ] All services running (3000, 3001, 3002, 4000)
- [ ] Database connected (Prisma Studio works)
- [ ] Redis running (redis-cli ping returns PONG)
- [ ] Environment variables configured
- [ ] Can access all apps in browser
- [ ] Hot reload working (make a change, see it update)

---

**Happy Coding! 🎉**

*Build something amazing for Uganda's e-commerce future!*
