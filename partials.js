// Shared across every page: header, footer, login modal, cart drawer.
// Each page just needs <div id="site-header"></div> / #site-footer / #site-modals
// and to include this script before site.js.

const HEADER_HTML = `
<header class="site-header">
  <div class="header-inner">
    <a href="/index.html" class="logo" aria-label="CMA Point home">
      <span class="logo-mark">CMA</span><span class="logo-tail">Point</span>
    </a>
    <nav class="main-nav" aria-label="Primary">
      <a href="/cma-foundation.html">Foundation</a>
      <a href="/cma-inter.html">Inter</a>
      <a href="/cma-final.html">Final</a>
      <a href="/faculty.html">Faculty</a>
      <a href="/pricing.html">Pricing</a>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" id="cartBtn" aria-label="Open cart">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <span class="cart-count" id="cartCount">0</span>
      </button>
      <button class="btn btn-ghost" id="loginBtn">Log in</button>
      <button class="btn btn-primary" id="signupBtn">Enroll Now</button>
    </div>
    <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-col">
      <div class="logo"><span class="logo-mark">CMA</span><span class="logo-tail">Point</span></div>
      <p>India's exam-pattern-first platform for CMA Foundation, Inter and Final preparation.</p>
    </div>
    <div class="footer-col">
      <h4>Courses</h4>
      <a href="/cma-foundation.html">CMA Foundation</a>
      <a href="/cma-inter.html">CMA Inter</a>
      <a href="/cma-final.html">CMA Final</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="/faculty.html">Faculty</a>
      <a href="/pricing.html">Pricing</a>
      <a href="/admin.html">Admin</a>
    </div>
    <div class="footer-col">
      <h4>Get updates</h4>
      <form class="footer-form" onsubmit="event.preventDefault()">
        <input type="email" placeholder="you@email.com" aria-label="Email for updates">
        <button class="btn btn-primary" type="submit">Subscribe</button>
      </form>
    </div>
  </div>
  <div class="footer-bottom">© <span id="year"></span> CMA Point. All rights reserved.</div>
</footer>`;

const MODALS_HTML = `
<div class="modal-overlay" id="authOverlay">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
    <button class="modal-close" id="authClose" aria-label="Close">&times;</button>
    <h3 id="authTitle">Log in to CMA Point</h3>
    <form id="authForm">
      <label>Mobile number
        <input type="tel" inputmode="numeric" pattern="[0-9]{10}" placeholder="10-digit mobile number" required>
      </label>
      <button type="submit" class="btn btn-primary btn-block">Send OTP</button>
    </form>
    <p class="modal-note">By continuing, you agree to CMA Point's Terms and Privacy Policy.</p>
  </div>
</div>

<div class="drawer-overlay" id="cartOverlay">
  <div class="drawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
    <div class="drawer-head">
      <h3 id="cartTitle">Your cart</h3>
      <button class="modal-close" id="cartClose" aria-label="Close cart">&times;</button>
    </div>
    <div class="drawer-body" id="cartItems">
      <p class="empty-state">Your cart is empty. Add a subject to get started.</p>
    </div>
    <div class="drawer-foot">
      <div class="drawer-total"><span>Total</span><strong id="cartTotal">₹0</strong></div>
      <button class="btn btn-primary btn-block" id="checkoutBtn" disabled>Pay with Razorpay</button>
    </div>
  </div>
</div>`;

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  const modalsEl = document.getElementById("site-modals");
  if (headerEl) headerEl.innerHTML = HEADER_HTML;
  if (footerEl) footerEl.innerHTML = FOOTER_HTML;
  if (modalsEl) modalsEl.innerHTML = MODALS_HTML;

  // Highlight the current page in nav
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(a => {
    if (a.getAttribute("href").endsWith(path)) a.style.color = "var(--teal)";
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.dispatchEvent(new Event("partialsReady"));
});
