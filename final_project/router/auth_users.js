const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

//returns boolean if the user is registered
const isValid = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}
//returns boolean if the user is authenticated
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login and get a token
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(400).json({message: "Username and password required"});
  }
  
  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      
      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User with username " + username + " has been logged in successfully");
  } else {
      return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization['username'];
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).send("The review for the book with ISBN " + isbn + " has been added successfully");
  } else {
    return res.status(404).json({message: "The book with ISBN " + isbn + " has not been found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  if (books[isbn]) {
    delete books[isbn].reviews[username];
    return res.status(200).send("The review for the book with ISBN " + isbn + " has been deleted successfully");
  } else {
    return res.status(404).json({message: "The book with ISBN " + isbn + " has not been found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
