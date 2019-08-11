const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const config = require('./config');

// check email address is valid
// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// send message using configured transport
// https://nodemailer.com/usage/
const sendMessage = async (message) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(config.transport);

  // send mail with defined transport object
  let info = await transporter.sendMail(message);

  // log info to console
  // console.log('Message sent with messageId: %s', info.messageId);
  return info;
};

// process POST request
router.post('/', async (req, res, next) => {
  try {
    //
    // reference of common REST API response codes
    // https://restfulapi.net/http-status-codes/
    //

    // check for required paramters in config file
    if (!config.from || !config.to || !config.subject) {
      res.status(500).send({
        status: 'Error',
        message: 'Config is missing from, to, or subject fields',
      });
      return;
    }

    // check request is valid
    if (!req.body.email || !validateEmail(req.body.email.trim())) {
      res.status(400).send({
        status: 'Error',
        message: 'Missing or invalid email address',
      });
      return;
    }

    // prepare messageParams string, we isnert this at top of message body
    const messageParams = Object.keys(req.body)
      .filter((k) => k !== 'message')
      .map((key) => `${key}: ${req.body[key]}`);

    // add message body
    messageParams.push(`message:\n${req.body.message || 'Message is missing'}`);

    if (!!config.debugPayload) {
      // bypass actual message sending, for debugging payload only
      console.log(messageParams.join('\n'));
      res.status(200).send({ status: 'OK' });
      return;
    }

    // prepare a message object
    // https://nodemailer.com/message/
    const message = {
      from: config.from,
      replyTo: req.body.email.trim() || config.from,
      to: config.to,
      subject:
        req.body.subject || config.subject || `Message from mail-gateway`,
      text: messageParams.join('\n'),
    };

    const info = await sendMessage(message);

    // callback info includes the result, the exact format depends on the transport mechanism used
    // https://nodemailer.com/usage/
    // console.log(info);

    if (info.accepted && info.accepted.length) {
      res.status(200).send({ status: 'OK' });
      return;
    }

    // nodemailer finished but message must have failed to send (info.accepted is empty array)
    console.error(info);
    res.status(500).send({
      status: 'Error',
      message: 'Message failed to send',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
