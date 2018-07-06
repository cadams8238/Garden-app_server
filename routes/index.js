//requires express and creates instance of it in same line
const routeApp = require('express')();

const weatherData = require('./weatherData');
const users = require('./users');
const auth = require('./auth');
const garden = require('./garden');
// const task = require('./task');


//sanity check
routeApp.get('/', (req, res) => {
    res.send({msg: 'hello! Server is up and running'});
});

routeApp.use('/', auth);
routeApp.use('/weatherData', weatherData);
routeApp.use('/users', users);
routeApp.use('/garden', garden);
// routeApp.use('/task', task);


//Custom [404: Not Found] error handler
routeApp.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Custom error handler
routeApp.use((err, req, res, next) => {
    console.error(err);
    if(err.status) {
        const errBody = {
            ...err,
            message: 'Internal Server Error'
        }
        res.status(err.status).json(errBody);
    } else {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

module.exports = routeApp;
