//
// copy this to config.js and use your own custom settings
// do not commit private information of config.js to Git!
//
const config = {
  // server listening port
  port: 4000,

  // nodemailer transport config
  // https://nodemailer.com/smtp/
  transport: {
    host: 'smtp.mydomain.com',
    port: 465,
    secure: true, // true for SSL
    auth: {
      user: 'username',
      pass: 'secret',
    },
  },

  // custom message options
  // this is how a message will be prepared when it is sent to you
  from: '"Nodemailer" <me@mydomain.com>',
  to: 'me@mydomain.com',

  // This can be overwritten in payload
  subject: 'Contact form message',

  // rate limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitWindowMax: 30, // 30 requests per 15 minutes

  // optional API key
  // key: 'SuperSecretKey',

  // enable console logging - not need if you're using a reverse proxy
  // logging always enabled if process.env.NODE_ENV === 'development'
  logging: true,
};

module.exports = config;
