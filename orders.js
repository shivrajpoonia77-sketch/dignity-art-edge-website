/* ==========================================================================
   ADMIN — ORDERS
   Reads/writes the same DAE.KEYS.ORDERS array the customer checkout page
   writes to, so status changes made here are reflected on the customer's
   "My Orders" page immediately.
   ========================================================================== */

(function () {
  const mount = document.getElementById("admin-content-mount");
  if (!mount) return;

  let statusFilter = "all";
  let searchTerm = "";
  const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

  mount.innerHTML = `
    <div class="admin-toolbar">
      <div class="admin-search-box">
        <i class="bi bi-search"></i>
        <input type="search" class="form-control" id="order-search" placeholder="Search by order ID or customer…">
      </div>
      <select class="form-select" id="order-status-filter" style="width:auto;">
        <option value="all">All Statuses</option>
        ${STATUSES.map((s) => `<option value="${s}">${s}</option>`).join("")}
      </select>
    </div>
    <div class="admin-panel">
      <div class="table-responsive">
        <table class="table admin-table mb-0">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="orders-table-body"></tbody>
        </table>
      </div>
    </div>
  `;

  const users = daeStoreGet(DAE.KEYS.USERS, []);
  const detailModal = new bootstrap.Modal(document.getElementById("orderDetailModal"));

  function userFor(userId) {
    return users.find((u) => u.id === userId);
  }

  function renderTable() {
    const orders = daeStoreGet(DAE.KEYS.ORDERS, []).filter((o) => {
      const user = userFor(o.userId);
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const haystack = `${o.orderId} ${user ? user.name : ""}`.toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });

    const body = document.getElementById("orders-table-body");
    if (orders.length === 0) {
      body.innerHTML = `<tr><td colspan="7" class="admin-empty"><i class="bi bi-box-seam d-block mb-2"></i>No orders match these filters</td></tr>`;
      return;
    }

    body.innerHTML = orders
      .map((o) => {
        const user = userFor(o.userId);
        return `
        <tr>
          <td class="font-mono">${o.orderId}</td>
          <td>${user ? daeEscapeHtml(user.name) : "Guest"}</td>
          <td>${daeFormatDate(o.date)}</td>
          <td>${o.items.reduce((s, i) => s + i.qty, 0)} item(s)</td>
          <td class="font-mono">${daeFormatPrice(o.total)}</td>
          <td>
            <select class="form-select form-select-sm status-select" data-id="${o.orderId}" style="width:auto;">
              ${STATUSES.map((s) => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </td>
          <td><button class="btn btn-sm btn-icon-circle view-order-btn" data-id="${o.orderId}" title="View details"><i class="bi bi-eye"></i></button></td>
        </tr>`;
      })
      .join("");

    body.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", () => updateStatus(select.dataset.id, select.value));
    });
    body.querySelectorAll(".view-order-btn").forEach((btn) => {
      btn.addEventListener("click", () => showOrderDetail(btn.dataset.id));
    });
  }

  function updateStatus(orderId, status) {
    const orders = daeStoreGet(DAE.KEYS.ORDERS, []);
    const idx = orders.findIndex((o) => o.orderId === orderId);
    if (idx === -1) return;
    orders[idx].status = status;
    daeStoreSet(DAE.KEYS.ORDERS, orders);
    daeToast(`Order ${orderId} marked as ${status}`, "success", "bi-check-circle");
    renderTable();
  }

  function showOrderDetail(orderId) {
    const order = daeStoreGet(DAE.KEYS.ORDERS, []).find((o) => o.orderId === orderId);
    if (!order) return;
    const user = userFor(order.userId);

    document.getElementById("order-detail-body").innerHTML = `
      <div class="row g-4 mb-3">
        <div class="col-md-6">
          <h6 class="label-mono mb-2">Customer</h6>
          <p class="mb-0">${user ? daeEscapeHtml(user.name) : "Guest"}<br>${user ? daeEscapeHtml(user.email) : ""}</p>
        </div>
        <div class="col-md-6">
          <h6 class="label-mono mb-2">Shipping Address</h6>
          <p class="mb-0">${daeEscapeHtml(order.shippingAddress.address)}, ${daeEscapeHtml(order.shippingAddress.city)}, ${daeEscapeHtml(order.shippingAddress.state)} ${daeEscapeHtml(order.shippingAddress.pincode)}</p>
        </div>
      </div>
      <h6 class="label-mono mb-2">Items</h6>
      <div class="d-flex flex-column gap-2 mb-3">
        ${order.items
          .map(
            (i) => `<div class="d-flex align-items-center gap-3">
              <img src="${i.image}" class="admin-thumb" alt="${daeEscapeHtml(i.name)}">
              <div class="flex-grow-1">${daeEscapeHtml(i.name)} <span class="label-mono">x${i.qty}</span></div>
              <span class="font-mono">${daeFormatPrice(i.price * i.qty)}</span>
            </div>`
          )
          .join("")}
      </div>
      <div class="d-flex justify-content-between border-top pt-3">
        <strong>Total</strong><strong class="font-mono">${daeFormatPrice(order.total)}</strong>
      </div>
    `;
    detailModal.show();
  }

  document.getElementById("order-status-filter").addEventListener("change", (e) => {
    statusFilter = e.target.value;
    renderTable();
  });
  document.getElementById("order-search").addEventListener(
    "input",
    daeDebounce((e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderTable();
    }, 250)
  );

  renderTable();
})();
