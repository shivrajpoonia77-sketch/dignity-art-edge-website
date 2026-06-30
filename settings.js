/* ==========================================================================
   ADMIN — SETTINGS
   ========================================================================== */

(function () {
  const mount = document.getElementById("admin-content-mount");
  if (!mount) return;

  const DEFAULT_SETTINGS = {
    storeName: "Dignity Art Edge",
    supportEmail: "support@dignityartedge.example",
    supportPhone: "+91 141 234 5678",
    freeShippingThreshold: 15000,
    standardShippingFee: 350,
  };

  mount.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-7">
        <div class="admin-panel mb-4">
          <h6 class="panel-title">Store Information</h6>
          <div id="settings-alert" class="alert d-none"></div>
          <form id="settings-form" class="form-dae row g-3">
            <div class="col-md-6">
              <label for="set-store-name">Store Name</label>
              <input type="text" class="form-control" id="set-store-name" required>
            </div>
            <div class="col-md-6">
              <label for="set-support-email">Support Email</label>
              <input type="email" class="form-control" id="set-support-email" required>
            </div>
            <div class="col-md-6">
              <label for="set-support-phone">Support Phone</label>
              <input type="tel" class="form-control" id="set-support-phone">
            </div>
            <div class="col-md-6">
              <label for="set-currency">Currency</label>
              <input type="text" class="form-control" id="set-currency" value="INR (₹)" disabled>
            </div>
            <div class="col-md-6">
              <label for="set-free-shipping">Free Shipping Threshold (₹)</label>
              <input type="number" class="form-control" id="set-free-shipping" min="0" required>
            </div>
            <div class="col-md-6">
              <label for="set-shipping-fee">Standard Shipping Fee (₹)</label>
              <input type="number" class="form-control" id="set-shipping-fee" min="0" required>
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-dae btn-dae-primary mt-2">Save Settings</button>
            </div>
          </form>
        </div>

        <div class="admin-panel">
          <h6 class="panel-title">Admin Password</h6>
          <div id="password-alert" class="alert d-none"></div>
          <form id="admin-password-form" class="form-dae row g-3">
            <div class="col-md-6">
              <label for="set-new-password">New Password</label>
              <input type="password" class="form-control" id="set-new-password" minlength="6" required>
            </div>
            <div class="col-md-6">
              <label for="set-confirm-password">Confirm Password</label>
              <input type="password" class="form-control" id="set-confirm-password" minlength="6" required>
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-dae btn-dae-outline mt-2">Update Password</button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="admin-panel">
          <h6 class="panel-title">Demo Data</h6>
          <p class="small text-muted">This is a frontend-only demo — all data lives in your browser's localStorage. Use this to reset the store back to its original seeded state.</p>
          <button class="btn btn-dae btn-dae-ghost w-100" id="reset-demo-btn"><i class="bi bi-arrow-counterclockwise"></i> Reset All Demo Data</button>
        </div>
      </div>
    </div>
  `;

  function loadSettings() {
    const settings = daeStoreGet(DAE.KEYS.STORE_SETTINGS, DEFAULT_SETTINGS);
    document.getElementById("set-store-name").value = settings.storeName;
    document.getElementById("set-support-email").value = settings.supportEmail;
    document.getElementById("set-support-phone").value = settings.supportPhone;
    document.getElementById("set-free-shipping").value = settings.freeShippingThreshold;
    document.getElementById("set-shipping-fee").value = settings.standardShippingFee;
  }
  loadSettings();

  document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    daeStoreSet(DAE.KEYS.STORE_SETTINGS, {
      storeName: document.getElementById("set-store-name").value.trim(),
      supportEmail: document.getElementById("set-support-email").value.trim(),
      supportPhone: document.getElementById("set-support-phone").value.trim(),
      freeShippingThreshold: parseInt(document.getElementById("set-free-shipping").value, 10),
      standardShippingFee: parseInt(document.getElementById("set-shipping-fee").value, 10),
    });
    const alertBox = document.getElementById("settings-alert");
    alertBox.className = "alert alert-success";
    alertBox.textContent = "Store settings saved.";
    alertBox.classList.remove("d-none");
    setTimeout(() => alertBox.classList.add("d-none"), 3000);
  });

  document.getElementById("admin-password-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const next = document.getElementById("set-new-password").value;
    const confirm = document.getElementById("set-confirm-password").value;
    const alertBox = document.getElementById("password-alert");
    if (next !== confirm) {
      alertBox.className = "alert alert-danger";
      alertBox.textContent = "Passwords do not match.";
      alertBox.classList.remove("d-none");
      return;
    }
    daeStoreSet("dae_admin_password_override", next);
    document.getElementById("admin-password-form").reset();
    alertBox.className = "alert alert-success";
    alertBox.textContent = "Admin password updated. Use it next time you sign in.";
    alertBox.classList.remove("d-none");
  });

  document.getElementById("reset-demo-btn").addEventListener("click", () => {
    if (!confirm("This clears all carts, wishlists, accounts, orders and admin edits stored in this browser. Continue?")) return;
    Object.values(DAE.KEYS).forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem("dae_admin_password_override");
    daeToast("Demo data reset. Reloading…", "success", "bi-arrow-counterclockwise");
    setTimeout(() => window.location.reload(), 900);
  });
})();
