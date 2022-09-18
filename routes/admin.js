var express = require('express');
var adminHelper = require('../helpers/admin-helper');
const userHelper = require('../helpers/user-helper');
var router = express.Router();

const verifyLogin = function (req, res, next){
  if(req.session.admin){
    next();
  }else{
    res.redirect('/admin/login');
  }
}
const isLoged = function (req, res, next){
  if(!req.session.admin){
    next();
  }else{
    res.redirect('/admin');
  }
}

// let's define admin urls
router.get('/', verifyLogin, function(req, res, next) {
  userHelper.showAllProducts()
  .then(function (products){

    let param = {
      admin: true,
      title: 'Shopping Cart',
      products: products
    }
    res.render('admin/index', param);
  }).catch(function (){
    console.log('[-] Something went wrong in show products');
  })
});

router.get('/login', isLoged, function(req, res, next) {
  let param = {
    title: 'Shopping Cart',
    adminLoginErrMessage: req.session.adminLoginErrMessage
  }
  req.session.adminLoginErrMessage = null;
  res.render('admin/login', param);
});

router.post('/login', isLoged, function(req, res, next) {
  adminHelper.doLogin(req.body)
  .then(function (adminData){
    req.session.admin = adminData;
    res.redirect('/admin');
  }).catch(function (message){
    console.log(message);
    req.session.adminLoginErrMessage = message;
    res.redirect('/admin/login');
  }); 
});
router.get('/logout', verifyLogin, function(req, res, next) {
  let param = {
    title: 'Shopping Cart'
  }
  req.session.admin = null;
  // redirect to Home page
  res.redirect('/');
});




router.get('/add-product', verifyLogin, function(req, res, next) {
  let param = {
    admin: true,
    title: 'Shopping Cart'
  }
  res.render('admin/add-product', param);
});

router.post('/add-product', verifyLogin, function(req, res, next) {
  adminHelper.addProduct(req.body)
  .then(function(result){
    // console.log(result.insertedId);
    let image = req.files.image;
    image.mv('./public/product-images/' + result.insertedId + '.jpg', function (err){
      if(!err){
        res.redirect('/admin/');
      }
      else{
        // TODO: Any error handling here

        console.log('[-] fileuploading error');
        console.log(err);
      }
    });
  })
});
router.get('/delete-product/:id', verifyLogin, function(req, res, next) {
  // console.log(req.params.id);
  adminHelper.deleteProduct(req.params.id)
  .then(function (){
    res.redirect('/admin');
  }).catch(function (){
    res.redirect('/admin');
    console.log('Error in deleting product');
  });

});

router.get('/edit-product/:id', verifyLogin, function(req, res, next) {
  adminHelper.getProductDetails(req.params.id)
  .then(function (product){
    let param = {
      admin: true,
      title: 'Shopping Cart',
      product: product
    }
    res.render('admin/edit-product', param);
  }).catch(function (err){
    console.log('[+]Something Error happened in edit-product');
  })
});
router.post('/edit-product', verifyLogin, function (req, res, next) {
  adminHelper.editProduct(req.body)
  .then(function() {
    res.redirect('/admin')
    let image = req.files.image;
    if(image){
      image.mv('./public/product-images/' + req.body._id + '.jpg', function (err){
        console.log(err);
        if(err){
          console.log('[-}Something went wrong in saving images');
        }else{
          console.log('[+] Successfully saved the image');
        }
      })
    }
  }).catch(function () {
    res.redirect('/admin')
    console.log('Something went wrong');
  })
})


module.exports = router;
