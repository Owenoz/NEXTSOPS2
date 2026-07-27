/* =============================================
   ERIECOM GADGETS — CART LOGIC
   ============================================= */

function getCart() {
  try { return JSON.parse(localStorage.getItem('eriecom_cart')) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('eriecom_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount, .cart-count').forEach(el => {
    el.textContent = total;
    if (total > 0) {
      el.style.display = 'flex';
      el.classList.add('cart-pop');
      setTimeout(() => el.classList.remove('cart-pop'), 300);
    } else {
      el.style.display = total === 0 ? 'none' : 'flex';
    }
  });
}

function addToCart(e, productId) {
  if (e) e.stopPropagation();
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1, category: product.category });
  }
  saveCart(cart);
  showToast(`<i class="fas fa-check-circle" style="color:#10b981"></i> ${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartTotal() {
  return getCart().reduce((s, i) => s + (i.price * i.qty), 0);
}

function toggleWishlist(e, productId) {
  if (e) e.stopPropagation();
  let wl = JSON.parse(localStorage.getItem('eriecom_wishlist') || '[]');
  const btn = e.currentTarget;
  if (wl.includes(productId)) {
    wl = wl.filter(id => id !== productId);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast('Removed from wishlist', '');
  } else {
    wl.push(productId);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast('<i class="fas fa-heart" style="color:#ef4444"></i> Added to wishlist!', '');
  }
  localStorage.setItem('eriecom_wishlist', JSON.stringify(wl));
}

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = message;
  toast.className = 'toast show ' + type;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartUI);
