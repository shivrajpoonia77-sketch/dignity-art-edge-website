/* ==========================================================================
   PRODUCT DETAILS PAGE SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const id = daeGetQueryParam("id");
  const product = id ? daeGetProductById(id) : null;

  if (!product) {
    document.getElementById("pd-content").classList.add("d-none");
    document.getElementById("pd-not-found").classList.remove("d-none");
    document.querySelector(".container.pt-4").classList.add("d-none");
    return;
  }

  daeRenderProductDetails(product);
});

function daeRenderProductDetails(p) {
  document.title = `${p.name} — Dignity Art Edge`;
  document.getElementById("pd-breadcrumb-name").textContent = p.name;

  const category = daeGetCategory(p.category);

  document.getElementById("pd-main-image").src = p.image;
  document.getElementById("pd-main-image").alt = p.name;
  document.getElementById("pd-image-placard").textContent = `${p.id} · ${p.medium}`;

  document.getElementById("pd-thumbnails").innerHTML = p.gallery
    .map((src, i) => `<div class="pd-thumb ${i === 0 ? "active" : ""}" data-src="${src}"><img src="${src}" alt="${daeEscapeHtml(p.name)} view ${i + 1}"></div>`)
    .join("");
  document.querySelectorAll(".pd-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.getElementById("pd-main-image").src = thumb.dataset.src;
      document.querySelectorAll(".pd-thumb").forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  document.getElementById("pd-category").textContent = category ? category.name : p.category;
  document.getElementById("pd-name").textContent = p.name;
  document.getElementById("pd-rating").innerHTML = daeStarRating(p.rating);
  document.getElementById("pd-reviews-count").textContent = `${p.rating.toFixed(1)} · ${p.reviews} reviews`;
  document.getElementById("pd-price").textContent = daeFormatPrice(p.price);
  document.getElementById("pd-old-price").textContent = p.oldPrice ? daeFormatPrice(p.oldPrice) : "";
  document.getElementById("pd-short-desc").textContent = p.description;
  document.getElementById("pd-full-desc").textContent = p.description + " Every piece is signed or stamped by the artisan studio and shipped with a printed certificate of authenticity matching its catalog number.";

  document.getElementById("pd-placard").innerHTML = `
    <span><strong>${p.id}</strong> Catalog No.</span>
    <span><strong>${daeEscapeHtml(p.medium)}</strong> Medium</span>
    <span><strong>${daeEscapeHtml(p.origin)}</strong> Origin</span>
    <span><strong>${p.year}</strong> Year</span>
    <span><strong>${daeEscapeHtml(p.dims)}</strong> Dimensions</span>
  `;

  const stockMsg = document.getElementById("pd-stock-msg");
  if (p.stock === 0) {
    stockMsg.innerHTML = `<span class="badge text-bg-danger">Sold Out</span>`;
  } else if (p.stock <= 4) {
    stockMsg.innerHTML = `<span class="badge" style="background:var(--warning);">Only ${p.stock} left in this edition</span>`;
  } else {
    stockMsg.innerHTML = `<span class="badge" style="background:var(--success);">In Stock</span>`;
  }

  // Quantity stepper
  const qtyInput = document.getElementById("pd-qty");
  qtyInput.max = p.stock;
  document.getElementById("pd-qty-plus").addEventListener("click", () => {
    qtyInput.value = Math.min(p.stock, parseInt(qtyInput.value, 10) + 1);
  });
  document.getElementById("pd-qty-minus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
  });

  // Add to cart
  const addBtn = document.getElementById("pd-add-cart-btn");
  if (p.stock === 0) {
    addBtn.disabled = true;
    addBtn.innerHTML = '<i class="bi bi-x-circle"></i> Sold Out';
  } else {
    addBtn.addEventListener("click", () => {
      daeAddToCart(p.id, parseInt(qtyInput.value, 10) || 1);
    });
  }

  // Wishlist toggle
  const wishBtn = document.getElementById("pd-wishlist-btn");
  const setWishIcon = () => {
    const active = daeIsWishlisted(p.id);
    wishBtn.classList.toggle("is-active", active);
    wishBtn.querySelector("i").className = active ? "bi bi-heart-fill" : "bi bi-heart";
  };
  setWishIcon();
  wishBtn.addEventListener("click", () => { daeToggleWishlist(p.id); setWishIcon(); });

  // Reviews (generated sample reviews so the tab isn't empty)
  daeRenderSampleReviews(p);

  // Related products
  const relatedGrid = document.getElementById("pd-related-grid");
  const related = daeRelatedProducts(p, 4);
  if (related.length === 0) {
    document.querySelector("#pd-related-grid").closest("div.mt-5").classList.add("d-none");
  } else {
    relatedGrid.innerHTML = related.map((rp) => `<div class="col-6 col-md-3">${daeProductCardHtml(rp)}</div>`).join("");
    daeWireProductCardButtons(relatedGrid);
  }
}

function daeRenderSampleReviews(p) {
  const names = ["Aditi R.", "Karan V.", "Sneha P.", "Farhan A."];
  const comments = [
    "Exactly as described, and the catalog placard made it feel like a genuine gallery purchase.",
    "Packaging was excellent for something this fragile — arrived without a scratch.",
    "Colour in person is even richer than the photos. Would buy from this studio again.",
    "A little smaller than I pictured, but the craftsmanship more than makes up for it.",
  ];
  const list = document.getElementById("pd-reviews-list");
  const count = Math.min(4, Math.max(2, Math.round(p.reviews / 15)));
  list.innerHTML = Array.from({ length: count })
    .map((_, i) => `
      <div class="review-card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="reviewer">${names[i]}</span>
          <span class="rating">${daeStarRating(4 + (i % 2 ? 0 : 1) === 5 ? 5 : 4.5)}</span>
        </div>
        <p class="mb-0">${comments[i]}</p>
      </div>`)
    .join("");
}
