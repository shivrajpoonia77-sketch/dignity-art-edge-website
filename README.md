# Dignity Art Edge

A premium, fully responsive frontend e-commerce project built with **HTML5, CSS3, vanilla JavaScript and Bootstrap 5**. Dignity Art Edge is a fictional curated marketplace for hand-made paintings, sculpture, ceramics and textile art. The project includes a complete **customer storefront** and a separate **admin dashboard**, both running entirely in the browser with `localStorage` standing in for a backend/database.

> This is a frontend-only internship/portfolio project. There is no server, no real payment processing, and no real authentication — everything is simulated client-side so the project can be opened and demoed directly from the file system or any static host.

---

## 1. Quick Start

Because the project uses `fetch`-free relative paths and ES5-friendly vanilla JS, you can run it two ways:

**Option A — Open directly**
Double-click `index.html` and it will open in your default browser. Every page works this way since nothing requires a server.

**Option B — Serve locally (recommended)**
Some browsers restrict certain features when opening files directly via `file://`. Serving locally avoids that:

```bash
# from the project's root folder
python -m http.server 5500
# then visit http://localhost:5500
```

or, with Node installed:

```bash
npx serve .
```

No build step, no `npm install`, no bundler — it's plain static files. Bootstrap 5, Bootstrap Icons, Google Fonts and Chart.js are loaded from public CDNs, so an internet connection is required for full styling/fonts/icons/charts.

---

## 2. Demo Accounts

| Area | Email | Password | Notes |
|---|---|---|---|
| Customer site | *(register your own)* | *(your choice)* | Use **Register** — no customer accounts are pre-seeded. |
| Admin dashboard | `admin@dignityartedge.com` | `Admin@123` | Hardcoded demo credential, see `assets/js/admin/admin-common.js`. Can be changed from **Admin → Settings**. |

---

## 3. Folder Structure

```
dignity-art-edge/
├── index.html                  # Home page
├── pages/                      # All customer-facing pages
│   ├── shop.html
│   ├── product-details.html
│   ├── cart.html
│   ├── wishlist.html
│   ├── checkout.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── orders.html
│   ├── about.html
│   ├── contact.html
│   └── faq.html
├── admin/                      # Admin dashboard
│   ├── login.html
│   ├── dashboard.html
│   ├── products.html
│   ├── orders.html
│   ├── customers.html
│   ├── inventory.html
│   ├── reports.html
│   └── settings.html
├── assets/
│   ├── css/                    # One stylesheet per concern (see §5)
│   ├── js/                     # One script per concern (see §6)
│   │   └── admin/              # Admin-only scripts
│   └── images/                 # (placeholder images are loaded from picsum.photos by URL — see §7)
└── README.md
```

Every page loads the **same shared stylesheets and scripts** (tokens → base → animations → page-specific), so a single change to `style.css` or `components.js` ripples across the whole site without hunting through duplicated markup.

---

## 4. Design Concept

The visual identity is built around a **gallery / auction-catalog** metaphor rather than a generic storefront look:

- **Palette** — warm "gallery wall" backgrounds, near-black ink for structure, a kiln-fired clay (rust) primary accent, a bronze-patina secondary accent (verdigris), and a brass highlight.
- **Typography** — `Fraunces` (display serif with character) for headings, `Work Sans` for body copy, and `Space Mono` for the small uppercase "placard" labels used throughout.
- **Signature component** — the **catalog placard**: every product card and the product details page carry a small museum-style label (catalog number, medium, origin, year) styled in monospace, echoing how a real gallery would tag a piece.
- **Admin dashboard** intentionally looks like a focused operations tool (dark fixed sidebar, dense tables, stat cards) rather than reusing the storefront's gallery styling — while still using the same color tokens so it reads as the same product family.

---

## 5. CSS Architecture (`assets/css/`)

| File | Purpose |
|---|---|
| `variables.css` | Design tokens: colors, fonts, spacing scale, shadows, motion timing. |
| `style.css` | Global base styles shared by every customer page: navbar, footer, buttons, product card, catalog placard, forms, toasts. |
| `animations.css` | All `@keyframes` plus the `.reveal` scroll-trigger utility. |
| `home.css` | Home page hero, trust strip, category tiles, testimonials. |
| `shop.css` | Filter sidebar, pagination. |
| `product-details.css` | Gallery frame, thumbnails, tabs. |
| `cart.css` | Cart table + wishlist grid. |
| `checkout.css` | Payment method cards, order line items. |
| `auth.css` | Split-screen login/register layout. |
| `account.css` | Profile/orders sidebar and order history cards. |
| `static.css` | About, Contact and FAQ page styling. |
| `admin.css` | The entire admin dashboard: login screen, sidebar, topbar, stat cards, data tables, badges. |

CSS is loaded in a fixed order on every page — **tokens → base → animations → page-specific** — so cascade conflicts stay predictable.

---

## 6. JavaScript Architecture (`assets/js/`)

The app has **no framework and no build step**; modularity comes from splitting concerns into small files and loading them in a consistent order on every page.

