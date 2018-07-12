'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

// const {TEST_DATABASE_URL} = require('../config');
// const {dbConnect, dbDisconnect} = require('../db-mongoose');

// // Set NODE_ENV to `test` to disable http layer logs
// // You can do this in the command line, but this is cross-platform
// process.env.NODE_ENV = 'test';

// Clear the console before each run
// process.stdout.write('\x1Bc\n');
const {app} = require('../index');

const expect = chai.expect;
chai.use(chaiHttp);

// before(function() {
//   return dbConnect(TEST_DATABASE_URL);
// });
//
// after(function() {
//   return dbDisconnect();
// });

describe('Mocha and Chai', function() {
  it('should be properly setup', function() {
    expect(true).to.be.true;
  });
});


describe('Basic Express setup', () => {

  describe('Express static', () => {
    it('GET request "/" should return the index page', () => {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
        });
    });

  });

  describe('404 handler', () => {
    it('should respond with 404 when given a bad path', () => {
      return chai.request(app)
        .get('/badPath')
        .catch(res => {
            console.log('i ran');
            expect(res).to.have.status(404);
        });
    });

  });
});
