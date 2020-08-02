var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs  = require('express-handlebars');
var passport = require("passport");
var flash = require("connect-flash");
var expressSession=require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var Cart = require('./models/cart');
var CartUser = require('./models/sessionuser');
require('dotenv').config();
require("./config/passport");
require("./config/handlebars");
var app = express();


//mongoose.connect('mongodb://localhost/shopping');
//mongoose.connect(process.env.MONGO_ATLAS);
mongoose.connect("mongodb+srv://admin:adminpassword@tanhung-o7d5l.mongodb.net/shopping?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
app.engine( 'hbs', exphbs( {
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  defaultLayout: "layout"
}));

app.set("view engine", ".hbs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// Login Work Start

app.post('/reduce/:id', async function(req, res, next) {
  const productId = req.params.id;
  const qty = req.body.qty; 
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduce(productId, qty);
  req.session.cart = cart;

  if(req.isAuthenticated()){
    var cartuser;
    cartuser = await CartUser.findOne({user: req.user});
    if(cartuser){
      cartuser.cart = req.session.cart;
    }else{
      cartuser = new CartUser({user: req.user, cart: req.session.cart});
    }
    cartuser.save();
  }

  res.status(200).send({ total: cart.totalPrice });
});

app.use(function(req, res, next)
{
  //login or logout
  res.locals.isAuthenticated= req.isAuthenticated();
  res.locals.user = req.user;
  //session cart
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authRouter);



app.post('/login',passport.authenticate('local', {
  failureRedirect: '/login',
  }), async function (req, res, next) {
    try{
    res.redirect('/');
    }catch(error){
      next(error);
    }
});

app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


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
