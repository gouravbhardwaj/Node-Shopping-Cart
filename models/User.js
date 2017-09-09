var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email:{type:String, required:true},
    password:{type:String, required:true}
});


userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
}

//Method to check if the password entered in the UI is matching the hashedpassword.
userSchema.methods.validatePassword = function(password){
  return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User',userSchema);
