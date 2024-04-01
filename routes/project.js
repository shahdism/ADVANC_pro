const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const db = require('../models/connection');

const app = express.Router();

// Parse JSON request bodies
const port = 6001;
app.use(bodyParser.json());


// Get all projects
app.get('/projects', (req, res) => {
    db.query('SELECT * FROM project', (err, results) => {
      if (err) {
        console.error('Error getting projects:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
  })

// Get a single project by ID
app.get('/projects/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  db.query('SELECT * FROM project WHERE projectID = ?', [projectId], (err, results) => {
    if (err) {
      console.error('Error getting project:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(results[0]);
  });
});

// Add a new project
// Add a new project
app.post('/', (req, res) => {
    const { title, description, diffLevel, groupSize} = req.body;
    const newProject = { title, description, diffLevel, groupSize };
    const query = 'INSERT INTO project SET ?';
    db.query(query, newProject, (err, result) => {
      if (err) {
        console.error('Error adding project:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      newProject.projectID = result.insertId;
      res.status(201).json(newProject);
    });
  });
  

// Update an existing project
app.put('/projects/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const { title, description, diffLevel, groupSize } = req.body;
    const updatedProject = { title, description, diffLevel, groupSize, userID, skillID };
    db.query('UPDATE project SET ? WHERE projectID = ?', [updatedProject, projectId], err => {
      if (err) {
        console.error('Error updating project:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(updatedProject);
    });
  });

// Delete a project
app.delete('/projects/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    db.query('DELETE FROM project WHERE projectID = ?', [projectId], err => {
      if (err) {
        console.error('Error deleting project:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.sendStatus(204);
    });
  });


  app.post('/projects/:projectId/users', (req, res) => {
    const projectId = req.params.projectId;
    const { users } = req.body;
  
    // First, check if the project exists
    db.query('SELECT * FROM project WHERE projectID = ?', [projectId], (err, results) => {
      if (err) {
        console.error('Error checking project:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Then, insert the associations into the project_users table for each user
      const values = users.map(userId => [projectId, userId]);
      db.query('INSERT INTO project_users (projectID, userID) VALUES ?', [values], (err, result) => {
        if (err) {
          console.error('Error adding users to project:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        res.status(201).json({ message: 'Users added to project successfully' });
      });
    });
  });
  
  app.use(bodyParser.json());

  app.post('/projects/:projectId/assign-tasks', (req, res) => {
    const projectId = req.params.projectId;

    // Step 1: Retrieve project skills based on projectId
    db.query('SELECT skillID FROM project_skills WHERE projectID = ?', [projectId], (err, projectSkills) => {
        if (err) {
            console.error('Error retrieving project skills:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Extract skillIDs from the result
        const skillIDs = projectSkills.map(skill => skill.skillID);

        // Step 2: Query UserSkillInterest table to find users with matching skills
        db.query('SELECT DISTINCT UserID FROM UserSkillInterest WHERE SkillID IN (?)', [skillIDs], (err, matchingUsers) => {
            if (err) {
                console.error('Error finding users with matching skills:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Parse tasks from the request body
            const tasks = req.body.tasks;

            // Assign tasks to users
            matchingUsers.forEach(user => {
                tasks.forEach(task => {
                    // Use destructuring to extract task properties
                    const { title, description, deadline, assignedToUserID, toolID } = task;
                    db.query('INSERT INTO tasks (title, description, deadline, assignedToUserID, toolID, status) VALUES (?, ?, ?, ?, ?, ?)',
                        [title, description, deadline, user.UserID, toolID, 'pending'],
                        (err, result) => {
                            if (err) {
                                console.error('Error assigning task:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }
                        });
                });
            });

            // Respond with success message
            res.status(200).json({ message: 'Tasks assigned successfully' });
        });
    });
});




// Export the app module
module.exports = app;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });