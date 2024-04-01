


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const db = require('../models/connection');

const app5 = express();
const port = 6001;

//app.use(bodyParser.json());

////// get the user skills

app5.get('/users/:username/skills', (req, res) => {
    const { username } = req.params;

    // Query to retrieve the userID based on the username
    db.query('SELECT userID FROM users WHERE username = ? LIMIT 1', [username], (err, userResults) => {
        if (err) {
            console.error('Error retrieving user ID:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResults[0].userID;

        db.query('SELECT users.username, skill.skillID, skill.skillName FROM users JOIN UserSkillInterest ON users.userID = UserSkillInterest.UserID JOIN skill ON skill.skillID = UserSkillInterest.SkillID WHERE UserSkillInterest.UserID = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error retrieving user skills:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json(results);
        });
    });
});

app5.get('/users/:username/interests', (req, res) => {
    const { username } = req.params;

    db.query('SELECT userID FROM users WHERE username = ? LIMIT 1', [username], (err, userResults) => {
        if (err) {
            console.error('Error retrieving user ID:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResults[0].userID;

        db.query('SELECT users.username, interest.interestID, interest.interestName FROM users JOIN UserSkillInterest ON users.userID = UserSkillInterest.userID JOIN interest ON interest.interestID = UserSkillInterest.interestID WHERE UserSkillInterest.userID = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error retrieving user interests:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json(results);
        });
    });
});






/////get all the user details 


app5.get('/users/:username/details', (req, res) => {
    const { username } = req.params;

    // Query to retrieve the userID based on the username
    db.query('SELECT userID FROM users WHERE username = ? LIMIT 1', [username], (err, userResults) => {
        if (err) {
            console.error('Error retrieving user ID:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResults[0].userID;

        // Query to retrieve all skills for the user based on the user ID
        db.query('SELECT users.username, skill.skillID, skill.skillName FROM users JOIN UserSkillInterest ON users.userID = UserSkillInterest.UserID JOIN skill ON skill.skillID = UserSkillInterest.SkillID WHERE UserSkillInterest.UserID = ?', [userId], (err, skillsResults) => {
            if (err) {
                console.error('Error retrieving user skills:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Query to retrieve all projects that the user works on based on the user ID
            db.query('SELECT project.title, project.description FROM project JOIN project_users ON project.projectID = project_users.projectID WHERE project_users.userID = ?', [userId], (err, projectsResults) => {
                if (err) {
                    console.error('Error retrieving user projects:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(200).json({
                    username,
                    skills: skillsResults,
                    projects: projectsResults
                });
            });
        });
    });
});


app5.use(bodyParser.json());

// Export the app module
module.exports = app5