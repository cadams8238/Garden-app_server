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


describe.only('Garden App - Gardens', function() {
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
                    expect(garden).to.contain.keys('name', 'location', 'zipcode', 'userId', 'createdAt', 'updatedAt', 'id');
                    expect(garden.id).to.equal(data[index].id);
                    expect(garden.name).to.equal(data[index].name);
                    expect(garden.userId.id).to.equal(data[index].userId.toString());
                    expect(new Date(garden.createdAt)).to.eql(data[index].createdAt);
                    expect(new Date(garden.updatedAt)).to.eql(data[index].updatedAt);
                });
            });
        });
    });
});
