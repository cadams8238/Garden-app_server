const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const User = require('../models/users');

router.get('/', (req, res, next) => {
    User.find()
        .then(results => {
            res.json(results);
        })
        .catch(err => next(err));
});

module.exports = router;
