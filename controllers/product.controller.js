var Product = require('../models/product');
var Comment = require('../models/comments');
var Cart = require('../models/cart');
var CartUser = require('../models/sessionuser');
var Order = require('../models/order');
var CountView = require('../models/countview');
module.exports.index = async function(req, res, next) {
 try{
   if(req.isAuthenticated()){
    const usercart = await CartUser.findOne({user: req.user});
    if(usercart){
      if(usercart.cart){
        req.session.cart = usercart.cart;
      }
      if(usercart.countview){
        req.session.countview = usercart.countview;
      }
    }
   }
  Product.find((error, data) =>{
    res.render('index', {products: data.slice(4,12)  });
  });
 }catch(error){
   next(error)
 }
};

module.exports.products = function(req, res, next) {
  var perPage = 9;
  let page = req.query.page || 1;

  let querygender =  {};
  if(req.query.gender !=undefined)
  {
    if(req.query.gender==="Nam") {
      querygender = {gender: "nam"};
    }
    else
    {
      querygender={gender:"nữ"}
    }
  }

  let price = req.query.price;
  //console.log(price);
  let queryprice = {};

  if(price == "duoi-5-tram")
    queryprice ={price: {  $lte: 500000 } }
  else if(price == "tu-5-tram-1-trieu"){
    queryprice ={price: {  $gte: 500000, $lte: 1000000} }
  }else if(price == "tren-1-trieu"){
    queryprice ={price: {  $gte: 1000000 } }
  }
  
  let querysortprice = {};
  if (req.query.SortPrice == "gia-giam"){
    querysortprice = {price: -1}
  }else if(req.query.SortPrice == "gia-tang"){
    querysortprice = {price: 1}
  }

  const producttype = req.query.Category;
  const brand = req.query.Producer;
  //console.log(producttype);
  //console.log(brand);
  let querybrand = {};
  let queryproduct = {};
  if(producttype === 'all1')
    queryproduct = {};
  else if(producttype === 'Cap'){
    queryproduct = {cat : 'Cặp'};
  }else if(producttype === 'Giay'){
    queryproduct = {cat : 'Giày'};
  }else if(producttype === 'Vi'){
    queryproduct = {cat : 'Ví'};
  }else if(producttype === 'Dongho'){
    queryproduct = {cat : 'Đồng hồ'};
  }

  if(brand === 'all2')
    querybrand = {};
  else if(brand === 'vanoca'){
    querybrand = {producer : 'vanoca'};
  }else if(brand === 'manzo'){
    querybrand = {producer : 'manzo'};
  }else if(brand === 'slimheel'){
    querybrand = {producer : 'slimheel'};
  }else if(brand === 'apple'){
    querybrand = {producer : 'apple'};
  }else if(brand === 'samsung'){
    querybrand = {producer : 'samsung'};
  }
  
  var search = req.query.search;
  var querysearch ={};
  if(search != undefined){
    querysearch = {productname: {$regex: req.query.search, $options: 'i'}};
  }
  
  Product.find(queryproduct).find(querybrand).find(queryprice).find(querygender).find(querysearch).skip((perPage * page) - perPage).limit(perPage).sort(querysortprice)
  .exec((err, data)=>{
    Product.find(queryproduct).find(querybrand).find(queryprice).find(querygender).find(querysearch).count().exec((err, count)=>{
      if(err){
        return next(err);
      }
      res.render('product/products', { title: 'Express', products: data, currentpage : page, total_page: Math.ceil(count / perPage), producttype: producttype, brand: brand  });
    })
  })
};

