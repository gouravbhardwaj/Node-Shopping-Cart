var express = require('express');
var router = express.Router();
var Product = require('../models/product');


/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err,docs){
     var productChunks = [];
     var chunkSize = 3;
     var counter = 0;

     for(var i=0;i<docs.length;i+=chunkSize){
       productChunks[counter] = docs.slice(i,i+chunkSize);
       counter++;
     }

      res.render('shop/index', { title: 'Shopping Cart', products : productChunks });
  });

});

module.exports = router;
