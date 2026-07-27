/* =============================================
   ERIECOM GADGETS — ADMIN DASHBOARD v3
   Panels: Overview · Products · Inventory · Categories · Orders · Settings
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ── AUTH GUARD ─────────────────────────────── */
  if (!isAdminLoggedIn()) { window.location.href = 'login.html'; return; }

  /* ── USER INFO ──────────────────────────────── */
  const user = getAdminUser();
  if (user) {
    const n = document.getElementById('adminDisplayName');
    const r = document.getElementById('adminDisplayRole');
    const a = document.getElementById('adminAvatarLetters');
    if (n) n.textContent = user.name || 'Admin';
    if (r) r.innerHTML = `<i class="fas fa-circle" style="font-size:6px"></i> ${user.role || 'Admin'}`;
    if (a) a.textContent = (user.name || 'AD').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  /* ── CONSTANTS ──────────────────────────────── */
  const CAT_LABELS = {
    phones:'Smartphones', laptops:'Laptops', audio:'Audio',
    tablets:'Tablets', gaming:'Gaming', accessories:'Accessories'
  };
  const CAT_ICONS = {
    phones:'fa-mobile-alt', laptops:'fa-laptop', audio:'fa-headphones-alt',
    tablets:'fa-tablet-alt', gaming:'fa-gamepad', accessories:'fa-plug'
  };
  const ALL_CATS = ['phones','laptops','audio','tablets','gaming','accessories'];

  /* ── HELPERS ────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const getGreeting = () => { const h = new Date().getHours(); return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'; };
  const todayStr = () => new Date().toLocaleDateString('en-UG', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const stockClass = s => s > 10 ? 'in-stock' : s > 0 ? 'low-stock' : 'out-stock';
  const stockLabel = s => s > 0 ? `${s} units` : 'Out of stock';
  const discountPct = (price, old) => (old && old > price) ? Math.round((1 - price / old) * 100) : null;
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /* ── SIDEBAR COUNT ──────────────────────────── */
  function refreshCount() {
    const el = $('sidebarProdCount');
    if (el) el.textContent = getProducts().length;
  }
  refreshCount();


  /* ── MOBILE SIDEBAR TOGGLE ──────────────────── */
  const sidebar = $('adminSidebar');
  const overlay = $('sidebarOverlay');
  const toggler = $('sidebarToggle');
  const openSidebar  = () => { sidebar?.classList.add('open');    overlay?.classList.add('show'); };
  const closeSidebar = () => { sidebar?.classList.remove('open'); overlay?.classList.remove('show'); };
  toggler?.addEventListener('click', () => sidebar?.classList.contains('open') ? closeSidebar() : openSidebar());
  overlay?.addEventListener('click', closeSidebar);

  /* ── TOPBAR SEARCH ──────────────────────────── */
  $('topbarSearch')?.addEventListener('input', function () {
    const q = this.value.trim();
    if (!q) return;
    if (window.currentPanel !== 'products') showPanel('products');
    setTimeout(() => {
      const ts = $('tableSearch');
      if (ts) { ts.value = q; renderProductsTable(q); }
    }, 80);
  });

  /* ── ESCAPE KEY CLOSES MODALS ───────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeProductForm(); closeDeleteConfirm(); }
  });

  /* ── CLOSE MODALS ON BACKDROP CLICK ────────── */
  $('productFormOverlay')?.addEventListener('click', function (e) {
    if (e.target === this) closeProductForm();
  });
  $('deleteConfirmOverlay')?.addEventListener('click', function (e) {
    if (e.target === this) closeDeleteConfirm();
  });

  /* ════════════════════════════════════════════
     PANEL ROUTER
  ════════════════════════════════════════════ */
  window.currentPanel = 'overview';

  window.showPanel = function (panel) {
    window.currentPanel = panel;
    document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
    const active = document.getElementById('nav-' + panel);
    if (active) active.classList.add('active');
    const titles = { overview:'Overview', products:'Products', inventory:'Inventory', categories:'Categories', orders:'Orders', settings:'Settings' };
    const tb = $('topbarTitle');
    if (tb) tb.textContent = titles[panel] || 'Dashboard';
    closeSidebar();
    const content = $('adminContent');
    if (!content) return;
    content.innerHTML = '<div class="admin-loading"><div class="loader"></div><p>Loading...</p></div>';
    setTimeout(() => {
      if (panel === 'overview')    renderOverview(content);
      else if (panel === 'products')   renderProducts(content);
      else if (panel === 'inventory')  renderInventory(content);
      else if (panel === 'categories') renderCategories(content);
      else if (panel === 'orders')     renderOrders(content);
      else if (panel === 'settings')   renderSettings(content);
    }, 60);
  };

  showPanel('overview');


  /* ════════════════════════════════════════════
     OVERVIEW PANEL
  ════════════════════════════════════════════ */
  function renderOverview(c) {
    const prods    = getProducts();
    const inStock  = prods.filter(p => p.stock > 0).length;
    const outStock = prods.length - inStock;
    const featured = prods.filter(p => p.featured).length;
    const trending = prods.filter(p => p.trending).length;
    const totalVal = prods.reduce((s, p) => s + p.price, 0);
    const lowStock = prods.filter(p => p.stock > 0 && p.stock <= 5).length;

    c.innerHTML = `
    <div class="admin-panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Good ${getGreeting()}, ${(user?.name||'Admin').split(' ')[0]} 👋</div>
          <div class="panel-subtitle">${todayStr()}</div>
        </div>
        <button class="topbar-add-btn" onclick="openProductForm(null)">
          <i class="fas fa-plus"></i><span>Add Product</span>
        </button>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-card-label">Total Products</span><div class="stat-card-icon icon-purple"><i class="fas fa-box-open"></i></div></div>
          <div class="stat-card-value">${prods.length}</div>
          <div class="stat-card-change neutral"><i class="fas fa-layer-group"></i> Across ${ALL_CATS.length} categories</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-card-label">In Stock</span><div class="stat-card-icon icon-green"><i class="fas fa-check-circle"></i></div></div>
          <div class="stat-card-value">${inStock}</div>
          <div class="stat-card-change ${outStock > 0 ? 'up' : 'neutral'}"><i class="fas fa-exclamation-triangle"></i> ${outStock} out of stock</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-card-label">Featured / Trending</span><div class="stat-card-icon icon-orange"><i class="fas fa-fire"></i></div></div>
          <div class="stat-card-value">${featured}</div>
          <div class="stat-card-change neutral"><i class="fas fa-chart-line"></i> ${trending} trending · ${featured} featured</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-card-label">Catalogue Value</span><div class="stat-card-icon icon-blue"><i class="fas fa-coins"></i></div></div>
          <div class="stat-card-value" style="font-size:17px">${formatUGX(totalVal)}</div>
          <div class="stat-card-change ${lowStock > 0 ? 'up' : 'neutral'}"><i class="fas fa-exclamation-circle"></i> ${lowStock} items low stock</div>
        </div>
      </div>
      <div class="overview-two-col">
        <div class="overview-card">
          <div class="overview-card-title"><i class="fas fa-layer-group" style="color:var(--primary-light)"></i> Products by Category</div>
          ${renderCategoryBreakdown(prods)}
        </div>
        <div class="overview-card">
          <div class="overview-card-title"><i class="fas fa-clock" style="color:var(--accent)"></i> Recently Added</div>
          ${renderRecentList(prods)}
        </div>
      </div>
      <div class="overview-card" style="margin-top:0">
        <div class="overview-card-title"><i class="fas fa-bolt" style="color:var(--warning)"></i> Quick Actions</div>
        <div class="quick-actions-row">
          <button class="topbar-add-btn" onclick="openProductForm(null)"><i class="fas fa-plus"></i><span>Add Product</span></button>
          <button class="btn-secondary" style="font-size:13px;padding:9px 16px" onclick="showPanel('products')"><i class="fas fa-list"></i> View All Products</button>
          <button class="btn-secondary" style="font-size:13px;padding:9px 16px" onclick="showPanel('inventory')"><i class="fas fa-warehouse"></i> Check Inventory</button>
          <button class="btn-secondary" style="font-size:13px;padding:9px 16px" onclick="showPanel('settings')"><i class="fas fa-cog"></i> Site Settings</button>
          <a href="../index.html" target="_blank" class="btn-secondary" style="font-size:13px;padding:9px 16px;display:inline-flex;align-items:center;gap:7px"><i class="fas fa-store"></i> View Live Store</a>
        </div>
      </div>
    </div>`;
  }

  function renderCategoryBreakdown(prods) {
    const counts = {};
    prods.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return ALL_CATS.map(cat => {
      const n   = counts[cat] || 0;
      const pct = prods.length ? Math.round(n / prods.length * 100) : 0;
      return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <i class="fas ${CAT_ICONS[cat]}" style="width:18px;font-size:13px;color:var(--primary-light);flex-shrink:0"></i>
        <span style="font-size:13px;color:var(--text-muted);width:110px;flex-shrink:0;text-transform:capitalize">${CAT_LABELS[cat]}</span>
        <div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:var(--gradient);border-radius:3px;transition:width 1s ease"></div>
        </div>
        <span style="font-size:12px;color:#fff;font-weight:700;min-width:22px;text-align:right">${n}</span>
      </div>`;
    }).join('');
  }

  function renderRecentList(prods) {
    return [...prods].sort((a, b) => b.id - a.id).slice(0, 6).map(p => `
    <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)">
      <img src="${esc(p.image)}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;border:1px solid var(--border);flex-shrink:0"
        onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&q=60'" />
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.name)}</div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:capitalize">${p.category}</div>
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--primary-light);white-space:nowrap">${formatUGX(p.price)}</div>
      <button class="tbl-btn tbl-edit" onclick="openProductForm(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
    </div>`).join('');
  }


  /* ════════════════════════════════════════════
     PRODUCTS PANEL
  ════════════════════════════════════════════ */
  function renderProducts(c) {
    c.innerHTML = `
    <div class="admin-panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Products</div>
          <div class="panel-subtitle" id="prodPanelSubtitle">All products in your store</div>
        </div>
        <button class="topbar-add-btn" onclick="openProductForm(null)"><i class="fas fa-plus"></i><span>Add Product</span></button>
      </div>
      <div class="products-table-wrap">
        <div class="table-toolbar">
          <div class="table-search">
            <i class="fas fa-search"></i>
            <input type="text" id="tableSearch" placeholder="Search by name…" oninput="renderProductsTable(this.value)" autocomplete="off" />
          </div>
          <select class="table-filter-select" id="tableCatFilter" onchange="renderProductsTable($('tableSearch')?.value||'')">
            <option value="">All Categories</option>
            ${ALL_CATS.map(c => `<option value="${c}">${CAT_LABELS[c]}</option>`).join('')}
          </select>
          <select class="table-filter-select" id="tableBadgeFilter" onchange="renderProductsTable($('tableSearch')?.value||'')">
            <option value="">All Badges</option>
            <option value="new">New</option>
            <option value="sale">Sale</option>
            <option value="hot">Hot</option>
            <option value="featured">Featured</option>
          </select>
          <div class="table-count-badge" id="tableBadgeCount">Showing <strong>0</strong> products</div>
        </div>
        <div id="productsTableBody"></div>
      </div>
    </div>`;
    renderProductsTable('');
  }

  window.renderProductsTable = function (search = '') {
    const catFilter   = $('tableCatFilter')?.value   || '';
    const badgeFilter = $('tableBadgeFilter')?.value || '';
    const q = (search || '').toLowerCase();
    let products = getProducts().filter(p => {
      if (catFilter   && p.category !== catFilter)  return false;
      if (badgeFilter && p.badge    !== badgeFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      return true;
    });

    const countEl = $('tableBadgeCount');
    if (countEl) countEl.innerHTML = `Showing <strong>${products.length}</strong> product${products.length !== 1 ? 's' : ''}`;

    const tbody = $('productsTableBody');
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = `<div class="empty-table"><i class="fas fa-box-open"></i><p>No products match your filters.</p>
        <button class="btn-secondary" style="font-size:13px;padding:8px 16px"
          onclick="document.getElementById('tableSearch').value='';document.getElementById('tableCatFilter').value='';document.getElementById('tableBadgeFilter').value='';renderProductsTable('')">
          Clear Filters</button></div>`;
      return;
    }

    tbody.innerHTML = `<div style="overflow-x:auto"><table class="products-table">
      <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Badge</th><th>Visibility</th><th style="text-align:center">Actions</th></tr></thead>
      <tbody>${products.map(p => {
        const disc = discountPct(p.price, p.oldPrice);
        const sClass = stockClass(p.stock);
        return `<tr>
          <td style="min-width:200px">
            <div style="display:flex;align-items:center;gap:12px">
              <img src="${esc(p.image)}" class="table-prod-img" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&q=60'" />
              <div><div class="table-prod-name">${esc(p.name)}</div><div class="table-prod-subtext">${esc(p.desc.slice(0, 55))}…</div></div>
            </div>
          </td>
          <td style="white-space:nowrap"><span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)"><i class="fas ${CAT_ICONS[p.category]}" style="color:var(--primary-light)"></i>${CAT_LABELS[p.category] || p.category}</span></td>
          <td><div class="table-price">${formatUGX(p.price)}</div>${p.oldPrice ? `<div class="table-price-old">${formatUGX(p.oldPrice)}</div>` : ''}${disc ? `<div style="font-size:10px;color:var(--success);font-weight:700">-${disc}% OFF</div>` : ''}</td>
          <td><span class="table-stock ${sClass}">${stockLabel(p.stock)}</span></td>
          <td>${p.badge ? `<span class="table-badge badge-${p.badge}">${p.badge.toUpperCase()}</span>` : '<span style="color:var(--text-muted);font-size:12px">—</span>'}</td>
          <td><div style="display:flex;flex-direction:column;gap:3px">${p.featured ? `<span style="font-size:10px;color:var(--primary-light)"><i class="fas fa-star"></i> Featured</span>` : ''}${p.trending ? `<span style="font-size:10px;color:var(--accent)"><i class="fas fa-fire"></i> Trending</span>` : ''}${!p.featured && !p.trending ? '<span style="font-size:11px;color:var(--text-muted)">Standard</span>' : ''}</div></td>
          <td style="text-align:center"><div class="table-actions" style="justify-content:center">
            <button class="tbl-btn tbl-view" title="Preview" onclick="window.open('../pages/product.html?id=${p.id}','_blank')"><i class="fas fa-eye"></i></button>
            <button class="tbl-btn tbl-edit" title="Edit" onclick="openProductForm(${p.id})"><i class="fas fa-edit"></i></button>
            <button class="tbl-btn tbl-delete" title="Delete" onclick="openDeleteConfirm(${p.id})"><i class="fas fa-trash"></i></button>
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>`;
  };


  /* ════════════════════════════════════════════
     INVENTORY PANEL
  ════════════════════════════════════════════ */
  function renderInventory(c) {
    const prods   = getProducts();
    const outList = prods.filter(p => p.stock === 0);
    const lowList = prods.filter(p => p.stock > 0 && p.stock <= 5);
    const okList  = prods.filter(p => p.stock > 5);

    c.innerHTML = `<div class="admin-panel">
      <div class="panel-header"><div><div class="panel-title">Inventory</div><div class="panel-subtitle">Track stock levels across all products</div></div></div>
      <div class="stats-grid" style="margin-bottom:28px">
        <div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Healthy Stock</span><div class="stat-card-icon icon-green"><i class="fas fa-check-circle"></i></div></div><div class="stat-card-value">${okList.length}</div><div class="stat-card-change up"><i class="fas fa-arrow-up"></i> Stock &gt; 5 units</div></div>
        <div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Low Stock</span><div class="stat-card-icon icon-yellow"><i class="fas fa-exclamation-triangle"></i></div></div><div class="stat-card-value">${lowList.length}</div><div class="stat-card-change ${lowList.length > 0 ? 'up' : 'neutral'}"><i class="fas fa-clock"></i> 1–5 units remaining</div></div>
        <div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Out of Stock</span><div class="stat-card-icon icon-orange"><i class="fas fa-times-circle"></i></div></div><div class="stat-card-value">${outList.length}</div><div class="stat-card-change ${outList.length > 0 ? 'up' : 'neutral'}"><i class="fas fa-box"></i> Need restocking</div></div>
        <div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Total Units</span><div class="stat-card-icon icon-blue"><i class="fas fa-warehouse"></i></div></div><div class="stat-card-value">${prods.reduce((s,p) => s + p.stock, 0)}</div><div class="stat-card-change neutral"><i class="fas fa-boxes"></i> Combined inventory</div></div>
      </div>
      ${lowList.length > 0 || outList.length > 0 ? `<div class="overview-card" style="margin-bottom:20px;border-color:rgba(245,158,11,0.3)">
        <div class="overview-card-title" style="color:var(--warning)"><i class="fas fa-exclamation-triangle"></i> Needs Attention (${lowList.length + outList.length} items)</div>
        <div class="inventory-grid">${[...outList, ...lowList].map(p => invCard(p)).join('')}</div></div>` : ''}
      <div class="overview-card"><div class="overview-card-title"><i class="fas fa-boxes" style="color:var(--success)"></i> All Products — Stock Overview</div>
        <div class="inventory-grid">${prods.map(p => invCard(p)).join('')}</div>
      </div>
    </div>`;
  }

  function invCard(p) {
    const max  = Math.max(p.stock, 30);
    const pct  = Math.min(100, Math.round((p.stock / max) * 100));
    const cls  = stockClass(p.stock);
    const clr  = cls === 'in-stock' ? 'var(--success)' : cls === 'low-stock' ? 'var(--warning)' : 'var(--error)';
    const badgeBg = cls === 'in-stock' ? 'rgba(16,185,129,0.12)' : cls === 'low-stock' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
    return `<div class="inventory-card">
      <div class="inv-header"><div class="inv-name" title="${esc(p.name)}">${esc(p.name)}</div><span class="inv-stock-badge" style="color:${clr};background:${badgeBg}">${stockLabel(p.stock)}</span></div>
      <div class="inv-progress"><div class="inv-progress-fill" style="width:${pct}%;background:${clr}"></div></div>
      <div class="inv-meta"><span style="text-transform:capitalize;color:var(--text-muted)">${p.category}</span>
        <button onclick="openProductForm(${p.id})" style="font-size:11px;color:var(--primary-light);background:none;border:none;cursor:pointer;font-family:var(--font)">Edit stock →</button></div>
    </div>`;
  }


  /* ════════════════════════════════════════════
     CATEGORIES PANEL
  ════════════════════════════════════════════ */
  function renderCategories(c) {
    const prods = getProducts();
    c.innerHTML = `<div class="admin-panel">
      <div class="panel-header"><div><div class="panel-title">Categories</div><div class="panel-subtitle">Overview of all product categories</div></div></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
        ${ALL_CATS.map(cat => {
          const list    = prods.filter(p => p.category === cat);
          const inS     = list.filter(p => p.stock > 0).length;
          const outS    = list.length - inS;
          const avgP    = list.length ? Math.round(list.reduce((s,p) => s + p.price, 0) / list.length) : 0;
          const featCnt = list.filter(p => p.featured).length;
          const pct     = list.length ? Math.round(inS / list.length * 100) : 0;
          return `<div class="overview-card" style="cursor:default;transition:all var(--transition)"
            onmouseover="this.style.borderColor='rgba(108,59,255,0.4)'" onmouseout="this.style.borderColor='var(--border)'">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
              <div style="width:50px;height:50px;border-radius:14px;background:rgba(108,59,255,0.12);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--primary-light)"><i class="fas ${CAT_ICONS[cat]}"></i></div>
              <div><div style="font-size:17px;font-weight:800;color:#fff;font-family:var(--font-display)">${CAT_LABELS[cat]}</div><div style="font-size:12px;color:var(--text-muted)">${list.length} products</div></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
              <div style="background:var(--dark3);border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">In Stock</div><div style="font-size:18px;font-weight:800;color:var(--success)">${inS}</div></div>
              <div style="background:var(--dark3);border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Out of Stock</div><div style="font-size:18px;font-weight:800;color:${outS>0?'var(--error)':'var(--text-muted)'}">${outS}</div></div>
              <div style="background:var(--dark3);border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Avg Price</div><div style="font-size:12px;font-weight:700;color:#fff">${formatUGX(avgP)}</div></div>
              <div style="background:var(--dark3);border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Featured</div><div style="font-size:18px;font-weight:800;color:var(--warning)">${featCnt}</div></div>
            </div>
            <div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:5px"><span>Stock health</span><span>${pct}%</span></div>
              <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden"><div style="width:${pct}%;height:100%;background:var(--gradient);border-radius:3px;transition:width 1s ease"></div></div>
            </div>
            <button onclick="showPanel('products');setTimeout(()=>{document.getElementById('tableCatFilter').value='${cat}';renderProductsTable('');},80)"
              style="width:100%;background:rgba(108,59,255,0.1);border:1px solid rgba(108,59,255,0.2);color:var(--primary-light);padding:8px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font);transition:all var(--transition)"
              onmouseover="this.style.background='var(--primary)';this.style.color='#fff'"
              onmouseout="this.style.background='rgba(108,59,255,0.1)';this.style.color='var(--primary-light)'">View Products →</button>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  /* ════════════════════════════════════════════
     ORDERS PANEL
  ════════════════════════════════════════════ */
  function renderOrders(c) {
    c.innerHTML = `<div class="admin-panel">
      <div class="panel-header"><div><div class="panel-title">Orders</div><div class="panel-subtitle">Customer orders and fulfilment</div></div></div>
      <div class="overview-card" style="text-align:center;padding:60px 40px">
        <div style="width:80px;height:80px;border-radius:50%;background:rgba(108,59,255,0.1);border:2px solid rgba(108,59,255,0.2);display:flex;align-items:center;justify-content:center;font-size:36px;color:var(--primary-light);margin:0 auto 20px"><i class="fas fa-shopping-cart"></i></div>
        <h3 style="font-family:var(--font-display);font-size:22px;font-weight:800;color:#fff;margin-bottom:10px">Orders Coming Soon</h3>
        <p style="color:var(--text-muted);max-width:460px;margin:0 auto 24px;font-size:14px;line-height:1.8">Full order management — including real-time tracking, status updates, customer messaging and invoice generation — will be available once a backend is connected.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="../pages/cart.html" target="_blank" class="btn-secondary" style="font-size:13px;padding:10px 20px;display:inline-flex;align-items:center;gap:8px"><i class="fas fa-eye"></i> Preview Cart Page</a>
          <a href="../index.html" target="_blank" class="btn-secondary" style="font-size:13px;padding:10px 20px;display:inline-flex;align-items:center;gap:8px"><i class="fas fa-store"></i> View Live Store</a>
        </div>
      </div>
    </div>`;
  }


  /* ════════════════════════════════════════════
     SETTINGS PANEL
  ════════════════════════════════════════════ */
  function renderSettings(c) {
    const s = loadSettings();
    c.innerHTML = `<div class="admin-panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Site Settings</div>
          <div class="panel-subtitle">Control every part of your store — changes apply instantly</div>
        </div>
        <button class="topbar-add-btn" onclick="saveAllSettings()"><i class="fas fa-save"></i><span>Save All</span></button>
      </div>

      <!-- CONTACT & STORE INFO -->
      <div class="products-table-wrap" style="margin-bottom:24px">
        <div class="table-toolbar" style="background:var(--dark3)">
          <span style="font-size:13px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px"><i class="fas fa-store" style="color:var(--primary-light)"></i> Store Information</span>
        </div>
        <div style="padding:20px">
          <div class="admin-form-grid">
            <div class="admin-form-group">
              <label class="admin-form-label">Store Name</label>
              <input type="text" class="admin-form-input" id="set_storeName" value="${esc(s.storeName)}" placeholder="Eriecom Gadgets" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Tagline</label>
              <input type="text" class="admin-form-input" id="set_tagline" value="${esc(s.tagline)}" placeholder="Uganda's #1 Electronics Store" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label"><i class="fab fa-whatsapp" style="color:#25d366"></i> WhatsApp Number <span style="font-size:10px;color:var(--text-muted)">(digits only, with country code)</span></label>
              <input type="text" class="admin-form-input" id="set_whatsapp" value="${esc(s.whatsapp)}" placeholder="256740275104" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label"><i class="fas fa-envelope" style="color:var(--primary-light)"></i> Email Address</label>
              <input type="email" class="admin-form-input" id="set_email" value="${esc(s.email)}" placeholder="Eriecom455@gmail.com" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Phone Number 1</label>
              <input type="text" class="admin-form-input" id="set_phone1" value="${esc(s.phone1)}" placeholder="+256 740 275 104" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Phone Number 2</label>
              <input type="text" class="admin-form-input" id="set_phone2" value="${esc(s.phone2)}" placeholder="+256 752 987 654" />
            </div>
            <div class="admin-form-group full">
              <label class="admin-form-label">Store Address</label>
              <input type="text" class="admin-form-input" id="set_address" value="${esc(s.address)}" placeholder="Kampala Road, Opp. Game Store, Kampala, Uganda" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Weekday Hours</label>
              <input type="text" class="admin-form-input" id="set_hoursWeekday" value="${esc(s.hoursWeekday)}" placeholder="Mon – Sat: 8:00am – 8:00pm" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Weekend Hours</label>
              <input type="text" class="admin-form-input" id="set_hoursWeekend" value="${esc(s.hoursWeekend)}" placeholder="Sunday: 10:00am – 6:00pm" />
            </div>
            <div class="admin-form-group full">
              <label class="admin-form-label">WhatsApp Default Message</label>
              <input type="text" class="admin-form-input" id="set_whatsappMessage" value="${esc(s.whatsappMessage)}" />
            </div>
          </div>
        </div>
      </div>

      <!-- HOMEPAGE CONTENT -->
      <div class="products-table-wrap" style="margin-bottom:24px">
        <div class="table-toolbar" style="background:var(--dark3)">
          <span style="font-size:13px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px"><i class="fas fa-home" style="color:var(--accent)"></i> Homepage Content</span>
        </div>
        <div style="padding:20px">
          <div class="admin-form-grid">
            <div class="admin-form-group full">
              <label class="admin-form-label">Hero Title</label>
              <input type="text" class="admin-form-input" id="set_heroTitle" value="${esc(s.heroTitle)}" placeholder="Next-Gen Electronics Delivered to Your Door" />
            </div>
            <div class="admin-form-group full">
              <label class="admin-form-label">Hero Description</label>
              <textarea class="admin-form-input admin-form-textarea" id="set_heroDesc" rows="3" placeholder="Short description under the hero title...">${esc(s.heroDesc)}</textarea>
            </div>
            <div class="admin-form-group full">
              <label class="admin-form-label">Footer About Text</label>
              <textarea class="admin-form-input admin-form-textarea" id="set_footerAbout" rows="2">${esc(s.footerAbout)}</textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- ANNOUNCEMENT BAR -->
      <div class="products-table-wrap" style="margin-bottom:24px">
        <div class="table-toolbar" style="background:var(--dark3)">
          <span style="font-size:13px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px"><i class="fas fa-bullhorn" style="color:var(--warning)"></i> Announcement Bar</span>
          <button onclick="addAnnouncementItem()" class="topbar-add-btn" style="font-size:12px;padding:6px 12px"><i class="fas fa-plus"></i> Add Item</button>
        </div>
        <div style="padding:20px" id="announcementItems">
          ${(s.announcementBar || []).map((txt, i) => announcementRow(txt, i)).join('')}
        </div>
      </div>

      <!-- SHOP SETTINGS -->
      <div class="products-table-wrap" style="margin-bottom:24px">
        <div class="table-toolbar" style="background:var(--dark3)">
          <span style="font-size:13px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px"><i class="fas fa-shopping-cart" style="color:var(--success)"></i> Shop & Checkout Settings</span>
        </div>
        <div style="padding:20px">
          <div class="admin-form-grid">
            <div class="admin-form-group">
              <label class="admin-form-label">Free Delivery Threshold (UGX)</label>
              <input type="number" class="admin-form-input" id="set_freeDeliveryThreshold" value="${s.freeDeliveryThreshold}" min="0" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Delivery Fee (UGX)</label>
              <input type="number" class="admin-form-input" id="set_deliveryFee" value="${s.deliveryFee}" min="0" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Coupon Code</label>
              <input type="text" class="admin-form-input" id="set_couponCode" value="${esc(s.couponCode)}" placeholder="ERIECOM10" />
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Coupon Discount (%)</label>
              <input type="number" class="admin-form-input" id="set_couponDiscount" value="${s.couponDiscount}" min="0" max="100" />
            </div>
          </div>
        </div>
      </div>

      <!-- SOCIAL LINKS -->
      <div class="products-table-wrap" style="margin-bottom:24px">
        <div class="table-toolbar" style="background:var(--dark3)">
          <span style="font-size:13px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px"><i class="fas fa-share-alt" style="color:var(--primary-light)"></i> Social Media Links</span>
        </div>
        <div style="padding:20px">
          <div class="admin-form-grid">
            <div class="admin-form-group"><label class="admin-form-label"><i class="fab fa-facebook-f"></i> Facebook URL</label><input type="url" class="admin-form-input" id="set_socialFacebook" value="${esc(s.socialFacebook)}" placeholder="https://facebook.com/eriecom" /></div>
            <div class="admin-form-group"><label class="admin-form-label"><i class="fab fa-instagram"></i> Instagram URL</label><input type="url" class="admin-form-input" id="set_socialInstagram" value="${esc(s.socialInstagram)}" placeholder="https://instagram.com/eriecom" /></div>
            <div class="admin-form-group"><label class="admin-form-label"><i class="fab fa-twitter"></i> Twitter/X URL</label><input type="url" class="admin-form-input" id="set_socialTwitter" value="${esc(s.socialTwitter)}" placeholder="https://twitter.com/eriecom" /></div>
            <div class="admin-form-group"><label class="admin-form-label"><i class="fab fa-tiktok"></i> TikTok URL</label><input type="url" class="admin-form-input" id="set_socialTiktok" value="${esc(s.socialTiktok)}" placeholder="https://tiktok.com/@eriecom" /></div>
          </div>
        </div>
      </div>

      <!-- DANGER ZONE -->
      <div class="products-table-wrap" style="border-color:rgba(239,68,68,0.25)">
        <div class="table-toolbar" style="background:rgba(239,68,68,0.06)">
          <span style="font-size:13px;font-weight:700;color:var(--error);display:flex;align-items:center;gap:8px"><i class="fas fa-exclamation-triangle"></i> Danger Zone</span>
        </div>
        <div style="padding:20px;display:flex;gap:12px;flex-wrap:wrap">
          <button onclick="resetProducts()" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:var(--error);padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font);transition:all var(--transition)" onmouseover="this.style.background='var(--error)';this.style.color='#fff'" onmouseout="this.style.background='rgba(239,68,68,0.1)';this.style.color='var(--error)'"><i class="fas fa-undo"></i> Reset Products to Defaults</button>
          <button onclick="resetAllSettings()" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:var(--error);padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font);transition:all var(--transition)" onmouseover="this.style.background='var(--error)';this.style.color='#fff'" onmouseout="this.style.background='rgba(239,68,68,0.1)';this.style.color='var(--error)'"><i class="fas fa-trash"></i> Reset Settings to Defaults</button>
        </div>
      </div>

      <div style="margin-top:24px;display:flex;justify-content:flex-end">
        <button class="btn-save" onclick="saveAllSettings()" style="max-width:240px"><i class="fas fa-save"></i> Save All Settings</button>
      </div>
    </div>`;
  }

  function announcementRow(txt, i) {
    return `<div class="ann-row" data-ann-index="${i}" style="display:flex;gap:10px;margin-bottom:10px;align-items:center">
      <input type="text" class="admin-form-input ann-input" value="${esc(txt)}" placeholder="Announcement text..." style="flex:1" />
      <button onclick="removeAnnouncementItem(${i})" style="width:34px;height:34px;border-radius:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:var(--error);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" title="Remove"><i class="fas fa-times"></i></button>
    </div>`;
  }

  window.addAnnouncementItem = function() {
    const container = $('announcementItems');
    if (!container) return;
    const rows = container.querySelectorAll('.ann-row');
    const i = rows.length;
    const div = document.createElement('div');
    div.innerHTML = announcementRow('', i);
    container.appendChild(div.firstElementChild);
  };

  window.removeAnnouncementItem = function(idx) {
    const rows = document.querySelectorAll('#announcementItems .ann-row');
    if (rows.length <= 1) { showToast('<i class="fas fa-info-circle" style="color:var(--warning)"></i> Keep at least one announcement item.', ''); return; }
    rows[idx]?.remove();
    // Re-index
    document.querySelectorAll('#announcementItems .ann-row').forEach((row, i) => {
      row.dataset.annIndex = i;
      const btn = row.querySelector('button');
      if (btn) btn.setAttribute('onclick', `removeAnnouncementItem(${i})`);
    });
  };

  window.saveAllSettings = function() {
    const current = loadSettings();
    const getString = id => ($( id)?.value?.trim() || current[id.replace('set_','')] || '');
    const getNum = id => parseInt($( id)?.value) || 0;

    const annItems = [];
    document.querySelectorAll('#announcementItems .ann-input').forEach(inp => {
      if (inp.value.trim()) annItems.push(inp.value.trim());
    });

    const newSettings = {
      storeName:              getString('set_storeName'),
      tagline:                getString('set_tagline'),
      whatsapp:               getString('set_whatsapp').replace(/\D/g, ''),
      whatsappMessage:        getString('set_whatsappMessage'),
      email:                  getString('set_email'),
      phone1:                 getString('set_phone1'),
      phone2:                 getString('set_phone2'),
      address:                getString('set_address'),
      hoursWeekday:           getString('set_hoursWeekday'),
      hoursWeekend:           getString('set_hoursWeekend'),
      heroTitle:              getString('set_heroTitle'),
      heroDesc:               getString('set_heroDesc'),
      footerAbout:            getString('set_footerAbout'),
      announcementBar:        annItems.length ? annItems : current.announcementBar,
      freeDeliveryThreshold:  getNum('set_freeDeliveryThreshold'),
      deliveryFee:            getNum('set_deliveryFee'),
      couponCode:             getString('set_couponCode').toUpperCase(),
      couponDiscount:         getNum('set_couponDiscount'),
      socialFacebook:         getString('set_socialFacebook'),
      socialInstagram:        getString('set_socialInstagram'),
      socialTwitter:          getString('set_socialTwitter'),
      socialTiktok:           getString('set_socialTiktok'),
    };

    if (!newSettings.whatsapp) {
      showToast('<i class="fas fa-exclamation-circle" style="color:var(--error)"></i> WhatsApp number is required.', 'error');
      return;
    }
    if (!newSettings.email) {
      showToast('<i class="fas fa-exclamation-circle" style="color:var(--error)"></i> Email is required.', 'error');
      return;
    }

    saveSettings(newSettings);
    showToast('<i class="fas fa-check-circle" style="color:var(--success)"></i> Settings saved! Changes will appear on the store immediately.', 'success');
  };

  window.resetProducts = function() {
    if (!confirm('Reset all products to the default catalogue? This will delete any custom products you have added.')) return;
    localStorage.removeItem('eriecom_products');
    refreshCount();
    showToast('<i class="fas fa-undo" style="color:var(--warning)"></i> Products reset to defaults.', '');
  };

  window.resetAllSettings = function() {
    if (!confirm('Reset all site settings to defaults? This cannot be undone.')) return;
    localStorage.removeItem('eriecom_settings');
    showToast('<i class="fas fa-undo" style="color:var(--warning)"></i> Settings reset to defaults.', '');
    setTimeout(() => showPanel('settings'), 300);
  };


  /* ════════════════════════════════════════════
     PRODUCT FORM MODAL (ADD / EDIT)
  ════════════════════════════════════════════ */
  window.openProductForm = function (id) {
    const overlay = $('productFormOverlay');
    const title   = $('formTitle');
    if (!overlay) return;
    overlay.classList.add('open');

    const form    = $('productForm');
    const imgWrap = $('imgPreviewWrap');
    const imgPrev = $('imgPreview');

    if (id) {
      const p = getById(id);
      if (!p) return;
      if (title) title.innerHTML = `<i class="fas fa-edit" style="color:var(--primary-light)"></i> Edit Product`;
      if (form) {
        form.reset();
        $('editProductId').value = p.id;
        $('pName').value         = p.name;
        $('pCategory').value     = p.category;
        $('pBadge').value        = p.badge || '';
        $('pPrice').value        = p.price;
        $('pOldPrice').value     = p.oldPrice || '';
        $('pStock').value        = p.stock;
        $('pRating').value       = p.rating || '';
        $('pReviews').value      = p.reviews || '';
        $('pImage').value        = p.image;
        $('pDesc').value         = p.desc;
        $('pFeatured').checked   = !!p.featured;
        $('pTrending').checked   = !!p.trending;
        updateDiscountHint();
        if (p.image && imgWrap && imgPrev) {
          imgWrap.style.display = 'block';
          imgPrev.src = p.image;
        }
      }
    } else {
      if (title) title.innerHTML = `<i class="fas fa-plus-circle" style="color:var(--primary-light)"></i> Add New Product`;
      if (form) form.reset();
      if ($('editProductId')) $('editProductId').value = '';
      if (imgWrap) imgWrap.style.display = 'none';
    }
  };

  window.closeProductForm = function () {
    $('productFormOverlay')?.classList.remove('open');
  };

  /* ── Image URL preview ──────────────────────── */
  window.previewImage = function (url) {
    const wrap = $('imgPreviewWrap');
    const img  = $('imgPreview');
    if (!wrap || !img) return;
    if (url && url.trim()) {
      img.src = url.trim();
      wrap.style.display = 'block';
      img.onerror = () => { wrap.style.display = 'none'; };
      img.onload  = () => { wrap.style.display = 'block'; };
    } else {
      wrap.style.display = 'none';
    }
  };

  /* ── Image file upload → base64 ─────────────── */
  window.handleImageUpload = function (input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('<i class="fas fa-exclamation-circle" style="color:var(--error)"></i> Please select an image file.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('<i class="fas fa-exclamation-circle" style="color:var(--error)"></i> Image must be under 2MB for local storage.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64 = e.target.result;
      const urlInput = $('pImage');
      const wrap     = $('imgPreviewWrap');
      const imgEl    = $('imgPreview');
      if (urlInput) urlInput.value = base64;
      if (wrap && imgEl) { imgEl.src = base64; wrap.style.display = 'block'; }
      showToast('<i class="fas fa-check-circle" style="color:var(--success)"></i> Image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  /* ── Discount hint ──────────────────────────── */
  function updateDiscountHint() {
    const price    = parseInt($('pPrice')?.value || 0);
    const oldPrice = parseInt($('pOldPrice')?.value || 0);
    const hint     = $('discountHint');
    if (!hint) return;
    if (oldPrice > price) {
      const disc = Math.round((1 - price / oldPrice) * 100);
      hint.innerHTML = `<i class="fas fa-tag" style="color:var(--success)"></i> ${disc}% discount`;
      hint.classList.add('success');
    } else {
      hint.textContent = '';
      hint.classList.remove('success');
    }
  }

  $('pPrice')?.addEventListener('input', updateDiscountHint);
  $('pOldPrice')?.addEventListener('input', updateDiscountHint);
  $('pImage')?.addEventListener('input', function () { previewImage(this.value); });

  /* ── Form submit ────────────────────────────── */
  const form = $('productForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const editId   = $('editProductId')?.value;
      const products = getProducts();

      const newProd = {
        id:       editId ? parseInt(editId) : Date.now(),
        name:     $('pName').value.trim(),
        category: $('pCategory').value,
        badge:    $('pBadge').value || null,
        price:    parseInt($('pPrice').value),
        oldPrice: parseInt($('pOldPrice').value) || null,
        stock:    parseInt($('pStock').value),
        rating:   parseFloat($('pRating').value) || 4.5,
        reviews:  parseInt($('pReviews').value) || 0,
        image:    $('pImage').value.trim(),
        desc:     $('pDesc').value.trim(),
        featured: $('pFeatured').checked,
        trending: $('pTrending').checked,
      };

      if (!newProd.name || !newProd.category || !newProd.image || !newProd.desc) {
        showToast('<i class="fas fa-exclamation-circle" style="color:var(--error)"></i> Please fill all required fields.', 'error');
        return;
      }

      if (editId) {
        const idx = products.findIndex(p => p.id === parseInt(editId));
        if (idx !== -1) products[idx] = newProd;
        showToast(`<i class="fas fa-check-circle" style="color:var(--success)"></i> "${newProd.name}" updated!`, 'success');
      } else {
        products.push(newProd);
        showToast(`<i class="fas fa-check-circle" style="color:var(--success)"></i> "${newProd.name}" added!`, 'success');
      }

      saveProducts(products);
      closeProductForm();
      refreshCount();
      if (window.currentPanel === 'products') renderProductsTable($('tableSearch')?.value || '');
      else showPanel(window.currentPanel);
    });
  }


  /* ════════════════════════════════════════════
     DELETE CONFIRM MODAL
  ════════════════════════════════════════════ */
  let _pendingDeleteId = null;

  window.openDeleteConfirm = function (id) {
    const p = getById(id);
    if (!p) return;
    _pendingDeleteId = id;
    const msg = $('deleteProductName');
    if (msg) msg.innerHTML = `Are you sure you want to delete <strong>"${esc(p.name)}"</strong>?<br>This action cannot be undone.`;
    $('deleteConfirmOverlay')?.classList.add('open');
  };

  window.closeDeleteConfirm = function () {
    $('deleteConfirmOverlay')?.classList.remove('open');
    _pendingDeleteId = null;
  };

  window.confirmDelete = function () {
    if (!_pendingDeleteId) return;
    const products = getProducts().filter(p => p.id !== _pendingDeleteId);
    saveProducts(products);
    closeDeleteConfirm();
    refreshCount();
    if (window.currentPanel === 'products') renderProductsTable($('tableSearch')?.value || '');
    if (window.currentPanel === 'inventory') showPanel('inventory');
    showToast('<i class="fas fa-trash" style="color:var(--error)"></i> Product deleted.', 'error');
  };

}); /* end DOMContentLoaded */
