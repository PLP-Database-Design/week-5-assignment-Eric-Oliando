// Declare dependencies / variables
const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables

app.use(express.json());
app.use(cors());

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3000
});

// Check if the connection works
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected successfully to MySQL as id:", db.threadId);

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);

        // Send a message to the browser
        app.get('/', (req, res) => {
            res.send('Server started successfully! Your connection was successful');
        });
    });
});


// GET endpoint to retrieve all patients

app.get('/patients', (req, res) => {
    const query = 'SELECT * FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error retrieving patients:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});



// GET endpoint to retrieve all providers

app.get('/providers', (req, res) => {
    const query = 'SELECT * FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error retrieving providers:", err);
            return res.status(300).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});


// GET endpoint to retrieve all patients by first name

app.get('/patients', (req, res) => {
    const firstName = req.query.firstName; 

    if (!firstName) {
        return res.status(400).json({ error: 'First name is required' });
    }

    const query = 'SELECT * FROM patients WHERE name LIKE ?'; 
    db.query(query, [`${firstName}%`], (err, results) => {
        if (err) {
            console.error("Error retrieving patients:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results); 
    });
});

// GET endpoint to retrieve all providers by specialty

app.get('/providers', (req, res) => {
    const specialty = req.query.specialty;

    if (!specialty) {
        return res.status(400).json({ error: 'Specialty is required' });
    }

    const query = 'SELECT * FROM providers WHERE specialty LIKE ?';
    db.query(query, [`${specialty}%`], (err, results) => {
        if (err) {
            console.error("Error retrieving providers:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});