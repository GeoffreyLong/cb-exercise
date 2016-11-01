var express = require('express');
var path = require("path");
var router = express.Router();

router.get('/', function(req, res) {
  res.sendFile(path.resolve('index.html'));
});

router.get('/find', function(req, res) {

});

module.exports = router;
