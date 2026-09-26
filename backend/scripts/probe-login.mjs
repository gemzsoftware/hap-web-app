/*
 * Temporary credential probe. Safe to delete.
 */
const BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';

const candidates = [
  ['admin@heavenark.test', 'AdminPass123'],
  ['investor@heavenark.test', 'InvestorPass123']
];

for (const [email, password] of candidates) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const text = await res.text();
  console.log(`${email} -> ${res.status} ${text.slice(0, 200)}`);
}