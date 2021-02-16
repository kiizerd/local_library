var express = require('express');
var router = express.Router();

const db = require('../../db');
const bookInstanceModel = require('../../models/bookinstance');

let dbStatus = db.connection.readyState;

router.get('/bookinstances', (req, res) => res.redirect('/catalog/genre'));

router.get('/catalog/book_instances', async (req, res, next) => {
  let bookInstanceQuery = await bookInstanceModel.find({});
  res.render('bookInstIndex', {
    title: 'Our Book Instances',
    dbStatus: dbStatus,
    bookInstance: bookInstanceQuery
  });
});

module.exports = router;
