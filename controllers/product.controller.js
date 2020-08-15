var Product = require('../models/product');
var Comment = require('../models/comments');
var Cart = require('../models/cart');
var CartUser = require('../models/sessionuser');
var Order = require('../models/order');
var CountView = require('../models/countview');
var query = require('../models/db');
const { model } = require('../models/product');
module.exports.index = async function (req, res, next) {
  try {
    // if (req.isAuthenticated()) {
    //   const usercart = await CartUser.findOne({ user: req.user });
    //   if (usercart) {
    //     if (usercart.cart) {
    //       req.session.cart = usercart.cart;
    //     }
    //     if (usercart.countview) {
    //       req.session.countview = usercart.countview;
    //     }
    //   }
    // }
    // Product.find((error, data) =>{
    //   res.render('index', {products: data.slice(4,12)  });
    // });
    let sql = 'select * from book';
    // db.query(sql, (err, result) => {
    //   res.render('index', { products: result });
    // });
    const result = await query(sql);
    res.render('index', { products: result });
  } catch (error) {
    next(error)
  }
};

module.exports.products = async function (req, res, next) {
  var perPage = 9;
  let page = req.query.page || 1;

  let querygender = {};
  // if (req.query.gender != undefined) {
  //   if (req.query.gender === "Nam") {
  //     querygender = { gender: "nam" };
  //   }
  //   else {
  //     querygender = { gender: "nữ" }
  //   }
  // }

  

  let querysortprice = {};
  if (req.query.SortPrice == "gia-giam") {
    querysortprice = { price: -1 }
  } else if (req.query.SortPrice == "gia-tang") {
    querysortprice = { price: 1 }
  }

  const producttype = req.query.Category;
  const author = req.query.Producer;
  //console.log(producttype);
  //console.log(brand);
  //let queryAuthor = {};
  let queryfilter = {};
  queryfilter['cat'] = '';
  queryfilter['author'] = '';
  queryfilter['price'] = {};
  if (producttype === 'all1')
    queryfilter['cat'] = '';
  else if (producttype === 'Cap') {
    queryfilter['cat'] = '';
  } else if (producttype === 'Giay') {
    queryfilter['cat'] = '';
  } else if (producttype === 'Vi') {
    queryfilter['cat'] = '';
  } else if (producttype === 'Dongho') {
    queryfilter['cat'] = '';
  }

  if (author === 'all2')
    queryfilter['author'] = '';
  else if (author === 'ten tac gia') {
    queryfilter['author'] = 'ten tac gia';
  } else if (author === 'manzo') {
    queryfilter['author'] = '';
  } else if (author === 'slimheel') {
    queryfilter['author'] = '';
  } else if (author === 'apple') {
    queryfilter['author'] = '';
  } else if (author === 'samsung') {
    queryfilter['author'] = '';
  }

  let price = req.query.price;
  //console.log(price);
  // let queryprice = {};

  // if (price == "duoi-5-tram")
  //   queryprice = { price: { $lte: 500000 } }
  // else if (price == "tu-5-tram-1-trieu") {
  //   queryprice = { price: { $gte: 500000, $lte: 1000000 } }
  // } else if (price == "tren-1-trieu") {
  //   queryprice = { price: { $gte: 1000000 } }
  // }
  if (price == "duoi-5-tram")
    queryfilter[price] = { lte:500000 , gte: 0 };


  var search = req.query.search;
  var querysearch = {};
  if (search != undefined) {
    querysearch = { productname: { $regex: req.query.search, $options: 'i' } };
  }
  // let sql = 'select * from book';
  // if (queryproduct.cat != undefined) {
  //   sql += ' where ID_Publisher = ' + queryproduct.cat;
  // }
  // if(querybrand.cat != undefined){
  //   sql += ' where ID_Publisher = ' + queryproduct.cat;
  // }
  // if(queryprice.cat != undefined){
  //   sql += ' where ID_Publisher = ' + queryproduct.cat;
  // }
  // if(querygender.cat != undefined){
  //   sql += ' where ID_Publisher = ' + queryproduct.cat;
  // }

  // db.query(sql, (err, result) => {
  //   console.log(result);
  // })

  // Product.find(queryproduct).find(querybrand).find(queryprice).find(querygender).find(querysearch).skip((perPage * c) - perPage).limit(perPage).sort(querysortprice)
  //   .exec((err, data) => {
  //     Product.find(queryproduct).find(querybrand).find(queryprice).find(querygender).find(querysearch).count().exec((err, count) => {
  //       if (err) {
  //         return next(err);
  //       }
  //       res.render('product/products', { title: 'Express', products: data, currentpage: page, total_page: Math.ceil(count / perPage), producttype: producttype, brand: brand });
  //     })
  //   })
  //data = await query('select * from book b inner join author a where a.ID_Author = b.ID_Author');
  // let data = await query('select * from book LIMIT ? OFFSET ?', [perPage, page - 1]);
  let data = await query('select * from book b inner join author a inner join category c where c.ID_Category = b.ID_Category'
    + ' and a.ID_Author = b.ID_Author');
  // if(queryproduct.cat != undefined && queryAuthor.author == undefined)
  //  data = await query('select * from book b inner join author a where a.ID_Author = b.ID_Author and a.NameAuthor = ?', [queryproduct.cat]);
  // else if(queryproduct.cat == undefined && queryAuthor.author != undefined)

  //let books = Json.parse(Json.stringify(data));
  let products = [];
  let books = JSON.parse(JSON.stringify(data));
  for (let book of books) {
    if ((book.NameCategory == queryfilter.cat || queryfilter.cat == '') && (book.NameAuthor == queryfilter.author || queryfilter.author == '')) {
      if(JSON.stringify(queryfilter.price) === '{}'|| (book.Price < queryfilter.price.lte && book.Price > ueryfilter.price.gte))
        products.push(book);
    }
  }
  let count = products.length;
  const currentpage  = (perPage * page) - perPage;
  const limitproducts = products.slice(currentpage,currentpage + perPage)
  //sap xep tang giam sort mang limitproducts
  
  //doc tu database
  const datalistauthor = await query('select * from author');
  const datalistcategory = await query('select * from category');
  res.render('product/products', { title: 'Express', products: limitproducts, currentpage: page, total_page: Math.ceil(count / perPage), producttype: producttype, brand: author, datalistauthor: datalistauthor, datalistcategory:datalistcategory });
};
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [day, month, year].join('-');
}
module.exports.productpage = async (req, res, next) => {
  let perPage = 4;
  let page = req.query.page || 1;

  const sql = 'SELECT c.*,a.NameAuthor, p.NamePublisher, ca.NameCategory  FROM book c inner join author a inner join publisher p inner join category ca where c.ID_Author = a.ID_Author and c.ID_Publisher = p.ID_Publisher and c.ID_Category = ca.ID_Category' +
    ' and id_book = ' + req.params.id;
  let data = await query(sql);
  //db.query(sql, async (err, data) => {
  try {
    let countview = new CountView(req.session.countview ? req.session.countview : {})
    countview.add(data.ID_Book);
    req.session.countview = countview;
    console.log(req.session.countview);
    if (req.isAuthenticated()) {
      let cartuser;
      cartuser = await CartUser.findOne({ user: req.user });
      if (cartuser) {
        cartuser.countview = req.session.countview;
      } else {
        cartuser = new CartUser({ user: req.user, countview: req.session.countview });
      }
      cartuser.save();
    }
    // let products = await Product.find({ cat: data.cat });
    let sql = 'select * from book where ID_Publisher = ' + data[0].ID_Publisher;


    const products = await query(sql);
    console.log(products);
    //ket thuc sua

    result = await products.filter(element => element.id !== data.id);
    //comments
    sql = 'select * from comment where ID_Book = ?';
    let count = await query(sql, req.params.id);
    count = count.length;
    sql = 'select UserName, Comment, DateComment from comment co inner join customer cu where co.ID_Customer = cu.ID_Customer and ID_Book = ? LIMIT ? OFFSET ?';
    let comments = await query(sql, [req.params.id, perPage, page - 1]);


    // let comments = await Comment.find({ postId: data.id }).skip((perPage * page) - perPage).limit(perPage);
    // let count = await Comment.find({ postId: data.id }).count().exec();
    //result.splice(Math.floor(Math.random() * products.length), 3)


    res.render('product/product-page', {
      data: data[0], products: result,
      postId: data._id, comments: comments, currentpage: page, total_page: Math.ceil(count / perPage), countview: countview.showtoOne(data._id)
    });
  } catch (err) {
    next(err);

  }

  // Product.findOne({ _id: req.params.id  }, async(err,data)=>{
  //   try{
  //     let countview =  new CountView(req.session.countview? req.session.countview : {})
  //     countview.add(data._id);
  //     req.session.countview = countview;
  //     console.log(req.session.countview);
  //     if(req.isAuthenticated()){
  //       let cartuser;
  //       cartuser = await CartUser.findOne({user: req.user});
  //       if(cartuser){
  //         cartuser.countview = req.session.countview;
  //       }else{
  //         cartuser = new CartUser({user: req.user, countview: req.session.countview});
  //       }
  //       cartuser.save();
  //     }
  //     let products = await Product.find({cat : data.cat});
  //     result = await products.filter(element => element.id !== data.id);
  //     let comments = await Comment.find({postId : data.id}).skip((perPage * page) - perPage).limit(perPage);
  //     let count = await Comment.find({postId : data.id}).count().exec();
  //     res.render('product/product-page',{data: data, products: result.splice(Math.floor(Math.random()*products.length),3), postId: data._id, comments:comments, currentpage : page, total_page: Math.ceil(count / perPage), countview: countview.showtoOne(data._id)});
  //   }catch(err){
  //     next(err);
  //   }
  // });   
};
module.exports.productpagepost = async (req, res, next) => {
  //const name = req.body.name || req.user.name || req.user.username;
  const comment = req.body.comment;
  const postId = req.body.postId;
  if (!req.isAuthenticated) {
    res.redirect('back');
  }
  // let commentdb = new Comment({ name: name, comment: comment, postId: postId });

  // commentdb.save((err, result) => {
  //   if (err) {
  //     console.log('loi khong the luu comment');
  //   } else {
  //     console.log('luu comment thang cong');
  //     res.redirect(req.url);
  //   }
  // })
  try {
    await query('insert into comment set ?', [{ ID_Customer: req.user.ID_Customer, ID_Book: postId, Comment: comment, DateComment: new Date() }]);
  } catch (error) {

  }

  res.redirect('back');
  //res.redirect(req.url);
};

