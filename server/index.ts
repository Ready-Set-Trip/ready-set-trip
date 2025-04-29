// set up your server (listen on port, etc) and set up access to the routes here

//import path from 'path';
import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('test');
  console.log('hello');
});
/**
 * require routers
 */
import loginRouters from './routes/login';
import signupRouters from './routes/signup';
import tripsRouters from './routes/trips';
import usersRouters from './routes/users';
import messageBoardRouters from './routes/messageBoard';

/**
 * handle parsing request body
 */
app.use(express.json());

// allow frontend and backend to be run together with Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

/**
 * handle requests for static files
 */

// using path.resolve for express.static is recommended
//app.use(express.static(path.join(__dirname, '../client'))); // don't know if we have any static files yet, was causing errors

/**
 * define route handlers
 */
app.use('/login', loginRouters);
app.use('/signup', signupRouters);
app.use('/trips', tripsRouters);
app.use('/users', usersRouters);
app.use('/messageBoard', messageBoardRouters);

// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  res.sendStatus(404);
});

// express global error handler
// for some reason the next function kept throwing TS errors about it not being used
// even after giving it an underscore before it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.log('logging err:', err);
  // defaultErr object
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);

  return res.status(errorObj.status).send(errorObj.message);
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default app;
