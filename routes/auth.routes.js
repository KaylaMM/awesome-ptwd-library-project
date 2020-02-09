// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

// routes/auth.routes.js
// ... the setup

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');

// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
    })
    .catch(error => next(error));
});
// router.post('/signup', (req, res, next) => {
//   console.log('The form data: ', req.body);
// });

router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log(`Password hash: ${hashedPassword}`);
    })
    .catch(error => next(error));
  });

  //USER PROFILE
router.get('/userProfile', (req, res) => {
    // res.render('users/user-profile'));
    res.render('/userProfile');
});

module.exports = router;