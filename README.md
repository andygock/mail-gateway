# mail-gateway

A very simple Express server for sending email messages using [Nodemailer](https://nodemailer.com/). It has a basic REST API with a single route.

Useful for things such as contact forms where you want to self host the mail interface, as opposed with using third party options.

Sends email using your own SMTP account. It can be configured for GMail accounts also by changing the Nodemailer transport configuration.

## Configuration

We need to create a `config.js` file in the root of the project. There is a `config.sample.js` file to help you get started by making a copy of this.

`config.js` should export an object with the following keys:

- `transport`: Nodemailer transport configuration, configure with your SMTP details. Any valid Nodemailer transport can be used.
- `from`: messages sent from this app will have this `From:` field.
- `to`: recipient of message sent by this app
- `subject`: subject line of message which will be sent
- `port`: listening port of server. If not defined, it will use `process.env.PORT || 4000`

Example `config.js`

```js
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
```

## Usage

### Install dependencies

    npm install

### Start server

    npm run start

The default port is `4000`, but you can change this in `config.port`.

On production systems, I'd recommend using a process manager such as [PM2](http://pm2.keymetrics.io/)

Example with `pm2`

```bash
# add app and start
pm2 start index.js --name mail-gateway

# stop app
pm2 stop mail-gateway

# restart app
pm2 restart mail-gateway
```

### Request

Send a `POST` request to your node app with the request string `/api/v1/mail`. I normally do this via a NGINX reverse proxy arrangement to avoid any extra CORS configuration.

The request body is JSON encoded `application/json`.

It must contain the `message` field. All other fields are optional, however it is recommended to have at least a `from` and `name`

Example JSON payload

```json
{
    "from": "user.submitted@theirdomain.com",
    "name": "User's name",
    "message": "This is the message\nNext line"
}
```

### Response

The server should respond normally with status code `200`

```json
{
    "status": "OK"
}
```

If there is an error, as an example of invalid JSON in the request body, status code is `err.status` or `500`

```json
{
    "status": "Error",
    "error": "Unexpected token f in JSON at position 3"
}
```

And if you hit a route that does not exist, status code `404`

```json
{
    "status": "NotFound"
}
```

### Alternative request payloads

It will also correctly handle the following encoding schemes

- `application/x-www-form-urlencoded`

## Email message body

If successful, you recpient should receive an email message with the parameters in `config.js` with the message body in the format

```txt
key1: value1
key2: value2
message:
your message
```

The key and value pairs can be anything that is submitted as part of the request. Usually these will be different form fields a user has filled out prior to submitting the form.

## NGINX reverse proxy

Example of a location block which configures a [reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) on all requests to `/api`

```txt
location /api {
    proxy_pass http://localhost:4000/api;
}
```

## Security

There is no security or any form of prevention for malicious submissions to this API. You design and arrange your own system to secure your API. For my use case, the Express server's listening port number is only available to `localhost` as I have a firewall running. My own apps then access the API via a NGINX reverse proxy.

You could also rate limit requests through your web server (E.g NGINX, Apache) or your firewall. The proxying server can also take care of logging.

## Alternatives

Other mail options, if you don't want to self host your mail interface:

- [Formspree](https://formspree.io)
- [MailThis](https://mailthis.to/)
- [Amazon SES](https://aws.amazon.com/ses/)

## Note for GMail users

A special non-obvious case:

[Reply-To not working](https://support.google.com/mail/forum/AAAAK7un8RUZRZA5KkTPAA/?hl=en&gpf=d/category-topic/gmail/composing-and-sending-messages/ZRZA5KkTPAA)?

> If the "From" address is either the same as the "To" address, or is configured in GMail Settings as one of the 'Send As...' accounts, Gmail replies to the "To" address instead of the "Reply-To" address. An easy workaround is to specify a non-Gmail "From" address

## Links

- [Nodemailer](https://nodemailer.com/)
- [Express](https://expressjs.com/)
- [NGINX reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Apache reverse proxy](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html)
- [PM2](http://pm2.keymetrics.io/)
