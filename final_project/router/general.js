const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({username: username, password: password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
});

// Get the book list available in the shop
public_users.get("/", (req,res) => {
  //check if there are any books
  if (Object.keys(books).length) {
    //return the books
    return res.send(JSON.stringify(books,null,4));
    //if there are no books, return a message saying no books are available
  } else {
    return res.send("No books are available");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //get the isbn from the request params
  const isbn = req.params.isbn;
  //check if the book exists
  if (books[isbn]) {
    //return the book details
    return res.send(JSON.stringify(books[isbn],null,4));
    //if the book does not exist, return a message saying no book found with ISBN
  } else {
    return res.send("No book found with ISBN: " + isbn);
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //get the author from the request params
  const author = req.params.author.toLowerCase();
  //convert books object to array
  const allBooks = Object.values(books);
  //filter the books by author
  const booksByAuthor = allBooks.filter(book => 
    book.author.toLowerCase().includes(author)
  );
  //if booksByAuthor is not empty, return the books by author
  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor, null, 4));
  //if booksByAuthor is empty, return a message saying no books found by author
  } else {
    return res.send("No books found by author: " + req.params.author);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  //convert books object to array
  const allBooks = Object.values(books);
  //filter the books by title
  const booksByTitle = allBooks.filter(book => 
    book.title.toLowerCase().includes(title)
  );
  //if booksByTitle is not empty, return the books by title
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle, null, 4));
    //if booksByTitle is empty, return a message saying no books found by title
  } else {
    return res.send("No books found by title: " + req.params.title);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //get the isbn from the request params
  const isbn = req.params.isbn;
  //check if the book exists
  if (books[isbn]) {
    //return the reviews for the book
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    //if the book does not exist, return a message saying no reviews found for ISBN
  } else {
    return res.send("No reviews found for ISBN: " + isbn);
  }
});

module.exports.general = public_users;
