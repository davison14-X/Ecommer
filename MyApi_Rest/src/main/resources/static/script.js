/* =============================================
   NEXUSGAMES — SCRIPT.JS
   ============================================= */

const PRODUCT_IMAGE = 'assets/producto-default.png';

// ─── DEFAULT PRODUCTS (fallback sin API) ─────────
const PRODUCTS_DEFAULT = [
  { id: 'gow-ps5-std', name: 'God of War Ragnarök', platform: 'PS5', category: 'Juego Físico', format: 'Standard Edition', price: 180000, stock: 45, genre: 'Acción-Aventura', description: 'Continúa la épica saga nórdica de Kratos y Atreus. Gráficos next-gen y combate brutal.', image: '' },
  { id: 'gow-ps5-dlx', name: 'God of War Ragnarök', platform: 'PS5', category: 'Juego Físico', format: 'Deluxe Edition', price: 240000, stock: 18, genre: 'Acción-Aventura', description: 'Edición especial con artbook digital y banda sonora oficial.', image: '' },
  { id: 'elden-ps5', name: 'Elden Ring', platform: 'PS5', category: 'Juego Físico', format: 'Standard Edition', price: 165000, stock: 32, genre: 'RPG', description: 'El RPG de mundo abierto de FromSoftware. Explora Las Tierras Intermedias.', image: '' },
  { id: 'elden-pc', name: 'Elden Ring', platform: 'PC', category: 'Juego Digital', format: 'Standard Edition', price: 130000, stock: 99, genre: 'RPG', description: 'Versión PC vía Steam. Mundo vasto, jefes desafiantes y libertad total.', image: '' },
  { id: 'forza-xbox', name: 'Forza Horizon 5', platform: 'Xbox Series X', category: 'Juego Físico', format: 'Standard Edition', price: 155000, stock: 28, genre: 'Carreras', description: 'Más de 500 autos en el mapa más grande de la saga. Ambientado en México.', image: '' },
  { id: 'forza-ult', name: 'Forza Horizon 5', platform: 'Xbox Series X', category: 'Juego Digital', format: 'Ultimate Edition', price: 215000, stock: 50, genre: 'Carreras', description: 'Ultimate Edition con 2 años de Car Pass, VIP y todo el contenido adicional.', image: '' },
  { id: 'zelda-switch', name: 'Zelda: Tears of the Kingdom', platform: 'Nintendo Switch', category: 'Juego Físico', format: 'Standard Edition', price: 180000, stock: 22, genre: 'Acción-Aventura', description: 'Explora Hyrule desde las profundidades hasta los cielos con mecánicas revolucionarias.', image: '' },
  { id: 'rdr2-pc', name: 'Red Dead Redemption 2', platform: 'PC', category: 'Juego Digital', format: 'Standard Edition', price: 95000, stock: 0, genre: 'Mundo Abierto', description: 'La obra maestra de Rockstar. Vive la vida de Arthur Morgan en el Viejo Oeste.', image: '' },
];

// ─── HELPERS ─────────────────────────────────────
function getProducts() {
  if (typeof productsCache !== 'undefined' && productsCache.length) return productsCache;
  const stored = localStorage.getItem('ng_products');
  if (stored) return JSON.parse(stored);
  return PRODUCTS_DEFAULT;
}
function saveProducts(products) {
  if (typeof syncProductsCache === 'function') syncProductsCache(products);
  localStorage.setItem('ng_products', JSON.stringify(products));
}
function getCart() {
  const stored = localStorage.getItem('ng_cart');
  return stored ? JSON.parse(stored) : [];
}
function saveCart(cart) { localStorage.setItem('ng_cart', JSON.stringify(cart)); }
function getCurrentUser() {
  const stored = localStorage.getItem('ng_current_user');
  return stored ? JSON.parse(stored) : null;
}
function setCurrentUser(user) {
  if (user) localStorage.setItem('ng_current_user', JSON.stringify(user));
  else localStorage.removeItem('ng_current_user');
}
function formatPrice(n) {
  return '$' + Number(n).toLocaleString('es-CO');
}
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── SCROLL ANIMATIONS ───────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

// ─── NAVBAR ──────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('mobile-open'));
    });
    navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('mobile-open')));
  }
}

