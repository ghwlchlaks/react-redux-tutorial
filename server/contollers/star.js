const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Memo = require('../models/memo').Memo;

router.post('/:id', (req, res) => {
  const id = req.params.id;
  const loginInfo = req.session.loginInfo;

  // check memo id vaild
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      error: 'invaild id',
      code: 1
    });
  }

  // check login status
  if (typeof loginInfo === 'undefined') {
    return res.status(403).send({
      error: 'not logged in',
      code: 2
    });
  }

  // find memo
  Memo.findById(id, (err, memo) => {
    if (err) throw err;
    if (!memo) {
      return res.status(404).send({
        error: 'no resource',
        code: 3
      });
    }

    // memo starred배열에서 유저의 아이디와 일치하는 index값 받기
    let index = memo.starred.indexOf(loginInfo.username);

    // 가지고 있다면 true 아니면 false
    let hasStarred = index === -1 ? false : true;

    if (!hasStarred) {
      // star누른적이없는 유저라면 배열에 추가
      memo.starred.push(username);
    } else {
      // 누른적이 있는 유저라면 배열에서 제거
      memo.starred.splice(index, i);
    }

    //save
    memo.save((err, memo) => {
      if (err) throw err;
      res.send({
        success: true,
        has_starred: !hasStarred,
        memo
      });
    });
  });
});

module.exports = router;
