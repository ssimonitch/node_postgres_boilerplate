const Router = require('express-promise-router');
const db = require('../db');

// merge params from users route
const postsRouter = new Router({ mergeParams: true });

// get all posts (accepts userId param)
postsRouter.get('/', async (req, res) => {

  // check for userId param (/users/:userId/posts)
  if (req.params.userId) {
    const userId = [req.params.userId];

    // verify user exists
    const user = await db.query('SELECT EXISTS (SELECT 1 FROM users WHERE id=$1)', userId);

    if (user.rows[0].exists === false) {
      return res.status(404).send({ error: 'User does not exist' });
    }

    // return all posts for that user
    const result = await db.query('SELECT * FROM posts WHERE user_id=$1', userId);

    if (result.rowCount !== 0) {
      return res.send(result.rows);
    } else {
      return res.status(404).send({ error: 'That user has no posts' });
    }
  }

  // default case: return all posts
  const result = await db.query('SELECT * FROM posts');

  if (result.rowCount !== 0) {
    res.send(result.rows);
  } else {
    res.status(404).send({ error: 'Could not retrieve posts' });
  }
});

// post post
postsRouter.post('/', async (req, res) => {
  const queryText = 'INSERT INTO posts(user_id, content) VALUES($1, $2) returning id';
  const values = [req.body.user_id, req.body.content];

  const result = await db.query(queryText, values);

  if (result.rowCount !== 0) {
    res.send(result.rows[0]);
  } else {
    res.status(404).send({ error: 'Could not create post' });
  }
});

// get post by id
postsRouter.get('/:postId', async (req, res) => {
  const queryText = 'SELECT * FROM posts WHERE id = $1';
  const values = [req.params.postId];

  const result = await db.query(queryText, values);

  if (result.rowCount !== 0) {
    res.send(result.rows[0]);
  } else {
    res.status(404).send({ error: 'Post not found' });
  }
});

// update post by id
postsRouter.put('/:postId', async (req, res) => {
  const queryText = 'UPDATE posts SET user_id = $2, content = $3 WHERE id = $1';
  const values = [req.params.postId, req.body.user_id, req.body.content];

  const result = await db.query(queryText, values);

  if (result.rowCount !== 0) {
    res.status(200).send({ message: 'Post updated successfully!' });
  } else {
    res.status(404).send({ error: 'Post not found' });
  }
});

// delete post by id
postsRouter.delete('/:postId', async (req, res) => {
  const queryText = 'DELETE FROM posts WHERE id = $1';
  const values = [req.params.postId];

  const result = await db.query(queryText, values);

  if (result.rowCount !== 0) {
    res.status(200).send({ message: 'Post removed' });
  } else {
    res.status(404).send({ error: 'Post not found' });
  }
});

// export our router to be mounted by the parent application
module.exports = postsRouter;
