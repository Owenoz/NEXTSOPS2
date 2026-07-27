/* =============================================
   ERIECOM GADGETS — MAIN JAVASCRIPT
   ============================================= */
// Hide page loader
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 300);
    setTimeout(() => loader.remove(), 900);
  }
});

document.addEventListener('DOMContentLoaded', () => {

  /* ---- PARTICLES BACKGROUND ---- */
  const pContainer = document.getElementById('particles');
  if (pContainer) {
    const colors = ['#6c3bff','#8b5cf6','#ff6b35','#00d4aa','#a855f7'];
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        opacity:${Math.random()*0.4+0.1};
        --dur:${Math.random()*8+5}s;
        --delay:-${Math.random()*8}s;
      `;
      pContainer.appendChild(p);
    }
  }

  /* ---- NAVBAR SCROLL EFFECT ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ---- BACK TO TOP ---- */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('show', window.scrollY > 400);
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- HAMBURGER MOBILE MENU ---- */
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
    document.addEventListener('click', (e) => {
      if (!ham.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  /* ---- SEARCH OVERLAY ---- */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const searchInput = document.getElementById('searchInput');
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      setTimeout(() => searchInput && searchInput.focus(), 200);
    });
    const closeSearchFn = () => searchOverlay.classList.remove('active');
    closeSearch && closeSearch.addEventListener('click', closeSearchFn);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSearchFn();
    });
    document.getElementById('searchBtn') && document.getElementById('searchBtn').addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (q) window.location.href = `pages/shop.html?search=${encodeURIComponent(q)}`;
    });
    searchInput && searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) window.location.href = `pages/shop.html?search=${encodeURIComponent(q)}`;
      }
    });
  }

  /* ---- RENDER FEATURED & TRENDING ---- */
  const featuredEl = document.getElementById('featuredProducts');
  if (featuredEl) {
    const featured = getFeatured().slice(0, 8);
    featuredEl.innerHTML = featured.map((p, i) => createProductCard(p, i)).join('');
  }
  const trendingEl = document.getElementById('trendingProducts');
  if (trendingEl) {
    const trending = getTrending().slice(0, 4);
    trendingEl.innerHTML = trending.map((p, i) => createProductCard(p, i)).join('');
  }

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 30);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

  /* ---- AOS SCROLL ANIMATIONS ---- */
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
        aosObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

  /* ---- COUNTDOWN TIMER ---- */
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('mins');
  const secsEl = document.getElementById('secs');
  if (hoursEl) {
    let stored = localStorage.getItem('eriecom_deal_end');
    if (!stored || parseInt(stored) < Date.now()) {
      stored = Date.now() + (23 * 3600 + 59 * 60 + 59) * 1000;
      localStorage.setItem('eriecom_deal_end', stored);
    }
    const dealEnd = parseInt(stored);
    function updateCountdown() {
      const diff = Math.max(0, dealEnd - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---- TESTIMONIALS SLIDER ---- */
  const track = document.getElementById('testimonialsTrack');
  const prev = document.getElementById('prevTestimonial');
  const next = document.getElementById('nextTestimonial');
  if (track && prev && next) {
    let current = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const visible = window.innerWidth < 768 ? 1 : 3;
    const max = Math.max(0, cards.length - visible);
    const slide = (dir) => {
      current = Math.max(0, Math.min(current + dir, max));
      const cardWidth = cards[0].offsetWidth + 20;
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    };
    prev.addEventListener('click', () => slide(-1));
    next.addEventListener('click', () => slide(1));
  }

  /* ---- NEWSLETTER FORM ---- */
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = nlForm.querySelector('input').value;
      showToast(`<i class="fas fa-check-circle" style="color:#10b981"></i> Subscribed with ${email}! Welcome to Eriecom.`, 'success');
      nlForm.reset();
    });
  }

  /* ---- RIPPLE EFFECT ON BUTTONS ---- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-primary, .btn-secondary');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `left:${e.clientX-rect.left}px;top:${e.clientY-rect.top}px;width:${Math.max(rect.width,rect.height)}px;height:${Math.max(rect.width,rect.height)}px;margin-left:-${Math.max(rect.width,rect.height)/2}px;margin-top:-${Math.max(rect.width,rect.height)/2}px`;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });

});
