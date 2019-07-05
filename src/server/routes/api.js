'use strict';

const express = require('express');
const router = express.Router();

router.get('/testapi', (req, res) => {
  res.json({"Working":true});
});

module.exports = router;