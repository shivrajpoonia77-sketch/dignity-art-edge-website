/* ==========================================================================
   DIGNITY ART EDGE — PRODUCT CARD COMPONENT
   One function builds the markup for a single product card, used on the
   home page featured grid, the shop grid, the wishlist grid and the
   "related products" rail on the product details page. Keeping it in one
   place means the card only has to be designed once.
   ========================================================================== */

function daeProductCardHtml(p) {
  const stockTag =
    p.stock === 0 ? '<span class="stock-tag out">Sold Out</span>' : p.stock <= 4 ? '<span class="stock-tag low">Only ' + p.stock + ' left</span>' : "";
  const badge = p.badge ? `<span class="stock-tag" style="left:auto;right:0.6rem;background:var(--rust);">${daeBadgeLabel(p.badge)}</span>` : "";
  const wished = daeIsWishlisted(p.id);
  const category = daeGetCategory(p.category);

  return `
  <div class="product-card" data-id="${p.id}">
    <div class="frame">
      <a href="${daeCardLinkPrefix()}product-details.html?id=${p.id}">
        <img src="${p.image}" alt="${daeEscapeHtml(p.name)}" loading="lazy">
      </a>
      ${stockTag}${badge}
      <div class="frame-actions">
        <button class="btn-icon-circle wishlist-toggle ${wished ? "is-active" : ""}" title="Add to wishlist" data-id="${p.id}">
          <i class="bi ${wished ? "bi-heart-fill" : "bi-heart"}"></i>
        </button>
        <a class="btn-icon-circle" title="Quick view" href="${daeCardLinkPrefix()}product-details.html?id=${p.id}"><i class="bi bi-eye"></i></a>
      </div>
    </div>
    <div class="body">
      <span class="cat-name">${category ? category.name : p.category}</span>
      <h3><a href="${daeCardLinkPrefix()}product-details.html?id=${p.id}" class="text-dark">${daeEscapeHtml(p.name)}</a></h3>
      <div class="rating mb-2">${daeStarRating(p.rating)} <span class="text-muted ms-1" style="font-size:0.78rem;">(${p.reviews})</span></div>
      <div class="price-row">
        <span class="price">${daeFormatPrice(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${daeFormatPrice(p.oldPrice)}</span>` : ""}
        <button class="btn btn-sm btn-dae btn-dae-primary ms-auto add-to-cart-btn" data-id="${p.id}" ${p.stock === 0 ? "disabled" : ""}>
          <i class="bi bi-bag-plus"></i>
        </button>
      </div>
    </div>
  </div>`;
}

/* Card links need a relative prefix depending on which folder the page lives in */
function daeCardLinkPrefix() {
  const page = window.DAE_PAGE || "";
  // pages already inside /pages/ link directly; index/home links into /pages/
  return page === "home" ? "pages/" : "";
}

/* Wires the "add to cart" and "wishlist" buttons inside a freshly-rendered grid container */
function daeWireProductCardButtons(container) {
  container.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      daeAddToCart(btn.dataset.id, 1);
    });
  });
  container.querySelectorAll(".wishlist-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const active = daeToggleWishlist(btn.dataset.id);
      btn.classList.toggle("is-active", active);
      btn.querySelector("i").className = active ? "bi bi-heart-fill" : "bi bi-heart";
      // if we're on the wishlist page itself, re-render so removed items disappear
      if (document.getElementById("wishlist-grid")) daeRenderWishlistPage();
    });
  });
}
