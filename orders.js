/* ==========================================================================
   ORDERS PAGE SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!daeRequireAuth("login.html?redirect=orders.html")) return;

  const user = daeCurrentUser();
  document.getElementById("acc-side-name").textContent = user.name;
  document.getElementById("acc-side-email").textContent = user.email;

  daeRenderOrdersList();
  daeWireOrdersLogoutLink();
});

function daeRenderOrdersList() {
  const user = daeCurrentUser();
  const allOrders = daeStoreGet(DAE.KEYS.ORDERS, []);
  const myOrders = allOrders.filter((o) => o.userId === user.id);

  const list = document.getElementById("orders-list");
  const emptyState = document.getElementById("orders-empty-state");

  if (myOrders.length === 0) {
    list.classList.add("d-none");
    emptyState.classList.remove("d-none");
    return;
  }
  list.classList.remove("d-none");
  emptyState.classList.add("d-none");

  list.innerHTML = myOrders
    .map(
      (order) => `
    <div class="order-card">
      <div class="order-head">
        <div>
          <span class="label-mono d-block">Order ${order.orderId}</span>
          <span class="small text-muted">Placed ${daeFormatDate(order.date)}</span>
        </div>
        <div class="text-end">
          <span class="order-status ${order.status}">${order.status}</span>
          <span class="d-block fw-semibold font-mono mt-1">${daeFormatPrice(order.total)}</span>
        </div>
      </div>
      <div class="d-flex flex-column gap-2">
        ${order.items
          .map(
            (item) => `
          <div class="d-flex align-items-center gap-3 order-item-row">
            <img src="${item.image}" alt="${daeEscapeHtml(item.name)}">
            <div class="flex-grow-1">
              <span class="d-block">${daeEscapeHtml(item.name)}</span>
              <span class="label-mono">Qty ${item.qty} &middot; ${item.id}</span>
            </div>
            <span class="font-mono">${daeFormatPrice(item.price * item.qty)}</span>
          </div>`
          )
          .join("")}
      </div>
      <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
        <span class="small text-muted"><i class="bi bi-geo-alt me-1"></i>${daeEscapeHtml(order.shippingAddress.city)}, ${daeEscapeHtml(order.shippingAddress.state)}</span>
        <span class="small text-muted text-capitalize"><i class="bi bi-credit-card me-1"></i>${order.paymentMethod}</span>
      </div>
    </div>`
    )
    .join("");
}

function daeWireOrdersLogoutLink() {
  const link = document.getElementById("orders-logout-btn");
  if (!link) return;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem(DAE.KEYS.SESSION);
    window.location.href = "../index.html";
  });
}
