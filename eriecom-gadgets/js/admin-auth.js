/* =============================================
   ERIECOM GADGETS — ADMIN AUTH v2
   ============================================= */

const ADMIN_CREDENTIALS = [
  { username: 'admin',   password: 'eriecom2025', name: 'Admin User',    role: 'Super Admin' },
  { username: 'eriecom', password: 'gadgets2025', name: 'Store Manager', role: 'Manager'     },
];

/* ---------- Session helpers ---------- */
function isAdminLoggedIn() {
  try {
    const d = JSON.parse(localStorage.getItem('eriecom_admin_session') || 'null');
    return !!(d && d.expires > Date.now());
  } catch { return false; }
}

function getAdminUser() {
  try { return JSON.parse(localStorage.getItem('eriecom_admin_session')); }
  catch { return null; }
}

function setAdminSession(user, remember) {
  const ms = remember ? 7 * 24 * 3600000 : 8 * 3600000;
  localStorage.setItem('eriecom_admin_session',
    JSON.stringify({ ...user, expires: Date.now() + ms }));
}

function logoutAdmin() {
  localStorage.removeItem('eriecom_admin_session');
  window.location.href = 'login.html';
}

/* ---------- Login page init ---------- */
document.addEventListener('DOMContentLoaded', () => {

  /* If already logged in on login page → go straight to dashboard */
  if (isAdminLoggedIn() && window.location.pathname.includes('login.html')) {
    window.location.href = 'dashboard.html';
    return;
  }

  /* Floating particles */
  const pBox = document.getElementById('loginParticles');
  if (pBox) {
    const colors = ['#6c3bff','#8b5cf6','#00d4aa','#ff6b35'];
    for (let i = 0; i < 22; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      const s = Math.random() * 5 + 2;
      el.style.cssText =
        `width:${s}px;height:${s}px;` +
        `background:${colors[i % colors.length]};` +
        `left:${Math.random() * 100}%;top:${Math.random() * 100}%;` +
        `opacity:${(Math.random() * 0.3 + 0.1).toFixed(2)};` +
        `--dur:${(Math.random() * 8 + 5).toFixed(1)}s;` +
        `--delay:-${(Math.random() * 8).toFixed(1)}s;`;
      pBox.appendChild(el);
    }
  }

  /* Password visibility toggle */
  const togglePw = document.getElementById('togglePw');
  const pwInput  = document.getElementById('adminPassword');
  if (togglePw && pwInput) {
    togglePw.addEventListener('click', () => {
      const show = pwInput.type === 'password';
      pwInput.type = show ? 'text' : 'password';
      togglePw.innerHTML = show
        ? '<i class="fas fa-eye-slash"></i>'
        : '<i class="fas fa-eye"></i>';
    });
  }

  /* Form submit */
  const form     = document.getElementById('loginForm');
  const errorBox = document.getElementById('loginError');
  const btnText  = document.getElementById('loginBtnText');
  const btnLoad  = document.getElementById('loginBtnLoader');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const username = (document.getElementById('adminUsername').value || '').trim();
    const password = (document.getElementById('adminPassword').value || '');
    const remember = document.getElementById('rememberMe')?.checked || false;

    /* Validate empty */
    if (!username || !password) {
      showLoginError('Please enter both username and password.');
      return;
    }

    /* Show loader */
    btnText.style.display = 'none';
    btnLoad.style.display = 'flex';
    errorBox.classList.remove('show');

    await new Promise(r => setTimeout(r, 800));

    const user = ADMIN_CREDENTIALS.find(
      u => u.username === username && u.password === password
    );

    btnText.style.display = 'flex';
    btnLoad.style.display = 'none';

    if (user) {
      setAdminSession(user, remember);
      showToast(
        `<i class="fas fa-check-circle" style="color:#10b981"></i> Welcome back, ${user.name}!`,
        'success'
      );
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
    } else {
      showLoginError('Invalid username or password. Please try again.');
      document.getElementById('adminPassword').value = '';
      shakeCard();
    }
  });

  function showLoginError(msg) {
    if (!errorBox) return;
    errorBox.querySelector('#loginErrorText') &&
      (errorBox.querySelector('#loginErrorText').textContent = msg);
    errorBox.innerHTML =
      `<i class="fas fa-exclamation-circle"></i><span>${msg}</span>`;
    errorBox.classList.add('show');
  }

  function shakeCard() {
    const card = document.querySelector('.login-card');
    if (!card) return;
    const moves = [-8, 8, -5, 5, -2, 2, 0];
    moves.forEach((x, i) =>
      setTimeout(() => card.style.transform = `translateX(${x}px)`, i * 60)
    );
    setTimeout(() => card.style.transform = '', moves.length * 60 + 40);
  }
});
