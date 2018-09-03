var {mongoose} = require('.././db/mongoose');

var Room = mongoose.model('Room',{
    agentId:{
        type:String,
        required:false,
        trim:true,
        minlenght:1
    },
    clientId:{
        type:String,
        required:true,
        trim:true,
        minlenght:1
    },
    dateTimeStart:{
        type:Date,
        required:true,
        trim:true,
        minlenght:1
    },
    dateTimeEnd:{
        type:Date,
        required:false,
        trim:true,
        minlenght:1
    },
    endBy:{
        type:String,
        required:false,
        trim:true,
        minlenght:1
    },
    activeStatus:{
        type:Boolean,
        required:true
    },
    rate:{
        type:Number
   },
   sessionId:{
    type:String,
    required:false,
    trim:true,
    minlenght:1
   },
   token:{
    type:String,
    required:false,
    trim:true,
    minlenght:1
   }

});

module.exports = {Room}