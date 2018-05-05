const passport = require('passport')
const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

/**
 * Passport configuration.
 */
const passportConfig = require('../config/passport');

/* GET home page. */
router.get('/login', AuthController.getLogin);

router.post('/login', AuthController.postLogin);

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/login' }), (req, res) => {
  req.session.user = req.user;
  res.redirect(req.session.returnTo || '/');
});

router.get('/logout', AuthController.getLogout);

module.exports = router;
