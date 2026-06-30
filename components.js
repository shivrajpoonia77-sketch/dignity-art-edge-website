/* ==========================================================================
   DIGNITY ART EDGE — SHARED COMPONENTS (navbar + footer)
   Every customer page includes two empty mount points:
     <div id="dae-navbar"></div>  and  <div id="dae-footer"></div>
   and sets two globals before loading this file:
     window.DAE_BASE  -> "./" from the project root, "../" from /pages/
     window.DAE_PAGE  -> e.g. "shop" — used to highlight the active nav link
   Centralising the markup here means a nav/footer edit only happens once,
   which is what keeps the "modular" structure consistent across ~20 pages.
   ========================================================================== */

function daeRenderNavbar() {
  const base = window.DAE_BASE || "./";
  const page = window.DAE_PAGE || "";
  const session = daeStoreGet(DAE.KEYS.SESSION, null);

  const navLinks = [
    { key: "home", label: "Home", href: `${base}index.html` },
    { key: "shop", label: "Shop", href: `${base}pages/shop.html` },
    { key: "about", label: "About", href: `${base}pages/about.html` },
    { key: "contact", label: "Contact", href: `${base}pages/contact.html` },
    { key: "faq", label: "FAQ", href: `${base}pages/faq.html` },
  ];

  const navHtml = navLinks
    .map((l) => `<li class="nav-item"><a class="nav-link ${l.key === page ? "active" : ""}" href="${l.href}">${l.label}</a></li>`)
    .join("");

  const accountMenu = session
    ? `<li><h6 class="dropdown-header label-mono">Hi, ${daeEscapeHtml(session.name.split(" ")[0])}</h6></li>
       <li><a class="dropdown-item" href="${base}pages/profile.html"><i class="bi bi-person me-2"></i>My Profile</a></li>
       <li><a class="dropdown-item" href="${base}pages/orders.html"><i class="bi bi-box-seam me-2"></i>My Orders</a></li>
       <li><hr class="dropdown-divider"></li>
       <li><a class="dropdown-item text-danger" href="#" id="dae-logout-btn"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>`
    : `<li><a class="dropdown-item" href="${base}pages/login.html"><i class="bi bi-box-arrow-in-right me-2"></i>Login</a></li>
       <li><a class="dropdown-item" href="${base}pages/register.html"><i class="bi bi-person-plus me-2"></i>Create Account</a></li>`;

  const mount = document.getElementById("dae-navbar");
  if (!mount) return;

  mount.innerHTML = `
    <div class="utility-bar d-none d-md-block">
      <div class="container d-flex justify-content-between align-items-center">
        <span><i class="bi bi-truck me-1"></i> Complimentary shipping on orders over ₹15,000</span>
        <span>
          <a href="${base}admin/login.html" class="me-3"><i class="bi bi-shield-lock me-1"></i>Admin</a>
          <a href="tel:+911412345678"><i class="bi bi-telephone me-1"></i>+91 141 234 5678</a>
        </span>
      </div>
    </div>
    <nav class="dae-navbar" id="dae-navbar-el">
      <div class="container d-flex align-items-center justify-content-between flex-wrap gap-3">
        <a href="${base}index.html" class="brand-mark">
          Dignity <span>Art</span> Edge
          <small>Studio &amp; Gallery</small>
        </a>

        <button class="navbar-toggler border-0 d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#daeMobileNav" aria-label="Open menu">
          <i class="bi bi-list fs-2"></i>
        </button>

        <ul class="nav d-none d-lg-flex">${navHtml}</ul>

        <div class="d-flex align-items-center gap-2">
          <a href="${base}pages/shop.html" class="nav-icon-btn d-none d-sm-inline-flex" title="Search the shop">
            <i class="bi bi-search"></i>
          </a>
          <div class="dropdown">
            <a href="#" class="nav-icon-btn" data-bs-toggle="dropdown" title="Account"><i class="bi bi-person"></i></a>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">${accountMenu}</ul>
          </div>
          <a href="${base}pages/wishlist.html" class="nav-icon-btn" title="Wishlist">
            <i class="bi bi-heart"></i><span class="count-badge d-none" id="dae-wishlist-count">0</span>
          </a>
          <a href="${base}pages/cart.html" class="nav-icon-btn" title="Cart">
            <i class="bi bi-bag"></i><span class="count-badge d-none" id="dae-cart-count">0</span>
          </a>
        </div>
      </div>
    </nav>

    <!-- Mobile off-canvas menu -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="daeMobileNav" style="background:var(--ink); color:#fff;">
      <div class="offcanvas-header">
        <span class="brand-mark" style="color:#fff;">Dignity <span>Art</span> Edge</span>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="nav flex-column fs-5">${navLinks.map((l) => `<li class="nav-item py-2 border-bottom" style="border-color:var(--line-dark)!important;"><a class="nav-link text-white" href="${l.href}">${l.label}</a></li>`).join("")}</ul>
      </div>
    </div>
  `;

  // logout handler
  const logoutBtn = document.getElementById("dae-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem(DAE.KEYS.SESSION);
      daeToast("You have been logged out", "info", "bi-box-arrow-right");
      setTimeout(() => (window.location.href = `${base}index.html`), 600);
    });
  }

  daeUpdateNavBadges();

  // shadow-on-scroll
  const navEl = document.getElementById("dae-navbar-el");
  window.addEventListener("scroll", () => {
    navEl.classList.toggle("is-scrolled", window.scrollY > 12);
  });
}

