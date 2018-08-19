var express = require('express')
var setRate = express.Router()
var {Room} = require('../../models/room');


setRate.post('/client/setRate',(req,res)=>{

    var userID = req.body.userId;
    var rate = req.body.rate;
    var roomId = req.body.roomId; 

    Room.findById(roomId).then((d)=>{

        // not found room


        if(d == null)
        {

            res.send({
                status: 400,
                data: null,
                message: "Not found roomId, Please check roomId",
                error: null
            });
            return;
        }



        if(d.clientId == userID){
            
            d.rate = rate
            d.save().then((savedRoom)=>{


                res.send({
                    status: 200,
                    data: savedRoom,
                    message: `Set rate success , now room 's rate is ${savedRoom.rate}`,
                    error: null
                });

            },(e)=>{

                res.send({
                    status: 400,
                    data: null,
                    message: "Exception error, please check error filed",
                    error: e
                });
            });
        }
        else
        {
            res.send({
                status: 400,
                data: null,
                message: 'Userid not found in this room, Please check userID',
                error: null
            });

        }



    },(e)=>{

        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });
    });
});


module.exports = setRate;