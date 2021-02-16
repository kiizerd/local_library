var express = require('express');
var router = express.Router();

const db = require('../../db');
const authorModel = require('../../models/author');

let dbStatus = db.connection.readyState;

router.get('/authors', (req, res) => res.redirect('/catalog/authors'));

router.get('/catalog/authors', async (req, res, next) => {
  let authorsQuery = await authorModel.find({});
  res.render('authorsIndex', {
    title: 'Our Authors',
    dbStatus: dbStatus,
    authors: authorsQuery
  });
});

module.exports = router;
