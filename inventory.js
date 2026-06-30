/* ==========================================================================
   ADMIN — INVENTORY
   ========================================================================== */

(function () {
  const mount = document.getElementById("admin-content-mount");
  if (!mount) return;

  let stockFilter = "all";

  mount.innerHTML = `
    <div class="row g-4 mb-4" id="inventory-stats"></div>
    <div class="admin-toolbar">
      <div class="d-flex gap-2 flex-wrap" id="inventory-filter-pills"></div>
    </div>
    <div class="admin-panel">
      <div class="table-responsive">
        <table class="table admin-table mb-0">
          <thead><tr><th></th><th>Product</th><th>Category</th><th>Status</th><th>Stock on Hand</th><th>Adjust</th></tr></thead>
          <tbody id="inventory-table-body"></tbody>
        </table>
      </div>
    </div>
  `;

  const FILTERS = [
    { key: "all", label: "All Items" },
    { key: "in-stock", label: "In Stock" },
    { key: "low-stock", label: "Low Stock" },
    { key: "out-of-stock", label: "Out of Stock" },
  ];
  document.getElementById("inventory-filter-pills").innerHTML = FILTERS.map(
    (f) => `<button class="admin-pill inv-pill ${f.key === "all" ? "active" : ""}" data-key="${f.key}">${f.label}</button>`
  ).join("");

  function renderStats() {
    const products = daeGetAdminProducts();
    const totalUnits = products.reduce((s, p) => s + p.stock, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;

    document.getElementById("inventory-stats").innerHTML = `
      <div class="col-6 col-xl-3">${daeStatCardHtml({ icon: "bi-boxes", color: "#3f6e8c", value: totalUnits, label: "Total Units" })}</div>
      <div class="col-6 col-xl-3">${daeStatCardHtml({ icon: "bi-palette", color: "#16140f", value: products.length, label: "Catalog Items" })}</div>
      <div class="col-6 col-xl-3">${daeStatCardHtml({ icon: "bi-exclamation-triangle", color: "#b6862f", value: lowStock, label: "Low Stock" })}</div>
      <div class="col-6 col-xl-3">${daeStatCardHtml({ icon: "bi-x-octagon", color: "#b03a2e", value: outOfStock, label: "Out of Stock" })}</div>
    `;
  }

  function renderTable() {
    let products = daeGetAdminProducts();
    if (stockFilter !== "all") {
      products = products.filter((p) => daeStockStatus(p.stock).cls === stockFilter);
    }

    const body = document.getElementById("inventory-table-body");
    if (products.length === 0) {
      body.innerHTML = `<tr><td colspan="6" class="admin-empty"><i class="bi bi-clipboard-data d-block mb-2"></i>No items in this view</td></tr>`;
      return;
    }

    body.innerHTML = products
      .map((p) => {
        const status = daeStockStatus(p.stock);
        const category = daeGetCategory(p.category);
        return `
        <tr data-id="${p.id}">
          <td><img src="${p.image}" class="admin-thumb" alt="${daeEscapeHtml(p.name)}"></td>
          <td><span class="fw-semibold">${daeEscapeHtml(p.name)}</span><br><span class="label-mono">${p.id}</span></td>
          <td>${category ? category.name : p.category}</td>
          <td><span class="admin-badge ${status.cls}">${status.label}</span></td>
          <td><span class="stock-value font-mono fw-semibold">${p.stock}</span> units</td>
          <td>
            <div class="input-group input-group-sm" style="width:130px;">
              <button class="btn btn-outline-secondary inv-minus" type="button">&minus;</button>
              <input type="number" class="form-control text-center inv-input" min="0" value="${p.stock}">
              <button class="btn btn-outline-secondary inv-plus" type="button">&plus;</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");

    body.querySelectorAll("tr").forEach((tr) => {
      const id = tr.dataset.id;
      const input = tr.querySelector(".inv-input");
      tr.querySelector(".inv-plus").addEventListener("click", () => adjustStock(id, parseInt(input.value, 10) + 1));
      tr.querySelector(".inv-minus").addEventListener("click", () => adjustStock(id, Math.max(0, parseInt(input.value, 10) - 1)));
      input.addEventListener("change", () => adjustStock(id, Math.max(0, parseInt(input.value, 10) || 0)));
    });
  }

  function adjustStock(id, newStock) {
    const products = daeGetAdminProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return;
    products[idx].stock = newStock;
    daeSaveAdminProducts(products);
    daeToast(`Stock updated for ${products[idx].name}`, "success", "bi-check-circle");
    renderStats();
    renderTable();
  }

  document.getElementById("inventory-filter-pills").addEventListener("click", (e) => {
    const pill = e.target.closest(".inv-pill");
    if (!pill) return;
    document.querySelectorAll(".inv-pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    stockFilter = pill.dataset.key;
    renderTable();
  });

  renderStats();
  renderTable();
})();
