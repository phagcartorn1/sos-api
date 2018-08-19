var {mongoose} = require('.././db/mongoose');

var Language = mongoose.model('Language',{
    id:{
        type:String,
        required:true,
        trim:true,
        minlenght:1
    },
    name:{
        type:String,
        required:true,
        trim:true,
        minlenght:1
    }
});

module.exports = {Language}