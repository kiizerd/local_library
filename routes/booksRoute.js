var express = require('express');
var router = express.Router();

const db = require('../db');
const bookModel = require('../models/book');

let dbStatus = db.connection.readyState;

router.get('/books', (req, res) => res.redirect('/catalog/books'));

router.get('/catalog/books', async (req, res, next) => {
  let booksQuery = await bookModel.find({});
  let authorsMaybe = bookModel.find({}).populate('author');
  res.render('booksIndex', { title: 'Our Books', dbStatus: dbStatus, books: booksQuery, authors: authorsMaybe });
});

module.exports = router;
