const express = require('express');
const mysql = require('mysql2');
const axios = require('axios'); // for making HTTP requests
const bodyParser = require('body-parser'); // Import bodyParser

const db = require('../models/connection'); // Import your MySQL connection

const app7 = express();

// Endpoint to fetch title and description of a task from the database and create Trello cards
app7.get('/', async (req, res) => {
    const projectId = req.params.Id;
    db.query('SELECT title, description FROM tasks ',  async (err, results) => {
        if (err) {
            console.error('Error getting project:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        try {
            // Iterate through the results and create Trello cards
            for (const task of results) {
                await createTrelloCard(task.title, task.description);
            }
            res.json({ message: 'Trello cards created successfully' });
        } catch (error) {
            console.error('Error creating Trello cards:', error);
            res.status(500).json({ error: 'Error creating Trello cards' });
        }
    });
});

// Function to create Trello card using Trello API
async function createTrelloCard(title, description) {
    try {
      const apiKey ='9999c8c5dac7dda6e34f84aed3b5a904';
       const token = 'ATTA3356d47963fd44306e090073cf2e98dab1345aed24c62cb398f318a8ebc7bc421F77528E';
       const boardId = 'YOUR_BOARD_ID';
       const listId = '65feaa939faca1964546fba7';

        const response = await axios.post(`https://api.trello.com/1/cards?key=${apiKey}&token=${token}`, {
            name: title,
            desc: description,
            idList: listId,
            // You may need to include other parameters like due date, labels, etc., based on your requirements
        });
        console.log('Trello card created:', response.data);
    } catch (error) {
        console.error('Error creating Trello card:', error.response.data);
        throw new Error('Error creating Trello card');
    }
}

app7.use(bodyParser.json());

// Export the app module
module.exports = app7;