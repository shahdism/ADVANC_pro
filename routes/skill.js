const express = require('express');
const router = express.Router();
const db = require('../models/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser'); // Import bodyParser

// Define the port number
const port = 6442;

// Create the Express app
const app4 = express();

// Middleware function for logging incoming requests
app4.use((req, res, next) => {
 // console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

// Use bodyParser middleware
app4.use(bodyParser.json());

router.post('/', (req, res, next) => {
  const { skillName, projectID } = req.body;
  if (!skillName || !projectID) {
    return res.status(400).json({ error: 'Skill name and project ID are required' });
  }

  db.query('INSERT INTO skill (skillName, projectID) VALUES (?, ?)', [skillName, projectID], (err, result) => {
    if (err) {
      console.error('Error adding skill:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Skill added successfully');
    res.status(201).json({ message: 'Skill added successfully', skillId: result.insertId });
  });
});


// Route to get all skills
router.get('/', (req, res, next) => {
  console.log('Step 5: Received request to get all skills');
  db.query('SELECT * FROM skill', (err, results) => {
    if (err) {
      console.error('Step 6: Error getting skills: ', err);
      return next(err);
    }
    console.log('Step 7: Retrieved skills successfully');
    res.status(200).json(results);
  });
});

// Error handling middleware
app4.use((err, req, res, next) => {
  console.error('Step 8: Internal server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Mount router
app4.use(router);

// Start the server
app4.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the app module
module.exports = app4;