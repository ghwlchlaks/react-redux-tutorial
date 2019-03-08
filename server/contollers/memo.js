const express = require('express');
const router = express.Router();
const Memo = require('../models/memo').Memo;

// write memo
router.post('/', (req, res) => {
  const contents = req.body.contents;
  const loginInfo = req.session.loginInfo;

  // login check
  if (typeof loginInfo === 'undefined') {
    return res.status(403).send({
      error: 'not logged in',
      code: 1
    });
  }

  // check contents valid
  if (typeof contents !== 'string' || contents === '') {
    return res.status(400).send({
      error: 'empty contents',
      code: 2
    });
  }

  // create new memo
  const memo = new Memo({
    writer: loginInfo.username,
    contents: contents
  });

  // save memo
  memo.save(err => {
    if (err) throw err;
    return res.send({ success: true });
  });
});

// modify memo
router.put('/:id', (req, res) => {});

//delete memo
router.delete('/:id', (req, res) => {});

//get memo list
router.get('/', (req, res) => {});

module.exports = router;
