const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`, (err) => {
  if (err) throw err;
  console.log('User table ready.');
});

// UI to display users and form to add new user
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('Database query error');

    let userList = '<h1>User List</h1><ul>';
    results.forEach(user => {
      userList += `<li>ID: ${user.id} - Name: ${user.name}</li>`;
    });
    userList += '</ul>';

    userList += `
      <h2>Add New User</h2>
      <form method="POST" action="/users" enctype="application/x-www-form-urlencoded">
        <input type="text" name="name" placeholder="Enter name" required />
        <button type="submit">Add User</button>
      </form>
    `;

    res.send(userList);
  });
});


// Insert user
app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const query = 'INSERT INTO users (name) VALUES (?)';
  db.query(query, [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({ id: result.insertId, name });
  });
});

// Get all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
