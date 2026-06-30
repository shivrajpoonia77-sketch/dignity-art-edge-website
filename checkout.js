/* ==========================================================================
   CHECKOUT PAGE SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!daeRequireAuth("login.html?redirect=checkout.html")) return;

  if (daeGetCart().length === 0) {
    window.location.href = "cart.html";
    return;
  }

  daePrefillCheckoutForm();
  daeRenderCheckoutSummary();
  daeWirePaymentToggle();
  daeWireCheckoutSubmit();
});

function daePrefillCheckoutForm() {
  const user = daeCurrentUser();
  if (!user) return;
  document.getElementById("co-name").value = user.name || "";
  document.getElementById("co-phone").value = user.phone || "";
  document.getElementById("co-address").value = user.address || "";
  document.getElementById("co-city").value = user.city || "";
  document.getElementById("co-pincode").value = user.pincode || "";
}

function daeRenderCheckoutSummary() {
  const rows = daeCartDetailed();
  const list = document.getElementById("checkout-items-list");
  list.innerHTML = rows
    .map(
      (row) => `
    <div class="checkout-line-item">
      <img src="${row.product.image}" alt="${daeEscapeHtml(row.product.name)}">
      <div class="meta">
        <span>${daeEscapeHtml(row.product.name)}</span>
        <small>Qty ${row.qty} · ${row.product.id}</small>
      </div>
      <span class="font-mono">${daeFormatPrice(row.lineTotal)}</span>
    </div>`
    )
    .join("");

  const subtotal = daeCartSubtotal();
  const shipping = subtotal >= 15000 ? 0 : 350;
  document.getElementById("co-subtotal").textContent = daeFormatPrice(subtotal);
  document.getElementById("co-shipping").textContent = shipping === 0 ? "Free" : daeFormatPrice(shipping);
  document.getElementById("co-total").textContent = daeFormatPrice(subtotal + shipping);
}

function daeWirePaymentToggle() {
  const cardFields = document.getElementById("card-fields");
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      cardFields.classList.toggle("d-none", radio.value !== "card");
    });
  });
}

function daeWireCheckoutSubmit() {
  const form = document.getElementById("checkout-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    // Persist the shipping details back onto the user's profile for next time
    daeUpdateCurrentUser({
      phone: document.getElementById("co-phone").value.trim(),
      address: document.getElementById("co-address").value.trim(),
      city: document.getElementById("co-city").value.trim(),
      pincode: document.getElementById("co-pincode").value.trim(),
    });

    const subtotal = daeCartSubtotal();
    const shipping = subtotal >= 15000 ? 0 : 350;
    const order = {
      orderId: daeGenerateId("ORD"),
      userId: daeCurrentUser().id,
      date: new Date().toISOString(),
      items: daeCartDetailed().map((r) => ({ id: r.product.id, name: r.product.name, qty: r.qty, price: r.product.price, image: r.product.image })),
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentMethod: document.querySelector('input[name="payment"]:checked').value,
      shippingAddress: {
        name: document.getElementById("co-name").value.trim(),
        phone: document.getElementById("co-phone").value.trim(),
        address: document.getElementById("co-address").value.trim(),
        city: document.getElementById("co-city").value.trim(),
        state: document.getElementById("co-state").value.trim(),
        pincode: document.getElementById("co-pincode").value.trim(),
      },
      status: "Processing",
    };

    const orders = daeStoreGet(DAE.KEYS.ORDERS, []);
    orders.unshift(order);
    daeStoreSet(DAE.KEYS.ORDERS, orders);

    daeSaveCart([]); // empty the cart now that the order is placed

    document.getElementById("success-order-id").textContent = order.orderId;
    const modal = new bootstrap.Modal(document.getElementById("orderSuccessModal"));
    modal.show();
  });
}
