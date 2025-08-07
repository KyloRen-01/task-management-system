const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "taskmanager",
  password: "kyloren0201",
  port: 5432,
});

// Greet
app.get("/api/greet", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Register
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "User registration failed" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json({ message: "Login successful", userId: user.id });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET tasks for a user
app.get("/api/tasks/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add task for user
app.post("/api/tasks", async (req, res) => {
  const { name, time, date, place, assigned, status, user_id } = req.body;

  // Validate time format (HH:mm)
  const timeRegex =
    /^([01]?[0-9]|2[0-3]):[0-5][0-9] ([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return res
      .status(400)
      .json({ error: "Invalid time format. Use HH:mm (24-hour format)" });
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (name, time, date, place, assigned, status, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, time, date, place, assigned, status, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Update task by id
app.put("/api/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, time, date, place, assigned, status } = req.body;

  // Validate time format (HH:mm)
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return res
      .status(400)
      .json({ error: "Invalid time format. Use HH:mm (24-hour format)" });
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  try {
    const result = await pool.query(
      `UPDATE tasks SET name=$1, time=$2, date=$3, place=$4, assigned=$5, status=$6
       WHERE id=$7 RETURNING *`,
      [name, time, date, place, assigned, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task by id
app.delete("/api/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.listen(port, () => {
  console.log(`🟢 Express backend running on http://localhost:${port}`);
});
