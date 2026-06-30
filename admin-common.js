/* ==========================================================================
   DIGNITY ART EDGE — ADMIN COMMON
   Shared across every admin/*.html page: sidebar + topbar rendering, a
   simple hardcoded-credential auth guard (this is a frontend-only demo —
   a real build would authenticate against a server), and the admin's own
   editable copy of the product catalog.
   ========================================================================== */

const DAE_ADMIN_DEMO = { email: "admin@dignityartedge.com", password: "Admin@123" };

/* ---------- Admin auth ---------- */
function daeAdminLogin(email, password) {
  const override = daeStoreGet("dae_admin_password_override", null);
  const expectedPassword = override || DAE_ADMIN_DEMO.password;
  if (email.toLowerCase() === DAE_ADMIN_DEMO.email && password === expectedPassword) {
    daeStoreSet(DAE.KEYS.ADMIN_SESSION, { email, name: "Studio Admin", loginAt: new Date().toISOString() });
    return true;
  }
  return false;
}
function daeAdminRequireAuth() {
  const session = daeStoreGet(DAE.KEYS.ADMIN_SESSION, null);
  if (!session) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}
function daeAdminLogout() {
  localStorage.removeItem(DAE.KEYS.ADMIN_SESSION);
  window.location.href = "login.html";
}

/* ---------- Admin product store (separate from the read-only DAE_PRODUCTS in data.js) ---------- */
function daeGetAdminProducts() {
  let products = daeStoreGet(DAE.KEYS.ADMIN_PRODUCTS, null);
  if (!products) {
    products = JSON.parse(JSON.stringify(DAE_PRODUCTS)); // deep clone the seed catalog once
    daeStoreSet(DAE.KEYS.ADMIN_PRODUCTS, products);
  }
  return products;
}
function daeSaveAdminProducts(products) {
  daeStoreSet(DAE.KEYS.ADMIN_PRODUCTS, products);
}

/* ---------- Sidebar + topbar ---------- */
const ADMIN_NAV = [
  { key: "dashboard", label: "Dashboard", icon: "bi-grid-1x2", href: "dashboard.html" },
  { key: "products", label: "Products", icon: "bi-palette", href: "products.html" },
  { key: "orders", label: "Orders", icon: "bi-box-seam", href: "orders.html" },
  { key: "customers", label: "Customers", icon: "bi-people", href: "customers.html" },
  { key: "inventory", label: "Inventory", icon: "bi-clipboard-data", href: "inventory.html" },
  { key: "reports", label: "Reports", icon: "bi-bar-chart", href: "reports.html" },
  { key: "settings", label: "Settings", icon: "bi-gear", href: "settings.html" },
];

function daeRenderAdminShell(pageKey, pageTitle) {
  const session = daeStoreGet(DAE.KEYS.ADMIN_SESSION, null);

  document.body.classList.add("admin-body");
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="admin-shell">
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="sidebar-brand">
          <a href="dashboard.html" class="brand-mark">Dignity <span>Art</span> Edge</a>
          <small>Studio Admin Console</small>
        </div>
        <nav class="admin-nav">
          ${ADMIN_NAV.map((item) => `<a href="${item.href}" class="${item.key === pageKey ? "active" : ""}"><i class="bi ${item.icon}"></i> ${item.label}</a>`).join("")}
        </nav>
        <div class="sidebar-footer">
          <a href="../index.html"><i class="bi bi-box-arrow-up-right me-1"></i> View Storefront</a>
        </div>
      </aside>

      <div class="admin-main">
        <header class="admin-topbar">
          <div class="d-flex align-items-center gap-3">
            <button id="admin-sidebar-toggle" class="btn btn-sm btn-outline-secondary"><i class="bi bi-list"></i></button>
            <h1>${pageTitle}</h1>
          </div>
          <div class="topbar-actions">
            <span class="label-mono d-none d-md-inline"><i class="bi bi-person-circle me-1"></i>${session ? daeEscapeHtml(session.name) : "Admin"}</span>
            <button class="btn btn-sm btn-dae btn-dae-outline" id="admin-logout-btn"><i class="bi bi-box-arrow-right"></i> Logout</button>
          </div>
        </header>
        <main class="admin-content" id="admin-content-mount"></main>
      </div>
    </div>`
  );

  document.getElementById("admin-logout-btn").addEventListener("click", daeAdminLogout);
  const toggle = document.getElementById("admin-sidebar-toggle");
  if (toggle) toggle.addEventListener("click", () => document.getElementById("admin-sidebar").classList.toggle("show"));
}

/* Small stat-card builder reused on dashboard.html and reports.html */
function daeStatCardHtml({ icon, color, value, label, delta }) {
  return `
  <div class="stat-card">
    <div class="stat-icon" style="background:${color}20;color:${color};"><i class="bi ${icon}"></i></div>
    <div class="stat-value">${value}</div>
    <div class="stat-label">${label}</div>
    ${delta ? `<div class="stat-delta ${delta.startsWith("-") ? "down" : "up"} mt-1"><i class="bi bi-arrow-${delta.startsWith("-") ? "down" : "up"}-short"></i>${delta}</div>` : ""}
  </div>`;
}

function daeStockStatus(stock) {
  if (stock === 0) return { label: "Out of Stock", cls: "out-of-stock" };
  if (stock <= 5) return { label: "Low Stock", cls: "low-stock" };
  return { label: "In Stock", cls: "in-stock" };
}
