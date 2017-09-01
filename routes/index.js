var express = require('express');
var router = express.Router();
var Product = require('../models/product');
/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err,docs){
     var ProductChunks = new Array();
     var chunkSize = 3;

     for(var i=0;i<docs.length;i+=chunkSize){
       ProductChunks.push(docs.slice(i,i+chunkSize));
       console.log('### : '+i);
     }
     console.log('### : ProductChunks '+ProductChunks);

      res.render('shop/index', { title: 'Shopping Cart', products : docs });
  });

});

module.exports = router;
