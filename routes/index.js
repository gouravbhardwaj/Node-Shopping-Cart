var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/Order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg =  req.flash('success')[0];
  Product.find(function(err,docs){
     var productChunks = [];
     var chunkSize = 3;
     var counter = 0;

     for(var i=0;i<docs.length;i+=chunkSize){
       productChunks[counter] = docs.slice(i,i+chunkSize);
       counter++;
     }

      res.render('shop/index', { title: 'Shopping Cart', products : productChunks,successMsg : successMsg, noMessage: !successMsg });
  });

});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items:{}});

  Product.findById(productId,function(err,product){
    if(err){
      res.render('/');
    }
    console.log(product.id);
    cart.add(product,product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');

  });

});

router.get('/shopping-cart/',function(req, res, next){
  if (!req.session.cart) {
    return res.render('shop/ShoppingCart',{products:null});
  }

  var cart = new Cart(req.session.cart);
  res.render('shop/ShoppingCart',{products:cart.generateArray(),totalPrice:cart.totalPrice});
});

router.get('/checkout/',function(req,res,next){
  if (!req.session.cart) {
    return res.redirect('/shopping-cart/');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/Checkout',{total:cart.totalPrice,errMsg:errMsg , noErrors : !errMsg});
});

router.post('/checkout/',function(req,res,next){
    if (!req.session.cart) {
      return res.redirect('/shopping-cart/');
    }

    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
      "sk_test_sROwdJIzJOPWoJ8ajf8GaOte"
    );

    stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Charge for jayden.thompson@example.com"
    }, function(err, charge) {
      // asynchronously called
      if(err){
          req.flash('error',err.message);
          return res.redirect('/checkout');
      }


      var myOrder = new Order({
        user: req.user, //Passport Places user in req
        cart :cart,
        address: req.body.address,
        name:req.body.name,
        paymentId:charge.id

      });
      myOrder.save(function(err,result){//Should handle error here
        console.log(err);
        console.log(result);
        req.flash('success','successfully bought product');
        req.session.cart = null;
        res.redirect('/');
      });


    });
});

module.exports = router;
