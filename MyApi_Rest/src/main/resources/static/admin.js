/* =============================================
   NEXUSGAMES — ADMIN.JS
   ============================================= */

function guardAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') window.location.href = 'index.html';
}

function initAdminNav() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  const topbarTitle = document.getElementById('topbarTitle');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== sidebarToggle)
        sidebar.classList.remove('open');
    });
  }

  const sectionTitles = { dashboard: 'Dashboard', products: 'Gestión de Productos', inventory: 'Gestión de Inventario' };
  document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      activateSection(section);
      if (topbarTitle) topbarTitle.textContent = sectionTitles[section] || 'Dashboard';
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      if (sidebar) sidebar.classList.remove('open');
    });
  });

  const adminLogout = document.getElementById('adminLogout');
  if (adminLogout) adminLogout.addEventListener('click', e => {
    e.preventDefault(); setCurrentUser(null); window.location.href = 'index.html';
  });
}

function activateSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('section-' + name);
  if (target) target.classList.add('active');
  if (name === 'dashboard') renderDashboard();
  if (name === 'products') renderAdminTable();
  if (name === 'inventory') renderInventoryGrid();
}

// ─── DASHBOARD ────────────────────────────────────
function renderDashboard() {
  const products = getProducts();
  const totalProducts = products.length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const simulatedSales = Math.floor(Math.random() * 60 + 20);

  const statsGrid = document.getElementById('statsGrid');
  if (statsGrid) {
    statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-icon" style="background:rgba(139,92,246,0.15);color:var(--purple-light)">
          <i class="fas fa-box-open"></i>
        </div>
        <div class="stat-card-body">
          <span class="stat-card-label">Total productos</span>
          <strong class="stat-card-num">${totalProducts}</strong>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:rgba(239,68,68,0.12);color:#ef4444">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="stat-card-body">
          <span class="stat-card-label">Agotados</span>
          <strong class="stat-card-num">${outOfStock}</strong>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:rgba(34,197,94,0.12);color:var(--green)">
          <i class="fas fa-warehouse"></i>
        </div>
        <div class="stat-card-body">
          <span class="stat-card-label">Unidades en stock</span>
          <strong class="stat-card-num">${totalStock}</strong>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:rgba(6,182,212,0.12);color:var(--cyan)">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-card-body">
          <span class="stat-card-label">Ventas simuladas</span>
          <strong class="stat-card-num">${simulatedSales}</strong>
        </div>
      </div>
    `;
  }

  const miniList = document.getElementById('miniProductsList');
  if (miniList) {
    miniList.innerHTML = products.slice(0, 5).map(p => `
      <div class="mini-product-row">
        <img src="${p.image || 'assets/producto-default.png'}" alt="${p.name}" />
        <div class="mini-product-info">
          <span>${p.name}</span>
          <span>${p.category} · ${p.platform}</span>
        </div>
        <span class="mini-product-price">${formatPrice(p.price)}</span>
      </div>
    `).join('');
  }

  const activityList = document.getElementById('activityList');
  if (activityList) {
    const activities = [
      { dot: 'green', text: 'Nuevo pedido — God of War Ragnarök PS5', time: 'Hace 3 min' },
      { dot: 'gold',  text: 'Stock bajo: Zelda TotK — 22 unidades', time: 'Hace 15 min' },
      { dot: 'green', text: 'Nuevo usuario registrado', time: 'Hace 28 min' },
      { dot: 'red',   text: 'Red Dead Redemption 2 — Agotado', time: 'Hace 1 hora' },
      { dot: 'green', text: 'Pedido completado — Elden Ring PC', time: 'Hace 2 horas' },
    ];
    activityList.innerHTML = activities.map(a => `
      <div class="activity-row">
        <div class="activity-dot ${a.dot}"></div>
        <div class="activity-info">
          <span>${a.text}</span>
          <span>${a.time}</span>
        </div>
      </div>
    `).join('');
  }
}

// ─── PRODUCTS TABLE ───────────────────────────────
function renderAdminTable() {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;
  const products = getProducts();

  tbody.innerHTML = products.map(p => {
    let stockClass, stockLabel;
    if (p.stock === 0)         { stockClass = 'stock-out'; stockLabel = 'Agotado'; }
    else if (p.stock <= 10)    { stockClass = 'stock-low'; stockLabel = 'Pocas unidades'; }
    else                       { stockClass = 'stock-ok';  stockLabel = 'Disponible'; }

    return `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${p.image || 'assets/producto-default.png'}" alt="${p.name}" />
            <div>
              <span>${p.name}</span>
              <span>${p.genre || ''}</span>
            </div>
          </div>
        </td>
        <td>${p.platform}</td>
        <td>${p.category}</td>
        <td>${p.format}</td>
        <td>${formatPrice(p.price)}</td>
        <td>${p.stock}</td>
        <td><span class="stock-badge ${stockClass}">${stockLabel}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-tbl btn-tbl-edit"    title="Editar"      data-id="${p.id}"><i class="fas fa-pen"></i></button>
            <button class="btn-tbl btn-tbl-restock" title="Stock"       data-id="${p.id}"><i class="fas fa-boxes"></i></button>
            <button class="btn-tbl btn-tbl-delete"  title="Eliminar"    data-id="${p.id}"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-tbl-edit').forEach(btn => btn.addEventListener('click', () => openEditModal(btn.dataset.id)));
  tbody.querySelectorAll('.btn-tbl-restock').forEach(btn => btn.addEventListener('click', () => openRestockModal(btn.dataset.id)));
  tbody.querySelectorAll('.btn-tbl-delete').forEach(btn => btn.addEventListener('click', () => deleteProduct(btn.dataset.id)));
}

// ─── INVENTORY GRID ───────────────────────────────
function renderInventoryGrid() {
  const grid = document.getElementById('inventoryGrid');
  if (!grid) return;
  const products = getProducts();
  const maxStock = 100;

  grid.innerHTML = products.map(p => {
    const pct = Math.min((p.stock / maxStock) * 100, 100);
    let barClass, statusClass, statusLabel;
    if (p.stock === 0)      { barClass = 'stock-bar-out'; statusClass = 'stock-out'; statusLabel = 'Agotado'; }
    else if (p.stock <= 10) { barClass = 'stock-bar-low'; statusClass = 'stock-low'; statusLabel = 'Pocas unidades'; }
    else                    { barClass = 'stock-bar-ok';  statusClass = 'stock-ok';  statusLabel = 'Disponible'; }

    return `
      <div class="inventory-card">
        <div class="inventory-card-header">
          <img src="${p.image || 'assets/producto-default.png'}" alt="${p.name}" />
          <div>
            <h4>${p.name}</h4>
            <p>${p.category} · ${p.platform}</p>
          </div>
        </div>
        <div class="stock-bar-container">
          <div class="stock-bar-fill ${barClass}" style="width:${pct}%"></div>
        </div>
        <div class="inventory-footer">
          <div>
            <div class="inv-stock-label">Unidades disponibles</div>
            <div class="inv-stock-num">${p.stock} <span class="stock-badge ${statusClass}" style="margin-left:6px">${statusLabel}</span></div>
          </div>
          <button class="btn-inv-restock" data-id="${p.id}">Actualizar</button>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.btn-inv-restock').forEach(btn => btn.addEventListener('click', () => openRestockModal(btn.dataset.id)));
}

// ─── PRODUCT MODAL ────────────────────────────────
let _editingId = null;

function initProductModal() {
  const addBtn = document.getElementById('addProductBtn');
  const closeBtn = document.getElementById('productModalClose');
  const saveBtn = document.getElementById('productSave');
  const modal = document.getElementById('productModal');

  if (addBtn) addBtn.addEventListener('click', () => {
    _editingId = null;
    document.getElementById('productModalTitle').textContent = 'Agregar Producto';
    clearProductForm(); openModal('productModal');
  });
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal('productModal'));
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal('productModal'); });
  if (saveBtn) saveBtn.addEventListener('click', saveProduct);
}

function openEditModal(id) {
  const p = getProducts().find(pr => pr.id === id);
  if (!p) return;
  _editingId = id;
  document.getElementById('productModalTitle').textContent = 'Editar Producto';
  document.getElementById('pId').value = p.id;
  document.getElementById('pName').value = p.name;
  document.getElementById('pPlatform').value = p.platform;
  document.getElementById('pCategory').value = p.category;
  document.getElementById('pFormat').value = p.format;
  document.getElementById('pPrice').value = p.price;
  document.getElementById('pStock').value = p.stock;
  document.getElementById('pDesc').value = p.description;
  document.getElementById('pImage').value = p.image || '';
  document.getElementById('pGenre').value = p.genre || '';
  document.getElementById('productError').textContent = '';
  openModal('productModal');
}

function clearProductForm() {
  ['pId','pName','pPlatform','pDesc','pImage','pGenre'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('pCategory').value = 'Juego Físico';
  document.getElementById('pFormat').value = 'Standard Edition';
  document.getElementById('pPrice').value = '';
  document.getElementById('pStock').value = '';
  document.getElementById('productError').textContent = '';
}

async function saveProduct() {
  const name     = document.getElementById('pName').value.trim();
  const platform = document.getElementById('pPlatform').value.trim();
  const category = document.getElementById('pCategory').value;
  const format   = document.getElementById('pFormat').value;
  const price    = parseInt(document.getElementById('pPrice').value);
  const stock    = parseInt(document.getElementById('pStock').value);
  const description = document.getElementById('pDesc').value.trim();
  const image    = document.getElementById('pImage').value.trim();
  const genre    = document.getElementById('pGenre').value.trim();
  const errorEl  = document.getElementById('productError');

  if (!name || !platform || isNaN(price) || isNaN(stock)) {
    errorEl.textContent = 'Completa todos los campos obligatorios.'; return;
  }
  errorEl.textContent = '';

  const payload = { name, platform, category, format, price, stock, description, image, genre };
  try {
    let saved;
    if (_editingId) {
      saved = await updateProductOnApi(_editingId, payload);
    } else {
      saved = await createProductOnApi(payload);
    }

    const products = getProducts();
    if (_editingId) {
      const idx = products.findIndex(p => p.id === _editingId);
      if (idx !== -1) products[idx] = saved;
    } else {
      products.push(saved);
    }
    saveProducts(products);
    closeModal('productModal');
    renderAdminTable();
    renderDashboard();
    showToast(_editingId ? 'Producto actualizado ✓' : 'Producto creado ✓');
  } catch (err) {
    errorEl.textContent = err.message || 'Error al guardar producto.';
  }
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto del catálogo?')) return;
  try {
    await deleteProductOnApi(id);
    const products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
    renderAdminTable();
    renderDashboard();
    showToast('Producto eliminado');
  } catch (err) {
    showToast(err.message || 'Error al eliminar', 'error');
  }
}

// ─── RESTOCK MODAL ───────────────────────────────
function openRestockModal(id) {
  const p = getProducts().find(pr => pr.id === id);
  if (!p) return;
  document.getElementById('restockProductName').textContent = `${p.name} — ${p.platform}`;
  document.getElementById('currentStockDisplay').textContent = p.stock;
  document.getElementById('restockProductId').value = id;
  document.getElementById('restockQty').value = 10;
  openModal('restockModal');
}

function initRestockModal() {
  const closeBtn = document.getElementById('restockModalClose');
  const modal = document.getElementById('restockModal');
  const addBtn = document.getElementById('restockAdd');
  const removeBtn = document.getElementById('restockRemove');
  const minusBtn = document.getElementById('restockMinus');
  const plusBtn = document.getElementById('restockPlus');
  const qtyInput = document.getElementById('restockQty');

  if (closeBtn) closeBtn.addEventListener('click', () => closeModal('restockModal'));
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal('restockModal'); });

  if (minusBtn) minusBtn.addEventListener('click', () => {
    const v = parseInt(qtyInput.value) || 1;
    if (v > 1) qtyInput.value = v - 1;
  });
  if (plusBtn) plusBtn.addEventListener('click', () => {
    qtyInput.value = (parseInt(qtyInput.value) || 1) + 1;
  });

  if (addBtn) addBtn.addEventListener('click', () => doRestock('add'));
  if (removeBtn) removeBtn.addEventListener('click', () => doRestock('remove'));
}

async function doRestock(action) {
  const id = document.getElementById('restockProductId').value;
  const qty = parseInt(document.getElementById('restockQty').value) || 0;
  if (qty <= 0) { showToast('Cantidad inválida', 'error'); return; }

  try {
    const updated = await updateStockOnApi(id, action, qty);
    const products = getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) products[idx] = updated;
    saveProducts(products);
    document.getElementById('currentStockDisplay').textContent = updated.stock;
    closeModal('restockModal');
    renderInventoryGrid();
    renderAdminTable();
    renderDashboard();
    showToast(`Stock ${action === 'add' ? 'aumentado' : 'reducido'} correctamente ✓`);
  } catch (err) {
    showToast(err.message || 'Error al actualizar stock', 'error');
  }
}

// ─── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  guardAdmin();
  try { await loadProductsFromApi(); } catch { /* usar cache */ }
  initAdminNav();
  initProductModal();
  initRestockModal();
  renderDashboard();
});
