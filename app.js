var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// for session creating 
const Secertkey = require('./config/config'); // secret key 
const session = require('express-session')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:Secertkey.Secertkey,cookie:{maxAge:600000}, saveUninitialized: true,resave: true,}))  
// mongodb connecting
const db =require('./config/connection');
db.connect((err)=>{
  if(err) console.log('database is connection error');
  else console.log('Database is connected');
})

// Users Router
const usersRouter = require('./routes/users');
app.use('/', usersRouter);

// Admin router
var adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

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