| File | Responsibility |
|---|---|
| `utils.js` | Currency formatting, localStorage read/write helpers, toasts, debounce, star ratings, id generation. Loaded first — everything else depends on it. |
| `data.js` | The product catalog (`DAE_PRODUCTS`) and categories (`DAE_CATEGORIES`) — the site's mock database. |
| `product-card.js` | Builds the shared product-card markup used on Home, Shop, Wishlist and "related products". |
| `cart.js` | Cart CRUD against `localStorage`, cart page rendering. |
| `wishlist.js` | Wishlist CRUD against `localStorage`, wishlist page rendering. |
| `auth.js` | Customer registration/login, session handling, the `daeRequireAuth()` route guard. |
| `components.js` | Renders the shared navbar + footer into every page from one source of truth. |
| `main.js` | Page bootstrap: mounts navbar/footer, scroll-reveal `IntersectionObserver`, scroll-to-top button. |
| `home.js`, `shop.js`, `product-details.js`, `checkout.js`, `profile.js`, `orders.js`, `contact.js` | Page-specific logic, one file per page. |
| `admin/admin-common.js` | Admin auth guard, sidebar/topbar shell, the admin's editable product store. |
| `admin/dashboard.js`, `products.js`, `orders.js`, `customers.js`, `inventory.js`, `reports.js`, `settings.js` | One file per admin page. |

### How a page wires itself together
Every page sets two globals **before** loading the shared scripts:

```html
<script>
  window.DAE_BASE = "../";   // "./" from the project root, "../" from /pages/ or /admin/
  window.DAE_PAGE = "shop";  // used to highlight the active nav link
</script>
<script src="../assets/js/utils.js"></script>
<script src="../assets/js/data.js"></script>
<!-- ...shared scripts... -->
<script src="../assets/js/shop.js"></script> <!-- page-specific script goes last -->
```

This keeps every page free of duplicated navbar/footer HTML while still working from any folder depth.

---

## 7. Data & Persistence (all client-side)

| localStorage key | Holds |
|---|---|
| `dae_cart` | `[{ id, qty }]` — joined against `DAE_PRODUCTS` at render time. |
| `dae_wishlist` | `["DAE-014", …]` — array of product ids. |
| `dae_users` | Registered customer accounts (demo only — passwords are stored in plain text in the browser, never do this in production). |
| `dae_session` | The currently logged-in customer. |
| `dae_orders` | All placed orders, shared between the customer "My Orders" page and the admin Orders page. |
| `dae_admin_products` | The admin's editable copy of the catalog, seeded once from `data.js` so storefront data stays read-only. |
| `dae_admin_session` | The currently logged-in admin. |
| `dae_contact_messages` | Messages submitted via the Contact page. |
| `dae_store_settings` | Store name/contact/shipping settings edited from Admin → Settings. |

**Images** are royalty-free placeholder photography served on the fly by [picsum.photos](https://picsum.photos), seeded per product so the same item always shows the same image (e.g. `picsum.photos/seed/ochre-horizon/700/875`). No binary image assets are bundled with the project, which keeps the repository lightweight — swap these `src` URLs for real product photography when going to production.

---

## 8. Feature Checklist

**Customer site:** Home, Shop (search/filter/sort/pagination), Product Details (gallery, tabs, reviews, related items), Cart, Wishlist, Checkout (form validation, payment method toggle, order confirmation), Login, Register, Profile (edit details + change password), Orders (history pulled from localStorage), About, Contact (validated form), FAQ (category-filterable accordion).

**Admin dashboard:** Login (separate, gated), Dashboard (stat cards, revenue/category charts via Chart.js, recent orders, stock alerts), Products (search + add/edit/delete via modal), Orders (status updates, detail modal), Customers (order count + lifetime spend, detail modal), Inventory (stock filters, inline quantity adjustment), Reports (revenue trend, payment split, top products, category performance), Settings (store info, admin password, demo data reset).

**Cross-cutting:** responsive down to mobile (Bootstrap 5 grid + custom breakpoints), scroll-reveal animations, toast notifications, visible keyboard focus states, `prefers-reduced-motion` respected, and a consistent design-token system across both the storefront and the admin dashboard.

---

## 9. Known Limitations (by design, for a frontend-only demo)

- No real backend — all "persistence" is `localStorage` and resets if the browser storage is cleared, or can be wiped intentionally from **Admin → Settings → Reset All Demo Data**.
- No real payment processing on Checkout.
- Admin login uses a single hardcoded demo account rather than real user management.
- Product images are placeholder photography, not the actual catalog pieces described in the copy.

---

## 10. Tech Stack

- HTML5 / CSS3 (custom properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+, no framework)
- Bootstrap 5.3 (CDN)
- Bootstrap Icons 1.11 (CDN)
- Chart.js 4.4 (CDN, admin dashboard only)
- Google Fonts: Fraunces, Work Sans, Space Mono

Built as an internship-style frontend portfolio project.
