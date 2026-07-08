/**
 * CMA Point — backend server
 * ---------------------------------------------------
 * Real, runnable Node/Express server with a SQLite database (file: cmapoint.db).
 * This is what powers "add a course" / "remove a course" from the admin panel —
 * courses aren't hardcoded in the frontend anymore, they live here.
 *
 * Run it:
 *   npm install
 *   node server.js
 *   → API at http://localhost:4000
 *
 * For production you'd swap SQLite for Postgres (e.g. Supabase/Neon) since
 * SQLite is a single file — fine for one server, not for scaling across many —
 * but the API shape below stays identical either way.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------
// DATABASE
// ---------------------------------------------------------------
const db = new Database("cmapoint.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    level TEXT NOT NULL,
    title TEXT NOT NULL,
    faculty TEXT NOT NULL,
    price INTEGER NOT NULL,
    mrp INTEGER NOT NULL,
    description TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS faculty (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    bio TEXT DEFAULT ''
  );
`);

const seedCount = db.prepare("SELECT COUNT(*) AS n FROM courses").get().n;
if (seedCount === 0) {
  const insert = db.prepare(`INSERT INTO courses (id, level, title, faculty, price, mrp, description) VALUES (@id,@level,@title,@faculty,@price,@mrp,@description)`);
  [
    { id: "cma-f-acc", level: "Foundation", title: "Fundamentals of Accounting", faculty: "CA Rishabh Jain", price: 3499, mrp: 4999, description: "Covers the full ICMAI Foundation accounting syllabus with worked examples." },
    { id: "cma-f-law", level: "Foundation", title: "Business Laws & Ethics", faculty: "CS Ananya Roy", price: 2999, mrp: 3999, description: "" },
    { id: "cma-i-cost", level: "Inter", title: "Cost & Management Accounting", faculty: "CMA Sanjay Verma", price: 5499, mrp: 7499, description: "" },
    { id: "cma-i-tax", level: "Inter", title: "Direct & Indirect Taxation", faculty: "CA Priya Nair", price: 5499, mrp: 7499, description: "" },
    { id: "cma-fi-strat", level: "Final", title: "Strategic Cost Management", faculty: "CMA Sanjay Verma", price: 6499, mrp: 8999, description: "" },
    { id: "cma-fi-audit", level: "Final", title: "Cost & Management Audit", faculty: "CA Rishabh Jain", price: 6499, mrp: 8999, description: "" },
  ].forEach(c => insert.run(c));

  const insertFaculty = db.prepare(`INSERT INTO faculty (id, name, subject, bio) VALUES (@id,@name,@subject,@bio)`);
  [
    { id: "f1", name: "CA Rishabh Jain", subject: "Accounting & Audit", bio: "" },
    { id: "f2", name: "CS Ananya Roy", subject: "Business Laws", bio: "" },
    { id: "f3", name: "CMA Sanjay Verma", subject: "Costing & Strategy", bio: "" },
    { id: "f4", name: "CA Priya Nair", subject: "Taxation", bio: "" },
  ].forEach(f => insertFaculty.run(f));
}

// ---------------------------------------------------------------
// SIMPLE ADMIN AUTH — one shared key via .env to start.
// Swap for real per-user accounts + hashed passwords before going live.
// ---------------------------------------------------------------
function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key && key === (process.env.ADMIN_KEY || "changeme123")) return next();
  return res.status(401).json({ error: "Unauthorized — invalid admin key" });
}

// ---------------------------------------------------------------
// COURSES — public read, admin-only write
// ---------------------------------------------------------------
app.get("/api/courses", (req, res) => {
  const { level } = req.query;
  const rows = level
    ? db.prepare("SELECT * FROM courses WHERE level = ? ORDER BY created_at DESC").all(level)
    : db.prepare("SELECT * FROM courses ORDER BY created_at DESC").all();
  res.json(rows);
});

app.get("/api/courses/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.post("/api/courses", requireAdmin, (req, res) => {
  const { id, level, title, faculty, price, mrp, description } = req.body;
  if (!id || !level || !title || !faculty || !price) {
    return res.status(400).json({ error: "id, level, title, faculty, and price are required" });
  }
  try {
    db.prepare(`INSERT INTO courses (id, level, title, faculty, price, mrp, description) VALUES (?,?,?,?,?,?,?)`)
      .run(id, level, title, faculty, price, mrp || price, description || "");
    res.status(201).json({ status: "created" });
  } catch (err) {
    res.status(400).json({ error: "A course with that id already exists" });
  }
});

app.put("/api/courses/:id", requireAdmin, (req, res) => {
  const { level, title, faculty, price, mrp, description } = req.body;
  const result = db.prepare(`UPDATE courses SET level=?, title=?, faculty=?, price=?, mrp=?, description=? WHERE id=?`)
    .run(level, title, faculty, price, mrp, description, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ status: "updated" });
});

app.delete("/api/courses/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM courses WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ status: "deleted" });
});

// ---------------------------------------------------------------
// FACULTY
// ---------------------------------------------------------------
app.get("/api/faculty", (req, res) => {
  res.json(db.prepare("SELECT * FROM faculty").all());
});

app.post("/api/faculty", requireAdmin, (req, res) => {
  const { id, name, subject, bio } = req.body;
  if (!id || !name || !subject) return res.status(400).json({ error: "id, name, subject required" });
  try {
    db.prepare(`INSERT INTO faculty (id, name, subject, bio) VALUES (?,?,?,?)`).run(id, name, subject, bio || "");
    res.status(201).json({ status: "created" });
  } catch (err) {
    res.status(400).json({ error: "A faculty member with that id already exists" });
  }
});

app.delete("/api/faculty/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM faculty WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ status: "deleted" });
});

// ---------------------------------------------------------------
// RAZORPAY
// ---------------------------------------------------------------
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require("razorpay");
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

app.post("/api/payment/create-order", async (req, res) => {
  if (!razorpay) return res.status(500).json({ error: "Razorpay keys not configured yet — add them to .env" });
  try {
    const { items } = req.body;
    const placeholders = items.map(() => "?").join(",");
    const rows = db.prepare(`SELECT price FROM courses WHERE id IN (${placeholders})`).all(...items);
    const amount = rows.reduce((sum, r) => sum + r.price, 0);

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
});

app.post("/api/payment/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected === razorpay_signature) {
    res.json({ status: "verified" });
  } else {
    res.status(400).json({ status: "invalid signature" });
  }
});

// ---------------------------------------------------------------
// OTP LOGIN (stub — wire sendSms to MSG91 / Twilio / 2Factor)
// ---------------------------------------------------------------
const otpStore = new Map();

app.post("/api/auth/send-otp", (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(mobile, otp);
  console.log(`OTP for ${mobile}: ${otp}`);
  res.json({ status: "sent" });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;
  if (otpStore.get(mobile) === otp) {
    otpStore.delete(mobile);
    res.json({ status: "verified", token: "demo-session-token" });
  } else {
    res.status(400).json({ status: "invalid otp" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`CMA Point API running on http://localhost:${PORT}`));
