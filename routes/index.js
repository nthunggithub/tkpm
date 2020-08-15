var express = require('express');
var router = express.Router();
var productcontroller = require('../controllers/product.controller')
var middleware = require('../config/middleware')

router.get('/', productcontroller.index);

router.get('/products', productcontroller.products);

router.route('/product/:id')
    .get(productcontroller.productpage)
    .post(productcontroller.productpagepost)
    
router.route('/checkout')
    .get(middleware.isAuthenticated, productcontroller.checkout)
    .post(middleware.isAuthenticated, productcontroller.checkoutpost)

router.get('/add-to-cart/:id/:id2', productcontroller.addtocart);

router.get('/view-cart', productcontroller.viewcart);

router.get('/removecart/:id', productcontroller.removecart);

router.get('/status-produts', middleware.isAuthenticated, productcontroller.statusproduts);

router.post('/delete-order/:id', middleware.isAuthenticated, productcontroller.deleteorder);

router.post('/accept-order/:id', middleware.isAuthenticated, productcontroller.acceptOrder);
module.exports = router;


