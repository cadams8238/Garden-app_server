//requires express and creates instance of it in same line
const routeApp = require('express')();

//sanity check
routeApp.get('/', (req, res) => {
    res.send({msg: 'hello! Server is up and running'});
});

// routeApp.use('/users/', require('./users'));


module.exports = { routeApp };
