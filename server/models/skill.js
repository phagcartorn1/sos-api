var {mongoose} = require('.././db/mongoose');

var Topic = mongoose.model('Topic',{
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

module.exports = {Topic}