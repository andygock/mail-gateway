const express = require('express');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');

const app = express();

// set port number to listen on
const port = config.port || process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(morgan('dev'));

app.all(
  '/api/*',

  // parse incoming requests with JSON payloads
  // https://expressjs.com/en/api.html#express.json
  express.json(),

  // parse incoming requests with urlencoded payloads
  // https://expressjs.com/en/api.html#express.urlencoded
  express.urlencoded({ extended: false })
);

// handle mail routing
app.use('/api/v1/mail', require('./mail'));

// handle uncaught errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ status: 'Error', error: err.message });
});

// handle missing routes with 404
app.use((req, res, next) => {
  // send 404
  res.status(404).send({ status: 'Error', message: 'NotFound' });
});

module.exports = app;