module.exports.checkout = function (req, res, next) {
  res.render('product/checkout');
}

module.exports.checkoutpost = async function (req, res, next) {
  let dataorders = await query('select * from orders where ID_Customer = ? and Status = ?', [req.user.ID_Customer, 0]);
  if (dataorders.length > 0) {
    var x = await query('update orders set TypePayment = ?, Address = ?, Name = ?,Phone = ?, Status = ? where ID_Order = ? ', [req.body.payments,
    req.body.address, req.body.name, req.body.phonenumber, 1, dataorders[0].ID_Order])
    console.log(x);

  }
  req.flash('success', 'Bạn đã mua thành công!');
  res.redirect('/status-produts');
  return;
  try {
    // if (!req.session.cart) {
    //   return res.redirect('/');
    // }

    // if (req.body.address == "" || req.body.phonenumber == "" || req.body.name == "" || req.body.methodpay == "") {
    //   return res.redirect('/');
    // }



    // let cart = new Cart(req.session.cart);

    // let x = cart.generateArray();
    // for (var i = 0; i < x.length; i++) {
    //   let product = await Product.findById(x[i].item._id);
    //   product.qtysold = product.qtysold ? (product.qtysold + parseInt(x[i].qty)) : parseInt(x[i].qty);
    //   product.save();
    // }
    // var datenow = new Date();
    // datenow = datenow.getDate() + "/" + (datenow.getMonth() + 1) + "/" + datenow.getFullYear();
    // let order = new Order({
    //   user: req.user,
    //   cart: cart,
    //   address: req.body.address,
    //   name: req.body.name,
    //   phonenumber: req.body.phonenumber,
    //   status: 0,
    //   methodpay: req.body.methodpay,
    //   date: datenow
    // })


    // order.save((err, result) => {
    //   if (err) {
    //     next(err);
    //   }
    //   req.flash('success', 'Bạn đã mua thành công!');
    //   req.session.cart = null;
    //   res.redirect('/');
    // })
  } catch (err) {
    next(err);
    //res.redirect('/');
  }
}
module.exports.addtocart = async function (req, res, next) {
  if (req.user == undefined) {
    res.redirect('/login');
    return;
  }
  const productId = req.params.id;
  req.ID_Customer = req.user.ID_Customer;
  const qty = parseInt(req.params.id2);
  // let cart = new Cart(req.session.cart ? req.session.cart : {});

  const databook = await query('SELECT * FROM book where ID_Book = ?', productId);
  let createprice = databook[0].Price * qty;
  //lay cart cua khach hang
  let orderuser = await query('SELECT * FROM orders where ID_Customer = ? and Status = ?', [req.ID_Customer, 0]);
  if (orderuser.length == 0) {

    await query('insert into orders set ? ', {
      ID_Customer: req.ID_Customer, DateCreated: new Date(),
      Amount: createprice, TypePayment: "", Address: "", Name: "", Phone: "", Status: 0
    });
    orderuser = await query('SELECT * FROM orders where ID_Customer = ? and Status = ?', [req.ID_Customer, 0]);
    orderuser = await query('SELECT * FROM orders where ID_Order = ?', orderuser[0].ID_Order);
    await query('insert into detail_order set ? ', {
      ID_Order: orderuser[0].ID_Order, ID_Book: productId,
      Quantity_DetailOrder: qty, Price: createprice
    });
    res.redirect('/products');
    return;
  }
  //orderuser = await query('SELECT * FROM orders where ID_Customer = ?', req.ID_Customer);
  orderuser[0].Amount += createprice;
  await query('update orders set Amount = ? where ID_Order = ? ', [orderuser[0].Amount, orderuser[0].ID_Order])

  detailorder = await query('SELECT * FROM detail_order where ID_Order = ? and ID_Book = ?', [orderuser[0].ID_Order, productId]);
  if (detailorder.length == 0) {
    await query('insert into detail_order set ? ', {
      ID_Order: orderuser[0].ID_Order, ID_Book: productId,
      Quantity_DetailOrder: qty, Price: createprice
    });
  } else {
    detailorder[0].Quantity_DetailOrder += qty;
    detailorder[0].Price += createprice;
    await query('update detail_order set Quantity_DetailOrder = ?, Price = ? where ID_Order = ? and ID_Book = ? ', [detailorder[0].Quantity_DetailOrder, detailorder[0].Price, detailorder[0].ID_Order, productId]);
  }
  res.redirect('/products');
  // Product.findById(productId, async (err, data) => {
  //   if (err) {
  //     console.log('khong them dc vao gio');
  //     res.redirect('/products');
  //   }
  //   cart.addmany(data, data._id, qty);
  //   req.session.cart = cart;

  //   if (req.isAuthenticated()) {
  //     var cartuser;
  //     cartuser = await CartUser.findOne({ user: req.user });
  //     if (cartuser) {
  //       cartuser.cart = req.session.cart;
  //     } else {
  //       cartuser = new CartUser({ user: req.user, cart: req.session.cart });
  //     }
  //     cartuser.save();
  //   }
  //   console.log(req.session.cart);
  //   res.redirect('/products');
  // })
};

