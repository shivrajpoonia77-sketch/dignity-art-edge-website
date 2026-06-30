/* ==========================================================================
   ADMIN — PRODUCTS
   Full CRUD against the admin's own copy of the catalog (DAE.KEYS.ADMIN_PRODUCTS),
   seeded once from data.js. The read-only DAE_PRODUCTS array that powers the
   storefront is never mutated.
   ========================================================================== */

(function () {
  const mount = document.getElementById("admin-content-mount");
  if (!mount) return;

  let searchTerm = "";

  mount.innerHTML = `
    <div class="admin-toolbar">
      <div class="admin-search-box">
        <i class="bi bi-search"></i>
        <input type="search" class="form-control" id="prod-search" placeholder="Search products…">
      </div>
      <button class="btn btn-dae btn-dae-primary" id="add-product-btn"><i class="bi bi-plus-lg"></i> Add Product</button>
    </div>
    <div class="admin-panel">
      <div class="table-responsive">
        <table class="table admin-table mb-0">
          <thead>
            <tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody id="products-table-body"></tbody>
        </table>
      </div>
    </div>
  `;

  // populate the category <select> inside the modal
  const categorySelect = document.getElementById("pm-category");
  categorySelect.innerHTML = DAE_CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("");

  const productModalEl = document.getElementById("productModal");
  const productModal = new bootstrap.Modal(productModalEl);

  function renderTable() {
    const products = daeGetAdminProducts().filter((p) => p.name.toLowerCase().includes(searchTerm));
    const body = document.getElementById("products-table-body");

    if (products.length === 0) {
      body.innerHTML = `<tr><td colspan="7" class="admin-empty"><i class="bi bi-palette d-block mb-2"></i>No products match your search</td></tr>`;
      return;
    }

    body.innerHTML = products
      .map((p) => {
        const status = daeStockStatus(p.stock);
        const category = daeGetCategory(p.category);
        return `
        <tr>
          <td><img src="${p.image}" class="admin-thumb" alt="${daeEscapeHtml(p.name)}"></td>
          <td>
            <span class="d-block fw-semibold">${daeEscapeHtml(p.name)}</span>
            <span class="label-mono">${p.id}</span>
          </td>
          <td>${category ? category.name : p.category}</td>
          <td class="font-mono">${daeFormatPrice(p.price)}</td>
          <td>${p.stock}</td>
          <td><span class="admin-badge ${status.cls}">${status.label}</span></td>
          <td>
            <button class="btn btn-sm btn-icon-circle edit-product-btn" data-id="${p.id}" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-icon-circle delete-product-btn" data-id="${p.id}" title="Delete"><i class="bi bi-trash3"></i></button>
          </td>
        </tr>`;
      })
      .join("");

    body.querySelectorAll(".edit-product-btn").forEach((btn) => btn.addEventListener("click", () => openEditModal(btn.dataset.id)));
    body.querySelectorAll(".delete-product-btn").forEach((btn) => btn.addEventListener("click", () => deleteProduct(btn.dataset.id)));
  }

  function openAddModal() {
    document.getElementById("productModalTitle").textContent = "Add Product";
    document.getElementById("product-form").reset();
    document.getElementById("pm-edit-id").value = "";
    productModal.show();
  }

  function openEditModal(id) {
    const product = daeGetAdminProducts().find((p) => p.id === id);
    if (!product) return;
    document.getElementById("productModalTitle").textContent = "Edit Product";
    document.getElementById("pm-edit-id").value = product.id;
    document.getElementById("pm-name").value = product.name;
    document.getElementById("pm-category").value = product.category;
    document.getElementById("pm-price").value = product.price;
    document.getElementById("pm-stock").value = product.stock;
    document.getElementById("pm-badge").value = product.badge || "";
    document.getElementById("pm-medium").value = product.medium;
    document.getElementById("pm-origin").value = product.origin;
    document.getElementById("pm-desc").value = product.description;
    productModal.show();
  }

  function deleteProduct(id) {
    const product = daeGetAdminProducts().find((p) => p.id === id);
    if (!confirm(`Delete "${product ? product.name : id}"? This cannot be undone.`)) return;
    const remaining = daeGetAdminProducts().filter((p) => p.id !== id);
    daeSaveAdminProducts(remaining);
    daeToast("Product deleted", "info", "bi-trash3");
    renderTable();
  }

  document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("pm-edit-id").value;
    const products = daeGetAdminProducts();

    const formData = {
      name: document.getElementById("pm-name").value.trim(),
      category: document.getElementById("pm-category").value,
      price: parseInt(document.getElementById("pm-price").value, 10),
      stock: parseInt(document.getElementById("pm-stock").value, 10),
      badge: document.getElementById("pm-badge").value,
      medium: document.getElementById("pm-medium").value.trim(),
      origin: document.getElementById("pm-origin").value.trim(),
      description: document.getElementById("pm-desc").value.trim(),
    };

    if (editId) {
      const idx = products.findIndex((p) => p.id === editId);
      if (idx !== -1) products[idx] = { ...products[idx], ...formData };
      daeToast("Product updated", "success", "bi-check-circle");
    } else {
      const newId = daeGenerateId("DAE");
      const seedImage = daeImg(formData.name.toLowerCase().replace(/\s+/g, "-") || newId);
      products.push({
        id: newId, ...formData, rating: 0, reviews: 0, year: new Date().getFullYear(),
        dims: "—", image: seedImage, gallery: [seedImage], featured: false, oldPrice: null,
      });
      daeToast("Product added", "success", "bi-check-circle");
    }
    daeSaveAdminProducts(products);
    productModal.hide();
    renderTable();
  });

  document.getElementById("add-product-btn").addEventListener("click", openAddModal);
  document.getElementById("prod-search").addEventListener(
    "input",
    daeDebounce((e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderTable();
    }, 250)
  );

  renderTable();
})();
