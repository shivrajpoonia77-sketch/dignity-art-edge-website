/* ==========================================================================
   PROFILE PAGE SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!daeRequireAuth("login.html?redirect=profile.html")) return;

  daeLoadProfileIntoForm();
  daeWireLogoutLink();

  document.getElementById("profile-form").addEventListener("submit", daeHandleProfileSave);
  document.getElementById("password-form").addEventListener("submit", daeHandlePasswordChange);
});

function daeLoadProfileIntoForm() {
  const user = daeCurrentUser();
  if (!user) return;

  document.getElementById("acc-side-name").textContent = user.name;
  document.getElementById("acc-side-email").textContent = user.email;

  document.getElementById("pf-name").value = user.name || "";
  document.getElementById("pf-email").value = user.email || "";
  document.getElementById("pf-phone").value = user.phone || "";
  document.getElementById("pf-pincode").value = user.pincode || "";
  document.getElementById("pf-address").value = user.address || "";
  document.getElementById("pf-city").value = user.city || "";
}

function daeHandleProfileSave(e) {
  e.preventDefault();
  daeUpdateCurrentUser({
    name: document.getElementById("pf-name").value.trim(),
    phone: document.getElementById("pf-phone").value.trim(),
    pincode: document.getElementById("pf-pincode").value.trim(),
    address: document.getElementById("pf-address").value.trim(),
    city: document.getElementById("pf-city").value.trim(),
  });
  daeShowAlert("profile-alert", "success", "Profile updated successfully.");
  daeLoadProfileIntoForm();
  daeRenderNavbar(); // refresh "Hi, Name" in the account dropdown
}

function daeHandlePasswordChange(e) {
  e.preventDefault();
  const current = document.getElementById("pw-current").value;
  const next = document.getElementById("pw-new").value;
  const confirm = document.getElementById("pw-confirm").value;
  const user = daeCurrentUser();

  if (user.password !== current) {
    daeShowAlert("password-alert", "danger", "Your current password is incorrect.");
    return;
  }
  if (next !== confirm) {
    daeShowAlert("password-alert", "danger", "New password and confirmation do not match.");
    return;
  }
  daeUpdateCurrentUser({ password: next });
  document.getElementById("password-form").reset();
  daeShowAlert("password-alert", "success", "Password updated successfully.");
}

function daeShowAlert(id, type, message) {
  const el = document.getElementById(id);
  el.className = `alert alert-${type}`;
  el.textContent = message;
  el.classList.remove("d-none");
  setTimeout(() => el.classList.add("d-none"), 4000);
}

function daeWireLogoutLink() {
  const link = document.getElementById("profile-logout-btn");
  if (!link) return;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem(DAE.KEYS.SESSION);
    window.location.href = "../index.html";
  });
}
