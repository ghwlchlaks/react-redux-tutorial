const express = require('express');
const router = express.Router();
const Memo = require('../models/memo').Memo;

// write memo
router.post('/', (req, res) => {});

// modify memo
router.put('/:id', (req, res) => {});

//delete memo
router.delete('/:id', (req, res) => {});

//get memo list
router.get('/', (req, res) => {});

module.exports = router;
