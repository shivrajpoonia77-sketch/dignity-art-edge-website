/* ==========================================================================
   DIGNITY ART EDGE — AUTH
   A fully client-side authentication simulation. There is no real backend,
   so "passwords" are stored in localStorage for demo purposes only — this
   pattern should never be used for a production app with real users.
   ========================================================================== */

/* ---------- Get all registered users ---------- */
function daeGetUsers() {
  return daeStoreGet(DAE.KEYS.USERS, []);
}

/* ---------- Register a new account, returns {ok, message} ---------- */
function daeRegisterUser({ name, email, password, phone }) {
  const users = daeGetUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { ok: false, message: "An account with this email already exists." };
  }
  const newUser = {
    id: daeGenerateId("USR"),
    name,
    email,
    password, // demo only — never store plain-text passwords in a real app
    phone: phone || "",
    address: "",
    city: "",
    pincode: "",
    joined: new Date().toISOString(),
  };
  users.push(newUser);
  daeStoreSet(DAE.KEYS.USERS, users);
  return { ok: true, message: "Account created successfully." };
}

/* ---------- Log in, returns {ok, message} ---------- */
function daeLoginUser(email, password) {
  const users = daeGetUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return { ok: false, message: "Incorrect email or password." };
  }
  const session = { id: user.id, name: user.name, email: user.email };
  daeStoreSet(DAE.KEYS.SESSION, session);
  return { ok: true, message: `Welcome back, ${user.name.split(" ")[0]}.` };
}

/* ---------- Current logged-in user object (full record, not just session) ---------- */
function daeCurrentUser() {
  const session = daeStoreGet(DAE.KEYS.SESSION, null);
  if (!session) return null;
  return daeGetUsers().find((u) => u.id === session.id) || null;
}

/* ---------- Save changes to the logged-in user's profile ---------- */
function daeUpdateCurrentUser(updates) {
  const session = daeStoreGet(DAE.KEYS.SESSION, null);
  if (!session) return false;
  const users = daeGetUsers();
  const idx = users.findIndex((u) => u.id === session.id);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], ...updates };
  daeStoreSet(DAE.KEYS.USERS, users);
  // keep session name in sync if it changed
  daeStoreSet(DAE.KEYS.SESSION, { ...session, name: users[idx].name, email: users[idx].email });
  return true;
}

/* ---------- Guard: call at the top of profile/orders/checkout pages ---------- */
function daeRequireAuth(redirectTo = "login.html") {
  const session = daeStoreGet(DAE.KEYS.SESSION, null);
  if (!session) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

/* ---------- Wires up the #login-form on login.html ---------- */
function daeInitLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const result = daeLoginUser(email, password);
    const alertBox = document.getElementById("login-alert");

    if (result.ok) {
      alertBox.className = "alert alert-success mt-3";
      alertBox.textContent = result.message;
      alertBox.classList.remove("d-none");
      setTimeout(() => {
        const redirect = daeGetQueryParam("redirect");
        window.location.href = redirect ? redirect : (window.DAE_BASE || "../") + "index.html";
      }, 700);
    } else {
      alertBox.className = "alert alert-danger mt-3";
      alertBox.textContent = result.message;
      alertBox.classList.remove("d-none");
    }
  });
}

/* ---------- Wires up the #register-form on register.html ---------- */
function daeInitRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    const confirmField = document.getElementById("reg-confirm");
    confirmField.setCustomValidity(password !== confirm ? "Passwords do not match" : "");

    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const result = daeRegisterUser({
      name: document.getElementById("reg-name").value.trim(),
      email: document.getElementById("reg-email").value.trim(),
      password,
      phone: document.getElementById("reg-phone").value.trim(),
    });

    const alertBox = document.getElementById("register-alert");
    if (result.ok) {
      // auto-login after registering
      daeLoginUser(document.getElementById("reg-email").value.trim(), password);
      alertBox.className = "alert alert-success mt-3";
      alertBox.textContent = result.message + " Redirecting…";
      alertBox.classList.remove("d-none");
      setTimeout(() => (window.location.href = (window.DAE_BASE || "../") + "index.html"), 800);
    } else {
      alertBox.className = "alert alert-danger mt-3";
      alertBox.textContent = result.message;
      alertBox.classList.remove("d-none");
    }
  });
}
