var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

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

UserSchema.methods.toJSON = function(){
   var user = this;
   var userObj = user.toObject();
    
    return _.pick(userObj, ['email', '_id']);
};

var User = mongoose.model('User', UserSchema);

module.exports = {
    User:User
}
