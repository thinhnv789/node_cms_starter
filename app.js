var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var expressValidator = require('express-validator');

/**
 * Read .env
 */
dotenv.config({path: './env/.env'});

const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');
const authRouter = require('./routes/auth');

const apiMediaRouter = require('./apis/routers/media');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
// Use session
var appSession = session({
  resave: true,
  rolling : true,
  saveUninitialized: false,
  secret: process.env.SECRET, // realtime chat system
  cookie:{ maxAge: parseInt(process.env.SESSION_EXP) },
  store: new MongoStore({
    url: process.env.MONGO_DB,
    autoReconnect: true,
  })
});
app.use(appSession);
app.use(flash());

// Pass user login to client
app.use((req, res, next) => {
  // Allow request from all domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.locals.user = req.session.user;
  next();
});

app.use('/libs', express.static(__dirname + '/node_modules/'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/auth', authRouter);

// Api routers
app.use('/api/media', apiMediaRouter);

// Connect to mongo database
mongoose.connect(process.env.MONGO_DB, function(err, db) {
  if (err) {
    console.log('error connect db', err);
  } else {
    console.log('Mongo database is connected')
  }
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
