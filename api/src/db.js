const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load config values from .env file
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
