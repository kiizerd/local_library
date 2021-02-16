var express = require('express');
var router = express.Router();

const db = require('../db')

let dbStatus = db.connection.readyState

// GET home page.
router.get('/', function(req, res) {
  res.redirect('/catalog');
});

module.exports = router;
