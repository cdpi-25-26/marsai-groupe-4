/**
 * Standalone seed script — no sequelize-cli needed.
 * Run via: node seed-users.js
 * Or on Fly.io: fly ssh console --app marsai-api -C "node seed-users.js"
 *
 * All test users get password: password123
 */

import "dotenv/config";
import pkg from "pg";
const { Client } = pkg;

// bcrypt hash of "password123" with 10 rounds
const HASH = "$2b$10$03dSVFlBykxGOeZUA14tBeakfeP0TNRiUKSvTeUGeiUykaInKSDd2";
const NOW = new Date().toISOString();

const users = [];

for (let i = 1; i <= 100; i++) {
  users.push({ first_name: `Producer${i}`, last_name: "User", email: `producer${i}@marsai.test`, role: "PRODUCER" });
}
for (let i = 1; i <= 10; i++) {
  users.push({ first_name: `Jury${i}`, last_name: "Member", email: `jury${i}@marsai.test`, role: "JURY" });
}
for (let i = 1; i <= 3; i++) {
  users.push({ first_name: `Admin${i}`, last_name: "User", email: `admin${i}@marsai.test`, role: "ADMIN" });
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT) || 5432,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

await client.connect();
console.log("Connected to DB");

let inserted = 0;
let skipped = 0;

for (const u of users) {
  const res = await client.query("SELECT id FROM users WHERE email = $1", [u.email]);
  if (res.rows.length > 0) {
    // Update password of existing user
    await client.query(
      "UPDATE users SET password = $1, updated_at = $2 WHERE email = $3",
      [HASH, NOW, u.email]
    );
    skipped++;
  } else {
    await client.query(
      `INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [u.first_name, u.last_name, u.email, HASH, u.role, NOW, NOW]
    );
    inserted++;
  }
}

await client.end();
console.log(`Done. Inserted: ${inserted}, Updated password: ${skipped}`);
console.log("Password for all test users: password123");
