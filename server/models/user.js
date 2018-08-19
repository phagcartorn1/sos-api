
var {mongoose} = require('.././db/mongoose');


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
    },
    onlineStatus:{
        type:Boolean,
        default : true
    },
    firstName : {
        type:String,
        required:true,
        trim:true,
        minlenght:1
    },
    lastName : {
        type:String,
        required:true,
        trim:true,
        minlenght:1
    },
    topicId : {
        type:String,
        required:false,
        trim:true,
        minlenght:1
    },
    languageId : {
        type:String,
        required:false,
        trim:true,
        minlenght:1
    }
   
});

module.exports = {User};