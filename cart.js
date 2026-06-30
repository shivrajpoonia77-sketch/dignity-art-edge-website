/* ==========================================================================
   DIGNITY ART EDGE — CART
   Cart items are stored in localStorage as: [{ id, qty }]. Product details
   (name, price, image…) are always re-joined from DAE_PRODUCTS at render
   time, so the cart never goes stale if catalog data changes.
   ========================================================================== */

function daeGetCart() {
  return daeStoreGet(DAE.KEYS.CART, []);
}
function daeSaveCart(cart) {
  daeStoreSet(DAE.KEYS.CART, cart);
  daeUpdateNavBadges();
}

/* ---------- Add a product to the cart (or increase qty if already present) ---------- */
function daeAddToCart(productId, qty = 1) {
  const product = daeGetProductById(productId);
  if (!product) return;
  const cart = daeGetCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cart.push({ id: productId, qty: Math.min(qty, product.stock) });
  }
  daeSaveCart(cart);
  daeToast(`${product.name} added to your cart`, "success", "bi-bag-check");
}

function daeRemoveFromCart(productId) {
  const cart = daeGetCart().filter((i) => i.id !== productId);
  daeSaveCart(cart);
}

function daeSetCartQty(productId, qty) {
  const product = daeGetProductById(productId);
  const cart = daeGetCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, Math.min(qty, product ? product.stock : 99));
  daeSaveCart(cart);
}

/* ---------- Joined cart rows: [{ product, qty, lineTotal }] ---------- */
function daeCartDetailed() {
  return daeGetCart()
    .map((item) => {
      const product = daeGetProductById(item.id);
      if (!product) return null;
      return { product, qty: item.qty, lineTotal: product.price * item.qty };
    })
    .filter(Boolean);
}

function daeCartSubtotal() {
  return daeCartDetailed().reduce((sum, row) => sum + row.lineTotal, 0);
}

/* ---------- Renders the cart table on pages/cart.html ---------- */
function daeRenderCartPage() {
  const tbody = document.getElementById("cart-items-body");
  const emptyState = document.getElementById("cart-empty-state");
  const cartWrap = document.getElementById("cart-table-wrap");
  if (!tbody) return;

  const rows = daeCartDetailed();

  if (rows.length === 0) {
    cartWrap.classList.add("d-none");
    emptyState.classList.remove("d-none");
    daeUpdateCartSummary();
    return;
  }
  cartWrap.classList.remove("d-none");
  emptyState.classList.add("d-none");

  tbody.innerHTML = rows
    .map(
      (row) => `
    <tr data-id="${row.product.id}">
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${row.product.image}" alt="${daeEscapeHtml(row.product.name)}" width="72" height="90" class="rounded-1" style="object-fit:cover;">
          <div>
            <a href="product-details.html?id=${row.product.id}" class="fw-semibold text-decoration-none text-dark d-block">${daeEscapeHtml(row.product.name)}</a>
            <span class="label-mono">${row.product.id}</span>
          </div>
        </div>
      </td>
      <td class="font-mono">${daeFormatPrice(row.product.price)}</td>
      <td>
        <div class="input-group input-group-sm" style="width:120px;">
          <button class="btn btn-outline-secondary qty-decrease" type="button">&minus;</button>
          <input type="number" class="form-control text-center cart-qty-input" min="1" max="${row.product.stock}" value="${row.qty}">
          <button class="btn btn-outline-secondary qty-increase" type="button">&plus;</button>
        </div>
      </td>
      <td class="font-mono fw-semibold line-total">${daeFormatPrice(row.lineTotal)}</td>
      <td><button class="btn btn-sm btn-icon-circle remove-item" title="Remove"><i class="bi bi-trash3"></i></button></td>
    </tr>`
    )
    .join("");

  // wire up qty / remove controls (delegated would also work, this is simpler given a fresh render each time)
  tbody.querySelectorAll("tr").forEach((tr) => {
    const id = tr.dataset.id;
    const input = tr.querySelector(".cart-qty-input");
    tr.querySelector(".qty-increase").addEventListener("click", () => {
      daeSetCartQty(id, parseInt(input.value, 10) + 1);
      daeRenderCartPage();
    });
    tr.querySelector(".qty-decrease").addEventListener("click", () => {
      daeSetCartQty(id, parseInt(input.value, 10) - 1);
      daeRenderCartPage();
    });
    input.addEventListener("change", () => {
      daeSetCartQty(id, parseInt(input.value, 10) || 1);
      daeRenderCartPage();
    });
    tr.querySelector(".remove-item").addEventListener("click", () => {
      daeRemoveFromCart(id);
      daeToast("Item removed from cart", "info", "bi-trash3");
      daeRenderCartPage();
    });
  });

  daeUpdateCartSummary();
}

/* ---------- Order summary card on the cart page (subtotal, shipping, total) ---------- */
function daeUpdateCartSummary() {
  const subtotalEl = document.getElementById("cart-subtotal");
  const shippingEl = document.getElementById("cart-shipping");
  const totalEl = document.getElementById("cart-total");
  if (!subtotalEl) return;

  const subtotal = daeCartSubtotal();
  const shipping = subtotal === 0 ? 0 : subtotal >= 15000 ? 0 : 350;
  const total = subtotal + shipping;

  subtotalEl.textContent = daeFormatPrice(subtotal);
  shippingEl.textContent = shipping === 0 ? "Free" : daeFormatPrice(shipping);
  totalEl.textContent = daeFormatPrice(total);

  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (checkoutBtn) checkoutBtn.classList.toggle("disabled", daeGetCart().length === 0);
}
