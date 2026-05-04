# Next Shops - Detailed User Flows

## 1. Buyer Registration & Login Flow

### Registration Flow
```
START → Homepage
  ↓
Click "Sign Up" / "Account"
  ↓
Registration Form
  - Email/Phone Number
  - Password
  - First Name
  - Last Name
  - Accept Terms & Conditions
  ↓
Submit Form
  ↓
[Backend Validation]
  ↓
Send OTP via SMS
  ↓
OTP Verification Screen
  - Enter 6-digit code
  - Resend option (60s cooldown)
  ↓
Verify OTP
  ↓
[Success] → Account Created
  ↓
Welcome Screen
  - Profile completion prompt
  - Add delivery address
  - Enable notifications
  ↓
Redirect to Homepage (Logged In)
END
```

### Login Flow
```
START → Homepage
  ↓
Click "Login"
  ↓
Login Form
  - Email/Phone
  - Password
  - "Remember Me" checkbox
  - "Forgot Password?" link
  ↓
Submit Credentials
  ↓
[Backend Authentication]
  ↓
[Success] → Generate JWT Token
  ↓
Store Token (localStorage/cookie)
  ↓
Redirect to Previous Page or Homepage
END

[Forgot Password Branch]
  ↓
Enter Email/Phone
  ↓
Send Reset OTP
  ↓
Verify OTP
  ↓
Enter New Password
  ↓
Confirm Password
  ↓
Update Password
  ↓
Auto-login
END
```

## 2. Product Discovery & Search Flow

### Browse by Category
```
START → Homepage
  ↓
Click Category (e.g., "Phones")
  ↓
Category Page
  - Breadcrumb navigation
  - Filter sidebar (Price, Brand, Rating, etc.)
  - Sort options (Popular, Price, New)
  - Product grid (2-3 columns mobile, 4-6 desktop)
  ↓
Apply Filters
  ↓
[AJAX Request] → Update product list
  ↓
Scroll for more (Infinite scroll or pagination)
  ↓
Click Product Card
  ↓
Product Detail Page
END
```

### Search Flow
```
START → Any Page
  ↓
Click Search Bar
  ↓
Type Query (e.g., "samsung phone")
  ↓
[Real-time Autocomplete]
  - Suggested products
  - Popular searches
  - Categories
  ↓
Select Suggestion OR Press Enter
  ↓
Search Results Page
  - Query displayed
  - Filter options
  - Sort options
  - Product grid
  - "Did you mean...?" suggestions
  ↓
Refine Search (filters/sort)
  ↓
Click Product
  ↓
Product Detail Page
END
```

## 3. Product Detail & Add to Cart Flow

```
START → Product Detail Page
  ↓
View Product Information
  - Image gallery (swipeable)
  - Title, price, discount
  - Rating & reviews
  - Seller information
  - Description & specifications
  - Related products
  ↓
Select Variant (if applicable)
  - Size, Color, etc.
  ↓
Select Quantity
  - +/- buttons
  - Stock availability check
  ↓
Click "Add to Cart"
  ↓
[Add to Cart Animation]
  ↓
Show Toast Notification
  - "Added to cart"
  - "View Cart" button
  - "Continue Shopping" button
  ↓
[Option 1] Continue Shopping → Stay on page
[Option 2] View Cart → Go to Cart Page
  ↓
Cart Page
  - List of items
  - Quantity adjustment
  - Remove items
  - Subtotal calculation
  - "Proceed to Checkout" button
END
```

## 4. Checkout & Payment Flow

```
START → Cart Page
  ↓
Click "Proceed to Checkout"
  ↓
[Check if Logged In]
  - If NO → Redirect to Login/Register
  - If YES → Continue
  ↓
STEP 1: Delivery Address
  - Select saved address OR
  - Add new address
    * Name
    * Phone
    * Street Address
    * City/District
    * Landmark (optional)
  - Set as default (checkbox)
  ↓
Click "Continue to Payment"
  ↓
STEP 2: Payment Method
  - Cash on Delivery (COD)
  - MTN Mobile Money
  - Airtel Money
  - Credit/Debit Card
  ↓
Select Payment Method
  ↓
[If Mobile Money]
  - Enter phone number
  - Confirm
  ↓
[If Card]
  - Enter card details
  - CVV, Expiry
  ↓
Click "Review Order"
  ↓
STEP 3: Order Review
  - Delivery address summary
  - Payment method summary
  - Order items list
  - Price breakdown
    * Subtotal
    * Delivery fee
    * Total
  - Terms & Conditions checkbox
  ↓
Click "Place Order"
  ↓
[Backend Processing]
  - Create order
  - Process payment (if not COD)
  - Send confirmation SMS/Email
  - Notify vendor
  ↓
[If Mobile Money]
  - Show USSD prompt message
  - Wait for payment confirmation
  - Show loading state
  ↓
Order Confirmation Page
  - Order number
  - Estimated delivery date
  - Payment status
  - "Track Order" button
  - "Continue Shopping" button
  ↓
Send Confirmation Notifications
  - SMS to buyer
  - Email to buyer
  - Notification to vendor
END
```

