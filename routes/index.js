const userRouter = require('./users');
const postRouter = require('./posts');

module.exports = (app) => {

  // index route
  app.get('/', (req, res) => {
    res.send('What could possibly go wrong?');
  });

  // endpoints
  app.use('/users', userRouter);
  app.use('/posts', postRouter);
};
