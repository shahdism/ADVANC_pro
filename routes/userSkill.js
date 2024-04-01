const express = require('express');
const bodyParser = require('body-parser');
const db = require('../models/connection');

const appp = express();
const port = 4000;

// Middleware
appp.use(bodyParser.json());

// Route to add a new user skill
appp.post('/', (req, res) => {
    const { userID, skillName } = req.body;
    if (!userID || !skillName) {
        return res.status(400).json({ error: 'Both userID and skillName are required' });
    }

    db.query('INSERT INTO userskills (userID, skillName) VALUES (?, ?)', [userID, skillName], (err, result) => {
        if (err) {
            console.error('Error adding user skill:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'User skill added successfully', userSkillID: result.insertId });
    });
});

// Route to get all user skills
appp.get('/', (req, res) => {
    db.query('SELECT * FROM userskills', (err, rows) => {
        if (err) {
            console.error('Error getting user skills:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(rows);
    });
});


appp.post('/search', (req, res) => {
    const { skills } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ error: 'Skills array is required and should not be empty.' });
    }

    db.query('SELECT u.username, u.email FROM users u JOIN userskills us ON u.userID = us.userID WHERE us.skillName IN (?)', [skills], (err, rows) => {
        if (err) {
            console.error('Error getting users with skills:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No users found with the provided skills.' });
        }

        res.status(200).json(rows);
    });
});

// Start the server
module.exports =appp;