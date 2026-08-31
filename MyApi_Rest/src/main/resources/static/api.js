/* =============================================
   NEXUSGAMES — Cliente API (Spring Boot)
   ============================================= */

const API_BASE = window.location.origin.includes('8080')
  ? window.location.origin
  : 'http://localhost:8080';

let productsCache = [];

const PRODUCT_IMAGE_DEFAULT = 'assets/producto-default.png';

function mapProductFromApi(p) {
  return {
    id: String(p.id),
    name: p.name,
    platform: p.platform,
    category: p.category,
    format: p.format,
    price: p.price,
    stock: p.stock,
    description: p.description || '',
    image: p.image || PRODUCT_IMAGE_DEFAULT,
    genre: p.genre || ''
  };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); }
    catch { data = { message: text }; }
  }

  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

async function loadProductsFromApi() {
  const list = await apiFetch('/api/productos');
  productsCache = Array.isArray(list) ? list.map(mapProductFromApi) : [];
  return productsCache;
}

async function createProductOnApi(product) {
  const saved = await apiFetch('/api/productos', { method: 'POST', body: JSON.stringify(product) });
  return mapProductFromApi(saved);
}

async function updateProductOnApi(id, product) {
  const saved = await apiFetch(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(product) });
  return mapProductFromApi(saved);
}

async function deleteProductOnApi(id) {
  await apiFetch(`/api/productos/${id}`, { method: 'DELETE' });
}

async function updateStockOnApi(id, action, quantity) {
  const saved = await apiFetch(`/api/productos/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ action, quantity })
  });
  return mapProductFromApi(saved);
}

async function loginOnApi(email, password) {
  return apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

async function registerOnApi(name, email, password) {
  return apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

function syncProductsCache(products) {
  productsCache = products;
}
