// Shared across every page. Waits for partials.js to inject the header/footer/modals
// before wiring up event listeners, since those elements don't exist until then.

let cart = [];

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (!itemsEl) return;

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
  totalEl.textContent = money(cart.reduce((sum, i) => sum + i.price, 0));
}

function addToCart(course) {
  if (!cart.some(i => i.id === course.id)) {
    cart.push({ id: course.id, title: course.title, price: course.price });
    renderCart();
    document.getElementById("cartOverlay").classList.add("open");
  }
}

document.addEventListener("partialsReady", () => {
  // Cart drawer
  const cartOverlay = document.getElementById("cartOverlay");
  document.getElementById("cartBtn").addEventListener("click", () => cartOverlay.classList.add("open"));
  document.getElementById("cartClose").addEventListener("click", () => cartOverlay.classList.remove("open"));
  cartOverlay.addEventListener("click", (e) => { if (e.target === cartOverlay) cartOverlay.classList.remove("open"); });
  document.getElementById("cartItems").addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-btn");
    if (!btn) return;
    cart.splice(Number(btn.dataset.index), 1);
    renderCart();
  });

  // Login modal
  const authOverlay = document.getElementById("authOverlay");
  document.getElementById("loginBtn").addEventListener("click", () => authOverlay.classList.add("open"));
  document.getElementById("signupBtn").addEventListener("click", () => authOverlay.classList.add("open"));
  document.getElementById("authClose").addEventListener("click", () => authOverlay.classList.remove("open"));
  authOverlay.addEventListener("click", (e) => { if (e.target === authOverlay) authOverlay.classList.remove("open"); });

  document.getElementById("authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const mobile = e.target.querySelector("input").value;
    try {
      await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile })
      });
      alert("OTP sent (check the backend console log in this demo).");
    } catch {
      alert("Could not reach the backend. Make sure server.js is running.");
    }
  });

  // Mobile menu
  document.getElementById("menuToggle").addEventListener("click", (e) => {
    const nav = document.querySelector(".main-nav");
    const actions = document.querySelector(".header-actions");
    const open = nav.style.display === "flex";
    nav.style.display = open ? "none" : "flex";
    actions.style.display = open ? "none" : "flex";
    e.currentTarget.setAttribute("aria-expanded", String(!open));
  });

  // Razorpay checkout
  document.getElementById("checkoutBtn").addEventListener("click", async () => {
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    if (total === 0) return;
    let order;
    try {
      const res = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(i => i.id) })
      });
      order = await res.json();
      if (order.error) { alert(order.error); return; }
    } catch {
      alert("Could not reach the backend. Make sure server.js is running and Razorpay keys are set in .env.");
      return;
    }

    const rzp = new Razorpay({
      key: "RAZORPAY_KEY_ID", // public key only
      amount: order.amount,
      currency: "INR",
      name: "CMA Point",
      description: cart.map(i => i.title).join(", "),
      order_id: order.id,
      handler: function (response) {
        fetch(`${API_BASE}/api/payment/verify`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        }).then(() => {
          alert("Payment verified — course access granted.");
          cart = [];
          renderCart();
          cartOverlay.classList.remove("open");
        });
      },
      theme: { color: "#0b617e" }
    });
    rzp.open();
  });

  renderCart();
});
