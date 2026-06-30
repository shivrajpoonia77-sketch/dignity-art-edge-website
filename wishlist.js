/* ==========================================================================
   DIGNITY ART EDGE — WISHLIST
   Wishlist items are stored as a flat array of product ids, e.g.
   ["DAE-014", "DAE-052"]. Far simpler than the cart since quantity does
   not apply to a wishlist.
   ========================================================================== */

function daeGetWishlist() {
  return daeStoreGet(DAE.KEYS.WISHLIST, []);
}
function daeSaveWishlist(list) {
  daeStoreSet(DAE.KEYS.WISHLIST, list);
  daeUpdateNavBadges();
}
function daeIsWishlisted(productId) {
  return daeGetWishlist().includes(productId);
}

function daeToggleWishlist(productId) {
  let list = daeGetWishlist();
  const product = daeGetProductById(productId);
  if (list.includes(productId)) {
    list = list.filter((id) => id !== productId);
    daeSaveWishlist(list);
    daeToast(`${product ? product.name : "Item"} removed from wishlist`, "info", "bi-heart");
  } else {
    list.push(productId);
    daeSaveWishlist(list);
    daeToast(`${product ? product.name : "Item"} added to wishlist`, "success", "bi-heart-fill");
  }
  return list.includes(productId);
}

/* ---------- Renders the grid on pages/wishlist.html ---------- */
function daeRenderWishlistPage() {
  const grid = document.getElementById("wishlist-grid");
  const emptyState = document.getElementById("wishlist-empty-state");
  if (!grid) return;

  const products = daeGetWishlist().map(daeGetProductById).filter(Boolean);

  if (products.length === 0) {
    grid.classList.add("d-none");
    emptyState.classList.remove("d-none");
    return;
  }
  grid.classList.remove("d-none");
  emptyState.classList.add("d-none");

  grid.innerHTML = products
    .map(
      (p) => `
    <div class="col-6 col-md-4 col-lg-3">
      ${daeProductCardHtml(p)}
    </div>`
    )
    .join("");

  daeWireProductCardButtons(grid);
}
