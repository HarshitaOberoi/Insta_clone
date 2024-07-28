var createError = require('http-errors');
var express = require('express');
var expressSession=require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport=require('passport')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// yeh hmesha view ke baad likhna...server ko allow kr rhe hain session ke liye
app.use(expressSession({
  saveUninitialized:false,
  // server pe dbao km odega nhi toh baar bar session start hota rhega
  resave:false,  
  secret:"bye bye"

}))
// passport ko bola shuru ho jao authentication and authorization ke liye
app.use(passport.initialize())
// session ke save krne ki peermission deni
app.use(passport.session())
passport.serializeUser(usersRouter.serializeUser())
passport.deserializeUser(usersRouter.deserializeUser())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);


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
