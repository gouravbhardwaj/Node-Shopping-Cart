var Product = require('../models/Product');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [

new Product({
 imagePath:'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
 title:'Gothic Video Game',
 description:'1 Awesome Game !!!',
 price:10
}),
new Product({
 imagePath:'https://wordpress-miniclip.s3.amazonaws.com/wp-content/uploads/sites/6/2013/01/gas-and-sand.jpg',
 title:'Race Game',
 description:'2 Awesome Game !!!',
 price:10
}),
new Product({
 imagePath:'http://img.ozgameshop.com/pc_and_video_games/games/pc/sniper_ghost_warrior_2_collectors_edition_xl.jpg',
 title:'Snipper Game',
 description:'3 Awesome Game !!!',
 price:10
}),
new Product({
 imagePath:'http://img.ozgameshop.com/pc_and_video_games/games/pc/sniper_ghost_warrior_2_collectors_edition_xl.jpg',
 title:'Hunter Game',
 description:'4 Awesome Game !!!',
 price:10
}),
new Product({
 imagePath:'http://img.ozgameshop.com/pc_and_video_games/games/pc/sniper_ghost_warrior_2_collectors_edition_xl.jpg',
 title:'Vampire Game',
 description:'5 Awesome Game !!!',
 price:10
})
];

var done=0;
for(var i=0;i < products.length;i++){
   products[i].save(function(){
     done++;
     if(done==products.length){
       exit();
     }
   });
}

function exit(){
  mongoose.disconnect();
}
