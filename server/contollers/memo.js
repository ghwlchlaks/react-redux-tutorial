const express = require('express');
const router = express.Router();
const Memo = require('../models/memo').Memo;
const mongoose = require('mongoose');

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
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const contents = req.body.contents;
  const loginInfo = req.session.loginInfo;

  console.log(id, contents, loginInfo);

  // check memo id valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      error: 'invalid id',
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

  //check login
  if (typeof loginInfo === 'undefined') {
    return res.status(403).send({
      error: 'not logged in',
      code: 3
    });
  }

  // find memo
  Memo.findById(id, (err, memo) => {
    if (err) throw err;
    if (!memo) {
      return res.status(404).send({
        error: 'no resource',
        code: 4
      });
    }

    if (memo.writer !== loginInfo.username) {
      return res.status(403).send({
        error: 'permission failure',
        code: 5
      });
    }

    memo.contents = contents;
    memo.date.edited = new Date();
    memo.is_edited = true;

    memo.save((err, memo) => {
      if (err) throw err;
      return res.send({
        success: true,
        memo
      });
    });
  });
});

//delete memo
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const loginInfo = req.session.loginInfo;

  // check memo id valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      error: 'invalid id',
      code: 1
    });
  }

  // check login
  if (typeof loginInfo === 'undefined') {
    return res.status(403).send({
      error: 'not logged in',
      code: 2
    });
  }

  // find memo and check for writer
  Memo.findById(id, (err, memo) => {
    if (err) throw err;
    if (!memo) {
      return res.status(404).send({
        error: 'no resource',
        code: 3
      });
    }
    if (memo.writer != loginInfo.username) {
      return res.status(403).send({
        error: 'permission failure',
        code: 4
      });
    }

    // remove memo
    Memo.remove({ _id: id }, err => {
      if (err) throw err;
      res.send({ success: true });
    });
  });
});

//get memo list
router.get('/', (req, res) => {
  Memo.find()
    .sort({ _id: -1 })
    .limit(6)
    .exec((err, memos) => {
      if (err) throw err;
      res.json(memos);
    });
});

// 특정 유저의 메모 가져오기
router.get('/:username', (req, res) => {
  const username = req.params.username;

  Memo.find({ writer: username })
    .sort({ _id: -1 })
    .limit(6)
    .exec((err, memos) => {
      if (err) throw err;
      res.json(memos);
    });
});

// 유저의이름 old, new 가져오기
router.get('/:username/:listType/:id', (req, res) => {
  const listType = req.params.listType;
  const id = req.params.id;
  const username = req.params.username;

  // check list type valid
  if (listType !== 'old' && listType !== 'new') {
    return res.status(400).send({
      error: 'invalid listType',
      code: 1
    });
  }

  // check memo id valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      error: 'invalid id',
      code: 2
    });
  }

  const objId = new mongoose.Types.ObjectId(id);

  if (listType === 'new') {
    // get new memo
    Memo.find({ writer: username, _id: { $gt: objId } })
      .sort({ _id: -1 })
      .limit(6)
      .exec((err, memos) => {
        if (err) throw err;
        return res.json(memos);
      });
  } else {
    // get older memo
    Memo.find({ writer: username, _id: { $lt: objId } })
      .sort({ _id: -1 })
      .limit(6)
      .exec((err, memos) => {
        if (err) throw err;
        return res.json(memos);
      });
  }
});
module.exports = router;