// ─── AUTH ─────────────────────────────────────────
function initAuth() {
  updateAuthUI();
  const loginBtn = document.getElementById('loginBtn');
  const authModal = document.getElementById('authModal');
  const authModalClose = document.getElementById('authModalClose');
  const loginSubmit = document.getElementById('loginSubmit');
  const registerSubmit = document.getElementById('registerSubmit');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');
  const logoutBtn = document.getElementById('logoutBtn');
  const userLoggedBtn = document.getElementById('userLoggedBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (loginBtn) loginBtn.addEventListener('click', () => openModal('authModal'));
  if (authModalClose) authModalClose.addEventListener('click', () => closeModal('authModal'));
  if (authModal) authModal.addEventListener('click', e => { if (e.target === authModal) closeModal('authModal'); });

  if (showRegister) showRegister.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
  });
  if (showLogin) showLogin.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  });
  if (loginSubmit) loginSubmit.addEventListener('click', handleLogin);
  if (registerSubmit) registerSubmit.addEventListener('click', handleRegister);

  if (userLoggedBtn) userLoggedBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdownMenu && dropdownMenu.classList.toggle('open');
  });
  document.addEventListener('click', () => { if (dropdownMenu) dropdownMenu.classList.remove('open'); });

  if (logoutBtn) logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    setCurrentUser(null); saveCart([]);
    updateAuthUI(); updateCartUI();
    showToast('Sesión cerrada correctamente');
  });

  const adminLogout = document.getElementById('adminLogout');
  if (adminLogout) adminLogout.addEventListener('click', e => {
    e.preventDefault(); setCurrentUser(null); window.location.href = 'index.html';
  });
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  if (!email || !password) { errorEl.textContent = 'Completa todos los campos.'; return; }
  try {
    const user = await loginOnApi(email, password);
    setCurrentUser({ name: user.name, email: user.email, role: user.role });
    errorEl.textContent = '';
    closeModal('authModal');
    if (user.role === 'admin') { window.location.href = 'admin.html'; return; }
    updateAuthUI();
    showToast(`¡Bienvenido, ${user.name}! 🎮`);
  } catch (err) {
    errorEl.textContent = err.message || 'Correo o contraseña incorrectos.';
  }
}

async function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errorEl = document.getElementById('registerError');
  if (!name || !email || !password) { errorEl.textContent = 'Completa todos los campos.'; return; }
  if (password.length < 6) { errorEl.textContent = 'La contraseña debe tener mínimo 6 caracteres.'; return; }
  try {
    const user = await registerOnApi(name, email, password);
    setCurrentUser({ name: user.name, email: user.email, role: user.role });
    errorEl.textContent = ''; closeModal('authModal'); updateAuthUI();
    showToast(`¡Cuenta creada! Bienvenido al nexo, ${name} 🎮`);
  } catch (err) {
    errorEl.textContent = err.message || 'No se pudo registrar la cuenta.';
  }
}

function updateAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('loginBtn');
  const userDropdown = document.getElementById('userDropdown');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const adminPanelLink = document.getElementById('adminPanelLink');
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userDropdown) userDropdown.style.display = 'block';
    if (userNameDisplay) userNameDisplay.textContent = user.name;
    if (adminPanelLink) { adminPanelLink.style.display = user.role === 'admin' ? 'flex' : 'none'; adminPanelLink.href = 'admin.html'; }
  } else {
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userDropdown) userDropdown.style.display = 'none';
  }
}

// ─── MODAL HELPERS ───────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

// ─── PRODUCTS ────────────────────────────────────
function initProducts() { renderProducts(); }

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = getProducts().map(p => productCard(p)).join('');
  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id));
  });
  setTimeout(initReveal, 50);
}

