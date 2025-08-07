// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "taskmanager",
  password: "kyloren0201",
  port: 5432,
});

module.exports = pool;
