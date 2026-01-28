// database/index.js
const { Pool } = require("pg");
require("dotenv").config();

// Use SSL for Render (production) and also for local dev connecting to Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development"
       ? { rejectUnauthorized: false }
       : false,
});

// Export a query function to use throughout your app
module.exports = {
  query: (text, params) => pool.query(text, params),
};
