// ===================== DATA =====================
// In production, fetch this from your backend (GET /api/courses) instead of hardcoding.
const COURSES = [
  { id: "cma-f-acc", level: "Foundation", title: "Fundamentals of Accounting", faculty: "CA Rishabh Jain", price: 3499, mrp: 4999 },
  { id: "cma-f-law", level: "Foundation", title: "Business Laws & Ethics", faculty: "CS Ananya Roy", price: 2999, mrp: 3999 },
  { id: "cma-i-cost", level: "Inter", title: "Cost & Management Accounting", faculty: "CMA Sanjay Verma", price: 5499, mrp: 7499 },
  { id: "cma-i-tax", level: "Inter", title: "Direct & Indirect Taxation", faculty: "CA Priya Nair", price: 5499, mrp: 7499 },
  { id: "cma-fi-strat", level: "Final", title: "Strategic Cost Management", faculty: "CMA Sanjay Verma", price: 6499, mrp: 8999 },
  { id: "cma-fi-audit", level: "Final", title: "Cost & Management Audit", faculty: "CA Rishabh Jain", price: 6499, mrp: 8999 },
];

const FACULTY = [
  { name: "CA Rishabh Jain", subject: "Accounting & Audit" },
  { name: "CS Ananya Roy", subject: "Business Laws" },
  { name: "CMA Sanjay Verma", subject: "Costing & Strategy" },
  { name: "CA Priya Nair", subject: "Taxation" },
];

const PLANS = [
  { name: "Single Subject", price: 3499, features: ["1 subject, full syllabus", "Recorded lectures", "Chapter-wise tests"] },
  { name: "Full Level Bundle", price: 14999, featured: true, features: ["All subjects for one level", "Live + recorded access", "Full test series", "PYQs, 2016–2026"] },
  { name: "Foundation to Final", price: 39999, features: ["Every level, every subject", "Priority doubt support", "All test series included"] },
];

const money = (n) => "₹" + n.toLocaleString("en-IN");

// ===================== RENDER: COURSES =====================
const courseGrid = document.getElementById("courseGrid");
courseGrid.innerHTML = COURSES.map(c => `
  <article class="course-card">
    <div class="course-thumb">${c.level.toUpperCase()}</div>
    <div class="course-body">
      <span class="course-level">CMA ${c.level}</span>
      <h3>${c.title}</h3>
      <p class="course-faculty">Taught by ${c.faculty}</p>
      <div class="course-meta">
        <span class="course-price">${money(c.price)}<small>${money(c.mrp)}</small></span>
        <button class="add-btn" data-id="${c.id}">Add</button>
      </div>
    </div>
  </article>
`).join("");

// SEO: populate the Course ItemList JSON-LD from real data instead of leaving it empty
const courseSchema = document.getElementById("course-schema");
const schemaData = JSON.parse(courseSchema.textContent);
schemaData.itemListElement = COURSES.map((c, i) => ({
  "@type": "ListItem",
  position: i + 1,
  item: {
    "@type": "Course",
    name: `CMA ${c.level}: ${c.title}`,
    provider: { "@type": "Organization", name: "CMA Point", sameAs: "https://cmapoint.in" },
    instructor: { "@type": "Person", name: c.faculty },
    offers: { "@type": "Offer", price: c.price, priceCurrency: "INR" }
  }
}));
courseSchema.textContent = JSON.stringify(schemaData);

// ===================== RENDER: FACULTY =====================
document.getElementById("facultyGrid").innerHTML = FACULTY.map(f => `
  <div class="faculty-card">
    <div class="faculty-avatar">${f.name.split(" ").slice(-1)[0][0]}</div>
    <h4>${f.name}</h4>
    <p>${f.subject}</p>
  </div>
`).join("");

// ===================== RENDER: PRICING =====================
document.getElementById("pricingGrid").innerHTML = PLANS.map(p => `
  <div class="price-card ${p.featured ? "featured" : ""}">
    <h3>${p.name}</h3>
    <div class="price-amount">${money(p.price)} <span>/ level</span></div>
    <ul>${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
    <button class="btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block plan-btn" data-price="${p.price}" data-name="${p.name}">Choose plan</button>
  </div>
`).join("");

