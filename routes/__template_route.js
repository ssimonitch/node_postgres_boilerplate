// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
// https://www.npmjs.com/package/express-promise-router
const Router = require('express-promise-router');

// initialize database
const db = require('../db');

// create a new express-promise-router
const router = new Router();

// use asyn-await or promises in routes
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users');
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// export our router to be mounted by the parent application
module.exports = router;