/* Keeps the cart / wishlist counters in the navbar in sync with localStorage */
function daeUpdateNavBadges() {
  const cart = daeStoreGet(DAE.KEYS.CART, []);
  const wishlist = daeStoreGet(DAE.KEYS.WISHLIST, []);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartBadge = document.getElementById("dae-cart-count");
  const wishBadge = document.getElementById("dae-wishlist-count");
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.classList.toggle("d-none", cartCount === 0);
  }
  if (wishBadge) {
    wishBadge.textContent = wishlist.length;
    wishBadge.classList.toggle("d-none", wishlist.length === 0);
  }
}

function daeRenderFooter() {
  const base = window.DAE_BASE || "./";
  const mount = document.getElementById("dae-footer");
  if (!mount) return;

  mount.innerHTML = `
    <footer class="dae-footer">
      <div class="container">
        <div class="row g-5">
          <div class="col-lg-4">
            <div class="foot-brand mb-3">Dignity <span class="text-rust">Art</span> Edge</div>
            <p class="small">A curated marketplace for hand-made paintings, sculpture, ceramics and textile art &mdash; each piece sold with the maker's story attached.</p>
            <div class="d-flex gap-2 mt-3">
              <a href="#" class="social-circle" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="#" class="social-circle" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>
              <a href="#" class="social-circle" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-circle" aria-label="X"><i class="bi bi-twitter-x"></i></a>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <h5>Shop</h5>
            <ul class="list-unstyled d-flex flex-column gap-2">
              <li><a href="${base}pages/shop.html">All Collections</a></li>
              <li><a href="${base}pages/shop.html?category=paintings">Paintings</a></li>
              <li><a href="${base}pages/shop.html?category=sculpture">Sculpture</a></li>
              <li><a href="${base}pages/shop.html?category=ceramics">Ceramics</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h5>Account</h5>
            <ul class="list-unstyled d-flex flex-column gap-2">
              <li><a href="${base}pages/profile.html">My Profile</a></li>
              <li><a href="${base}pages/orders.html">Order History</a></li>
              <li><a href="${base}pages/wishlist.html">Wishlist</a></li>
              <li><a href="${base}pages/cart.html">My Cart</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h5>Support</h5>
            <ul class="list-unstyled d-flex flex-column gap-2">
              <li><a href="${base}pages/contact.html">Contact Us</a></li>
              <li><a href="${base}pages/faq.html">FAQs</a></li>
              <li><a href="${base}pages/about.html">About the Studio</a></li>
            </ul>
          </div>
          <div class="col-lg-2">
            <h5>Newsletter</h5>
            <p class="small">New pieces, first.</p>
            <form class="newsletter-form" onsubmit="event.preventDefault(); daeToast('Thanks — you are on the list.', 'success', 'bi-envelope-check'); this.reset();">
              <input type="email" placeholder="you@email.com" required class="w-100 mb-2" />
              <button class="btn btn-dae btn-dae-rust btn-sm w-100" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <hr class="foot-divider" />
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 foot-bottom">
          <span>&copy; <span id="dae-year"></span> Dignity Art Edge Studio. All rights reserved.</span>
          <span>Built as an internship frontend project &middot; Placeholder imagery via picsum.photos</span>
        </div>
      </div>
    </footer>
  `;
  const yearEl = document.getElementById("dae-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
