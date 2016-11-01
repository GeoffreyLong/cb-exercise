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
      var bookDataJson = JSON.parse(body);
      var bookData = bookDataJson[queryBook];
      res.status(200);

      if (bookData) {
        var returnBook = {};
        returnBook.title = bookData['title'];
        returnBook.subtitle = bookData['subtitle'];
        returnBook.pages = bookData['number_of_pages'];
        returnBook.url = bookData['url'];
        console.log(returnBook);
        res.send(returnBook);
      }
      else {
        console.log("No Data");
        res.send({});
      }
    }
    else {
      console.log("Error:" + err);
      res.status(400).send(err);
    }
  })
});

module.exports = router;
