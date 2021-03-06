var query = require('../models/db');
var ordermodel = require('../models/order');
var bookmodel = require('../models/book');
module.exports.index = async function (req, res, next) {
  try {
    let sql = 'select * from book';
    let result = await query(sql);
    result = JSON.parse(JSON.stringify(result));
    res.render('index', { products: result.slice(0, 4), hotbook:result.slice(4, 8), chooseforme: result.slice(8, 12),  });
  } catch (error) {
    next(error)
  }
};

module.exports.products = async function (req, res, next) {
 var perPage=9;
  let page= req.query.page || 1;

  const producttype = req.query.Category;
  const author = req.query.Author;

  let products = [];
  products = await bookmodel.searchBook(req.query.SortPrice,req.query.Category,
    req.query.Author, req.query.price,req.query.search);
  
  let count = products.length;
  const currentpage = (perPage * page) - perPage;
  const limitproducts = products.slice(currentpage, currentpage + perPage)
  
  //doc tu database
  const datalistauthor = await query('select * from author');
  const datalistcategory = await query('select * from category');
  res.render('product/products', { title: 'Express', products: limitproducts, currentpage: page, total_page: Math.ceil(count / perPage), producttype: producttype, brand: author, datalistauthor: datalistauthor, datalistcategory: datalistcategory });
};

module.exports.productpage = async (req, res, next) => {
  let perPage = 4;
  let page = req.query.page || 1;

  const sql = 'SELECT c.*,a.NameAuthor, p.NamePublisher, ca.NameCategory  FROM book c inner join author a inner join publisher p inner join category ca where c.ID_Author = a.ID_Author and c.ID_Publisher = p.ID_Publisher and c.ID_Category = ca.ID_Category' +
    ' and id_book = ' + req.params.id;
  let data = await query(sql);
  try {
    // let countview = new CountView(req.session.countview ? req.session.countview : {})
    // countview.add(data.ID_Book);
    // req.session.countview = countview;
    // console.log(req.session.countview);
    let sql = 'select * from book where ID_Publisher = ' + data[0].ID_Publisher;
    const products = await query(sql);
    //ket thuc sua

    result = await products.filter(element => element.ID_Book !== data[0].ID_Book);
    //comments
    sql = 'select * from comment where ID_Book = ?';
    let count = await query(sql, req.params.id);
    count = count.length;
    sql = 'select UserName, Comment, DateComment from comment co inner join customer cu where co.ID_Customer = cu.ID_Customer and ID_Book = ? LIMIT ? OFFSET ?';
    let comments = await query(sql, [req.params.id, perPage, page - 1]);

    result=result.slice(0,6);
    res.render('product/product-page', {
      data: data[0], products: result, comments: comments, currentpage: page, total_page: Math.ceil(count / perPage)
    });//, countview: countview.showtoOne(data._id)
  } catch (err) {
    next(err);
  }  
};
var commentmodels = require('../models/comment')
module.exports.productpagepost = async (req, res, next) => {
  //const name = req.body.name || req.user.name || req.user.username;
  const comment = req.body.comment;
  const postId = req.body.postId;
  if (!req.isAuthenticated) {
    res.redirect('back');
  }
  try {
    await commentmodels.addcomment(req.user.ID_Customer, postId, comment);
  } catch (error) {
    next(error);
  }
  res.redirect('back');
  //res.redirect(req.url);
};

module.exports.checkout = function (req, res, next) {
  res.render('product/checkout');
}

module.exports.checkoutpost = async function (req, res, next) {
  try {
    let dataorders = await query('select * from orders where ID_Customer = ? and Status = ?', [req.user.ID_Customer, 0]);
    if (dataorders.length > 0) {
      var x = await query('update orders set TypePayment = ?, Address = ?, Name = ?,Phone = ?, Status = ? where ID_Order = ? ', [req.body.payments,
      req.body.address, req.body.name, req.body.phonenumber, 1, dataorders[0].ID_Order])
      console.log(x);

    }
    req.flash('success', 'Bạn đã mua thành công!');
    res.redirect('/status-produts');
    return;
  } catch (error) {
    next(error);
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
    await ordermodel.addOrder(req.ID_Customer, createprice);
    orderuser = await query('SELECT * FROM orders where ID_Customer = ? and Status = ?', [req.ID_Customer, 0]);
    orderuser = await query('SELECT * FROM orders where ID_Order = ?', orderuser[0].ID_Order);
    await query('insert into detail_order set ? ', {
      ID_Order: orderuser[0].ID_Order, ID_Book: productId,
      Quantity_DetailOrder: qty, Price: createprice
    });
    res.redirect('/products');
    return;
  }
  
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
  res.redirect('back');
};

module.exports.viewcart = async function (req, res, next) {
  let detailorder = null;
  let totalPrice = 0;
  if (req.isAuthenticated()) {
    let dataorder = await query('SELECT * FROM orders where ID_Customer = ? and Status = ?', [req.user.ID_Customer, 0]);
    
    if (dataorder.length > 0) {
      detailorder = await query('SELECT b.imagePath, b.NameBook, b.ID_Book, b.Price, b.Discount,' +
        ' d.Quantity_DetailOrder, d.Price as detail_orderPrice FROM book b inner join detail_order d where b.ID_Book = d.ID_Book and d.ID_Order = ?', [dataorder[0].ID_Order]);
      totalPrice = dataorder[0].Amount;
    }
  }
  res.render('product/view-cart', { products: detailorder, totalPrice: totalPrice });
};

module.exports.removecart = async function (req, res, next) {
  try {
    let productId = req.params.id;
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
    let orders = await query('select o.ID_Order, b.imagePath, b.NameBook, do.Quantity_DetailOrder, do.Price, o.Status, o.Amount from orders o inner join detail_order do inner join book b where b.ID_Book = do.ID_Book and o.Status <> 0 and o.ID_Order = do.ID_Order and o.ID_Customer = ?', [req.user.ID_Customer]);
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
    //await query('delete from orders where ID_Order = ?', [idorder]);
    await ordermodel.deleteOrder(idorder);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
}


module.exports.acceptOrder = async function (req, res, next) {
  try {
    let idorder = req.params.id;
    ///await query('update orders set Status = 3 where ID_Order = ?', [idorder]);
    await ordermodel.updateStatusOrder(3, idorder);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
}

