var passport = require('passport');
var Users = require('../models/User');
var localStrategy = require('passport-local').Strategy;


//Using passport
passport.serializeUser(function(user,done){
   done(null,user.id);
});

//Using Passport to find the User in the MONGOdb cOLLECTION
passport.deserializeUser(function(id,done){
  Users.findById(id,function(err,user){
     done(err,user);
  });
});

//Uainf this local.signup strategy insie the passport
passport.use('local.signup',new localStrategy(
{
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}
,function(req,email,password,done){

  req.checkBody('email','Invaid Email.').notEmpty().isEmail();
  req.checkBody('password','Invaid Password.').notEmpty().isLength({min:4});
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function(error){
       messages.push(error.msg);
    });
    return done(null,false,req.flash('error',messages));
  }

     Users.findOne({'email':email},function(err,user){
        if(err){
          return done(err);
        }

        if(user){
          return done(null,false,{message:'Email already in Use.'});
        }

        console.log(err);

        console.log(user);

        var newUser = new Users();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err,result){
           if(err){
             return done(err);
           }

           return done(null,newUser);
        });//newUser.save

     });//findOne
}));

passport.use('local.signin',new localStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},function(req,email,password,done){
  req.checkBody('email','Invaid Email.').notEmpty().isEmail();
  req.checkBody('password','Invaid Password.').notEmpty().isLength({min:4});
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function(error){
       messages.push(error.msg);
    });
    return done(null,false,req.flash('error',messages));
  }

  Users.findOne({'email':email},function(err,user){

    //Check for Error
     if(err){
       return done(err);
     }

     //Check if user is present
     if(!user){
       return done(null,false,{message:'No User Found.'});
     }

     //Check if the password matches, passing the  password entered in theui and matching the one in the database.
     if(!user.validatePassword(password)){
       return done(null,false,{message:'Wrong Password.'});
     }

        return done(null,user);

  });//findOne

}));
