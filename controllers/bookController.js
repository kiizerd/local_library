var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator');

var async = require('async');
const genre = require('../models/genre');

exports.index = function(req, res) {

    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

// Display list of all Books.
exports.book_list = function(req, res, next) {

  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });

};

// Display detail page for a specific book.
exports.book_detail = function (req, res, next) {
  
  async.parallel({
    book: function(callback) {
      
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: function(callback) {

      BookInstance.find({ 'book': req.params.id })
      .exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.book==null) {
      var err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    res.render('book_detail', {
      title: results.book.title,
      book: results.book,
      book_instances : results.book_instance
    });
  });
};

// Display book create form on GET.
exports.book_create_get = function (req, res) {
  async.parallel({
    authors: function(callback) {
      Author.find(callback);
    },
    genres: function(callback) {
      Genre.find(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('book_form', {
      title: 'Create Book',
      authors: results.authors,
      genres: results.genres 
    });
  }
  )
};

// Handle book create on POST.
exports.book_create_post = [
  (req, res, next) => {
    // convert genre to array
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined')
      req.body.genre = [];
      else
      req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  
  // validate and sanitize
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 13, max: 13 }).escape()
    .withMessage('Must be 13 characters').isNumeric().withMessage('Must contain only numbers'),
  body('genre.*').escape(),
  
  // process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    // create new book object with escaped and trimmed data
    let book = new Book(
      {
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre
      });
    if (!errors.isEmpty()) {
      // there are errors

      // get all authors and genres for form
      async.parallel({
        authors: function(callback) {
          Author.find(callback);
        },
        genres: function(callback) {
          Genre.find(callback);
        }
      }, function(err, results) {
        if (err) { return next(err); }
        // mark our selected genres as checked
        for (let i = 0; i < results.genres.length; i++) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked='true';
          }
        }
        res.render('book_form', {
          title: 'Create Book',
          authors: results.authors,
          genres: results.genres,
          book: book,
          errors: errors.array()
        });
      });
      return;
    } else {
      // data from form is valid, save book
      book.save(function(err) {
        if (err) { return next(err); }
        // new book creation successfull, redirect to book detail page
        res.redirect(book.url);
      });
    }
  }
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res, next) {
  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id).exec(callback)
    },
    book_instances: function(callback) {
      BookInstance.find({ 'book': req.params.id }).exec(callback)
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.book==null) {
      res.redirect('/catalog/books')
    }
    res.render('book_delete', {
      title: 'Delete Book',
      book: results.book,
      book_instances: results.book_instances
    })
  })
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res, next) {
  async.parallel({
    book: function(callback) {
      Book.findById(req.body.bookid).exec(callback)
    },
    book_instances: function(callback) {
      BookInstance.find({ 'book': req.body.bookid }).exec(callback)
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.book_instances.length > 0) {
      res.render('book_delete', {
        title: 'Delete Book',
        book: results.book,
        book_instances: results.book_instances
      });
      return;
    } else {
      Book.findByIdAndRemove(req.body.bookid, function deleteBook(err) {
        if (err) { return next(err); }
        res.redirect('/catalog/books');
      });
    };
  });
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};