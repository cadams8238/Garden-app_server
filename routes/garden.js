const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');

const Garden = require('../models/garden');


router.use('/', passport.authenticate('jwt', {session: false}));


router.get('/', (req, res, next) => {
    const userId = req.user.id;

    Garden.find({userId})
        .populate("userId")
        .then(results => res.json(results))
        .catch(err => next(err))
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('The `id` is not valid');
        err.status = 400;
        return next(err);
      }

    Garden.findOne({_id: id, userId})
        .then(result => {
            if (result) {
              res.json(result);
            } else {
              next();
            }
        })
        .catch(err => next(err));
});



router.post('/', (req, res, next) => {
    const { name, location, description } = req.body;
    const userId = req.user.id;
    const newGarden = { name, location, description, userId };
    // let newGarden;
    // newGarden = !description ?
    //     { name, location } :
    //     { name, location, description}

    Garden.create(newGarden)
        .then(result => {
            res.location(`${req.originalUrl}/${result.id}`)
                .status(201).json(result);
        })
        .catch(err => next(err));

});


router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    Garden.findOneAndRemove({_id: id, userId})
        .then(() => {
            res.sendStatus(204);
        })
        .catch(err => next(err));
});


module.exports = router;
