/* =============================================
   ERIECOM GADGETS — PRODUCT DATA & MANAGEMENT
   ============================================= */

const DEFAULT_PRODUCTS = [
  // SMARTPHONES
  { id: 1, name: "Samsung Galaxy S24 Ultra", category: "phones", price: 4800000, oldPrice: 5500000, rating: 4.9, reviews: 312, badge: "hot", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80", desc: "200MP camera, Snapdragon 8 Gen 3, 5000mAh battery, S-Pen included.", featured: true, trending: true, stock: 15 },
  { id: 2, name: "iPhone 15 Pro Max", category: "phones", price: 6200000, oldPrice: 6800000, rating: 4.8, reviews: 428, badge: "sale", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80", desc: "A17 Pro chip, titanium design, 48MP camera system, USB-C.", featured: true, trending: true, stock: 8 },
  { id: 3, name: "Xiaomi 14 Pro", category: "phones", price: 2900000, oldPrice: null, rating: 4.7, reviews: 189, badge: "new", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80", desc: "Leica cameras, Snapdragon 8 Gen 3, 4880mAh battery.", featured: false, trending: true, stock: 22 },
  { id: 4, name: "Samsung Galaxy A55", category: "phones", price: 1650000, oldPrice: 1900000, rating: 4.5, reviews: 201, badge: "sale", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80", desc: "50MP OIS camera, 5000mAh, 45W charging, IP67 rated.", featured: true, trending: false, stock: 30 },
  { id: 5, name: "Tecno Camon 30 Pro", category: "phones", price: 980000, oldPrice: null, rating: 4.3, reviews: 95, badge: "new", image: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500&q=80", desc: "50MP front camera, 6.78\" AMOLED, MediaTek Dimensity 7020.", featured: false, trending: true, stock: 45 },
  { id: 6, name: "Infinix Note 40 Pro", category: "phones", price: 720000, oldPrice: 850000, rating: 4.2, reviews: 77, badge: "sale", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", desc: "100W charging, 5000mAh, 108MP camera, 6.78\" AMOLED.", featured: false, trending: false, stock: 50 },

  // LAPTOPS
  { id: 7, name: "MacBook Pro 14\" M3 Pro", category: "laptops", price: 8900000, oldPrice: null, rating: 4.9, reviews: 156, badge: "featured", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", desc: "M3 Pro chip, 18GB RAM, 512GB SSD, Liquid Retina XDR display.", featured: true, trending: true, stock: 6 },
  { id: 8, name: "Dell XPS 15 2024", category: "laptops", price: 6400000, oldPrice: 7100000, rating: 4.7, reviews: 88, badge: "sale", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80", desc: "Intel Core i7-13700H, RTX 4060, 32GB RAM, OLED display.", featured: true, trending: false, stock: 9 },
  { id: 9, name: "HP EliteBook 840 G10", category: "laptops", price: 4200000, oldPrice: null, rating: 4.6, reviews: 112, badge: "new", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80", desc: "Intel Core i5-1335U, 16GB RAM, 512GB SSD, business grade.", featured: false, trending: true, stock: 14 },
  { id: 10, name: "Lenovo IdeaPad Gaming 3", category: "laptops", price: 2800000, oldPrice: 3200000, rating: 4.4, reviews: 203, badge: "sale", image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80", desc: "Ryzen 5 7535HS, RTX 3050, 8GB RAM, 144Hz display.", featured: false, trending: true, stock: 18 },

  // AUDIO
  { id: 11, name: "Sony WH-1000XM5", category: "audio", price: 1100000, oldPrice: 1350000, rating: 4.9, reviews: 542, badge: "sale", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", desc: "Industry-leading noise cancellation, 30-hour battery, multipoint connect.", featured: true, trending: true, stock: 25 },
  { id: 12, name: "JBL Flip 6", category: "audio", price: 420000, oldPrice: 500000, rating: 4.7, reviews: 289, badge: "sale", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80", desc: "Portable waterproof speaker, 12 hours battery, PartyBoost.", featured: false, trending: true, stock: 35 },
  { id: 13, name: "Apple AirPods Pro (2nd Gen)", category: "audio", price: 1450000, oldPrice: null, rating: 4.8, reviews: 341, badge: "featured", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", desc: "ANC, Transparency mode, MagSafe charging case, H2 chip.", featured: true, trending: false, stock: 20 },
  { id: 14, name: "JBL Tune 760NC", category: "audio", price: 380000, oldPrice: 450000, rating: 4.5, reviews: 175, badge: "sale", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80", desc: "ANC, foldable design, 35-hour battery, USB-C charging.", featured: false, trending: true, stock: 40 },

  // TABLETS
  { id: 15, name: "iPad Pro 12.9\" M2", category: "tablets", price: 5200000, oldPrice: null, rating: 4.9, reviews: 198, badge: "featured", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80", desc: "M2 chip, Liquid Retina XDR, 5G, Apple Pencil 2nd gen support.", featured: true, trending: true, stock: 7 },
  { id: 16, name: "Samsung Galaxy Tab S9", category: "tablets", price: 2900000, oldPrice: 3300000, rating: 4.7, reviews: 134, badge: "sale", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80", desc: "Snapdragon 8 Gen 2, Dynamic AMOLED, IP68, S-Pen included.", featured: false, trending: true, stock: 12 },

  // GAMING
  { id: 17, name: "PlayStation 5 Digital", category: "gaming", price: 2600000, oldPrice: null, rating: 4.8, reviews: 367, badge: "hot", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80", desc: "4K gaming, 120fps, SSD storage, backward compatible.", featured: true, trending: true, stock: 5 },
  { id: 18, name: "Xbox Series X", category: "gaming", price: 2800000, oldPrice: null, rating: 4.7, reviews: 218, badge: "featured", image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80", desc: "4K/120fps, 1TB SSD, Game Pass compatible, Quick Resume.", featured: false, trending: false, stock: 4 },
  { id: 19, name: "Razer BlackShark V2 Pro", category: "gaming", price: 590000, oldPrice: 680000, rating: 4.6, reviews: 122, badge: "sale", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&q=80", desc: "Wireless gaming headset, THX Spatial Audio, 24hr battery.", featured: false, trending: true, stock: 22 },

  // ACCESSORIES
  { id: 20, name: "Anker 67W USB-C Charger", category: "accessories", price: 95000, oldPrice: 120000, rating: 4.6, reviews: 445, badge: "sale", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80", desc: "Fast charging 67W, GaN tech, universal compatibility, compact.", featured: false, trending: true, stock: 100 },
  { id: 21, name: "Samsung 25W Wireless Pad", category: "accessories", price: 180000, oldPrice: null, rating: 4.4, reviews: 88, badge: "new", image: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=500&q=80", desc: "Qi wireless charging, 25W fast charge, LED indicator.", featured: false, trending: false, stock: 60 },
  { id: 22, name: "Logitech MX Master 3S", category: "accessories", price: 280000, oldPrice: 320000, rating: 4.8, reviews: 312, badge: "sale", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80", desc: "8K DPI, silent clicks, 70-day battery, multi-device.", featured: false, trending: true, stock: 30 },
];

function loadProducts() {
  const stored = localStorage.getItem('eriecom_products');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  localStorage.setItem('eriecom_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem('eriecom_products', JSON.stringify(products));
}

function getProducts() { return loadProducts(); }
function getFeatured() { return loadProducts().filter(p => p.featured); }
function getTrending() { return loadProducts().filter(p => p.trending); }
function getByCategory(cat) { return loadProducts().filter(p => p.category === cat); }
function getById(id) { return loadProducts().find(p => p.id === parseInt(id)); }

function formatUGX(amount) {
  return 'UGX ' + Number(amount).toLocaleString('en-UG');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<i class="far fa-star"></i>';
  return html;
}

function createProductCard(product, index = 0) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;
  return `
  <div class="product-card" data-id="${product.id}" data-aos="fade-up" data-aos-delay="${(index % 4) * 80}" onclick="viewProduct(${product.id})">
    <div class="product-img-wrap">
      <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80'" />
      ${product.badge ? `<span class="product-badge badge-${product.badge}">${product.badge === 'new' ? 'New' : product.badge === 'sale' ? 'Sale' : product.badge === 'hot' ? '🔥 Hot' : 'Featured'}</span>` : ''}
      <button class="product-wishlist" onclick="toggleWishlist(event, ${product.id})"><i class="far fa-heart"></i></button>
      <button class="product-quick-add" onclick="addToCart(event, ${product.id})"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
    </div>
    <div class="product-info">
      <div class="product-category">${product.category}</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-rating">
        <div class="stars-small">${renderStars(product.rating)}</div>
        <span class="rating-count">(${product.reviews})</span>
      </div>
      <div class="product-price">
        <span class="price-current">${formatUGX(product.price)}</span>
        ${product.oldPrice ? `<span class="price-old">${formatUGX(product.oldPrice)}</span>` : ''}
        ${discount ? `<span class="price-discount">-${discount}%</span>` : ''}
      </div>
    </div>
  </div>`;
}

function viewProduct(id) {
  window.location.href = `pages/product.html?id=${id}`;
}

// Initialize on load
loadProducts();
