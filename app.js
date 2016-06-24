var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chickens', function(err) {
    // create an DB called 'iot' in mongodb
    if(err) {
        console.log('Mongoose: connection DB error', err);
    } else {
        console.log('Mongoose: connection DB successful');
    }
});

var app = express();
var routes = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

/*
app.post('/', function(request, response){
    console.log(request.body);      
    response.setHeader('Content-Type', 'text/plain')
    response.write('you posted:\n')
    response.end(JSON.stringify(request.body, null, 2))
});
*/

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
        var err = new Error('Not Found');
            err.status = 404;
                next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

if (!module.parent) {
    var server = app.listen(3000, function () {
      var host = server.address().address
      var port = server.address().port
      console.log("Express started on http://%s:%s", host, port)
    })
}

module.exports = app;

