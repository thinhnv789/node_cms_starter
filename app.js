var createError = require('http-errors');
var express = require('express');
var i18n = require('i18n');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var io = require('socket.io')();
var ioEvents = require('./socket/server')(io);
var appRouters = require('./routes/index');
var apiRouters = require('./apis/routers/index');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var expressValidator = require('express-validator');
var passport = require('passport');

/**
 * Read .env
 */
dotenv.config({path: './env/.env'});

/**
 * Passport configuration.
 */
const passportConfig = require('./config/passport');

var app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
// Use session
var sessionMiddleware = session({
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
io.use(function(socket, next) {
  sessionMiddleware(socket.request, {}, next);
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set locales
i18n.configure({
  locales:['en', 'vi'],
  // defaultLocale: 'en',
  directory: __dirname + '/locales'
});

// Pass user login to client
app.use((req, res, next) => {
  // express helper for natively supported engines
  if (process.env.I18N_LANG) {
    try {
      i18n.setLocale(process.env.I18N_LANG);   
    } catch (e) {

    }
  }
  global.i18n = i18n;
  res.locals.i18n = i18n;
 
  // Allow request from all domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.locals.user = req.session.user;
  res.locals.userPermissions = req.session.permissions;
  next();
});

app.use('/libs', express.static(__dirname + '/node_modules/'));
app.use(express.static(path.join(__dirname, 'public')));

// App routers
appRouters(app);

// Api routers
apiRouters(app);

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

global.io = io;

module.exports = app;
