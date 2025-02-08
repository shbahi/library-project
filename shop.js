const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// Configure MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "library"
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.log("Error connecting to MySQL:", err);
    }
});

// Get bookshop by ID
app.get("/bookshops/:id", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE shop_id = ?";
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results[0]);
    });
});

// Get all cities
app.get("/bookshops/:city", (req, res) => {
    const query = "SELECT city FROM bookshop";
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving cities", details: err.message });
        }
        res.json(results);
    });
});

// Get bookshop by name
app.get("/bookshops/name/:name", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE name = ?";
    connection.query(query, [req.params.name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        res.json(results);
    });
});

// Get bookshop by email
app.get("/bookshops/email/:email", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE email = ?";
    connection.query(query, [req.params.email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        res.json(results);
    });
});

// Update bookshop name
app.put("/bookshops/:id/name", (req, res) => {
    const { name } = req.body;
    const query = "UPDATE bookshop SET name = ? WHERE shop_id = ?";
    connection.query(query, [name, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating name", details: err.message });
        }
        res.status(200).json({ message: "Bookshop name has been updated" });
    });
});

// Update bookshop email
app.put("/bookshops/:id/email", (req, res) => {
    const { email } = req.body;
    const query = "UPDATE bookshop SET email = ? WHERE shop_id = ?";
    connection.query(query, [email, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating email", details: err.message });
        }
        res.status(200).json({ message: "Bookshop email has been updated" });
    });
});

// Add a new bookshop (only one per request)
app.post("/bookshops", (req, res) => {
    const {shop_id, city, name, contactNumber, email, Address } = req.body;
    const query = "INSERT INTO bookshop (city, name, contactNumber, email, Address) VALUES (?, ?, ?, ?, ?)";
    connection.query(query, [city, name, contactNumber, email, Address], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error adding new bookshop", details: err.message });
        }
        res.status(201).json({ message: "Bookshop has been added" });
    });
});

// Delete a bookshop by ID
app.delete("/bookshops/:id", (req, res) => {
    const query = "DELETE FROM bookshop WHERE shop_id = ?";
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting bookshop", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop has been deleted" });
    });
});

// Start the server
const port = 3002;
app.listen(port, () => {
    console.log(`Server has been started on http://localhost:${port}`);
});