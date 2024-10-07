const client = require('./server.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('./logger'); // Import the logger from logger.js

app.use(cors());
app.use(bodyParser.json());

app.listen(3000, () => {
  logger.info('Server is now listening at port 3000');
});

client.connect();

// POST endpoint to create a new user
app.post('/users', (req, res) => {
  const { id, brand, model, year } = req.body;

  // Basic validation
  if (!id || !brand || !model || !year) {
    logger.warn('Missing required fields');
    return res.status(400).json({ error: 'ID, brand, model, and year are required' });
  }

  // Insert new user into the database
  const query = 'INSERT INTO users (id, brand, model, year) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [id, brand, model, year];

  client.query(query, values, (err, result) => {
    if (err) {
      logger.error(`Error inserting user: ${err.stack}`);
      res.status(500).json({ error: 'Database error' });
    } else {
      logger.info(`User created: ${JSON.stringify(result.rows[0])}`);
      res.status(201).json(result.rows[0]);
    }
  });
});

// GET endpoint to retrieve all users
app.get('/users', (req, res) => {
  client.query('SELECT * FROM users', (err, result) => {
    if (err) {
      logger.error(`Error retrieving users: ${err.stack}`);
      res.status(500).json({ error: 'Database error' });
    } else {
      logger.info('Users retrieved successfully');
      res.status(200).json(result.rows);
    }
  });
});

// GET endpoint to retrieve a user by id
app.get('/users/:id/edit', (req, res) => {
  const userId = req.params.id;
  client.query('SELECT * FROM users WHERE id = $1', [userId], (err, result) => {
    if (err) {
      logger.error(`Error retrieving user: ${err.stack}`);
      res.status(500).json({ error: 'Database error' });
    } else {
      logger.info(`User retrieved: ${JSON.stringify(result.rows[0])}`);
      res.status(200).json(result.rows[0]);
    }
  });
});

// PUT endpoint to update a user by id
app.put('/users/update/:id', (req, res) => {
  const userId = req.params.id;
  const { brand, model, year } = req.body;

  // Basic validation
  if (!brand || !model || !year) {
    logger.warn('Missing required fields');
    return res.status(400).json({ error: 'Brand, model, and year are required' });
  }

  const query = 'UPDATE users SET brand = $1, model = $2, year = $3 WHERE id = $4 RETURNING *';
  const values = [brand, model, year, userId];

  client.query(query, values, (err, result) => {
    if (err) {
      logger.error(`Error updating user: ${err.stack}`);
      res.status(500).json({ error: 'Database error' });
    } else {
      logger.info(`User updated: ${JSON.stringify(result.rows[0])}`);
      res.status(200).json(result.rows[0]);
    }
  });
});

// DELETE endpoint to delete a user by id
app.delete('/users/delete/:id', (req, res) => {
  const userId = req.params.id;
  client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId], (err, result) => {
    if (err) {
      logger.error(`Error deleting user: ${err.stack}`);
      res.status(500).json({ error: 'Database error' });
    } else if (result.rowCount === 0) {
      logger.warn('User not found');
      res.status(404).json({ error: 'User not found' });
    } else {
      logger.info(`User deleted: ${JSON.stringify(result.rows[0])}`);
      res.status(200).json(result.rows[0]);
    }
  });
});

app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.send("===helloooooooo====");
});
