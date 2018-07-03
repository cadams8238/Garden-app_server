//requires express and creates instance of it in same line
const routeApp = require('express')();
const weatherData = require('./weatherData');

//sanity check
routeApp.get('/', (req, res) => {
    res.send({msg: 'hello! Server is up and running'});
});

routeApp.use('/', weatherData);

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
