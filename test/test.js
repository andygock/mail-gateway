// tests current config by sending dummy message to a target directory
// user will need to check target email address mailbox

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
const app = require('../index');

chai.use(chaiHttp);

it('should have rate limit headers in response', (done) => {
  chai
    .request(app)
    .post('/api/v1/mail')
    .send({})
    .end((err, res) => {
      res.header.should.have.property('x-ratelimit-limit');
      res.header.should.have.property('x-ratelimit-remaining');
      res.header.should.have.property('x-ratelimit-reset');
      res.status.should.equal(400);
      res.body.should.have.property('status');
      res.body.status.should.equal('Error');
      done();
    });
});

it('should fail with missing email field', (done) => {
  chai
    .request(app)
    .post('/api/v1/mail')
    .send({
      // mandatory fields
      // missing 'email' field
      message: 'This is a test message\nNext line',

      // optional fields
      subject: 'Message subject',
      param1: 'value1',
      param2: 2,
    })
    .end((err, res) => {
      res.status.should.equal(400);
      res.body.should.have.property('status');
      res.body.status.should.equal('Error');
      done();
    });
});

it('should fail 404 with bad path', (done) => {
  chai
    .request(app)
    .post('/api/v1/mail-does-not-exist')
    .send({
      // mandatory fields
      // missing 'email' field
      message: 'This is a test message\nNext line',

      // optional fields
      subject: 'Message subject',
      param1: 'value1',
      param2: 2,
    })
    .end((err, res) => {
      res.status.should.equal(404);
      done();
    });
});

it('should send email message', (done) => {
  chai
    .request(app)
    .post('/api/v1/mail')
    .send({
      // mandatory fields
      email: 'user@sender.com',
      message: 'This is a test message\nNext line',

      // optional fields
      subject: 'Message subject',
      param1: 'value1',
      param2: 2,
    })
    .end((err, res) => {
      res.status.should.equal(200);
      res.body.should.have.property('status');
      res.body.status.should.equal('OK');
      done();
    });
});
