/* ==========================================================================
   HOME PAGE SCRIPT
   Populates the three dynamic grids on index.html. Runs after main.js has
   already mounted the navbar/footer (script tags are loaded in order at the
   bottom of the page, and this listener queues behind main.js's).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  daeRenderCategoryGrid();
  daeRenderFeaturedGrid();
  daeRenderNewArrivalsGrid();
});

function daeRenderCategoryGrid() {
  const grid = document.getElementById("home-category-grid");
  if (!grid) return;
  grid.innerHTML = DAE_CATEGORIES.map(
    (cat, i) => `
    <div class="col-6 col-md-4 col-lg-2 reveal delay-${(i % 4) + 1}">
      <a href="pages/shop.html?category=${cat.slug}" class="category-tile">
        <img src="https://picsum.photos/seed/cat-${cat.slug}/400/460" alt="${cat.name}">
        <div class="tile-label">
          <span class="label-mono"><i class="bi ${cat.icon} me-1"></i>Shop</span>
          <h5>${cat.name}</h5>
        </div>
      </a>
    </div>`
  ).join("");
}

function daeRenderFeaturedGrid() {
  const grid = document.getElementById("home-featured-grid");
  if (!grid) return;
  const featured = DAE_PRODUCTS.filter((p) => p.featured).slice(0, 8);
  grid.innerHTML = featured
    .map((p, i) => `<div class="col-6 col-md-4 col-lg-3 reveal delay-${(i % 4) + 1}">${daeProductCardHtml(p)}</div>`)
    .join("");
  daeWireProductCardButtons(grid);
}

function daeRenderNewArrivalsGrid() {
  const grid = document.getElementById("home-new-grid");
  if (!grid) return;
  const fresh = DAE_PRODUCTS.filter((p) => p.badge === "new").slice(0, 4);
  grid.innerHTML = fresh
    .map((p, i) => `<div class="col-6 col-md-3 reveal delay-${(i % 4) + 1}">${daeProductCardHtml(p)}</div>`)
    .join("");
  daeWireProductCardButtons(grid);
}
