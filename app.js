var express = require('express');
var routes = require('./routes/index');
var path = require('path');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev')); 

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'app')));

// Ignore requests for favicon
app.get('/favicon.ico', function(req, res) {
    res.send(200);
});

app.use('/', routes);

app.all('*', function(req, res) {
    res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        console.log(err.message);
        res.status(err.status || 500).end();
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err);
    console.log(err.message);
    res.status(err.status || 500).end();
});

module.exports = app;
