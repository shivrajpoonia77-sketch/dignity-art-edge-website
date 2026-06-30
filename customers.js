/* ==========================================================================
   ADMIN — CUSTOMERS
   ========================================================================== */

(function () {
  const mount = document.getElementById("admin-content-mount");
  if (!mount) return;

  let searchTerm = "";

  mount.innerHTML = `
    <div class="admin-toolbar">
      <div class="admin-search-box">
        <i class="bi bi-search"></i>
        <input type="search" class="form-control" id="customer-search" placeholder="Search customers…">
      </div>
      <span class="label-mono" id="customer-count"></span>
    </div>
    <div class="admin-panel">
      <div class="table-responsive">
        <table class="table admin-table mb-0">
          <thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Joined</th><th>Orders</th><th>Lifetime Spend</th><th></th></tr></thead>
          <tbody id="customers-table-body"></tbody>
        </table>
      </div>
    </div>
  `;

  const detailModal = new bootstrap.Modal(document.getElementById("customerDetailModal"));

  function customerStats(userId) {
    const orders = daeStoreGet(DAE.KEYS.ORDERS, []).filter((o) => o.userId === userId);
    return { count: orders.length, spend: orders.reduce((s, o) => s + o.total, 0), orders };
  }

  function renderTable() {
    const users = daeStoreGet(DAE.KEYS.USERS, []).filter(
      (u) => u.name.toLowerCase().includes(searchTerm) || u.email.toLowerCase().includes(searchTerm)
    );
    document.getElementById("customer-count").textContent = `${users.length} customer${users.length === 1 ? "" : "s"}`;

    const body = document.getElementById("customers-table-body");
    if (users.length === 0) {
      body.innerHTML = `<tr><td colspan="7" class="admin-empty"><i class="bi bi-people d-block mb-2"></i>No registered customers yet</td></tr>`;
      return;
    }

    body.innerHTML = users
      .map((u) => {
        const stats = customerStats(u.id);
        return `
        <tr>
          <td><span class="fw-semibold">${daeEscapeHtml(u.name)}</span></td>
          <td>${daeEscapeHtml(u.email)}</td>
          <td>${daeEscapeHtml(u.phone || "—")}</td>
          <td>${daeFormatDate(u.joined)}</td>
          <td>${stats.count}</td>
          <td class="font-mono">${daeFormatPrice(stats.spend)}</td>
          <td><button class="btn btn-sm btn-icon-circle view-customer-btn" data-id="${u.id}" title="View"><i class="bi bi-eye"></i></button></td>
        </tr>`;
      })
      .join("");

    body.querySelectorAll(".view-customer-btn").forEach((btn) => btn.addEventListener("click", () => showCustomerDetail(btn.dataset.id)));
  }

  function showCustomerDetail(userId) {
    const user = daeStoreGet(DAE.KEYS.USERS, []).find((u) => u.id === userId);
    if (!user) return;
    const stats = customerStats(userId);

    document.getElementById("customer-detail-body").innerHTML = `
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="admin-avatar" style="width:54px;height:54px;font-size:1.4rem;"><i class="bi bi-person"></i></div>
        <div>
          <h5 class="mb-0">${daeEscapeHtml(user.name)}</h5>
          <span class="label-mono">${daeEscapeHtml(user.email)}</span>
        </div>
      </div>
      <div class="row g-3 mb-3">
        <div class="col-6"><span class="label-mono d-block">Phone</span>${daeEscapeHtml(user.phone || "—")}</div>
        <div class="col-6"><span class="label-mono d-block">Joined</span>${daeFormatDate(user.joined)}</div>
        <div class="col-12"><span class="label-mono d-block">Address</span>${daeEscapeHtml(user.address || "—")}${user.city ? `, ${daeEscapeHtml(user.city)}` : ""} ${daeEscapeHtml(user.pincode || "")}</div>
      </div>
      <div class="row g-3 mb-3">
        <div class="col-6"><span class="label-mono d-block">Total Orders</span><strong>${stats.count}</strong></div>
        <div class="col-6"><span class="label-mono d-block">Lifetime Spend</span><strong class="font-mono">${daeFormatPrice(stats.spend)}</strong></div>
      </div>
      ${stats.orders.length ? `<h6 class="label-mono mt-3 mb-2">Order History</h6>` + stats.orders.map((o) => `<div class="d-flex justify-content-between small border-bottom py-2"><span>${o.orderId}</span><span>${daeFormatDate(o.date)}</span><span class="font-mono">${daeFormatPrice(o.total)}</span></div>`).join("") : ""}
    `;
    detailModal.show();
  }

  document.getElementById("customer-search").addEventListener(
    "input",
    daeDebounce((e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderTable();
    }, 250)
  );

  renderTable();
})();
