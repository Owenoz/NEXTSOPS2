/* =============================================
   ERIECOM GADGETS — PRODUCT DETAIL PAGE JS
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = getById(id);

  if (!product) {
    document.getElementById('productLayout').innerHTML = `
      <div style="text-align:center;padding:80px 20px;grid-column:1/-1;">
        <i class="fas fa-box-open" style="font-size:48px;color:var(--text-muted);margin-bottom:16px;display:block"></i>
        <h2 style="color:#fff;margin-bottom:8px">Product Not Found</h2>
        <p style="color:var(--text-muted);margin-bottom:20px">This product doesn't exist or has been removed.</p>
        <a href="shop.html" class="btn-primary">Browse Shop</a>
      </div>`;
    return;
  }

  // Update page title & breadcrumb
  document.title = `${product.name} — Eriecom Gadgets`;
  document.getElementById('prodBreadcrumb').textContent = product.name;

  // Fallback images (simulate gallery with same image + slight variation)
  const images = [product.image, product.image, product.image];

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const stockStatus = product.stock > 5
    ? `<span class="prod-in-stock"><i class="fas fa-circle"></i> In Stock (${product.stock} units)</span>`
    : product.stock > 0
      ? `<span class="prod-in-stock prod-low-stock"><i class="fas fa-circle"></i> Only ${product.stock} left!</span>`
      : `<span class="prod-in-stock prod-out-stock"><i class="fas fa-circle"></i> Out of Stock</span>`;

  // Generate specs from product data
  const specMap = {
    phones: [
      ['Brand', product.name.split(' ')[0]],
      ['Operating System', product.name.includes('iPhone') ? 'iOS 17' : 'Android 14'],
      ['Storage', '128GB / 256GB / 512GB'],
      ['RAM', '8GB / 12GB'],
      ['Battery', '4500 – 5000mAh'],
      ['Charging', '45W – 100W Fast Charge'],
      ['Display', '6.1" – 6.8" AMOLED'],
      ['5G', 'Yes'],
      ['Warranty', '12 Months'],
    ],
    laptops: [
      ['Brand', product.name.split(' ')[0]],
      ['Processor', product.name.includes('MacBook') ? 'Apple M3 Pro' : 'Intel Core i7 / AMD Ryzen 7'],
      ['RAM', '16GB / 32GB DDR5'],
      ['Storage', '512GB / 1TB NVMe SSD'],
      ['Display', '14" / 15.6" IPS / OLED'],
      ['GPU', product.name.toLowerCase().includes('gaming') ? 'RTX 4060 8GB' : 'Integrated'],
      ['Battery', '6 – 10 Hours'],
      ['OS', product.name.includes('MacBook') ? 'macOS Sonoma' : 'Windows 11 Pro'],
      ['Warranty', '12 Months'],
    ],
    audio: [
      ['Brand', product.name.split(' ')[0]],
      ['Type', product.name.toLowerCase().includes('earbud') || product.name.toLowerCase().includes('airpod') ? 'In-Ear' : 'Over-Ear'],
      ['Connectivity', 'Bluetooth 5.3'],
      ['Battery', '20 – 36 Hours'],
      ['Noise Cancellation', 'Active (ANC)'],
      ['Microphone', 'Built-in'],
      ['Water Resistance', 'IPX4'],
      ['Warranty', '12 Months'],
    ],
    tablets: [
      ['Brand', product.name.split(' ')[0]],
      ['Display', '10.9" – 12.9" Retina'],
      ['Processor', product.name.includes('iPad') ? 'Apple M2' : 'Snapdragon 8 Gen 2'],
      ['Storage', '128GB / 256GB / 512GB'],
      ['RAM', '8GB / 12GB'],
      ['Battery', '7,000 – 10,000mAh'],
      ['Connectivity', 'Wi-Fi 6E / 5G'],
      ['Warranty', '12 Months'],
    ],
    gaming: [
      ['Platform', product.name.includes('PlayStation') ? 'Sony PlayStation' : 'Microsoft Xbox'],
      ['Resolution', '4K UHD'],
      ['Frame Rate', 'Up to 120fps'],
      ['Storage', '1TB SSD'],
      ['Online', 'Online Multiplayer Support'],
      ['Backward Compat.', 'Yes'],
      ['Warranty', '12 Months'],
    ],
    accessories: [
      ['Brand', product.name.split(' ')[0]],
      ['Compatibility', 'Universal – All Devices'],
      ['Output', '67W – 100W'],
      ['Ports', 'USB-C / USB-A'],
      ['Technology', 'GaN / PD / PPS'],
      ['Warranty', '12 Months'],
    ],
  };
  const specs = specMap[product.category] || [['Info', product.desc]];

  const sampleReviews = [
    { name: 'Aisha K.', rating: 5, date: '3 days ago', text: 'Absolutely love this product. Delivery was same day in Kampala. 100% genuine with original packaging. Highly recommend Eriecom!', verified: true },
    { name: 'James O.', rating: 5, date: '1 week ago', text: 'Great product, exactly as described. The customer support team was very helpful when I had questions. Will definitely buy again.', verified: true },
    { name: 'Patricia N.', rating: 4, date: '2 weeks ago', text: 'Very good quality. Only giving 4 stars because delivery took slightly longer than expected outside Kampala. Product itself is perfect.', verified: false },
    { name: 'David M.', rating: 5, date: '3 weeks ago', text: 'Best electronics shop in Uganda! Got mine at a great price and warranty was clearly explained. The product works flawlessly.', verified: true },
  ];

  const layout = document.getElementById('productLayout');
  layout.innerHTML = `
    <div class="product-gallery page-enter">
      <div class="gallery-main">
        <img src="${images[0]}" alt="${product.name}" class="gallery-main-img" id="mainImg" />
        ${product.badge ? `<span class="gallery-badge badge-${product.badge}">${product.badge === 'sale' ? `${discount}% OFF` : product.badge.toUpperCase()}</span>` : ''}
        <button class="gallery-wishlist" id="galleryWishlist" onclick="toggleWishlist(event, ${product.id})"><i class="far fa-heart"></i></button>
      </div>
      <div class="gallery-thumbs">
        ${images.map((img, i) => `
          <div class="thumb ${i === 0 ? 'active' : ''}" onclick="switchThumb(this, '${img}')">
            <img src="${img}" alt="View ${i + 1}" loading="lazy" />
          </div>`).join('')}
      </div>
    </div>

    <div class="product-info-panel page-enter">
      <div class="prod-category">${product.category}</div>
      <h1 class="prod-title">${product.name}</h1>

      <div class="prod-rating-row">
        <div class="prod-stars">${renderStars(product.rating)}</div>
        <span class="prod-rating-num">${product.rating}</span>
        <span class="prod-reviews"><a href="#reviews">${product.reviews} reviews</a></span>
        ${stockStatus}
      </div>

      <div class="prod-price-block">
        <div class="prod-price-main">
          <span class="prod-price-current">${formatUGX(product.price)}</span>
          ${product.oldPrice ? `<span class="prod-price-old">${formatUGX(product.oldPrice)}</span>` : ''}
          ${discount ? `<span class="prod-price-save">Save ${discount}%</span>` : ''}
        </div>
        <p class="prod-price-note"><i class="fas fa-tag"></i> Price includes VAT. Pay via MTN MoMo, Airtel Money, or Card.</p>
      </div>

      <div class="prod-options">
        <div class="option-label">Color: <span id="selectedColor">Phantom Black</span></div>
        <div class="color-options">
          <div class="color-swatch active" style="background:#111" title="Phantom Black" onclick="selectColor(this, 'Phantom Black')"></div>
          <div class="color-swatch" style="background:#e8e8e8" title="Arctic White" onclick="selectColor(this, 'Arctic White')"></div>
          <div class="color-swatch" style="background:#6c3bff" title="Violet" onclick="selectColor(this, 'Violet')"></div>
          <div class="color-swatch" style="background:#00d4aa" title="Mint" onclick="selectColor(this, 'Mint')"></div>
        </div>
      </div>

      <div class="qty-row">
        <div class="option-label" style="margin-bottom:0">Quantity:</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(-1)"><i class="fas fa-minus"></i></button>
          <span class="qty-num" id="qtyNum">1</span>
          <button class="qty-btn" onclick="changeQty(1)"><i class="fas fa-plus"></i></button>
        </div>
        <span style="font-size:13px;color:var(--text-muted)">Max: ${Math.min(product.stock, 10)} per order</span>
      </div>

      <div class="prod-cta">
        <button class="btn-add-cart" onclick="addToCartProduct()">
          <i class="fas fa-shopping-bag"></i> Add to Cart
        </button>
        <button class="btn-buy-now" onclick="buyNow()">
          <i class="fas fa-bolt"></i> Buy Now
        </button>
      </div>

      <div class="guarantee-strip">
        <div class="guarantee-item"><i class="fas fa-certificate"></i> 100% Genuine</div>
        <div class="guarantee-item"><i class="fas fa-rotate-left"></i> 14-Day Returns</div>
        <div class="guarantee-item"><i class="fas fa-shield-alt"></i> 12M Warranty</div>
        <div class="guarantee-item"><i class="fas fa-lock"></i> Secure Payment</div>
      </div>

      <div class="delivery-info">
        <div class="delivery-row">
          <i class="fas fa-truck-fast"></i>
          <div><strong>Kampala Same-Day</strong> <span>— Order before 2pm for delivery today</span></div>
        </div>
        <div class="delivery-row">
          <i class="fas fa-map-marker-alt"></i>
          <div><strong>Nationwide 2–3 Days</strong> <span>— All major towns in Uganda</span></div>
        </div>
        <div class="delivery-row">
          <i class="fas fa-store"></i>
          <div><strong>Free Pickup</strong> <span>— Kampala Road store, Mon–Sat 8am–8pm</span></div>
        </div>
      </div>

      <div class="prod-tabs" id="reviews">
        <div class="tab-nav">
          <button class="tab-btn active" onclick="switchTab(this,'desc')">Description</button>
          <button class="tab-btn" onclick="switchTab(this,'specs')">Specifications</button>
          <button class="tab-btn" onclick="switchTab(this,'reviews')">Reviews (${product.reviews})</button>
        </div>

        <div class="tab-panel active" id="tab-desc">
          <p style="font-size:15px;color:var(--text-muted);line-height:1.8;margin-bottom:16px">${product.desc}</p>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8">
            All products at Eriecom Gadgets are 100% genuine and sourced directly from authorized distributors.
            Each unit comes with official manufacturer warranty, full accessories in original packaging,
            and our own 12-month store warranty for added peace of mind.
          </p>
        </div>

        <div class="tab-panel" id="tab-specs">
          <table class="specs-table">
            ${specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
          </table>
        </div>

        <div class="tab-panel" id="tab-reviews">
          <div class="reviews-summary">
            <div class="review-score">
              <div class="big-num">${product.rating}</div>
              <div class="big-stars">${renderStars(product.rating)}</div>
              <p>${product.reviews} verified reviews</p>
            </div>
            <div class="review-bars">
              ${[5,4,3,2,1].map(s => {
                const pct = s === 5 ? 70 : s === 4 ? 20 : s === 3 ? 6 : s === 2 ? 2 : 2;
                return `<div class="review-bar-row">
                  <span>${s}★</span>
                  <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
                  <span>${pct}%</span>
                </div>`;
              }).join('')}
            </div>
          </div>
          ${sampleReviews.map(r => `
            <div class="review-item">
              <div class="review-header">
                <div class="review-avatar">${r.name.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div class="review-name">${r.name}</div>
                  <div class="review-stars">${renderStars(r.rating)}</div>
                </div>
                ${r.verified ? `<span class="verified-badge"><i class="fas fa-check"></i> Verified</span>` : ''}
                <span class="review-date">${r.date}</span>
              </div>
              <p class="review-text">${r.text}</p>
            </div>`).join('')}
        </div>
      </div>
    </div>`;

  // Load related products
  const related = getProducts().filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const relEl = document.getElementById('relatedProducts');
  if (relEl) relEl.innerHTML = related.map((p, i) => createProductCard(p, i)).join('');

  // AOS on related
  setTimeout(() => {
    document.querySelectorAll('[data-aos]').forEach(el => {
      setTimeout(() => el.classList.add('aos-animate'), parseInt(el.dataset.aosDelay || 0));
    });
  }, 300);

  // Quantity state
  let qty = 1;
  const maxQty = Math.min(product.stock, 10);

  window.changeQty = (delta) => {
    qty = Math.max(1, Math.min(maxQty, qty + delta));
    document.getElementById('qtyNum').textContent = qty;
  };

  window.selectColor = (el, name) => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('selectedColor').textContent = name;
  };

  window.switchThumb = (el, src) => {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const mainImg = document.getElementById('mainImg');
    mainImg.style.opacity = '0';
    mainImg.style.transform = 'scale(0.97)';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 150);
    mainImg.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  };

  window.switchTab = (btn, tabId) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tabId}`)?.classList.add('active');
  };

  window.addToCartProduct = () => {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.qty += qty;
    else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty, category: product.category });
    saveCart(cart);
    showToast(`<i class="fas fa-check-circle" style="color:#10b981"></i> ${qty}× ${product.name} added to cart!`, 'success');
  };

  window.buyNow = () => {
    addToCartProduct();
    window.location.href = 'cart.html';
  };

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
    btt?.classList.toggle('show', window.scrollY > 400);
  });
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Hamburger
  const ham = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (ham && mobileMenu) {
    ham.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = ham.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  }

  // Search
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => { searchOverlay.classList.add('active'); setTimeout(() => searchInput?.focus(), 200); });
    document.getElementById('closeSearch')?.addEventListener('click', () => searchOverlay.classList.remove('active'));
    document.getElementById('searchBtn')?.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (q) window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
    });
  }
});