// ===================== CART =====================
let cart = [];

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  countEl.textContent = cart.length;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="empty-state">Your cart is empty. Add a subject to get started.</p>`;
    checkoutBtn.disabled = true;
  } else {
    itemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-line">
        <span>${item.title}</span>
        <span>${money(item.price)} <button data-index="${i}" class="remove-btn">Remove</button></span>
      </div>
    `).join("");
    checkoutBtn.disabled = false;
  }

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  totalEl.textContent = money(total);
}

courseGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const course = COURSES.find(c => c.id === btn.dataset.id);
  if (course && !cart.some(i => i.id === course.id)) {
    cart.push({ id: course.id, title: course.title, price: course.price });
    renderCart();
    openCart();
  }
});

document.getElementById("cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest(".remove-btn");
  if (!btn) return;
  cart.splice(Number(btn.dataset.index), 1);
  renderCart();
});

document.querySelectorAll(".plan-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    cart = [{ id: "plan-" + btn.dataset.name, title: btn.dataset.name, price: Number(btn.dataset.price) }];
    renderCart();
    openCart();
  });
});

// ===================== CART DRAWER =====================
const cartOverlay = document.getElementById("cartOverlay");
const openCart = () => cartOverlay.classList.add("open");
const closeCart = () => cartOverlay.classList.remove("open");
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", (e) => { if (e.target === cartOverlay) closeCart(); });

// ===================== LOGIN MODAL =====================
const authOverlay = document.getElementById("authOverlay");
const openAuth = () => authOverlay.classList.add("open");
const closeAuth = () => authOverlay.classList.remove("open");
document.getElementById("loginBtn").addEventListener("click", openAuth);
document.getElementById("signupBtn").addEventListener("click", openAuth);
document.getElementById("authClose").addEventListener("click", closeAuth);
authOverlay.addEventListener("click", (e) => { if (e.target === authOverlay) closeAuth(); });

document.getElementById("authForm").addEventListener("submit", (e) => {
  e.preventDefault();
  // Real flow: POST the mobile number to /api/auth/send-otp on your backend,
  // which triggers an SMS OTP (e.g. via MSG91 / Twilio) and returns a session token
  // once verified. See server.js for the reference endpoint.
  alert("OTP flow goes here — wire this up to your backend's /api/auth/send-otp endpoint.");
});

// ===================== RAZORPAY CHECKOUT =====================
document.getElementById("checkoutBtn").addEventListener("click", async () => {
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  if (total === 0) return;

  // Step 1: ask YOUR backend to create a Razorpay order (never create orders client-side).
  // This calls the /api/payment/create-order endpoint defined in server.js.
  let order;
  try {
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, items: cart.map(i => i.id) })
    });
    order = await res.json();
  } catch (err) {
    alert("Could not reach the server to start payment. (This demo has no live backend — see server.js.)");
    return;
  }

  // Step 2: open Razorpay's checkout using the order id returned by your backend.
  const options = {
    key: "RAZORPAY_KEY_ID", // public key only — the secret key stays on the server
    amount: order.amount,
    currency: "INR",
    name: "CMA Point",
    description: cart.map(i => i.title).join(", "),
    order_id: order.id,
    handler: function (response) {
      // Step 3: send the payment response to your backend to verify the signature
      // (see /api/payment/verify in server.js) before granting course access.
      fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response)
      }).then(() => {
        alert("Payment verified — course access granted.");
        cart = [];
        renderCart();
        closeCart();
      });
    },
    theme: { color: "#0b617e" }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});

// ===================== MOBILE MENU =====================
document.getElementById("menuToggle").addEventListener("click", (e) => {
  const nav = document.querySelector(".main-nav");
  const actions = document.querySelector(".header-actions");
  const open = nav.style.display === "flex";
  nav.style.display = open ? "none" : "flex";
  actions.style.display = open ? "none" : "flex";
  e.currentTarget.setAttribute("aria-expanded", String(!open));
});

// ===================== FOOTER YEAR =====================
document.getElementById("year").textContent = new Date().getFullYear();

renderCart();
