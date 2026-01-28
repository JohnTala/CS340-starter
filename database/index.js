const { Pool } = require("pg");
require("dotenv").config();

let pool;

// Use different SSL settings for production (Render) vs development (local)
if (process.env.NODE_ENV === "production") {
  // Render/Postgres connection requires SSL with rejectUnauthorized: false
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Local development
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // no SSL locally
  });
}

module.exports = {
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params);
      console.log("Executed query:", text);
      return res;
    } catch (err) {
      console.error("Database query error:", err);
      throw err;
    }
  },
};
