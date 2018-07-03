const express = require('express');
const passport = require('passport');

const router = express.Router();
const localAuth = passport.authenticate('local', { session: false });


router.post('/login', localAuth, function (req, res) {
  console.log(`${req.user.username} successfully logged in.`);
  return res.json({ data: 'rosebud' });
});

module.exports = router;
