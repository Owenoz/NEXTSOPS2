# Next Shops - System Architecture

## Overview
Next Shops is a mobile-first e-commerce marketplace platform for Uganda, built as an improved MVP clone of Jumia Uganda.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 (Web)          │  React Native (Mobile - Future)│
│  - Buyer App (Port 3000)   │  - iOS/Android Apps            │
│  - Vendor Dashboard (3001) │  - Push Notifications          │
│  - Admin Panel (3002)      │  - Offline Support             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         API GATEWAY                          │
├─────────────────────────────────────────────────────────────┤
│  Node.js/Express (Port 4000)                                │
│  - REST API                                                  │
│  - JWT Authentication                                        │
│  - Rate Limiting                                             │
│  - Request Validation (Zod)                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                    │
├─────────────────────────────────────────────────────────────┤
│  Services:                                                   │
│  - Auth Service (Login, Register, OTP)                      │
│  - Product Service (CRUD, Search, Filters)                  │
│  - Order Service (Create, Track, Update)                    │
│  - Payment Service (MTN, Airtel, COD, Card)                 │
│  - Vendor Service (Onboarding, Analytics)                   │
│  - Notification Service (SMS, Email, Push)                  │
│  - Logistics Service (Delivery, Tracking)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary DB)    │  Redis (Cache & Sessions)     │
│  - Users, Products, Orders  │  - Session Store              │
│  - Vendors, Reviews         │  - Rate Limiting              │
│  - Payments, Categories     │  - Real-time Data             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                     │
├─────────────────────────────────────────────────────────────┤
│  Payment Gateways:          │  Infrastructure:              │
│  - MTN Mobile Money API     │  - AWS S3 (File Storage)      │
│  - Airtel Money API         │  - Cloudinary (Images)        │
│  - Flutterwave/Paystack     │  - SendGrid (Email)           │
│                             │  - Africa's Talking (SMS)     │
│  Logistics:                 │  - Google Maps API            │
│  - Boda-boda Partners       │  - Sentry (Monitoring)        │
│  - Pickup Stations          │  - Google Analytics           │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios + SWR
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT + bcrypt

### Database
- **Primary**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Search**: PostgreSQL Full-Text Search (MVP), Elasticsearch (Future)

### Infrastructure
- **Hosting**: AWS/Vercel
- **CDN**: Cloudinary
- **Monitoring**: Sentry
- **Analytics**: Google Analytics

## Key Features by User Type

### Buyers
1. Browse & Search (autocomplete, filters)
2. Product Details (images, specs, reviews)
3. Cart & Wishlist
4. Checkout (COD, Mobile Money, Card)
5. Order Tracking
6. Reviews & Ratings
7. Account Management
8. Notifications (SMS, Email)

### Sellers/Vendors
1. Vendor Registration & Verification
2. Product Management (Single/Bulk Upload)
3. Inventory Management
4. Order Management
5. Sales Analytics
6. Payment/Commission Tracking
7. Promotion Tools
8. Customer Communication

### Admin
1. User & Vendor Moderation
2. Product Approval
3. Order Monitoring
4. Analytics Dashboard
5. Commission Management
6. Content Management (Banners, Deals)
7. Dispute Resolution
8. System Configuration

## Data Flow Examples

### Order Creation Flow
```
1. Buyer adds items to cart
2. Proceeds to checkout
3. Enters delivery address
4. Selects payment method
5. Frontend sends order request to API
6. API validates data
7. Creates order in database
8. Initiates payment (if not COD)
9. Sends confirmation SMS/Email
10. Notifies vendor
11. Returns order confirmation to buyer
```

### Payment Flow (Mobile Money)
```
1. User selects MTN/Airtel Money
2. Enters phone number
3. API calls payment gateway
4. User receives USSD prompt
5. User enters PIN
6. Payment gateway confirms
7. API updates order status
8. Sends confirmation to user
9. Notifies vendor to ship
```

## Security Measures

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control (RBAC)
3. **Data Validation**: Zod schemas on all inputs
4. **SQL Injection**: Prisma ORM parameterized queries
5. **XSS Protection**: Content Security Policy headers
6. **CSRF Protection**: CSRF tokens on forms
7. **Rate Limiting**: Redis-based rate limiting
8. **Password Security**: bcrypt hashing (12 rounds)
9. **HTTPS Only**: SSL/TLS encryption
10. **PII Protection**: Encrypted sensitive data

## Scalability Considerations

### Current MVP
- Monolithic architecture
- Single database instance
- Basic caching with Redis
- CDN for static assets

### Future Scaling
- Microservices architecture
- Database read replicas
- Message queue (RabbitMQ/Kafka)
- Elasticsearch for search
- Kubernetes orchestration
- Multi-region deployment

## Performance Targets

- **Page Load**: < 3s on 3G
- **API Response**: < 500ms (p95)
- **Image Load**: < 2s (optimized)
- **Search Results**: < 1s
- **Checkout Flow**: < 30s total

## Monitoring & Observability

1. **Error Tracking**: Sentry
2. **Performance**: New Relic/DataDog
3. **Logs**: CloudWatch/ELK Stack
4. **Uptime**: Pingdom/UptimeRobot
5. **Analytics**: Google Analytics + Custom Events

## Deployment Strategy

### Environments
1. **Development**: Local (Docker Compose)
2. **Staging**: AWS/Vercel (staging branch)
3. **Production**: AWS/Vercel (main branch)

### CI/CD Pipeline
```
1. Code Push → GitHub
2. Run Tests (Jest, Playwright)
3. Build Application
4. Run Security Scans
5. Deploy to Staging
6. Run E2E Tests
7. Manual Approval
8. Deploy to Production
9. Health Checks
10. Rollback if needed
```

## Mobile-First Approach

### Design Principles
1. Touch-friendly UI (min 44px tap targets)
2. Optimized images (WebP, lazy loading)
3. Minimal data usage
4. Offline-first capabilities (PWA)
5. Fast loading on 3G networks
6. Simple navigation
7. Large, readable text
8. High contrast colors

### Progressive Web App (PWA)
- Service Worker for offline support
- Add to Home Screen
- Push notifications
- Background sync
- App-like experience

## Ugandan Market Adaptations

1. **Payment Methods**: COD, Mobile Money priority
2. **Language**: English + Luganda support
3. **Delivery**: Boda-boda integration
4. **Pricing**: UGX currency, no decimals
5. **Trust Signals**: Verified sellers, reviews
6. **Data Efficiency**: Optimized for slow networks
7. **SMS Notifications**: Primary communication
8. **Local Support**: Kampala-based customer service
