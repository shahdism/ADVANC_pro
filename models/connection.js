const mysql = require('mysql2');
const connection = mysql.createConnection({
  
  host: '127.0.0.1',
  user: 'root',
  password: 'sz23112001',
  database: 'craft',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Insert a skill after connecting to the database
  // insertSkill('strong', (err, result) => {
  //   if (err) {
  //     console.error('Error inserting skill:', err);
  //     return;
  //   }
  //   console.log('Inserted skill ID:', result.insertId); // Assuming skillId is auto-incremented
  // });
});

// Function to insert a new skill into the skills table
function insertSkill(skillname, callback) {
  const sql = 'INSERT INTO skill (skillname) VALUES (?)'; // Changed table name to 'skill'
  connection.query(sql, [skillname], (err, result) => {
    if (err) {
      console.error('Error inserting skill: ', err);
      callback(err, null);
      return;
    }
    console.log('Skill inserted successfully');
    callback(null, result);
  });
}

module.exports = connection;