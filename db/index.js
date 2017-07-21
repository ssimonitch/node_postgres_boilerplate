const { Pool } = require('pg');
const conString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: conString
});

// provide pool query globally
module.exports = {
  query: (text, params) => pool.query(text, params)
};
