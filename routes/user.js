var express = require('express');
var userHelper = require('../helpers/user-helper');
var router = express.Router();

// two function that checks user is logined or not
const verifyLogin = function (req, res, next){
  if(req.session.user){
    next()
  }
  else{
    res.redirect('/login');
  }
}
const isLoged = function (req, res, next){
  if(!req.session.user){
    next()
  }
  else{
    res.redirect('/');
  }
}

// guest user can look at the home page
router.get('/', function(req, res, next) {
  userHelper.showAllProducts()
  .then(function (products){
    let param = {
      title: 'Shopping Cart',
      user: req.session.user,
      products: products
    }
    console.log(req.session.user);
    res.render('user/index.hbs', param)

  }).catch(function (){
    console.log('[-] Something went wrong in show products');
  })
});


router.get('/sign-up', isLoged, function (req, res, next){
  let param = {
    title: 'Shopping Cart'
  }
  res.render('user/sign-up', param);
});

router.post('/sign-up', isLoged, function (req, res, next){
  let param = {
    title: 'Shopping Cart',
  }
  userHelper.doSignUp(req.body)
  .then(function (result){
    // res.redirect('/login');
    req.session.user = req.body;
    req.session.user._id = result.insertedId
    res.redirect('/')
  }).catch(function (err){
    console.log('[-]SignUp Something Went wrong');
    console.log(err);
  })
});

router.get('/login', isLoged, function (req, res, next){
  // if there isn't a req.session.loginErrMessage then loginErrmessage will be null
  let loginErrMessage = req.session.loginErrMessage;
  // console.log(loginErrMessage);
  let param = {
    title: 'Shopping Cart',
    loginErrMessage: loginErrMessage
  }
  // change the value of loginErrMessage
  req.session.loginErrMessage = null;
  res.render('user/login', param);
});
router.post('/login', isLoged, function (req, res, next){
  userHelper.doLogin(req.body)
  .then(function (userData){
    req.session.user = userData;
    res.redirect('/');
  }).catch(function (message){
    req.session.loginErrMessage = message;
    res.redirect('/login');
  });
});
router.get('/logout', verifyLogin, function(req, res, next) {
  req.session.user = null;
  // redirect to Home page
  res.redirect('/');
});
router.get('/cart',verifyLogin, function (req, res, next) {
  let products = userHelper
  let param = {
    title: 'SHOPPING CART',
    user: req.session.user
  }
  res.render('user/cart', param)
})
router.get('/add-to-cart/:id', verifyLogin, function (req, res, next) {
  userHelper.addToCart(req.params.id, req.session.user._id)
  .then(function (result){
    res.redirect('/cart')
  }).catch(function (err){
    console.log('Something went wrong in add to cart');
  })
})




module.exports = router;
