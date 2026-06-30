/* ==========================================================================
   SHOP PAGE SCRIPT
   All filtering/sorting/pagination happens client-side against DAE_PRODUCTS.
   State lives in `shopState`; every control mutates it then calls
   daeRenderShopGrid() to redraw.
   ========================================================================== */

const PAGE_SIZE = 9;

const shopState = {
  search: "",
  categories: new Set(),
  maxPrice: 60000,
  minRating: 0,
  sort: "featured",
  page: 1,
};

document.addEventListener("DOMContentLoaded", () => {
  // Pre-select a category if the user arrived via ?category=slug (home page category tiles, footer links)
  const presetCategory = daeGetQueryParam("category");
  if (presetCategory) shopState.categories.add(presetCategory);

  daeBuildCategoryFilters();
  daeBuildRatingFilters();
  daeWireShopControls();
  daeRenderShopGrid();
});

function daeBuildCategoryFilters() {
  const wrap = document.getElementById("shop-category-filters");
  wrap.innerHTML = DAE_CATEGORIES.map(
    (cat) => `
    <div class="form-check">
      <input class="form-check-input shop-cat-checkbox" type="checkbox" value="${cat.slug}" id="cat-${cat.slug}" ${shopState.categories.has(cat.slug) ? "checked" : ""}>
      <label class="form-check-label" for="cat-${cat.slug}">${cat.name}</label>
    </div>`
  ).join("");
}

function daeBuildRatingFilters() {
  const wrap = document.getElementById("shop-rating-filters");
  [4, 3, 0].forEach((r) => {
    const div = document.createElement("div");
    div.className = "form-check";
    div.innerHTML = `
      <input class="form-check-input shop-rating-radio" type="radio" name="ratingFilter" value="${r}" id="rating-${r}" ${shopState.minRating === r ? "checked" : ""}>
      <label class="form-check-label" for="rating-${r}">${r === 0 ? "Any rating" : `${daeStarRating(r)} &amp; up`}</label>`;
    wrap.appendChild(div);
  });
}

function daeWireShopControls() {
  document.getElementById("shop-search").addEventListener(
    "input",
    daeDebounce((e) => {
      shopState.search = e.target.value.trim().toLowerCase();
      shopState.page = 1;
      daeRenderShopGrid();
    }, 250)
  );

  document.querySelectorAll(".shop-cat-checkbox").forEach((box) => {
    box.addEventListener("change", () => {
      box.checked ? shopState.categories.add(box.value) : shopState.categories.delete(box.value);
      shopState.page = 1;
      daeRenderShopGrid();
    });
  });

  const priceRange = document.getElementById("shop-price-range");
  priceRange.addEventListener("input", () => {
    shopState.maxPrice = parseInt(priceRange.value, 10);
    document.getElementById("shop-price-value").textContent = daeFormatPrice(shopState.maxPrice);
    shopState.page = 1;
    daeRenderShopGrid();
  });

  document.querySelectorAll(".shop-rating-radio").forEach((radio) => {
    radio.addEventListener("change", () => {
      shopState.minRating = parseInt(radio.value, 10);
      shopState.page = 1;
      daeRenderShopGrid();
    });
  });

  document.getElementById("shop-sort").addEventListener("change", (e) => {
    shopState.sort = e.target.value;
    daeRenderShopGrid();
  });

  document.getElementById("shop-reset-filters").addEventListener("click", () => {
    shopState.search = "";
    shopState.categories.clear();
    shopState.maxPrice = 60000;
    shopState.minRating = 0;
    shopState.sort = "featured";
    shopState.page = 1;
    document.getElementById("shop-search").value = "";
    document.getElementById("shop-price-range").value = 60000;
    document.getElementById("shop-price-value").textContent = "₹60,000";
    document.getElementById("shop-sort").value = "featured";
    daeBuildCategoryFilters();
    daeBuildRatingFilters();
    document.querySelectorAll(".shop-cat-checkbox").forEach((b) => b.addEventListener("change", () => {
      b.checked ? shopState.categories.add(b.value) : shopState.categories.delete(b.value);
      daeRenderShopGrid();
    }));
    document.querySelectorAll(".shop-rating-radio").forEach((r) => r.addEventListener("change", () => {
      shopState.minRating = parseInt(r.value, 10);
      daeRenderShopGrid();
    }));
    daeRenderShopGrid();
  });
}

function daeFilteredSortedProducts() {
  let list = DAE_PRODUCTS.filter((p) => {
    const matchSearch = !shopState.search || p.name.toLowerCase().includes(shopState.search) || p.category.includes(shopState.search);
    const matchCategory = shopState.categories.size === 0 || shopState.categories.has(p.category);
    const matchPrice = p.price <= shopState.maxPrice;
    const matchRating = p.rating >= shopState.minRating;
    return matchSearch && matchCategory && matchPrice && matchRating;
  });

  switch (shopState.sort) {
    case "price-asc": list.sort((a, b) => a.price - b.price); break;
    case "price-desc": list.sort((a, b) => b.price - a.price); break;
    case "rating": list.sort((a, b) => b.rating - a.rating); break;
    case "newest": list.sort((a, b) => b.year - a.year); break;
    default: list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1)); break;
  }
  return list;
}

function daeRenderShopGrid() {
  const grid = document.getElementById("shop-product-grid");
  const emptyState = document.getElementById("shop-empty-state");
  const countLabel = document.getElementById("shop-result-count");

  const filtered = daeFilteredSortedProducts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  shopState.page = Math.min(shopState.page, totalPages);
  const start = (shopState.page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  countLabel.textContent = `${filtered.length} piece${filtered.length === 1 ? "" : "s"} found`;

  if (pageItems.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
    grid.innerHTML = pageItems.map((p) => `<div class="col-6 col-md-4">${daeProductCardHtml(p)}</div>`).join("");
    daeWireProductCardButtons(grid);
  }

  daeRenderShopPagination(totalPages);
}

function daeRenderShopPagination(totalPages) {
  const pager = document.getElementById("shop-pagination");
  if (totalPages <= 1) { pager.innerHTML = ""; return; }

  let html = `<li class="page-item ${shopState.page === 1 ? "disabled" : ""}"><a class="page-link" href="#" data-page="${shopState.page - 1}">&laquo;</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === shopState.page ? "active" : ""}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  html += `<li class="page-item ${shopState.page === totalPages ? "disabled" : ""}"><a class="page-link" href="#" data-page="${shopState.page + 1}">&raquo;</a></li>`;
  pager.innerHTML = html;

  pager.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const p = parseInt(link.dataset.page, 10);
      if (p < 1 || p > totalPages) return;
      shopState.page = p;
      daeRenderShopGrid();
      window.scrollTo({ top: document.getElementById("shop-product-grid").offsetTop - 120, behavior: "smooth" });
    });
  });
}
