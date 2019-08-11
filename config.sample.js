//
// copy this to config.js and use your own custom settings
// do not commit private information of config.js to Git!
//
const config = {
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
  subject: 'Contact form message',

  // server listening port
  port: 4000,
};

module.export = config;