module.exports.viewcart = async function (req, res, next) {
  // if (!req.session.cart) {
  //   return res.render('product/view-cart', { products: null });
  // }
  // const cart = new Cart(req.session.cart);
  //req.user.ID_Customer =1;
  let detailorder = null;
  let totalPrice = 0;
  if (req.isAuthenticated()) {
    let dataorder = await query('SELECT * FROM orders where ID_Customer = ? and Status = ?', [req.user.ID_Customer, 0]);

    let products = [];
    let uniqueObjects = null;
    if (dataorder.length > 0) {
      detailorder = await query('SELECT b.imagePath, b.NameBook, b.ID_Book, b.Price, b.Discount,' +
        ' d.Quantity_DetailOrder FROM book b inner join detail_order d where b.ID_Book = d.ID_Book and d.ID_Order = ?', [dataorder[0].ID_Order]);
      // for(let i = 0; i< detailorder.length; i++ ){

      //uniqueObjects = [...new Map(detailorder.map(item => [item.ID_Book, item])).values()]
      // }
      totalPrice = dataorder[0].Amount;
    }
  }
  //res.render('product/view-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
  res.render('product/view-cart', { products: detailorder, totalPrice: totalPrice });
};

module.exports.removecart = async function (req, res, next) {
  try {
    let productId = req.params.id;

    // let cart = new Cart(req.session.cart ? req.session.cart : {});

    // cart.removeItem(productId);
    // req.session.cart = cart;

    // if (req.isAuthenticated()) {
    //   let cartuser;
    //   cartuser = await CartUser.findOne({ user: req.user });
    //   if (cartuser) {
    //     cartuser.cart = req.session.cart;
    //   } else {
    //     cartuser = new CartUser({ user: req.user, cart: req.session.cart });
    //   }
    //   cartuser.save();
    // }
    let dataorder = await query('SELECT * FROM orders where ID_Customer = ? and Status = ?', [req.user.ID_Customer, 0]);
    if (dataorder.length > 0) {
      const detail_order = await query('SELECT * from detail_order where ID_Order = ? and ID_Book = ?', [dataorder[0].ID_Order, productId]);
      await query('delete from detail_order where ID_Order = ? and ID_Book = ?', [dataorder[0].ID_Order, productId]);
      //cap nhat lai tong tien
      dataorder[0].Amount -= detail_order[0].Price;
      await query('update orders set Amount = ? where ID_Order = ?', [dataorder[0].Amount, dataorder[0].ID_Order]);
    }
    res.redirect('/view-cart');
  } catch (err) {
    next(err);
  }
}

