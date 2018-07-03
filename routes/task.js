const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Task = require('../models/task');



router.get('/', (req, res, next) => {
    Task.find()
        .then(results => {
            console.log(results)
            res.json(results)
        })
        .catch(err => next(err));
});

module.exports = router;
