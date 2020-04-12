const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const config = require('./config');

// rate limiter config
// ref: https://github.com/nfriedly/express-rate-limit
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs || 15 * 60 * 1000, // 15 minutes
  max: config.rateLimitWindowMax || 30, // limit each IP to 30 requests per windowMs
});

// set port number to listen on
const port = config.port || process.env.PORT || 4000;

const app = express();

// required for express-rate-limit when used behind a proxy
app.set('trust proxy', 1);

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(morgan('dev'));

// apply rate limiter to requests beginning with /api/
app.use('/api/', limiter);

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
  res
    .status(err.status || 500)
    .send({ status: 'Error', message: err.message || 'Unknown error' });
});

// handle missing routes with 404
app.use((req, res, next) => {
  // send 404
  res.status(404).send({ status: 'Error', message: 'NotFound' });
});

module.exports = app;
