// ROUTES FILE NEEDS TO BE REQUIRED IN THE APP.JS IN ORDER NOT TO GIVE 404
// APP NEEDS TO KNOW YOU CREATED A NEW ROUTE FILE, THAT'S THE ONLY WAY FOR IT TO KNOW WHICH ROUTES YOU WANT TO HIT

const express = require('express');
const router = express.Router();

// ********* require Author and Book models in order to use them *********
const Author = require('../models/Author.model');
const Book = require('../models/Book.model');

// ****************************************************************************************
// GET - to display the form to create a new book
// ****************************************************************************************

// localhost:3000/book-input
router.get('/book-input', (req, res) => {
  Author.find() // <-- always gives us an array back
    .then(availableAuthors => {
      res.render('books-views/book-form', { availableAuthors });
    })
    .catch(err => console.log(`Err while displaying book input page: ${err}`));
});

// ****************************************************************************************
// POST - create a book
// ****************************************************************************************

// <form action="/books" method="POST">
router.post('/books', (req, res) => {
  // console.log(req.body);
  Book.create(req.body)
    .then(savedBook => {
      // console.log('saved book is: ', savedBook);
      res.redirect('/books'); // --> redirect to the page that will show us the list of books
    })
    .catch(err => console.log(`Err while saving the book in the DB: ${err}`));
});

// ****************************************************************************************
// GET route to display all the books
// ****************************************************************************************

router.get('/books', (req, res) => {
  Book.find()
    .then(booksFromDB => res.render('books-views/books-list', { books: booksFromDB }))
    .catch(err => console.log(`Err while getting the books from the  DB: ${err}`));
});

// ****************************************************************************************
// POST route to delete the book
// ****************************************************************************************

// <form action="/books/{{this._id}}/delete" method="post">
router.post('/books/:bookId/delete', (req, res) => {
  Book.findByIdAndRemove(req.params.bookId)
    .then(() => res.redirect('/books'))
    .catch(err => console.log(`Err while deleting the book from the  DB: ${err}`));
});

// ****************************************************************************************
// GET route to display the form for updating the book
// ****************************************************************************************

// <a href="/books/{{book._id}}/edit"> Edit </a>
router.get('/books/:id/edit', (req, res) => {
  Book.findById(req.params.id)
    .populate('author')
    .then(foundBook => {
      // console.log('boook:', foundBook);
      Author.find()
        .then(allAvailableAuthorsFromDB => {
          // const allAuthors2 = allAvailableAuthorsFromDB.map(oneAuthorFromDB => {
          //   if (oneAuthorFromDB._id.equals(foundBook.author._id)) {
          //        create additional key in the author object to differentiate
          //        the author that wrote this book from all the other authors

          //     oneAuthorFromDB.isWriter = true;
          //   }
          // });

          const almostAllAuthors = allAvailableAuthorsFromDB.filter(
            oneAuthor => !oneAuthor._id.equals(foundBook.author._id)
          );
          res.render('books-views/book-edit', { foundBook, almostAllAuthors });
        })
        .catch(err => console.log(`Err while getting the authors from the  DB for the update: ${err}`));
    })
    .catch(err => console.log(`Err while getting the book from the  DB for the update: ${err}`));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************

// <form action="/books/{{foundBook._id}}/update" method="POST">
router.post('/books/:id/update', (req, res) => {
  console.log(req.body);
  Book.findByIdAndUpdate(req.params.id, req.body)
    .then(updatedBook => res.redirect(`/books/${req.params.id}`)) // <-- req.params.id OR updatedBook._id
    .catch(err => console.log(`Err while updating the specific book in the  DB: ${err}`));
});

// ****************************************************************************************
// GET route for displaying the book details page
// ****************************************************************************************

router.get('/books/:someBookId', (req, res) => {
  Book.findById(req.params.someBookId)
    .populate('author') // .populate("author") --> we are saying: give me all the details related to the 'author' field in the book
    //                      (there's only author id there so what it does is-finds the rest of information related to that author based on the id)
    .then(foundBook => {
      // console.log('Did I find a book?', foundBook);
      res.render('books-views/book-details', { book: foundBook });
    })
    .catch(err => console.log(`Err while getting the specific book from the  DB: ${err}`));
});

module.exports = router;
