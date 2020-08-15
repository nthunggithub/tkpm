var express = require('express');
var router = express.Router();
var usercontroller = require('../controllers/usercontroller')
var middleware = require('../config/middleware')

router.get('/sign-up', middleware.isNotAuthenticated, usercontroller.signup);

router.post('/sign-up', middleware.isNotAuthenticated, usercontroller.signuppost);

router.get('/login', middleware.isNotAuthenticated, usercontroller.login);

router.get('/logout', middleware.isAuthenticated, usercontroller.logout);

router.route('/forgot-password')
  .get(middleware.isNotAuthenticated, usercontroller.forgotpassword)
  .post(middleware.isNotAuthenticated, usercontroller.forgotpasswordpost)

router.route('/forgot-password/:id')
  .get(middleware.isNotAuthenticated, usercontroller.forgotpasswordverify);

router.route('/verify/:id')
  .get(usercontroller.verify);//khong middleware


router.route('/profile')
  .get(middleware.isAuthenticated, usercontroller.profile)

router.route('/updateprofile')
  .get(middleware.isAuthenticated, usercontroller.editprofile)
  .post(middleware.isAuthenticated, usercontroller.profileupdate);

router.route('/update-password')
  .get(middleware.isAuthenticated, usercontroller.updatepassword)
  .post(middleware.isAuthenticated, usercontroller.updatepasswordpost);

module.exports = router;