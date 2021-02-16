var express = require('express');
var router = express.Router();

const db = require('../db')

let dbStatus = db.connection.readyState

router.get('/', function(req, res, next) {
  res.redirect('/catalog');
});

router.get('/catalog', function(req, res, next) {
  res.render('index', { title: 'Local Library', dbStatus: dbStatus });
});

module.exports = router;
