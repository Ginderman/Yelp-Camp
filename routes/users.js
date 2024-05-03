const express = require('express');
const router = express.Router({mergeParams: true});
const  catchAsync = require('../utils/CatchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../utils/storeReturnTo');
const usersController = require('../controllers/users')

router.route('/')
      .get( (req, res) => {res.redirect('/home')});

router.route('/register')
      .get((usersController.registerPage))
      .post(catchAsync (usersController.createUser));

router.route('/login')
      .get((usersController.loginPage))
      .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'} ), (usersController.login));

router.get('/logout', (usersController.logout)); 

module.exports = router;


