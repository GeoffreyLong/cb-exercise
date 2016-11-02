var express = require('express');
var path = require('path');
var router = express.Router();
var request = require('request');

// Send the html file to the user
// Since the browser *almost* always reroutes to '/', we will have the index.html file
router.get('/', function(req, res) {
  res.sendFile(path.resolve('index.html'));
});

router.get('/find', function(req, res) {
  var queryString = req.query.books;

  // Check to see if there is a query, else it is an erroneous call
  if (!queryString) {
    res.redirect('/');
  }
  else {
    request('https://openlibrary.org/api/books?bibkeys=' + queryString + '&format=json&jscmd=data', function (error, response, body) {
      // Set up the return structure
      var returnStructure = {};
      returnStructure.books = [];
      returnStructure.notFound = [];
      returnStructure.err = null;

      if (!error && response.statusCode == 200) {
        // Pull out the response and put into Javascript's JSON dictionary object
        var bookDataJson = JSON.parse(body);

        // Check if bookDataJson object exists
        // This could speed up the process if there are no valid entries
        // if (Object.keys(bookDataJson).length === 0 && bookDataJson.constructor === Object) {
        // }
        
        // We have a response from the API, so set the status
        res.status(200);

        // Check each of the ISBNs or LCCNs to see if they were found by the API
        // If they were found, then add them to the array of books
        // Else, add them to the notFound array
        queryString.split(",").forEach(function(identifier) {
          var bookData = bookDataJson[identifier];
           if (bookData) {
            // Parse data and place into object
            var returnBook = {};
            returnBook.title = bookData['title'];
            returnBook.subtitle = bookData['subtitle'];
            returnBook.pages = bookData['number_of_pages'];
            returnBook.url = bookData['url'];
            
            // Push object to the books array
            returnStructure.books.push(returnBook);
          }
          else {
            // Push the identifier to the notFound array
            returnStructure.notFound.push(identifier);
          }
        });
      }
      else {
        // When the API call results in an error, add this to the structure
        // Set the status
        console.log("Error:" + error);
        returnStructure.err = error
        res.status(400);
      }
      
      // Send the resultant data back to the front end
      res.send(returnStructure);
    })
  }
});

module.exports = router;
