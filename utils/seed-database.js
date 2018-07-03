const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const Task = require('../models/task');
const User = require('../models/users');

const seedTasks = require('../db/seedTasks');
const seedUsers = require('../db/seedUsers');


console.log(`Connecting to mongodb at ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.info('Dropping Database');
        return mongoose.connection.db.dropDatabase();
    })
    .then(() => {
        console.info('Seeding Database');
        return Promise.all([
            Task.insertMany(seedTasks),
            User.insertMany(seedUsers)
        ]);
    })
    .then(() => {
        console.info('Disconnecting');
        return mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        return mongoose.disconnect();
    });
