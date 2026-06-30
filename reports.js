/* ==========================================================================
   ADMIN — REPORTS
   Charts blend real localStorage order data with a small seeded baseline
   (clearly commented below) so the dashboard still looks meaningful on a
   freshly cloned demo store with zero orders placed yet.
   ========================================================================== */

(function () {
  const mount = document.getElementById("admin-content-mount");
  if (!mount) return;

  const orders = daeStoreGet(DAE.KEYS.ORDERS, []);
  const products = daeGetAdminProducts();

  mount.innerHTML = `
    <div class="row g-4 mb-4">
      <div class="col-lg-7">
        <div class="admin-panel h-100">
          <h6 class="panel-title">Monthly Revenue Trend</h6>
          <div class="chart-wrap"><canvas id="monthlyChart"></canvas></div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="admin-panel h-100">
          <h6 class="panel-title">Payment Method Split</h6>
          <div class="chart-wrap"><canvas id="paymentChart"></canvas></div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="admin-panel h-100">
          <h6 class="panel-title">Top Rated Products</h6>
          <div class="chart-wrap"><canvas id="topProductsChart"></canvas></div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="admin-panel h-100">
          <h6 class="panel-title">Category Performance</h6>
          <div class="table-responsive">
            <table class="table admin-table mb-0">
              <thead><tr><th>Category</th><th>Items</th><th>Avg. Price</th><th>Avg. Rating</th></tr></thead>
              <tbody id="category-performance-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // ---------- Monthly revenue: seeded baseline (clearly a demo trend) plus this month's real total ----------
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const seededMonthly = [142000, 168000, 155000, 191000, 204000, 0];
  seededMonthly[5] = orders.reduce((s, o) => s + o.total, 0); // current month reflects real placed orders

  new Chart(document.getElementById("monthlyChart"), {
    type: "bar",
    data: { labels: monthLabels, datasets: [{ label: "Revenue", data: seededMonthly, backgroundColor: "#b5512e", borderRadius: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { callback: (v) => "₹" + v / 1000 + "k" } } },
    },
  });

  // ---------- Payment method split from real orders (falls back to an illustrative split if empty) ----------
  const paymentCounts = { card: 0, upi: 0, cod: 0 };
  orders.forEach((o) => { if (paymentCounts[o.paymentMethod] !== undefined) paymentCounts[o.paymentMethod]++; });
  const hasRealPaymentData = orders.length > 0;
  const paymentValues = hasRealPaymentData ? [paymentCounts.card, paymentCounts.upi, paymentCounts.cod] : [5, 3, 2];

  new Chart(document.getElementById("paymentChart"), {
    type: "pie",
    data: { labels: ["Card", "UPI", "Cash on Delivery"], datasets: [{ data: paymentValues, backgroundColor: ["#16140f", "#b5512e", "#a9853b"] }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } },
  });

  // ---------- Top rated products ----------
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
  new Chart(document.getElementById("topProductsChart"), {
    type: "bar",
    data: {
      labels: topRated.map((p) => p.name.length > 16 ? p.name.slice(0, 16) + "…" : p.name),
      datasets: [{ label: "Rating", data: topRated.map((p) => p.rating), backgroundColor: "#5c7a6e", borderRadius: 4 }],
    },
    options: {
      indexAxis: "y",
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { max: 5 } },
    },
  });

  // ---------- Category performance table ----------
  const tbody = document.getElementById("category-performance-body");
  tbody.innerHTML = DAE_CATEGORIES.map((cat) => {
    const items = products.filter((p) => p.category === cat.slug);
    if (items.length === 0) return `<tr><td>${cat.name}</td><td>0</td><td>—</td><td>—</td></tr>`;
    const avgPrice = items.reduce((s, p) => s + p.price, 0) / items.length;
    const avgRating = items.reduce((s, p) => s + p.rating, 0) / items.length;
    return `<tr><td>${cat.name}</td><td>${items.length}</td><td class="font-mono">${daeFormatPrice(Math.round(avgPrice))}</td><td>${avgRating.toFixed(1)} <i class="bi bi-star-fill text-brass" style="color:var(--brass);"></i></td></tr>`;
  }).join("");
})();