## 5. Order Tracking Flow

```
START → Account Dashboard
  ↓
Click "My Orders"
  ↓
Orders List Page
  - Filter by status (All, Pending, Shipped, Delivered)
  - Order cards showing:
    * Order number
    * Date
    * Total amount
    * Status badge
    * Product thumbnail
  ↓
Click Order Card
  ↓
Order Detail Page
  - Order timeline/progress bar
    * Order Placed
    * Confirmed
    * Processing
    * Shipped
    * Out for Delivery
    * Delivered
  - Product details
  - Delivery address
  - Payment information
  - Tracking number (if available)
  - Estimated delivery date
  - "Contact Seller" button
  - "Cancel Order" button (if eligible)
  - "Return/Refund" button (if delivered)
  ↓
[Real-time Updates]
  - SMS notifications on status change
  - In-app notifications
  ↓
[If Delivered]
  - "Rate Product" prompt
  - "Write Review" button
END
```

## 6. Review & Rating Flow

```
START → Order Detail Page (Delivered)
  ↓
Click "Rate Product"
  ↓
Review Form
  - Star rating (1-5)
  - Review title (optional)
  - Review text
  - Upload photos (optional, max 5)
  - "Would you recommend?" (Yes/No)
  ↓
Submit Review
  ↓
[Backend Validation]
  - Check if order is verified
  - Check for duplicate reviews
  ↓
[Success] → Review Submitted
  ↓
Show Thank You Message
  - "Review pending approval"
  - Earn reward points (if applicable)
  ↓
[Admin Approval]
  ↓
Review Published
  ↓
Notify User (SMS/Email)
END
```

## 7. Vendor Onboarding Flow

```
START → Homepage
  ↓
Click "Sell on Next Shops"
  ↓
Vendor Landing Page
  - Benefits of selling
  - Success stories
  - Commission structure
  - "Start Selling" CTA
  ↓
Click "Start Selling"
  ↓
Vendor Registration Form
  STEP 1: Account Information
    - Email
    - Phone
    - Password
  ↓
  STEP 2: Business Information
    - Business Name
    - Business Type (Individual/Company)
    - Business Registration Number
    - Tax ID (TIN)
    - Business Address
  ↓
  STEP 3: Bank Details
    - Bank Name
    - Account Number
    - Account Name
    - Mobile Money Number (alternative)
  ↓
  STEP 4: Verification Documents
    - National ID / Passport
    - Business License (if company)
    - Tax Certificate
    - Upload documents
  ↓
Submit Application
  ↓
[Backend Processing]
  - Create vendor account (pending)
  - Send verification email
  - Notify admin for review
  ↓
Application Submitted Page
  - "Under Review" message
  - Expected review time (2-3 days)
  - Contact support info
  ↓
[Admin Review Process]
  - Verify documents
  - Background check
  - Approve/Reject
  ↓
[If Approved]
  - Send approval email/SMS
  - Activate vendor account
  - Send onboarding guide
  ↓
Vendor Dashboard Access
  - Welcome tour
  - "Add Your First Product" prompt
END
```

## 8. Vendor Product Upload Flow

