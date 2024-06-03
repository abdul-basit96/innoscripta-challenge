const express = require('express');
const { callback } = require('../controllers/auth-controller');
const router = express.Router();
const passport = require('passport');

router.get('/login', passport.authenticate('azure_ad_oauth2'));
router.get('/callback', passport.authenticate('azure_ad_oauth2', {
    failureRedirect: '/',
    session: false,
  }), callback);

module.exports = router;
