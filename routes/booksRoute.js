var express = require('express');
var router = express.Router();

const db = require('../db');
const bookModel = require('../models/book');

let dbStatus = db.connection.readyState;

router.get('/books', function(req, res, next) {
  res.redirect('/catalog/books');
});

router.get('/catalog/books', async (req, res, next) => {
  let booksQuery = await bookModel.find({});
  res.render('booksIndex', { title: 'Our Books', dbStatus: dbStatus, books: booksQuery });
});

module.exports = router;
