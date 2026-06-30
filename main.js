/* ==========================================================================
   DIGNITY ART EDGE — MAIN
   The single entry point every customer page calls on DOMContentLoaded.
   Responsible only for cross-page plumbing (navbar, footer, scroll effects);
   anything page-specific lives in that page's own script (home.js, shop.js…).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  daeRenderNavbar();
  daeRenderFooter();
  daeInitScrollReveal();
  daeInitScrollTopButton();
});

/* ---------- Scroll-reveal: fade/slide in any element with class="reveal" ---------- */
function daeInitScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || targets.length === 0) {
    targets.forEach((t) => t.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ---------- Floating scroll-to-top button ---------- */
function daeInitScrollTopButton() {
  const btn = document.createElement("button");
  btn.id = "scroll-top-btn";
  btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  btn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 480);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
