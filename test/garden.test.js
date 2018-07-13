const {app} = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

const User = require('../models/users');
const Garden = require('../models/garden');

const seedUsers = require('../db/seedUsers');
const seedGardens = require('../db/seedGardens');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Garden App - Gardens', function() {
    let token;
    let user;

    before(function() {
        return mongoose.connect(TEST_DATABASE_URL)
            .then(() => mongoose.connection.db.dropDatabase());
    });

    beforeEach(function() {
        return Promise.all([
            User.insertMany(seedUsers),
            Garden.insertMany(seedGardens)
        ])
        .then(([users]) => {
            user = users[0];
            token = jwt.sign({user}, JWT_SECRET, {subject: user.username});
        });
    });

    afterEach(function() {
        return mongoose.connection.db.dropDatabase();
    });

    after(function() {
        return mongoose.disconnect();
    });


    describe('GET /', function() {
        it('Should return a list of gardens belonging to that user', function() {
            return Promise.all([
                chai.request(app)
                    .get('/garden')
                    .set('Authorization', `Bearer ${token}`),
                Garden.find({userId: user.id})
            ])
            .then(([res, data]) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(data.length);
            });
        });

        it('Should return a list of garden with correct keys and values', function() {
            return Promise.all([
                chai.request(app)
                    .get('/garden')
                    .set('Authorization', `Bearer ${token}`),
                Garden.find({userId: user.id})
            ])
            .then(([res, data]) => {
                res.body.forEach(function(garden, index) {
                    // console.log(garden.userId) -- userId is an object {username, id}
                    expect(garden).to.be.an('object');
                    expect(garden).to.contain.keys('name', 'location', 'zipcode', 'description', 'userId', 'createdAt', 'updatedAt', 'id');
                    expect(garden.id).to.equal(data[index].id);
                    expect(garden.name).to.equal(data[index].name);
                    expect(garden.location).to.equal(data[index].location);
                    expect(garden.zipcode).to.equal(data[index].zipcode);
                    expect(garden.description).to.equal(data[index].description);
                    expect(garden.userId.id).to.equal(data[index].userId.toString());
                    expect(new Date(garden.createdAt)).to.eql(data[index].createdAt);
                    expect(new Date(garden.updatedAt)).to.eql(data[index].updatedAt);
                });
            });
        });
    });

    describe('GET /garden/:id', function() {
        it('Should correctly return one garden', function() {
            let data;
            return Garden.findOne({userId: user.id})
                .then(_data => {
                    data = _data;
                    return chai.request(app)
                        .get(`/garden/${data.id}`)
                        .set('Authorization', `Bearer ${token}`);
                })
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.contain.keys('name', 'location', 'zipcode', 'description', 'userId', 'createdAt', 'updatedAt', 'id');
                    expect(res.body.id).to.equal(data.id);
                    expect(res.body.name).to.equal(data.name);
                    expect(res.body.location).to.equal(data.location);
                    expect(res.body.zipcode).to.equal(data.zipcode);
                    expect(res.body.description).to.equal(data.description);
                    expect(res.body.userId).to.equal(data.userId.toString());
                    expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
                    expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
                })
        })

        it('Should respond with a 400 for an invalid id', function() {
            return chai.request(app)
                .get('/garden/NOT-A-VALID-ID')
                .set('Authorization', `Bearer ${token}`)
                .catch(res => {
                    expect(res).to.have.status(400);
                    expect(res.response.body.message).to.equal('The `id` is not valid');
                })
        })

        it('should respond with a 404 for an ID that does not exist', function () {
            // The string "DOESNOTEXIST" is 12 bytes which is a valid Mongo ObjectId
            return chai.request(app)
                .get('/api/folders/DOESNOTEXIST')
                .set('Authorization', `Bearer ${token}`)
                .catch(res => {
                    expect(res).to.have.status(404);
                });
        });
    });

    describe.only('POST /garden', function() {
        it('Should create and return a new garden when give valid data', function() {
            const newGarden = {
                name: 'My Garden',
                location: 'Portland',
                zipcode: 97211,
                description: 'Growing veg',
                userId: user.id
            }
            let body;

            return chai.request(app)
                .post('/garden')
                .send(newGarden)
                .set('Authorization', `Bearer ${token}`)

                .then(res => {
                    body = res.body;
                    expect(res).to.have.status(201);
                    expect(res).to.have.header('location');
                    expect(res).to.be.json;
                    expect(body).to.be.an('object');
                    expect(res.body).to.contain.keys('name', 'location', 'zipcode', 'description', 'userId', 'createdAt', 'updatedAt', 'id');
                    return Garden.findById(body.id)
                })
                .then(data => {
                    expect(body.id).to.equal(data.id);
                    expect(body.name).to.equal(data.name);
                    expect(body.location).to.equal(data.location);
                    expect(body.zipcode).to.equal(data.zipcode);
                    expect(body.description).to.equal(data.description);
                    expect(body.userId).to.equal(data.userId.toString());
                    expect(new Date(body.createdAt)).to.eql(data.createdAt);
                    expect(new Date(body.updatedAt)).to.eql(data.updatedAt);
                });
        });

        //AssertionError: expected [Error: Bad Request] to have headers or getHeader method
        it.skip('Should return an error when missing `name` field', function() {
            const newGarden = {
                foo: 'bar',
                location: 'Hawaii',
                zipcode: 30021,
                userId: user.id };

            return chai.request(app)
                .post('/garden')
                .send(newGarden)
                .set('Authorization', `Bearer ${token}`)

                .catch(res => {
                    console.log(res);
                    console.log(Object.keys(res));
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.response.body).to.be.an('object');
                    expect(res.response.body.message).to.equal('`name` is not defined');
                });
        });

        it.skip('Should return an error when missing `location` field', function() {
            const newGarden = {
                foo: 'bar',
                name: 'Garden',
                zipcode: 30021,
                userId: user.id };

            return chai.request(app)
                .post('/garden')
                .send(newGarden)
                .set('Authorization', `Bearer ${token}`)

                .catch(res => {
                    console.log(res);
                    console.log(Object.keys(res));
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.response.body).to.be.an('object');
                    expect(res.response.body.message).to.equal('`location` is not defined');
                });
        });

        it.skip('Should return an error when missing `zipcode` field', function() {
            const newGarden = {
                foo: 'bar',
                location: 'Hawaii',
                name: 'Garden',
                userId: user.id };

            return chai.request(app)
                .post('/garden')
                .send(newGarden)
                .set('Authorization', `Bearer ${token}`)

                .catch(res => {
                    console.log(res);
                    console.log(Object.keys(res));
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.response.body).to.be.an('object');
                    expect(res.response.body.message).to.equal('`zipcode` is not defined');
                });
        });
    });
});