module.exports.statusproduts = async function (req, res, next) {

  try {
    // let orders = await Order.find({ user: req.user })

    // let cart;

    // orders.forEach(order => {
    //   //moi don dat hang
    //   cart = new Cart(order.cart);
    //   order.items = cart.generateArray();
    // });
    let orders = await query('select o.ID_Order, b.imagePath, b.NameBook, do.Quantity_DetailOrder, do.Price, o.Status, o.Amount from orders o inner join detail_order do inner join book b where b.ID_Book = do.ID_Book and o.Status <> 0 and o.ID_Order = do.ID_Order and o.ID_Customer = ?', [req.user.ID_Customer]);
    //let orders = await query('select * from orders o inner join detail_order do where o.ID_Order = do.ID_Order and  ID_Customer = ? and Status <> ?', [req.user.ID_Customer, 0]);
    // orders.forEach(order => {
    //   //moi don dat hang
    //   //cart = new Cart(order.cart);
    //   order.items = cart.generateArray();
    // });
    orders = JSON.parse(JSON.stringify(orders));
    myArray = orders;
    var groups = {};
    for (var i = 0; i < myArray.length; i++) {
      var groupName = myArray[i].ID_Order;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(myArray[i]);
    }
    myArray = [];
    for (var groupName in groups) {
      myArray.push({ ID_Order: groupName, book: groups[groupName], Amount: groups[groupName][0].Amount, Status: groups[groupName][0].Status });
    }

    res.render('delivery/status-products', { orders: myArray });

  } catch (error) {
    next(error);
  }

};

module.exports.deleteorder = async function (req, res, next) {
  try {
    let idorder = req.params.id;
    await query('delete from detail_order where ID_Order = ? ', [idorder]);
    await query('delete from orders where ID_Order = ?', [idorder]);

    res.redirect('back');
  } catch (error) {
    next(error);
  }
}

module.exports.acceptOrder = async function (req, res, next) {
  try {
    let idorder = req.params.id;
    await query('update orders set Status = 3 where ID_Order = ?', [idorder]);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
}

