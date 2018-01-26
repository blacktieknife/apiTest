var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
       type:String,
       required:true,
        minlength:1,
        trim: true,
        unique: true,
        validate:{
            isAsync: false,
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength: 6
    },
    tokens :[{
        access:{
            type:String,
            required:true
        },
        token : {
            type:String,
            required: true
        }
    }]
    
},{ usePushEach: true });

UserSchema.pre("save", function(next){
        var user = this;
        if(user.isModified('password')){
            console.log("PSS WORD MODIFIED!")
    bcrypt.genSalt(10, function(error,salt){
        if(error){
            console.log(error)
        } else {
         bcrypt.hash(user.password, salt, function(err, hash){
             if(err){
                 console.log(err);
             } else {
            user.password = hash;
             next();
             }
       });
        }
      
        
    });
} else {
    next();
}
        
               });

UserSchema.methods.generateAuthToken = function() {
    var user = this;
   // console.log("this in generateAuthToken  = ",this);
    var access = "auth";
    var token = jwt.sign({_id:user._id.toHexString(), access:access}, 'creep').toString();
    //console.log("token from the user model function ",token);
    user.tokens.push({
        access:access,
        token: token
    });
//console.log("this should be updated with tokens ",this);
    return user.save().then(function() {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;
    
   return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    });

};


UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try {
       decoded = jwt.verify(token, "creep");
        
    } catch(err){
      return Promise.reject();
    }
    console.log(decoded);
   return User.findOne({_id:decoded._id,"tokens.token":token,"tokens.access": "auth"});
    
};

UserSchema.statics.findByCredentials = function(email,password) {
    var User = this;
    var decoded;
    return User.findOne({email:email})
        .then(function(user){
        if(!user){
     return Promise.reject(`User Not Found with email ${email}`);
        } else {
return new Promise(function(resolve, reject){
bcrypt.compare(password, user.password, function(err, result){
     if(err){
         reject(err);
     } else {
         if(result){
             resolve(user);
         } else {
             reject(result);
         }
     }
});
          });
        }
    });
    
//    var decoded;
//    try {
//       decoded = jwt.verify(token, "creep");
//
//    } catch(err){
//      return Promise.reject();
//    }
//    console.log(decoded);
//   return User.findOne({_id:decoded._id,"tokens.token":token,"tokens.access": "auth"});
//
};


UserSchema.methods.toJSON = function(){
   var user = this;
   var userObj = user.toObject();
    
    return _.pick(userObj, ['email', '_id']);
};

var User = mongoose.model('User', UserSchema);

module.exports = {
    User:User
}
