/* ==========================================================================
   DIGNITY ART EDGE — UTILITIES
   Small, dependency-free helper functions reused across every page. Keeping
   them here (instead of copy-pasting into each page script) is what makes
   the JavaScript "modular" — every other file in /assets/js relies on this
   one being loaded first.
   ========================================================================== */

const DAE = {
  /* ---------- localStorage keys, centralised so they never drift ---------- */
  KEYS: {
    CART: "dae_cart",
    WISHLIST: "dae_wishlist",
    USERS: "dae_users",
    SESSION: "dae_session",
    ORDERS: "dae_orders",
    ADMIN_PRODUCTS: "dae_admin_products",   // admin-editable copy of the catalog
    ADMIN_SESSION: "dae_admin_session",
    CONTACT_MESSAGES: "dae_contact_messages",
    STORE_SETTINGS: "dae_store_settings",
  },
};

/* ---------- Currency ---------- */
function daeFormatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

/* ---------- Generic localStorage read/write (JSON safe) ---------- */
function daeStoreGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn("DAE storage read failed for", key, e);
    return fallback;
  }
}
function daeStoreSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("DAE storage write failed for", key, e);
  }
}

/* ---------- Query string helper, e.g. product-details.html?id=DAE-014 ---------- */
function daeGetQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- Escape user-entered text before inserting into innerHTML ---------- */
function daeEscapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* ---------- Star rating markup, e.g. daeStarRating(4.5) ---------- */
function daeStarRating(value) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  let html = "";
  for (let i = 0; i < full; i++) html += '<i class="bi bi-star-fill"></i>';
  if (half) html += '<i class="bi bi-star-half"></i>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<i class="bi bi-star"></i>';
  return html;
}

/* ---------- Toast notifications (success / danger / info) ---------- */
function daeToast(message, type = "success", icon = "bi-check-circle") {
  let zone = document.getElementById("dae-toast-zone");
  if (!zone) {
    zone = document.createElement("div");
    zone.id = "dae-toast-zone";
    document.body.appendChild(zone);
  }
  const el = document.createElement("div");
  el.className = `dae-toast ${type}`;
  el.innerHTML = `<i class="bi ${icon}"></i><span>${daeEscapeHtml(message)}</span>`;
  zone.appendChild(el);
  setTimeout(() => {
    el.classList.add("fade-out");
    setTimeout(() => el.remove(), 350);
  }, 2600);
}

/* ---------- Debounce, used by the shop search box ---------- */
function daeDebounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* ---------- Simple id generator for orders / messages ---------- */
function daeGenerateId(prefix = "ID") {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

/* ---------- Date formatting ---------- */
function daeFormatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ---------- Badge label helper for product cards (new / bestseller / limited) ---------- */
function daeBadgeLabel(badge) {
  const map = { new: "New Arrival", bestseller: "Bestseller", limited: "Limited Edition" };
  return map[badge] || "";
}
