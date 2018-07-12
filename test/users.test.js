const {app} = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_DATABASE_URL } = require('../config');

const User = require('../models/users');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Garden App - Users', function() {
    const username = 'testUser';
    const password = 'testPassword';

    before(function () {
        console.log(TEST_DATABASE_URL);
        return mongoose.connect(TEST_DATABASE_URL)
            .then(() => mongoose.connection.db.dropDatabase());
    });

    afterEach(function () {
        return mongoose.connection.db.dropDatabase();
    });

    after(function () {
        return mongoose.disconnect();
    });

    describe('/users', function() {
        describe('POST', function() {
            it('Should create a new user', function() {
                const testUser = { username, password };

                let res;
                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .then(_res => {
                        res = _res;
                        expect(res).to.have.status(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.keys('id', 'username');

                        expect(res.body.id).to.exist;
                        expect(res.body.username).to.equal(testUser.username);

                        return User.findOne({ username });
                    })
                    .then(user => {
                        expect(user).to.exist;
                        expect(user.id).to.equal(res.body.id);
                        return user.validatePassword(password);
                    })
                    .then(isValid => {
                        expect(isValid).to.be.true;
                  });
            })

            it('Should reject users with missing username', function () {
                const testUser = { password };

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        console.log(Object.keys(res))
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('Missing field');
                    });
            });

            it('Should reject users with missing password', function() {
                const testUser = { username };

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('Missing field');
                    });
            });

            it('Should reject users with non-string username', function() {
                const testUser = {username: true, password};

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('Incorrect field type: expected string');
                    });
            });

            it('Should reject users with non-string password', function() {
                const testUser = {username, password: true};

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('Incorrect field type: expected string');
                    });
            });

            it('Should reject users with non-trimmed username', function() {
                const testUser = {username: "  batman  ", password};

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('Cannot start or end with whitespace');
                    })
            });

            it('Should reject users with non-trimmed password', function() {
                const testUser = {username, password: "  batman  "};

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('Cannot start or end with whitespace');
                    })
            });

            it('Should reject users with empty username', function() {
                const testUser = {username: '', password};

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('Missing field');
                    })
            });

            it('Should reject users with password less than 8 characters', function() {
                const testUser = {username, password: 'a'};

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('`password` needs to be more than 6 characters and less than 72');
                    })
            });

            it('Should reject users with password greater than 72 characters', function() {
                const testUser = {username, password: 'passwordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpassword'};

                return chai.request(app)
                    .post('/users')
                    .send(testUser)
                    .catch(res => {
                        expect(res).to.have.status(422);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('code', 'reason', 'message');

                        expect(res.response.body.reason).to.equal('Validation Error');
                        expect(res.response.body.message).to.equal('`password` needs to be more than 6 characters and less than 72');
                    })
            });

            it('Should reject users with duplicate username', function() {
                const testUser = {username: 'bobuser', password};

                return User.create(testUser)
                .catch(() => {
                    return chai.request(app)
                        .post('/api/users')
                        .send(testUser)
                    .then(res => {
                        expect(res).to.have.status(400);
                        expect(res.response.body).to.be.an('object');
                        expect(res.response.body).to.have.keys('status', 'message');

                        expect(res.response.body.message).to.equal('The username already exists');
                    })
                })
            });
        })
    })

})
