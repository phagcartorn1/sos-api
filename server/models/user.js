var mongoose = require("mongoose");

var User = mongoose.model('User',{
    userName:{
        type:String,
        required:true,
        trim:true,
        minlenght:1
    },
    password : {
        type:String,
        required:true,
        trim:true,
        minlenght:1
    },
    type:{
        type:String,
        required:true,
        trim:true,
        minlenght:1       
    }
});

module.exports = {User};