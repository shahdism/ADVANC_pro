const express = require('express');
const bodyParser = require('body-parser');
const db = require('../models/connection'); // Import your MySQL connection
const path = require('path'); // Import path module for handling file paths

const app3= express();
const port = 6001;

// Set EJS as the view engine
app3.set('view engine', 'ejs');
app3.set('views', path.join(__dirname, 'rout'));

// Serve static files (including HTML) from the 'rout' directory
app3.use(express.static(path.join(__dirname, 'rout')));

// Middleware to parse JSON request bodies
app3.use(bodyParser.json());

// Define your Express routes for project operations

// Route handler for the root URL
app3.get('/', (req, res) => {
    // Query the database to get the projects data
    db.query('SELECT * FROM project', (err, results) => {
        if (err) {
            console.error('Error getting projects:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        // Render the HTML page with the projects data included
        res.render('case', { projects: results });
    });
});



app3.use(bodyParser.json());

// Export the app module
module.exports = app3;