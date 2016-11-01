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
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
