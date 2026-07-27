# 🛒 Eriecom Gadgets — Professional E-commerce Website

A fully-featured, production-ready e-commerce website for **Eriecom Gadgets**, Uganda's premier electronics store. Built with modern web technologies, this project includes customer-facing shopping pages and a complete admin dashboard for product management.

---

## ✨ Features

### **Customer Features**
- **🏠 Homepage**: Hero section with animated particles, featured products, trending items, testimonials, deals countdown
- **🛍️ Shop Page**: Advanced filtering (category, price, rating), sorting, grid/list view toggle, search
- **📦 Product Detail Page**: Image gallery, specs table, reviews, add to cart, quantity selector, color variants
- **🛒 Shopping Cart**: Add/remove items, quantity controls, coupon code (use `ERIECOM10` for 10% off), delivery calculator
- **💳 Checkout**: Full checkout form with personal info, delivery address, multiple payment methods (MTN MoMo, Airtel Money, Visa/Mastercard, Cash on Delivery)
- **📱 WhatsApp Integration**: Floating WhatsApp button on all customer pages for instant support
- **🌙 Modern Dark Theme**: Professional gradient design with glassmorphism effects
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices

### **Admin Features**
- **🔐 Secure Login**: Admin authentication system (default credentials below)
- **📊 Dashboard Overview**: Product statistics, category breakdown, recent additions, quick actions
- **➕ Product Management**: Add, edit, delete products with full CRUD operations
- **🖼️ Image Preview**: Real-time image preview when adding products
- **🏷️ Badge System**: New, Sale, Hot, Featured badges for products
- **📋 Category Management**: View products by category with stock tracking
- **🔍 Search & Filter**: Find products quickly in admin panel
- **💾 Local Storage**: All data persists in browser localStorage

---

## 📁 Project Structure

```
eriecom-gadgets/
├── index.html              # Homepage
├── pages/
│   ├── shop.html          # Product listing page
│   ├── product.html       # Product detail page
│   └── cart.html          # Shopping cart & checkout
├── admin/
│   ├── login.html         # Admin login
│   └── dashboard.html     # Admin dashboard
├── css/
│   ├── style.css          # Main styles
│   ├── animations.css     # Animation effects
│   ├── shop.css           # Shop page styles
│   ├── product.css        # Product detail styles
│   ├── cart.css           # Cart & checkout styles
│   ├── admin.css          # Admin panel styles
│   └── polish.css         # Final polish & extras
├── js/
│   ├── products.js        # Product data & utilities
│   ├── cart.js            # Cart management
│   ├── main.js            # Homepage logic
│   ├── shop.js            # Shop page logic
│   ├── product.js         # Product detail logic
│   ├── cart-page.js       # Cart & checkout logic
│   ├── admin-auth.js      # Admin authentication
│   └── admin-dashboard.js # Admin dashboard logic
└── assets/                # Images & icons (empty, uses CDN)
```

---

## 🚀 Getting Started

### **1. Open the Website**

Simply open `index.html` in any modern web browser:

