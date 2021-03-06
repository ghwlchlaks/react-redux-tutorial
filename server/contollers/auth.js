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

/**
 * error code
 * 1: login failed
 */
router.post('/signin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (typeof password !== 'string') {
    return res.status(401).send({
      error: 'Login failed',
      code: 1
    });
  }

  User.findOne({ username: username }, (err, findUser) => {
    if (err) throw err;
    // 존재하는 아이디인지 검사
    if (!findUser) {
      return res.status(401).send({
        error: 'login failed',
        code: 1
      });
    }

    // session 생성
    const session = req.session;
    session.loginInfo = {
      _id: findUser._id,
      username: findUser.username
    };

    // return success
    return res.send({
      success: true
    });
  });
});

/**
 * 로그인 검사
 * 만약 새로고침을 해서 어플리케이션을 처음부터 다시 렌더링하게 될 때 가지고있는 쿠키가 유효한건지 체크하기위함.
 */
router.get('/getInfo', (req, res) => {
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(401).send({
      error: 1
    });
  }

  res.send({ info: req.session.loginInfo });
});

/**
 * 로그아웃
 * 세션 소멸
 */
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) throw err;
    return res.send({ success: true });
  });
});

// 유저 검색
router.get('/search/:username', (req, res) => {
  const username = req.params.username;
  const re = new RegExp('^' + username);

  User.find({ username: { $regex: re } }, { _id: false, username: true })
    .limit(5)
    .sort({ username: 1 })
    .exec((err, users) => {
      if (err) throw err;
      res.json(users);
    });
});

// empty username search
router.get('/search', (req, res) => {
  res.json([]);
});

module.exports = router;
