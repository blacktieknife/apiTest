var mongoose = require('mongoose');

var Navigation = mongoose.model('Navigation', {
    name:{
       type:String,
        required:true,
         minlength:1,
          trim: true
    },
    type:{
       type:String,
        required:true,
         minlength:1,
          trim: true
    },
    link:{
        type:String,
        required:true,
         minlength:1,
          trim: true
    },
    visable:{
      type:Boolean,
       required:true,
        default: true
    },
    role:{
        type:String,
        required:true,
        default:"general"
    }
});

module.exports = {
    Navigation:Navigation
}
