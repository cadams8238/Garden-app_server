const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const { WEATHER_API_KEY } = require('../config');
const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=Portland&mode=json&APPID=';

// router.get('/', (req, res, next) => {
//     res.send({message: 'hi'})
// })

router.get('/', (req, res, next) => {
    fetch(`${WEATHER_API_URL}${WEATHER_API_KEY}`)
    .then(response => response.json())
    .then(jsonData => {
        res.json(jsonData);
    })
    .catch(err => next(err));
})

module.exports = router;