module.exports.productpage = (req, res, next) => {
  let perPage = 4;
  let page = req.query.page || 1;

  Product.findOne({ _id: req.params.id  }, async(err,data)=>{
    try{
      let countview =  new CountView(req.session.countview? req.session.countview : {})
      countview.add(data._id);
      req.session.countview = countview;
      console.log(req.session.countview);
      if(req.isAuthenticated()){
        let cartuser;
        cartuser = await CartUser.findOne({user: req.user});
        if(cartuser){
          cartuser.countview = req.session.countview;
        }else{
          cartuser = new CartUser({user: req.user, countview: req.session.countview});
        }
        cartuser.save();
      }
      let products = await Product.find({cat : data.cat});
      result = await products.filter(element => element.id !== data.id);
      let comments = await Comment.find({postId : data.id}).skip((perPage * page) - perPage).limit(perPage);
      let count = await Comment.find({postId : data.id}).count().exec();
      res.render('product/product-page',{data: data, products: result.splice(Math.floor(Math.random()*products.length),3), postId: data._id, comments:comments, currentpage : page, total_page: Math.ceil(count / perPage), countview: countview.showtoOne(data._id)});
    }catch(err){
      next(err);
    }
  });   
};
module.exports.productpagepost = (req, res, next) => {
  const name = req.body.name || req.user.name || req.user.username;
  const comment = req.body.comment;
  const postId = req.body.postId;

  let commentdb = new Comment({name: name, comment: comment, postId: postId});

  commentdb.save((err, result)=>{
    if(err){
        console.log('loi khong the luu comment');
    }else{
        console.log('luu comment thang cong');
        res.redirect(req.url);
    }
  })
};

module.exports.checkout =  function(req, res, next) {
  res.render('product/checkout');
}

module.exports.checkoutpost =  async function(req, res, next){
  try{
    if(!req.session.cart){
      return res.redirect('/');
    }
  
    if(req.body.address =="" || req.body.phonenumber =="" || req.body.name =="" || req.body.methodpay ==""){
      return res.redirect('/');
    }
  
    
  
    let cart = new Cart(req.session.cart);
  
    let x = cart.generateArray();
    for(var i=0; i<x.length; i++){
      let product = await Product.findById(x[i].item._id);
      product.qtysold = product.qtysold ? (product.qtysold +  parseInt(x[i].qty)) : parseInt(x[i].qty);
      product.save();
    }
    var datenow =new Date();
    datenow = datenow.getDate() + "/" + (datenow.getMonth() +1) + "/" + datenow.getFullYear();
    let order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      phonenumber: req.body.phonenumber,
      status: 0,
      methodpay: req.body.methodpay,
      date: datenow
    })
  
    order.save((err, result)=>{
      if(err){
        next(err);
      }
      req.flash('success', 'Bạn đã mua thành công!');
      req.session.cart = null;
      res.redirect('/');
    })
  }catch(err){
     next(err);
    //res.redirect('/');
  }
}
module.exports.addtocart =  function(req, res, next) {
  const productId = req.params.id;
  const qty = parseInt(req.params.id2);
  let cart = new Cart(req.session.cart? req.session.cart : {});
  
  Product.findById(productId, async(err, data)=>{
    if(err){
      console.log('khong them dc vao gio');
      res.redirect('/products');
    }
    cart.addmany(data, data._id, qty);
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
    console.log(req.session.cart);
    res.redirect('/products');
  })
};

module.exports.viewcart = function(req, res, next) {
  if(!req.session.cart){
    return res.render('product/view-cart', {products: null});
  }
  const cart = new Cart(req.session.cart);
  res.render('product/view-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
};

module.exports.removecart = async function(req, res, next){
  try{
  let productId = req.params.id;

  let cart = new Cart(req.session.cart? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;

  if(req.isAuthenticated()){
    let cartuser;
    cartuser = await CartUser.findOne({user: req.user});
    if(cartuser){
      cartuser.cart = req.session.cart;
    }else{
      cartuser = new CartUser({user: req.user, cart: req.session.cart});
    }
    cartuser.save();
  }

  res.redirect('/view-cart');
  }catch(err){
    next(err);
  }
}

module.exports.statusproduts = async function(req, res, next) {

  try{
    let orders = await Order.find({user: req.user})

    let cart;
    
    orders.forEach(order => {
      //moi don dat hang
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('delivery/status-products', { orders: orders });

  }catch(error){
    next(error);
  }
  
};

