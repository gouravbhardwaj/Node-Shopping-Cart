var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var routes = require('./routes/index');
var mongoose = require('mongoose');
var session = require('express-session');
var passport =require('passport'); //User management Signup/In
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);//Used for saving cart details in Session, workes with Mongoose and express-session
var userRoutes = require('./routes/user');
var app = express();

mongoose.connect('localhost:27017/shopping');
require('./config/passport')
// view engine setup
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());//Validator parses the body in the request so only after the Body
app.use(cookieParser());
app.use(session({
  secret:'mysupersecret',
  resave:true,
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),//Making use of Mongodb Connection and making sure no new connecion is created, we want to make sure already extablised connection is put to use.
  cookie: {maxAge : 180 * 60 * 1000} //how long the session should live before it expired
}
));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();

  res.locals.session = req.session;//Middleware to make sure i have access to session object in my Views also.
  next();
});
app.use('/user', userRoutes);
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
