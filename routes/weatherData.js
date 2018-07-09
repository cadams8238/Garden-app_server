const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');

const { WEATHER_API_KEY } = require('../config');
//forecast 5day 3hr
// const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=Portland&mode=json&APPID=';
//current weather 3hr
// const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather?zip=97211&mode=json&APPID=';

const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const WEATHER_API_URL_ENDING = '&mode=json&APPID=';

// router.get('/testData', (req, res, next) => {
//     res.send({data: 'hello'})
// })

// fetch(`${WEATHER_API_URL}${WEATHER_API_KEY}`)


router.get('/:zipcode', (req, res, next) => {
    const { zipcode } = req.params;

    fetch(`${WEATHER_API_URL}${zipcode}${WEATHER_API_URL_ENDING}${WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(jsonData => {
            res.json(jsonData);
        })
        .catch(err => next(err));
})

module.exports = router;
