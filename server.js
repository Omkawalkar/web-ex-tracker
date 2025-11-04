const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect SQLite
const db = new sqlite3.Database("./expenses.db", (err) => {
    if (err) console.error("❌ Database connection error:", err.message);
    else console.log("✅ Connected to SQLite database");
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  amount REAL,
  category TEXT,
  description TEXT
)`);

// GET all expenses
app.get("/expenses", (req, res) => {
    db.all("SELECT * FROM expenses ORDER BY date DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST new expense
app.post("/expenses", (req, res) => {
    const { date, amount, category, description } = req.body;
    db.run(
        "INSERT INTO expenses (date, amount, category, description) VALUES (?,?,?,?)",
        [date, amount, category, description],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, date, amount, category, description });
        }
    );
});

// DELETE expense
app.delete("/expenses/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM expenses WHERE id = ?", id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted", changes: this.changes });
    });
});
app.listen(PORT, () => console.log('🚀 Server running on http://localhost:${PORT}'));