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
var query = require('./models/db');
app.post('/reduce/:id', async function(req, res, next) {
  const productId = req.params.id;
  const qty = req.body.qty; 
  // var cart = new Cart(req.session.cart ? req.session.cart : {});
  // cart.reduce(productId, qty);
  // req.session.cart = cart;
  let amount;
  if(req.isAuthenticated()){
    var cartuser;
    //cartuser = await CartUser.findOne({user: req.user});
    let cartorder = await query('select * from orders where ID_Customer = ? and Status = 0',[req.user.ID_Customer] );
    cartuser = await query('select * from detail_order where ID_Order = ? and ID_Book = ?',[cartorder[0].ID_Order, productId])
    let newprice = cartuser[0].Price/cartuser[0].Quantity_DetailOrder * qty;
    amount = cartorder[0].Amount - cartuser[0].Price + newprice;
    await query('update orders set Amount = ? where ID_Order = ?',[amount, cartorder[0].ID_Order] );
    await query('update detail_order set Quantity_DetailOrder = ?, Price = ? where ID_Order = ? and ID_Book = ?',[qty, newprice, cartorder[0].ID_Order, productId] );
    
  }

  res.status(200).send({ total: amount });
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
