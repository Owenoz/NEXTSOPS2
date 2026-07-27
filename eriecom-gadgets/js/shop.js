/* =============================================
   ERIECOM GADGETS — SHOP PAGE LOGIC
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

  let allProducts = getProducts();
  let filtered = [...allProducts];
  let currentPage = 1;
  const PER_PAGE = 12;
  let isListView = false;

  /* ---- READ URL PARAMS ---- */
  const params = new URLSearchParams(window.location.search);
  const urlCat = params.get('cat') || 'all';
  const urlSearch = params.get('search') || '';

  // Set category radio
  const catRadio = document.querySelector(`input[name="cat"][value="${urlCat}"]`);
  if (catRadio) catRadio.checked = true;

  // Update page title/desc
  const catLabels = { all: 'All Products', phones: 'Smartphones', laptops: 'Laptops', audio: 'Audio & Sound', tablets: 'Tablets', gaming: 'Gaming', accessories: 'Accessories' };
  const titleEl = document.getElementById('shopTitle');
  const descEl = document.getElementById('shopDesc');
  const breadEl = document.getElementById('breadcrumbLabel');
  if (urlSearch) {
    if (titleEl) titleEl.textContent = `Search: "${urlSearch}"`;
    if (descEl) descEl.textContent = `Results for "${urlSearch}"`;
    if (breadEl) breadEl.textContent = `Search`;
  } else if (urlCat !== 'all') {
    if (titleEl) titleEl.textContent = catLabels[urlCat] || urlCat;
    if (descEl) descEl.textContent = `Explore our ${catLabels[urlCat]} collection`;
    if (breadEl) breadEl.textContent = catLabels[urlCat] || urlCat;
  }

  /* ---- FILTER & SORT LOGIC ---- */
  function applyFilters() {
    const cat = document.querySelector('input[name="cat"]:checked')?.value || 'all';
    const rating = parseFloat(document.querySelector('input[name="rating"]:checked')?.value || '0');
    const maxPrice = parseInt(document.getElementById('priceSlider').value);
    const minPriceInput = parseInt(document.getElementById('minPrice').value) || 0;
    const inStock = document.getElementById('inStockOnly').checked;
    const sort = document.getElementById('sortSelect').value;
    const search = urlSearch.toLowerCase();

    filtered = allProducts.filter(p => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (p.rating < rating) return false;
      if (p.price > maxPrice) return false;
      if (p.price < minPriceInput) return false;
      if (inStock && p.stock <= 0) return false;
      if (search && !p.name.toLowerCase().includes(search) && !p.category.toLowerCase().includes(search)) return false;
      return true;
    });

    // Sort
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);

    currentPage = 1;
    renderProducts();
    renderActiveFilters(cat, rating, maxPrice);
  }

  function renderProducts() {
    const grid = document.getElementById('shopProducts');
    const noRes = document.getElementById('noResults');
    const loadMoreWrap = document.getElementById('loadMoreWrap');
    const countEl = document.getElementById('resultCount');
    if (!grid) return;

    const slice = filtered.slice(0, currentPage * PER_PAGE);
    countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      grid.innerHTML = '';
      noRes.classList.remove('hidden');
      loadMoreWrap.style.display = 'none';
      return;
    }
    noRes.classList.add('hidden');
    grid.innerHTML = slice.map((p, i) => createShopCard(p, i)).join('');

    // AOS trigger
    setTimeout(() => {
      grid.querySelectorAll('[data-aos]').forEach(el => {
        setTimeout(() => el.classList.add('aos-animate'), parseInt(el.dataset.aosDelay || 0));
      });
    }, 50);

    loadMoreWrap.style.display = filtered.length > slice.length ? 'block' : 'none';
    if (isListView) grid.classList.add('list-view');
  }

  function createShopCard(product, index) {
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
    return `
    <div class="product-card" data-id="${product.id}" data-aos="fade-up" data-aos-delay="${(index % 4) * 60}" onclick="viewProduct(${product.id})">
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80'" />
        ${product.badge ? `<span class="product-badge badge-${product.badge}">${product.badge === 'new' ? 'New' : product.badge === 'sale' ? 'Sale' : product.badge === 'hot' ? '🔥 Hot' : 'Featured'}</span>` : ''}
        ${product.stock <= 3 && product.stock > 0 ? `<span class="product-badge badge-hot" style="top:40px">Only ${product.stock} left</span>` : ''}
        <button class="product-wishlist" onclick="toggleWishlist(event,${product.id})"><i class="far fa-heart"></i></button>
        <button class="product-quick-add" onclick="addToCart(event,${product.id})"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-desc-preview">${product.desc}</div>
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

  function renderActiveFilters(cat, rating, maxPrice) {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    let chips = '';
    if (cat !== 'all') chips += `<div class="filter-chip">${cat} <button onclick="removeCatFilter()">×</button></div>`;
    if (rating > 0) chips += `<div class="filter-chip">★ ${rating}+ <button onclick="removeRatingFilter()">×</button></div>`;
    if (maxPrice < 10000000) chips += `<div class="filter-chip">Max ${formatUGX(maxPrice)} <button onclick="removeMaxPrice()">×</button></div>`;
    if (urlSearch) chips += `<div class="filter-chip">Search: "${urlSearch}" <button onclick="window.location.href='shop.html'">×</button></div>`;
    container.innerHTML = chips;
  }

  window.removeCatFilter = () => { document.querySelector('input[name="cat"][value="all"]').checked = true; applyFilters(); };
  window.removeRatingFilter = () => { document.querySelector('input[name="rating"][value="0"]').checked = true; applyFilters(); };
  window.removeMaxPrice = () => { document.getElementById('priceSlider').value = 10000000; applyFilters(); };
  window.resetFilters = () => { removeCatFilter(); removeRatingFilter(); removeMaxPrice(); };
  window.viewProduct = (id) => { window.location.href = `product.html?id=${id}`; };

  /* ---- PRICE SLIDER ---- */
  const slider = document.getElementById('priceSlider');
  const priceDisplay = document.getElementById('priceDisplay');
  if (slider) {
    slider.addEventListener('input', () => {
      const val = parseInt(slider.value);
      priceDisplay.textContent = formatUGX(val);
      document.getElementById('maxPrice').value = val;
    });
  }

  /* ---- EVENT LISTENERS ---- */
  document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    document.querySelector('input[name="cat"][value="all"]').checked = true;
    document.querySelector('input[name="rating"][value="0"]').checked = true;
    if (slider) { slider.value = 10000000; priceDisplay.textContent = 'UGX 10,000,000'; }
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('inStockOnly').checked = false;
    applyFilters();
  });
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);

  document.querySelectorAll('input[name="cat"]').forEach(r => r.addEventListener('change', applyFilters));
  document.querySelectorAll('input[name="rating"]').forEach(r => r.addEventListener('change', applyFilters));

  document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    currentPage++;
    renderProducts();
  });

  // View toggle
  document.getElementById('gridView')?.addEventListener('click', function() {
    isListView = false;
    this.classList.add('active');
    document.getElementById('listView').classList.remove('active');
    document.getElementById('shopProducts').classList.remove('list-view');
  });
  document.getElementById('listView')?.addEventListener('click', function() {
    isListView = true;
    this.classList.add('active');
    document.getElementById('gridView').classList.remove('active');
    document.getElementById('shopProducts').classList.add('list-view');
  });

  // Mobile filter toggle
  const sidebar = document.getElementById('shopSidebar');
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  document.getElementById('mobileFilterBtn')?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  // Navbar scroll + back to top
  const navbar = document.getElementById('navbar');
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (btt) btt.classList.toggle('show', window.scrollY > 400);
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
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // Search overlay
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
    searchInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const q = searchInput.value.trim(); if (q) window.location.href = `shop.html?search=${encodeURIComponent(q)}`; }
    });
  }

  /* ---- INITIAL RENDER ---- */
  applyFilters();
});
