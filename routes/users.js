// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
// https://www.npmjs.com/package/express-promise-router
const Router = require('express-promise-router');
const postsRouter = require('./posts');

// initialize database
const db = require('../db');

// create a new express-promise-router
const userRouter = new Router();

// MIDDLEWARE: pass params to posts route
userRouter.use('/:userId/posts', postsRouter);

// get all users
userRouter.get('/', async (req, res) => {
  const queryText = 'SELECT * FROM users';

  const result = await db.query(queryText);
  if (result.rowCount !== 0) {
    res.send(result.rows);
  } else {
    res.status(404).send({ error: 'Could not retrieve users' });
  }
});

// post user
userRouter.post('/', async (req, res) => {
  const queryText = 'INSERT INTO users(username, password) VALUES($1, $2) returning id';
  const values = [req.body.username, req.body.password];

  const result = await db.query(queryText, values);

  if (result.rowCount !== 0) {
    res.send(result.rows[0]);
  } else {
    res.status(404).send({ error: 'Could not create user' });
  }
});

// get user by id
userRouter.get('/:userId', async (req, res) => {
  const queryText = 'SELECT * FROM users WHERE id = $1';
  const values = [req.params.userId];

  const result = await db.query(queryText, values);

  if (result.rowCount !== 0) {
    res.send(result.rows[0]);
  } else {
    res.status(404).send({ error: 'User not found' });
  }
});

// update user by id
userRouter.put('/:userId', async (req, res) => {
  const queryText = 'UPDATE users SET username = $2, password = $3 WHERE id = $1';
  const values = [req.params.userId, req.body.username, req.body.password];

  const result = await db.query(queryText, values);

  if (result.rowCount !== 0) {
    res.status(200).send({ message: 'User updated successfully!' });
  } else {
    res.status(404).send({ error: 'User not found' });
  }
});

// delete user by id
userRouter.delete('/:userId', async (req, res) => {
  const queryText = 'DELETE FROM users WHERE id = $1';
  const values = [req.params.userId];

  const result = await db.query(queryText, values);

  if (result.rowCount !== 0) {
    res.status(200).send({ message: 'User removed' });
  } else {
    res.status(404).send({ error: 'User not found' });
  }
});

// export our router to be mounted by the parent application
module.exports = userRouter;
