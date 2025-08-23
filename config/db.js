const { Pool } = require("pg");
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: 5432, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: false, // For testing; set up certificates for production
  },
});

pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL');
        client.release(); // Always release the client after use
    })
    .catch(err => console.error('Connection error', err));

module.exports = pool;
