var express = require('express');
var path = require('path');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res) {
  res.sendFile(path.resolve('index.html'));
});

router.get('/find', function(req, res) {
  request('https://openlibrary.org/api/books?bibkeys=ISBN:0385472579&format=json&jscmd=data', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
    }
  })
});

module.exports = router;
