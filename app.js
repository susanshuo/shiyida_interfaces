var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var login = require('./routes/login');
var regist = require('./routes/regist');
var publish_topic = require('./routes/publish_topic');
var users = require('./routes/users');
var index = require('./routes/index');

var zan = require('./routes/pub_zan');
var comment = require('./routes/pub_comment');
var suggestion = require('./routes/suggestion');

var versionname = require('./routes/get_versionname');
var apkurl = require('./routes/get_apkurl');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);
app.use('/regist', regist);
app.use('/publish_topic',publish_topic);
app.use('/users', users);

app.use('/zan',zan);
app.use('/comment',comment);
app.use('/suggestion',suggestion);

app.use('/pub_zan',zan);
app.use('/pub_comment',comment);

app.use('/get_versionname',versionname);
app.use('/get_apkurl',apkurl);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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
app.listen(3000);
module.exports = app;
