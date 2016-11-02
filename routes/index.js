var express = require('express');
var path = require('path');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res) {
  res.sendFile(path.resolve('index.html'));
});

router.get('/find', function(req, res) {
  var queryBook = req.query.book;
  request('https://openlibrary.org/api/books?bibkeys=' + queryBook + '&format=json&jscmd=data', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // Pull out the response and put into Javascript's JSON dictionary object
      var bookDataJson = JSON.parse(body);

      res.status(200);

      var returnStructure = {};
      returnStructure.books = [];
      returnStructure.notFound = [];

      // Check if bookDataJson object exists
      // if (Object.keys(bookDataJson).length === 0 && bookDataJson.constructor === Object) 

      // Check each of the ISBNs or LCCNs to see if they were found
      // If they were found, then add them to the array of books
      // Else, add them to the notFound array
      queryBook.split(",").forEach(function(identifier) {
        var bookData = bookDataJson[identifier];
         if (bookData) {
          // Parse data and place into object
          console.log(bookData);
          var returnBook = {};
          returnBook.title = bookData['title'];
          returnBook.subtitle = bookData['subtitle'];
          returnBook.pages = bookData['number_of_pages'];
          returnBook.url = bookData['url'];
          
          // Push object to the books array
          console.log(returnBook);
          returnStructure.books.push(returnBook);
        }
        else {
          // Push the identifier to the notFound array
          console.log("Book Not Found");
          returnStructure.notFound.push(identifier);
        }
      });

      res.send(returnStructure);
    }
    else {
      console.log("Error:" + error);
      res.status(400).send(error);
    }
  })
});

module.exports = router;
