const express = require('express');
const router = express.Router();
const User = require('../models/user').User;

router.get('/', (req, res) => {
  res.send('auth main route');
});

/**
 * error code
 * 1: username(x)
 * 2: password(x)
 * 3: exists username
 */
router.post('/signup', (req, res) => {
  const usernameRegex = /^[a-z0-9]+$/;
  const { username, password } = req.body;

  if (!usernameRegex.test(username)) {
    return res.status(400).send({
      error: 'bad username',
      code: 1
    });
  }

  // check pass length
  if (password.length < 4 || typeof password !== 'string') {
    return res.status(400).send({
      error: 'bad password',
      code: 2
    });
  }

  User.findOne({ username: username }, (err, findUser) => {
    if (err) throw err;
    if (findUser) {
      return res.status(400).send({
        error: 'username exists',
        code: 3
      });
    }

    const user = new User({
      username: username,
      password: password
    });

    user.password = user.generateHash(user.password);

    // save user
    user.save(err => {
      if (err) throw err;
      return res.send({ success: true });
    });
  });
});

router.post('/signin', (req, res) => {
  res.send({ info: null });
});

router.get('/getInfo', (req, res) => {
  res.send({ info: null });
});

router.post('/logout', (req, res) => {
  res.send({ success: true });
});

module.exports = router;
