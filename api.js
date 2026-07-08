// Change this to your deployed backend URL once it's live (e.g. https://api.cmapoint.in).
// Using a relative path assumes the API is deployed on the same domain as the site.
const API_BASE = "http://localhost:4000";

async function fetchCourses(level) {
  const url = level ? `${API_BASE}/api/courses?level=${encodeURIComponent(level)}` : `${API_BASE}/api/courses`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load courses");
  return res.json();
}

async function fetchFaculty() {
  const res = await fetch(`${API_BASE}/api/faculty`);
  if (!res.ok) throw new Error("Failed to load faculty");
  return res.json();
}

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
