const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app6 = express();
app6.use(bodyParser.json());
const dp = require('../models/connection');

// Create MySQL connection pool

// Get all materials
app6.get('/', (req, res) => {
    dp.query('SELECT * FROM material', (error, rows) => {
        if (error) {
            console.error('Error fetching materials:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

// Get material by ID
app6.get('/materials/:id', async (req, res) => {
    const materialID = req.params.id;
    try {
        
        const [rows] = await dp.query('SELECT * FROM material WHERE materialID = ?', [materialID]);
        connection.release();
        if (rows.length === 0) {
            res.status(404).json({ error: 'Material not found' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error('Error fetching material:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new material
app6.post('/materials', async (req, res) => {
    const { name, userID, amount } = req.body;
    try {
         dp.query('INSERT INTO material (name, userID, amount) VALUES (?, ?, ?)', [name, userID, amount]);
        connection.release();
        res.sendStatus(201);
    } catch (error) {
        console.error('Error creating material:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a material
app6.put('/materials/:id', async (req, res) => {
    const materialID = req.params.id;
    const { name, userID, amount } = req.body;
    try {
        await db.query('UPDATE material SET name = ?, userID = ?, amount = ? WHERE materialID = ?', [name, userID, amount, materialID]);
        connection.release();
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a material
app6.delete('/materials/:id', async (req, res) => {
    const materialID = req.params.id;
    try {
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM material WHERE materialID = ?', [materialID]);
        connection.release();
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Similar routes for tools (GET, POST, PUT, DELETE)

app6.use(bodyParser.json());

// Export the app module
module.exports = app6;