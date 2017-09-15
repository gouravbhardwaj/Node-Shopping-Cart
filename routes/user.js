var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');


var csrfProtection = csrf();
router.use(csrfProtection);

//Profile
router.get('/profile',isLoggedIn,function(req,res,next){
  res.render('user/profile');
});

//Logout
router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/');
});

router.use('/',notLoggedIn,function(req,res,next){
  next();
});

//SignIn
router.get('/signin',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasError:messages.length > 0});
});

router.post('/signin',passport.authenticate('local.signin',{
  successRedirect : '/user/profile',
  failureRedirect : '/user/signin',
  failureFlash : true  //OnFailure the page is redirected to signup with the flash message that is mentioned.
}));
//SignIn Ends


//SignUp
router.get('/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasError:messages.length > 0});
});

router.post('/Signup',passport.authenticate('local.signup',{
  successRedirect : '/user/profile',
  failureRedirect : '/user/signup',
  failureFlash : true  //OnFailure the page is redirected to signup with the flash message that is mentioned.

}));
//SignUp Ends




module.exports = router;

function notLoggedIn(req,res,next){
  if(!req.isAuthenticated())//isAuthenticated is omanaged by passport in the session
  {
    return next();
  }
  res.redirect('/');
}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())//isAuthenticated is omanaged by passport in the session
  {
    return next();
  }
  res.redirect('/');
}