```bash
# Navigate to the project folder
cd /home/owenoz/eriecom-gadgets

# Open in browser (Linux)
xdg-open index.html

# Or use a local server (recommended)
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

### **2. Browse as Customer**

- **Homepage**: `index.html`
- **Shop**: Click "Shop Now" or navigate to `pages/shop.html`
- **Product Details**: Click any product card
- **Cart**: Click the cart icon in the navbar
- **Checkout**: Proceed from cart page

### **3. Access Admin Dashboard**

1. Click the shield icon (🛡️) in the navbar or go to `admin/login.html`
2. **Login credentials**:
   - **Username**: `admin`
   - **Password**: `eriecom2025`
   
   *OR*
   
   - **Username**: `eriecom`
   - **Password**: `gadgets2025`

3. Manage products, view analytics, and control inventory

---

## 🎨 Design Highlights

- **Color Scheme**: Purple gradient (#6c3bff → #ff6b35) with dark theme
- **Typography**: Inter (body), Space Grotesk (headings)
- **Icons**: Font Awesome 6.5
- **Animations**: Smooth transitions, particle effects, scroll animations, loading skeletons
- **Modern UX**: Glassmorphism, hover effects, floating action buttons, toast notifications

---

## 💾 Data Persistence

All data is stored in **browser localStorage**:

- **Products**: `eriecom_products` — 22 default electronics products
- **Cart**: `eriecom_cart` — Shopping cart items
- **Admin Session**: `eriecom_admin_session` — Admin login state
- **Wishlist**: `eriecom_wishlist` — Favorited products

**Note**: Data persists per browser. Use different browsers or incognito mode to test as different users.

---

## 🛠️ Customization

### **Change Store Information**

Edit contact details in footer and announcement bar:
- **Phone**: Search for `+256 700 123 456` and replace
- **Email**: Search for `info@eriecomgadgets.ug` and replace
- **Address**: Search for `Kampala Road` and update
- **WhatsApp**: Update `wa.me/256700123456` links

### **Add Real Products**

1. Log into admin dashboard
2. Click "Add Product" button
3. Fill in product details:
   - Name, category, price
   - Image URL (use Unsplash or upload to CDN)
   - Description, stock, rating
   - Badge type and visibility settings
4. Click "Save Product"

### **Modify Styling**

- **Colors**: Edit CSS variables in `css/style.css` (`:root` section)
- **Fonts**: Change Google Fonts imports in HTML files
- **Layout**: Adjust grid columns in respective CSS files

### **Add Payment Gateway**

This is a frontend-only demo. To add real payments:

1. **Backend Required**: Set up Node.js, Python, or PHP backend
2. **Payment APIs**: Integrate MTN MoMo, Flutterwave, or Paystack
3. **Update**: `js/cart-page.js` → `placeOrder()` function
4. **Database**: Replace localStorage with MongoDB, MySQL, or Firebase

---

## 📱 Mobile Responsiveness

The site is fully responsive with breakpoints at:
- **Desktop**: 1280px+
- **Laptop**: 1024px – 1279px
- **Tablet**: 768px – 1023px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

All pages tested on common viewport sizes.

---

## 🎯 Featured Functionality

### **Coupon System**
- Use code `ERIECOM10` for 10% discount
- Applied at cart page before checkout

### **Free Delivery**
- Orders above UGX 150,000 get free delivery in Kampala
- Otherwise UGX 10,000 delivery fee applies

### **Stock Management**
- Products show "In Stock", "Only X left", or "Out of Stock"
- Low stock warnings appear on product cards

### **Search & Filter**
- Real-time search across product names and categories
- Filter by category, price range, rating, and availability
- Sort by price (low/high), rating, newest

---

## 🧪 Testing Checklist

- [x] Homepage loads with animations
- [x] Shop page filters and sorts products
- [x] Product detail shows specs and reviews
- [x] Add to cart updates badge count
- [x] Cart persists across page refreshes
- [x] Coupon code applies discount
- [x] Checkout form validates inputs
- [x] Admin login authenticates
- [x] Admin can add/edit/delete products
- [x] Mobile menu works on small screens
- [x] WhatsApp button links correctly
- [x] Back to top button appears on scroll

---

## 🚫 Known Limitations

- **No Backend**: This is a frontend-only demo. Orders are not actually processed.
- **Mock Data**: Uses sample products with Unsplash images
- **No Database**: All data in localStorage (resets if cleared)
- **No Email**: Newsletter subscription shows success but doesn't send emails
- **Single Currency**: UGX only (Ugandan Shillings)

---

## 🔒 Security Notes

- Admin passwords are **hardcoded** in `js/admin-auth.js` for demo purposes only
- **DO NOT** use in production without proper backend authentication
- Session expires after 8 hours (or 7 days if "Remember me" checked)
- No sensitive payment data is stored

---

## 📈 Future Enhancements

**Phase 2 (Backend Integration)**:
- [ ] Node.js/Express backend
- [ ] MongoDB database
- [ ] Real payment gateway (Flutterwave/Paystack)
- [ ] Order management & tracking
- [ ] Email notifications
- [ ] User accounts & order history
- [ ] Product reviews & ratings

**Phase 3 (Advanced Features)**:
- [ ] Product recommendations
- [ ] Related products algorithm
- [ ] Inventory alerts
- [ ] Analytics dashboard
- [ ] Multi-currency support
- [ ] Discount campaigns
- [ ] Live chat support

---

## 🤝 Credits

- **Images**: [Unsplash](https://unsplash.com) (product photos)
- **Icons**: [Font Awesome](https://fontawesome.com)
- **Fonts**: [Google Fonts](https://fonts.google.com) (Inter, Space Grotesk)

---

## 📄 License

This project is created as a demonstration. Feel free to use, modify, and adapt for your own projects.

---

## 💬 Support

For questions or assistance:
- **WhatsApp**: +256 700 123 456
- **Email**: info@eriecomgadgets.ug
- **Location**: Kampala Road, Opposite Game Store, Kampala, Uganda

---

**Made with ❤️ in Uganda**

*Eriecom Gadgets — Uganda's #1 Electronics Store*
