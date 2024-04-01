const express = require('express');
const router = express.Router();
const db = require('../models/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//require('dotenv').config();
const JWT_SECRET='9+bLqkJoXxzSNN+q0Mm4vkk7ViLVEEcKH/K4TcOGOO8=';
// Define the port number
const port = 6001;
const app = express();
app.use(express.json());
app.use(router);
// Middleware function for logging incoming requests
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});


router.post('/users', (req, res, next) => {
  console.log('Received request to add a new user:', req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password: ', err);
      return next(err);
    }
    const newUser = { username, email, password: hash};
    db.query('INSERT INTO users SET ?', newUser, (err, result) => {
      if (err) {
        console.error('Error adding user: ', err);
        return next(err);
      }
      console.log(process.env.JWT_SECRET);
      const token = jwt.sign({ username: newUser.username, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' }); // Expires in 7 days
      res.status(201).json({ message: 'User added successfully', userId: result.insertId, token });
    });
  });
});


router.get('/users/:userID', (req, res, next) => {
  const userID = req.params.userID;


  db.query('SELECT * FROM users WHERE userID = ?', userID, (err, result) => {
    if (err) {
      console.error('Error retrieving user: ', err);
      return next(err); 
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result[0];
    res.status(200).json(user);
  });
});

router.delete('/users/:userID', (req, res, next) => {
  const userID = req.params.userID;

  db.query('DELETE FROM users WHERE userID = ?', userID, (err, result) => {
    if (err) {
      console.error('Error deleting user: ', err);
      return next(err); 
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});


// Route to generate a new token
router.get('/refresh-token', verifyToken, (req, res, next) => {
  const userData = req.user;
  if (!userData) {
    return res.status(400).json({ error: 'User data not provided' });
  }
  
  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' }); // Expires in 7 days
  console.log("New token:", token);
  res.status(200).json({ token });
});




app.post('/user-skill-interest', (req, res) => {
  const { userId, skillId, interestId } = req.body;

  db.query('INSERT INTO UserSkillInterest (UserID, SkillID, InterestID) VALUES (?, ?, ?)', [userId, skillId, interestId], (err, result) => {
    if (err) {
      console.error('Error adding user skill-interest association:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ message: 'User skill-interest association added successfully' });
  });
});



router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});