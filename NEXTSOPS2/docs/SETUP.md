# Next Shops - Setup & Deployment Guide

## Prerequisites

- Node.js 20+ and npm/yarn
- PostgreSQL 15+
- Redis 7+
- Git

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/next-shops.git
cd next-shops
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..

# Install vendor dashboard dependencies
cd vendor && npm install && cd ..
```

### 3. Setup Database

#### PostgreSQL
```bash
# Create database
createdb nextshops

# Or using psql
psql -U postgres
CREATE DATABASE nextshops;
\q
```

#### Redis
```bash
# Start Redis (if not running)
redis-server

# Or using Docker
docker run -d -p 6379:6379 redis:7-alpine
```

### 4. Environment Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=4000

DATABASE_URL="postgresql://postgres:password@localhost:5432/nextshops"
REDIS_URL="redis://localhost:6379"

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MTN Mobile Money (Uganda)
MTN_MOMO_API_KEY=your_mtn_api_key
MTN_MOMO_USER_ID=your_mtn_user_id
MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key

# Airtel Money (Uganda)
AIRTEL_MONEY_CLIENT_ID=your_airtel_client_id
AIRTEL_MONEY_CLIENT_SECRET=your_airtel_client_secret

# Email (SendGrid or SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id
```

### 5. Database Migration
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Seed Database (Optional)
```bash
cd backend
npm run seed
```

### 7. Start Development Servers

#### Option 1: All at once (from root)
```bash
npm run dev
```

#### Option 2: Individual servers
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Vendor Dashboard
cd vendor && npm run dev
```

### 8. Access Applications

- **Frontend (Buyer App)**: http://localhost:3000
- **Vendor Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:4000
- **Prisma Studio**: `cd backend && npm run studio`

## Production Deployment

### Option 1: Vercel (Frontend) + AWS (Backend)

#### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Deploy vendor dashboard
cd vendor
vercel --prod
```

#### Backend Deployment (AWS EC2)
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-org/next-shops.git
cd next-shops/backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Build
npm run build

# Start with PM2
pm2 start dist/index.js --name next-shops-api
pm2 save
pm2 startup
```

### Option 2: Docker Deployment

#### Build Docker Images
```bash
# Backend
cd backend
docker build -t next-shops-backend .

# Frontend
cd frontend
docker build -t next-shops-frontend .
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nextshops
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/nextshops
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

### Option 3: Kubernetes (Production Scale)

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: next-shops-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: next-shops-backend
  template:
    metadata:
      labels:
        app: next-shops-backend
    spec:
      containers:
      - name: backend
        image: your-registry/next-shops-backend:latest
        ports:
        - containerPort: 4000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: next-shops-secrets
              key: database-url
```

## Environment-Specific Configuration

### Development
- Hot reload enabled
- Detailed error messages
- Debug logging
- Local database

### Staging
- Production build
- Limited error details
- Info logging
- Staging database
- Test payment gateways

### Production
- Optimized build
- Minimal error exposure
- Error logging only
- Production database
- Live payment gateways
- CDN enabled
- SSL/TLS required

## Database Backup

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="nextshops"

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/nextshops_$DATE.sql

# Compress
gzip $BACKUP_DIR/nextshops_$DATE.sql

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/nextshops_$DATE.sql.gz s3://your-bucket/backups/

# Delete old backups (keep last 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### Restore from Backup
```bash
gunzip nextshops_backup.sql.gz
psql nextshops < nextshops_backup.sql
```

## Monitoring Setup

### Sentry (Error Tracking)
```bash
# Install Sentry SDK
npm install @sentry/node @sentry/nextjs

# Initialize in backend/src/index.ts
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})

# Initialize in frontend/next.config.js
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(nextConfig, {
  silent: true,
})
```

### PM2 Monitoring
```bash
# Install PM2
npm install -g pm2

# Start with monitoring
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs
```

## Performance Optimization

### Frontend
1. **Image Optimization**
   - Use Next.js Image component
   - WebP format
   - Lazy loading
   - CDN delivery

2. **Code Splitting**
   - Dynamic imports
   - Route-based splitting
   - Component lazy loading

3. **Caching**
   - Static page generation
   - API response caching
   - Browser caching headers

### Backend
1. **Database Optimization**
   - Indexes on frequently queried fields
   - Connection pooling
   - Query optimization

2. **Caching Strategy**
   - Redis for session storage
   - Cache frequently accessed data
   - Cache invalidation strategy

3. **API Optimization**
   - Rate limiting
   - Response compression
   - Pagination

## Security Checklist

- [ ] HTTPS enabled (SSL/TLS)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] JWT secret is strong and unique
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS protection headers
- [ ] CSRF tokens on forms
- [ ] Password hashing (bcrypt)
- [ ] Secure session management
- [ ] API authentication required
- [ ] File upload validation
- [ ] Regular security audits

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -d nextshops

# Reset database
npx prisma migrate reset
```

### Redis Connection Issues
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## Useful Commands

```bash
# Development
npm run dev              # Start all services
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run dev:vendor       # Vendor dashboard only

# Build
npm run build            # Build all
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Database
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma Client

# Linting
npm run lint             # Lint all
npm run lint:frontend    # Lint frontend
npm run lint:backend     # Lint backend

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Support

- Documentation: https://docs.nextshops.ug
- Email: support@nextshops.ug
- Phone: +256 800 123 456