function productCard(p) {
  const outOfStock = p.stock === 0;
  const img = p.image || PRODUCT_IMAGE;
  const platform = (p.platform || '').toUpperCase();
  const desc = p.description ? (p.description.length > 90 ? p.description.slice(0, 87) + '…' : p.description) : '';
  return `
    <article class="product-card reveal">
      <div class="product-img-wrap">
        <img src="${img}" alt="${p.name}" loading="lazy" />
        ${outOfStock ? '<span class="out-of-stock-badge">Agotado</span>' : ''}
      </div>
      <div class="product-body">
        <div class="product-meta-row">
          <span class="product-origin"><i class="fas fa-gamepad"></i> ${platform}</span>
          <span class="product-type-badge">${p.category || ''}</span>
        </div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${desc}</p>
        <div class="product-footer">
          <div class="product-pricing">
            <span class="product-size">${p.format || ''}</span>
            <span class="product-price">${formatPrice(p.price)}</span>
          </div>
          <button class="btn-add-cart ${outOfStock ? 'disabled' : ''}" data-id="${p.id}" type="button" ${outOfStock ? 'disabled' : ''} aria-label="Agregar ${p.name} al carrito">
            <i class="fas fa-cart-plus"></i>
            <span>${outOfStock ? 'Agotado' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

// ─── CART ─────────────────────────────────────────
function initCart() {
  updateCartUI();
  const cartBtn = document.getElementById('cartBtn');
  const cartModalClose = document.getElementById('cartModalClose');
  const cartModal = document.getElementById('cartModal');
  const needLoginClose = document.getElementById('needLoginClose');
  const needLoginModal = document.getElementById('needLoginModal');
  const needLoginGoLogin = document.getElementById('needLoginGoLogin');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cartBtn) cartBtn.addEventListener('click', () => openModal('cartModal'));
  if (cartModalClose) cartModalClose.addEventListener('click', () => closeModal('cartModal'));
  if (cartModal) cartModal.addEventListener('click', e => { if (e.target === cartModal) closeModal('cartModal'); });
  if (needLoginClose) needLoginClose.addEventListener('click', () => closeModal('needLoginModal'));
  if (needLoginModal) needLoginModal.addEventListener('click', e => { if (e.target === needLoginModal) closeModal('needLoginModal'); });
  if (needLoginGoLogin) needLoginGoLogin.addEventListener('click', () => { closeModal('needLoginModal'); openModal('authModal'); });
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    saveCart([]); updateCartUI(); closeModal('cartModal');
    showToast('¡Compra exitosa! Tu pedido está en camino 🎮🎉');
  });
}

function addToCart(productId) {
  const user = getCurrentUser();
  if (!user) { openModal('needLoginModal'); return; }
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product || product.stock === 0) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    if (existing.qty >= product.stock) { showToast('No hay más unidades disponibles', 'error'); return; }
    existing.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart); updateCartUI();
  showToast(`${product.name} agregado al carrito 🎮`);
}

function updateCartUI() {
  const cart = getCart();
  const products = getProducts();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.getElementById('cartCount');
  if (cartCount) { cartCount.textContent = totalItems; cartCount.classList.toggle('visible', totalItems > 0); }

  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Tu carrito está vacío</p><span>Agrega juegos para comenzar</span></div>`;
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  let subtotal = 0;
  cartItems.innerHTML = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return '';
    subtotal += p.price * item.qty;
    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${p.image || PRODUCT_IMAGE}" alt="${p.name}" />
        </div>
        <div class="cart-item-details">
          <div class="cart-item-top">
            <div class="cart-item-info">
              <h4 class="cart-item-name">${p.name}</h4>
              <p class="cart-item-variant">${p.platform} · ${p.format || ''}</p>
            </div>
            <span class="cart-item-price">${formatPrice(p.price * item.qty)}</span>
          </div>
          <div class="cart-item-bottom">
            <div class="cart-item-qty">
              <button class="qty-btn" type="button" data-action="decrease" data-id="${p.id}"><i class="fas fa-minus"></i></button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" type="button" data-action="increase" data-id="${p.id}"><i class="fas fa-plus"></i></button>
            </div>
            <button class="btn-remove-item" type="button" data-id="${p.id}"><i class="fas fa-trash-alt"></i> Quitar</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  cartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const products = getProducts();
      const item = cart.find(i => i.id === btn.dataset.id);
      const product = products.find(p => p.id === btn.dataset.id);
      if (!item) return;
      if (btn.dataset.action === 'increase') {
        if (item.qty >= product.stock) { showToast('Máximo stock disponible', 'error'); return; }
        item.qty++;
      } else {
        item.qty--;
        if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
      }
      saveCart(cart); updateCartUI();
    });
  });
  cartItems.querySelectorAll('.btn-remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      saveCart(getCart().filter(i => i.id !== btn.dataset.id));
      updateCartUI();
    });
  });

  if (cartFooter) {
    cartFooter.style.display = 'block';
    document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('cartTotal').textContent = formatPrice(subtotal);
  }
}

// ─── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadProductsFromApi();
  } catch {
    saveProducts(PRODUCTS_DEFAULT);
    showToast('Sin conexión al servidor. Usando datos locales.', 'error');
  }
  initReveal(); initNavbar(); initAuth(); initProducts(); initCart(); updateAuthUI();
  setTimeout(initReveal, 100);
});
