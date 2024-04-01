const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const db = require('../models/connection'); 

const app = express();
const port = 6001;



// Middleware
app.use(bodyParser.json());

// Endpoint to handle POST requests to create a new task
app.post('/', (req, res) => {
  const { title, description, deadline, assignedToUserID, assignedByUserID, toolID } = req.body;

  // Query to insert a new task into the tasks table
  const sql = `INSERT INTO tasks (title, description, deadline, assignedToUserID, toolID) VALUES (?, ?, ?, ?, ?)`;

  // Execute the query
  db.query(sql, [title, description, deadline, assignedToUserID, toolID], (err, results) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('Task created successfully');
    res.status(201).json({ message: 'Task created successfully' });
  });
});



module.exports = app;
