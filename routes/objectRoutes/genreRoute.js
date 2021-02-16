var express = require('express');
var router = express.Router();

const db = require('../../db');
const genreModel = require('../../models/genre');

let dbStatus = db.connection.readyState;

router.get('/genre', (req, res) => res.redirect('/catalog/genre'));

router.get('/catalog/genres', async (req, res, next) => {
  let genresQuery = await genreModel.find({});
  res.render('genreIndex', {
    title: 'Our Genres',
    dbStatus: dbStatus,
    genres: genresQuery
  });
});

module.exports = router;
