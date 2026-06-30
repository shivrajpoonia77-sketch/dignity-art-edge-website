/* ==========================================================================
   ADMIN — DASHBOARD
   ========================================================================== */

(function () {
  const mount = document.getElementById("admin-content-mount");
  if (!mount) return; // guard, in case the auth redirect already fired

  const orders = daeStoreGet(DAE.KEYS.ORDERS, []);
  const users = daeStoreGet(DAE.KEYS.USERS, []);
  const products = daeGetAdminProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);

  mount.innerHTML = `
    <div class="row g-4 mb-4">
      <div class="col-6 col-xl-3">${daeStatCardHtml({ icon: "bi-currency-rupee", color: "#b5512e", value: daeFormatPrice(totalRevenue), label: "Total Revenue", delta: "+12.4%" })}</div>
      <div class="col-6 col-xl-3">${daeStatCardHtml({ icon: "bi-box-seam", color: "#3f6e8c", value: orders.length, label: "Total Orders", delta: "+5.1%" })}</div>
      <div class="col-6 col-xl-3">${daeStatCardHtml({ icon: "bi-people", color: "#5c7a6e", value: users.length, label: "Customers", delta: "+8.0%" })}</div>
      <div class="col-6 col-xl-3">${daeStatCardHtml({ icon: "bi-palette", color: "#a9853b", value: products.length, label: "Catalog Items" })}</div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="admin-panel h-100">
          <h6 class="panel-title">Revenue — Last 7 Days</h6>
          <div class="chart-wrap"><canvas id="salesChart"></canvas></div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="admin-panel h-100">
          <h6 class="panel-title">Sales by Category</h6>
          <div class="chart-wrap"><canvas id="categoryChart"></canvas></div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="admin-panel">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="panel-title mb-0">Recent Orders</h6>
            <a href="orders.html" class="small text-rust">View all <i class="bi bi-arrow-right"></i></a>
          </div>
          <div class="table-responsive">
            <table class="table admin-table mb-0">
              <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody id="dash-recent-orders"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="admin-panel">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="panel-title mb-0">Stock Alerts</h6>
            <a href="inventory.html" class="small text-rust">Manage <i class="bi bi-arrow-right"></i></a>
          </div>
          <div id="dash-stock-alerts" class="d-flex flex-column gap-2"></div>
        </div>
      </div>
    </div>
  `;

  // ---------- Recent orders table ----------
  const recentBody = document.getElementById("dash-recent-orders");
  if (orders.length === 0) {
    recentBody.innerHTML = `<tr><td colspan="5" class="admin-empty"><i class="bi bi-inbox d-block mb-2"></i>No orders placed yet</td></tr>`;
  } else {
    recentBody.innerHTML = orders
      .slice(0, 6)
      .map((o) => {
        const user = users.find((u) => u.id === o.userId);
        return `<tr>
          <td class="font-mono">${o.orderId}</td>
          <td>${user ? daeEscapeHtml(user.name) : "Guest"}</td>
          <td>${daeFormatDate(o.date)}</td>
          <td class="font-mono">${daeFormatPrice(o.total)}</td>
          <td><span class="admin-badge ${o.status}">${o.status}</span></td>
        </tr>`;
      })
      .join("");
  }

  // ---------- Stock alerts ----------
  const alertsWrap = document.getElementById("dash-stock-alerts");
  const flagged = [...outOfStock, ...lowStock].slice(0, 6);
  if (flagged.length === 0) {
    alertsWrap.innerHTML = `<div class="admin-empty"><i class="bi bi-check-circle d-block mb-2"></i>All items are well stocked</div>`;
  } else {
    alertsWrap.innerHTML = flagged
      .map((p) => {
        const status = daeStockStatus(p.stock);
        return `<div class="d-flex align-items-center gap-3">
          <img src="${p.image}" class="admin-thumb" alt="${daeEscapeHtml(p.name)}">
          <div class="flex-grow-1">
            <span class="d-block small fw-semibold">${daeEscapeHtml(p.name)}</span>
            <span class="label-mono">${p.stock} units left</span>
          </div>
          <span class="admin-badge ${status.cls}">${status.label}</span>
        </div>`;
      })
      .join("");
  }

  // ---------- Charts ----------
  const ctx1 = document.getElementById("salesChart");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const salesData = [18400, 24200, 19800, 31200, 28600, 41200, 35800];
  new Chart(ctx1, {
    type: "line",
    data: {
      labels: days,
      datasets: [{
        label: "Revenue",
        data: salesData,
        borderColor: "#b5512e",
        backgroundColor: "rgba(181,81,46,0.12)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#b5512e",
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { callback: (v) => "₹" + v / 1000 + "k" } } },
    },
  });

  const ctx2 = document.getElementById("categoryChart");
  const catCounts = DAE_CATEGORIES.map((c) => products.filter((p) => p.category === c.slug).length);
  new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: DAE_CATEGORIES.map((c) => c.name),
      datasets: [{ data: catCounts, backgroundColor: ["#b5512e", "#5c7a6e", "#a9853b", "#3f6e8c", "#16140f", "#9b9382"] }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } },
  });
})();