```
START → Vendor Dashboard
  ↓
Click "Add Product"
  ↓
Product Upload Form
  STEP 1: Basic Information
    - Product Name
    - Category (dropdown)
    - Sub-category
    - Brand
    - Description (rich text editor)
  ↓
  STEP 2: Pricing & Inventory
    - Price (UGX)
    - Original Price (for discount display)
    - Stock Quantity
    - SKU (auto-generated or manual)
    - Low stock alert threshold
  ↓
  STEP 3: Images
    - Upload main image (required)
    - Upload additional images (max 8)
    - Drag to reorder
    - Image guidelines displayed
  ↓
  STEP 4: Specifications
    - Add key-value pairs
    - Examples: Color, Size, Weight, etc.
    - Dynamic fields based on category
  ↓
  STEP 5: Variants (Optional)
    - Add variant types (Size, Color)
    - Add variant options
    - Set price/stock per variant
  ↓
  STEP 6: Shipping
    - Weight
    - Dimensions (L x W x H)
    - Shipping fee (or use default)
    - Processing time
  ↓
Preview Product
  - See how it will appear to buyers
  - Edit if needed
  ↓
Click "Publish Product"
  ↓
[Backend Processing]
  - Validate data
  - Optimize images
  - Create product (pending approval)
  - Notify admin
  ↓
Product Submitted
  - "Pending Approval" status
  - Expected approval time
  ↓
[Admin Approval]
  ↓
[If Approved]
  - Product goes live
  - Notify vendor
  - Product appears in search/category
END

[Bulk Upload Alternative]
  ↓
Download CSV Template
  ↓
Fill Product Data in Excel
  ↓
Upload CSV File
  ↓
Validate Data
  ↓
Review Import Summary
  ↓
Confirm Import
  ↓
Products Created (Pending Approval)
END
```

## 9. Vendor Order Management Flow

```
START → Vendor Dashboard
  ↓
New Order Notification
  - SMS alert
  - Email alert
  - In-app notification
  ↓
Click "Orders" in sidebar
  ↓
Orders List
  - Filter by status
  - Search by order number
  - Order cards with key info
  ↓
Click Order Card
  ↓
Order Detail Page
  - Customer information (name, phone, address)
  - Product details
  - Payment status
  - Delivery deadline
  - Special instructions
  ↓
[Order Actions]
  ↓
Click "Confirm Order"
  ↓
Confirmation Dialog
  - Verify stock availability
  - Confirm processing time
  ↓
Confirm
  ↓
Order Status → "Processing"
  ↓
Prepare Package
  ↓
Click "Mark as Shipped"
  ↓
Shipping Form
  - Tracking number (optional)
  - Carrier/Delivery partner
  - Estimated delivery date
  - Upload package photo (optional)
  ↓
Submit
  ↓
Order Status → "Shipped"
  ↓
[Automatic Notifications]
  - SMS to customer
  - Email to customer
  ↓
[Delivery Partner Picks Up]
  ↓
[Customer Receives Order]
  ↓
[Auto-update or Manual]
  ↓
Order Status → "Delivered"
  ↓
[Payment Released to Vendor]
  - Commission deducted
  - Amount added to vendor balance
  ↓
Vendor can request payout
END
```

## 10. Mobile Money Payment Flow (Detailed)

```
START → Checkout Page
  ↓
Select "MTN Mobile Money"
  ↓
Enter Phone Number
  - Format: 256XXXXXXXXX
  - Validate format
  ↓
Click "Pay Now"
  ↓
[Frontend] Show loading state
  ↓
[Backend] Call MTN MoMo API
  - Request to Pay
  - Transaction ID generated
  ↓
[MTN] Send USSD prompt to user's phone
  ↓
[Frontend] Show instruction screen
  - "Check your phone for USSD prompt"
  - "Enter your Mobile Money PIN"
  - "Do not close this page"
  - Countdown timer (2 minutes)
  ↓
[User] Receives USSD prompt on phone
  ↓
[User] Enters PIN
  ↓
[MTN] Processes payment
  ↓
[Backend] Poll for payment status
  - Check every 5 seconds
  - Max 2 minutes
  ↓
[Payment Successful]
  ↓
[Backend]
  - Update order status → "Paid"
  - Update payment record
  - Send confirmation SMS/Email
  - Notify vendor
  ↓
[Frontend] Redirect to success page
  ↓
Order Confirmation Page
END

[Payment Failed Branch]
  ↓
Show error message
  - Insufficient balance
  - Wrong PIN
  - Transaction cancelled
  ↓
Offer retry option
  ↓
[Retry] → Back to payment method selection
[Cancel] → Order cancelled, stock restored
END
```

## Key User Experience Principles

1. **Minimal Steps**: Reduce friction at every stage
2. **Clear Feedback**: Always show loading states and confirmations
3. **Error Handling**: Helpful error messages with recovery options
4. **Mobile-First**: Touch-friendly, thumb-reachable buttons
5. **Trust Signals**: Show security badges, verified sellers, reviews
6. **Speed**: Fast page loads, optimistic UI updates
7. **Accessibility**: High contrast, large text, screen reader support
8. **Localization**: Ugandan context (UGX, local addresses, mobile money)
