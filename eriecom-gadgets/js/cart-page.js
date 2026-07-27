/* =============================================
   ERIECOM GADGETS — CART PAGE & CHECKOUT LOGIC
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

  const DELIVERY_FEE = 10000;
  const KAMPALA_FREE_THRESHOLD = 150000;
  let couponApplied = false;
  let couponDiscount = 0;
  let currentView = 'cart'; // 'cart' | 'checkout' | 'success'

  function renderCart() {
    const cart = getCart();
    const layout = document.getElementById('cartLayout');
    const countEl = document.getElementById('cartItemCount');
    if (!layout) return;

    if (countEl) countEl.textContent = cart.length > 0 ? `(${cart.length} item${cart.length > 1 ? 's' : ''})` : '';

    if (cart.length === 0) {
      layout.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon"><i class="fas fa-shopping-bag"></i></div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Browse our latest electronics and find something you'll love.</p>
          <a href="shop.html" class="btn-primary"><i class="fas fa-store"></i> Browse Shop</a>
        </div>`;
      return;
    }

    const subtotal = getCartTotal();
    const delivery = subtotal >= KAMPALA_FREE_THRESHOLD ? 0 : DELIVERY_FEE;
    const discount = couponApplied ? couponDiscount : 0;
    const total = subtotal - discount + delivery;

    layout.innerHTML = `
      <div class="cart-left">
        <div class="cart-header-row">
          <h3>${cart.length} Item${cart.length > 1 ? 's' : ''} in Your Cart</h3>
          <button class="clear-cart-btn" onclick="confirmClearCart()"><i class="fas fa-trash"></i> Clear Cart</button>
        </div>

        <div class="cart-items">
          ${cart.map(item => `
            <div class="cart-item" id="cart-item-${item.id}">
              <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&q=80'" />
              </div>
              <div class="cart-item-details">
                <div class="cart-item-cat">${item.category}</div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatUGX(item.price)}</div>
                <div class="cart-item-unit">per unit</div>
              </div>
              <div class="cart-item-actions">
                <div class="cart-qty-control">
                  <button class="cart-qty-btn" onclick="changeCartQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                  <span class="cart-qty-num">${item.qty}</span>
                  <button class="cart-qty-btn" onclick="changeCartQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                </div>
                <div class="cart-item-subtotal">${formatUGX(item.price * item.qty)}</div>
                <button class="cart-remove" onclick="removeItem(${item.id})"><i class="fas fa-times"></i> Remove</button>
              </div>
            </div>`).join('')}
        </div>

        <div class="coupon-row">
          <input type="text" class="coupon-input" id="couponInput" placeholder="Have a coupon code? Enter here..." />
          <button class="coupon-btn" onclick="applyCoupon()">Apply</button>
        </div>
      </div>

      <div class="cart-right">
        <div class="order-summary">
          <div class="summary-title"><i class="fas fa-receipt" style="color:var(--primary-light)"></i> Order Summary</div>
          <div class="summary-row"><span>Subtotal (${cart.reduce((s,i) => s+i.qty, 0)} items)</span><span>${formatUGX(subtotal)}</span></div>
          ${couponApplied ? `<div class="summary-row discount"><span>Coupon (ERIECOM10)</span><span>-${formatUGX(discount)}</span></div>` : ''}
          <div class="summary-row">
            <span>Delivery</span>
            <span>${delivery === 0 ? '<span style="color:var(--success)">FREE</span>' : formatUGX(delivery)}</span>
          </div>
          ${delivery > 0 ? `<div style="font-size:12px;color:var(--text-muted);padding:4px 0">Spend ${formatUGX(KAMPALA_FREE_THRESHOLD - subtotal)} more for free delivery in Kampala</div>` : ''}
          <hr class="summary-divider" />
          <div class="summary-total">
            <span>Total</span>
            <span class="total-amount">${formatUGX(total)}</span>
          </div>
          <button class="checkout-btn" onclick="proceedToCheckout()">
            <i class="fas fa-lock"></i> Proceed to Checkout
          </button>
          <a href="shop.html" class="continue-shopping"><i class="fas fa-arrow-left"></i> Continue Shopping</a>
          <div class="payment-methods">
            <p><i class="fas fa-lock"></i> Secure & Encrypted Payment</p>
            <div class="payment-icons-row">
              <span class="pay-badge"><i class="fas fa-mobile-alt"></i> MTN MoMo</span>
              <span class="pay-badge"><i class="fas fa-mobile-alt"></i> Airtel</span>
              <span class="pay-badge"><i class="fab fa-cc-visa"></i> Visa</span>
              <span class="pay-badge"><i class="fab fa-cc-mastercard"></i> MC</span>
              <span class="pay-badge"><i class="fas fa-money-bill"></i> Cash</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderCheckout() {
    const cart = getCart();
    const subtotal = getCartTotal();
    const delivery = subtotal >= KAMPALA_FREE_THRESHOLD ? 0 : DELIVERY_FEE;
    const discount = couponApplied ? couponDiscount : 0;
    const total = subtotal - discount + delivery;

    const layout = document.getElementById('cartLayout');
    layout.innerHTML = `
      <div class="checkout-section active">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap;">
          <button onclick="backToCart()" style="background:none;border:1px solid var(--border);color:var(--text-muted);padding:8px 16px;border-radius:8px;cursor:pointer;font-family:var(--font);font-size:13px;display:flex;align-items:center;gap:6px;transition:all var(--transition);"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-muted)'">
            <i class="fas fa-arrow-left"></i> Back to Cart
          </button>
          <h1 class="cart-page-title" style="margin-bottom:0">Checkout</h1>
        </div>

        <div class="checkout-grid">
          <div>
            <div class="checkout-form-card">
              <div class="form-section-title"><i class="fas fa-user"></i> Personal Information</div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">First Name *</label>
                  <input type="text" class="form-input" id="firstName" placeholder="John" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name *</label>
                  <input type="text" class="form-input" id="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Phone Number *</label>
                  <input type="tel" class="form-input" id="phone" placeholder="+256 700 000 000" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-input" id="email" placeholder="you@example.com" />
                </div>
              </div>
            </div>

            <div class="checkout-form-card">
              <div class="form-section-title"><i class="fas fa-map-marker-alt"></i> Delivery Address</div>
              <div class="form-group">
                <label class="form-label">District / City *</label>
                <select class="form-select" id="district">
                  <option value="">Select your district</option>
                  <option>Kampala</option><option>Wakiso</option><option>Mukono</option>
                  <option>Entebbe</option><option>Jinja</option><option>Gulu</option>
                  <option>Mbarara</option><option>Mbale</option><option>Fort Portal</option>
                  <option>Arua</option><option>Lira</option><option>Masaka</option>
                  <option>Other (Nationwide)</option>
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Area / Zone *</label>
                  <input type="text" class="form-input" id="area" placeholder="e.g. Ntinda, Wandegeya" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Street / Building</label>
                  <input type="text" class="form-input" id="street" placeholder="e.g. Plot 14, Kyebando St." />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Delivery Notes</label>
                <input type="text" class="form-input" id="notes" placeholder="Any special delivery instructions..." />
              </div>
            </div>

            <div class="checkout-form-card">
              <div class="form-section-title"><i class="fas fa-credit-card"></i> Payment Method</div>
              <div class="payment-method-options">
                <label class="payment-option selected" id="opt-mtn" onclick="selectPayment(this,'mtn')">
                  <input type="radio" name="payment" value="mtn" checked />
                  <div class="payment-option-icon pay-mtn"><i class="fas fa-mobile-alt"></i></div>
                  <div class="payment-option-info">
                    <strong>MTN Mobile Money</strong>
                    <span>Pay via MTN MoMo — instant confirmation</span>
                  </div>
                </label>
                <label class="payment-option" id="opt-airtel" onclick="selectPayment(this,'airtel')">
                  <input type="radio" name="payment" value="airtel" />
                  <div class="payment-option-icon pay-airtel"><i class="fas fa-mobile-alt"></i></div>
                  <div class="payment-option-info">
                    <strong>Airtel Money</strong>
                    <span>Pay via Airtel Money</span>
                  </div>
                </label>
                <label class="payment-option" id="opt-card" onclick="selectPayment(this,'card')">
                  <input type="radio" name="payment" value="card" />
                  <div class="payment-option-icon pay-card"><i class="fab fa-cc-visa"></i></div>
                  <div class="payment-option-info">
                    <strong>Visa / Mastercard</strong>
                    <span>Secure card payment</span>
                  </div>
                </label>
                <label class="payment-option" id="opt-cod" onclick="selectPayment(this,'cod')">
                  <input type="radio" name="payment" value="cod" />
                  <div class="payment-option-icon pay-cod"><i class="fas fa-money-bill-wave"></i></div>
                  <div class="payment-option-info">
                    <strong>Cash on Delivery</strong>
                    <span>Pay when your order arrives</span>
                  </div>
                </label>
              </div>
            </div>

            <button class="place-order-btn" onclick="placeOrder()">
              <i class="fas fa-check-circle"></i> Place Order — ${formatUGX(total)}
            </button>
          </div>

          <div>
            <div class="order-summary">
              <div class="summary-title">Order Review</div>
              ${cart.map(item => `
                <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);align-items:center;">
                  <img src="${item.image}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80'" />
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                    <div style="font-size:12px;color:var(--text-muted);">Qty: ${item.qty}</div>
                  </div>
                  <div style="font-size:13px;font-weight:700;color:#fff;white-space:nowrap;">${formatUGX(item.price * item.qty)}</div>
                </div>`).join('')}
              <div class="summary-row" style="margin-top:10px"><span>Subtotal</span><span>${formatUGX(subtotal)}</span></div>
              ${couponApplied ? `<div class="summary-row discount"><span>Coupon</span><span>-${formatUGX(discount)}</span></div>` : ''}
              <div class="summary-row"><span>Delivery</span><span>${delivery === 0 ? '<span style="color:var(--success)">FREE</span>' : formatUGX(delivery)}</span></div>
              <hr class="summary-divider" />
              <div class="summary-total"><span>Total</span><span class="total-amount">${formatUGX(total)}</span></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderSuccess(orderNum) {
    const layout = document.getElementById('cartLayout');
    layout.innerHTML = `
      <div class="order-success active" style="grid-column:1/-1">
        <div class="success-icon"><i class="fas fa-check"></i></div>
        <h2>Order Placed Successfully!</h2>
        <div class="order-num"><i class="fas fa-tag"></i> Order #${orderNum}</div>
        <p>Thank you for shopping with Eriecom Gadgets! Your order has been received and our team will contact you shortly to confirm delivery details.<br/><br/>You'll receive a confirmation SMS on the number provided.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a href="shop.html" class="btn-primary"><i class="fas fa-store"></i> Continue Shopping</a>
          <a href="../index.html" class="btn-secondary">Back to Home</a>
        </div>
      </div>`;
    clearCart();
    document.getElementById('cartItemCount') && (document.getElementById('cartItemCount').textContent = '');
  }

  // ---- HANDLERS ----
  window.changeCartQty = (id, delta) => {
    updateQty(id, delta);
    renderCart();
  };
  window.removeItem = (id) => {
    const item = document.getElementById(`cart-item-${id}`);
    if (item) {
      item.style.transition = 'all 0.3s ease';
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      setTimeout(() => { removeFromCart(id); renderCart(); }, 300);
    }
  };
  window.confirmClearCart = () => {
    if (confirm('Clear all items from your cart?')) { clearCart(); renderCart(); }
  };
  window.applyCoupon = () => {
    const code = document.getElementById('couponInput')?.value.trim().toUpperCase();
    if (code === 'ERIECOM10') {
      couponApplied = true;
      couponDiscount = Math.round(getCartTotal() * 0.1);
      renderCart();
      showToast('<i class="fas fa-tag" style="color:var(--success)"></i> Coupon applied! 10% off your order.', 'success');
    } else {
      showToast('<i class="fas fa-times-circle" style="color:var(--error)"></i> Invalid coupon code.', 'error');
    }
  };
  window.proceedToCheckout = () => {
    currentView = 'checkout';
    renderCheckout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  window.backToCart = () => {
    currentView = 'cart';
    renderCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  window.selectPayment = (el, val) => {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
  };
  window.placeOrder = () => {
    const first = document.getElementById('firstName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const district = document.getElementById('district')?.value;
    const area = document.getElementById('area')?.value.trim();
    if (!first || !phone || !district || !area) {
      showToast('<i class="fas fa-exclamation-circle" style="color:var(--error)"></i> Please fill in all required fields.', 'error');
      return;
    }
    const orderNum = 'ERG-' + Date.now().toString().slice(-6);
    setTimeout(() => { renderSuccess(orderNum); }, 400);
  };

  // Navbar
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

  renderCart();
});
