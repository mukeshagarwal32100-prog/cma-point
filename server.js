/**
 * CMA Point — reference backend (Node.js + Express)
 * ---------------------------------------------------
 * This is NOT running anywhere yet. It's meant to be dropped into a real
 * Node project (locally or via Claude Code), connected to a database, and
 * deployed (Render / Railway / a VPS / AWS). It shows the three things a
 * real course platform needs on the server side:
 *
 *   1. Order creation for Razorpay  (never create orders from the browser)
 *   2. Payment signature verification (never trust the client's "success" alone)
 *   3. OTP-based login                (mobile number + SMS OTP, common in India)
 *
 * Setup:
 *   npm init -y
 *   npm install express razorpay dotenv cors crypto
 *   node server.js
 *
 * Env vars needed (.env):
 *   RAZORPAY_KEY_ID=your_key_id
 *   RAZORPAY_KEY_SECRET=your_key_secret
 *   DATABASE_URL=postgres://...          (or MongoDB URI)
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------------------------------------------------------------
// 1. CREATE ORDER
// Frontend sends the cart total; backend re-validates the price
// against the real course prices in the database (never trust the
// amount sent by the browser) and creates a Razorpay order.
// ---------------------------------------------------------------
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { items } = req.body; // array of course IDs

    // TODO: look up real prices for `items` from your database here,
    // instead of trusting req.body.amount from the client.
    const amount = await calculateAmountFromDatabase(items);

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
});

// ---------------------------------------------------------------
// 2. VERIFY PAYMENT
// Razorpay sends back a signature after checkout. You MUST verify
// it server-side before unlocking course access — this is what
// stops someone from faking a "successful payment" in the browser.
// ---------------------------------------------------------------
app.post("/api/payment/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // TODO: mark the order as paid in your database and grant the
    // student access to the purchased course(s).
    res.json({ status: "verified" });
  } else {
    res.status(400).json({ status: "invalid signature" });
  }
});

// ---------------------------------------------------------------
// 3. OTP LOGIN (mobile number based, standard for Indian EdTech)
// Wire `sendSms` up to a provider like MSG91, Twilio, or 2Factor.
// ---------------------------------------------------------------
const otpStore = new Map(); // swap for Redis in production

app.post("/api/auth/send-otp", async (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(mobile, otp);

  // await sendSms(mobile, `Your CMA Point OTP is ${otp}`);
  console.log(`OTP for ${mobile}: ${otp}`); // dev-only logging

  res.json({ status: "sent" });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;
  if (otpStore.get(mobile) === otp) {
    otpStore.delete(mobile);
    // TODO: create/find the user in your database and issue a session
    // (JWT or a signed cookie) here.
    res.json({ status: "verified", token: "demo-session-token" });
  } else {
    res.status(400).json({ status: "invalid otp" });
  }
});

async function calculateAmountFromDatabase(itemIds) {
  // Placeholder — replace with a real DB lookup.
  const prices = {
    "cma-f-acc": 3499, "cma-f-law": 2999, "cma-i-cost": 5499,
    "cma-i-tax": 5499, "cma-fi-strat": 6499, "cma-fi-audit": 6499,
  };
  return itemIds.reduce((sum, id) => sum + (prices[id] || 0), 0);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`CMA Point API running on port ${PORT}`));
