var express = require('express');
var joinRoom = express.Router();

// Model
var  {user}  = require('../.././models/user')
var  {room} = require('../../models/room');


joinRoom.post('/client/joinRoom',()=>{

    var userId = req.body.userId;
    var roomId = req.body.roomId;


    user.findByID(userId).then((result) => {

        if (a == null) {

            res.send({
                status: 400,
                data: null,
                message: 'User id not found, Please check userID',
                error: null
            });
        }
        else
        {

            room.findByID(roomId).then((r)=>{

                if (r == null) {
                    // not found room
                    res.send({
                        status: 400,
                        data: null,
                        message: 'Room not found, Please check roomId',
                        error: null
                    });
                 }
                 else
                 {
                     r.clientId = userId
                     r.save().then((result)=>{

                        res.send({
                            status: 200,
                            data: null,
                            message: "Join room success",
                            error: null
                        });

                           
                        io.emit('call', {
                            token: toxToken,
                            sessionId: session.sessionId,
                            message: 'In coming call form client',
                            roomId: d._id
                        });



                         
                     },(e)=>{

                        res.send({
                            status: 400,
                            data: null,
                            message: "Exception error, please check error filed",
                            error: e
                        });

                     })
                 }

            }).catch((err)=>{

                res.send({
                    status: 400,
                    data: null,
                    message: "Exception error, please check error filed",
                    error: e
                });
                

            })


        }
   
    }).catch((err) => {

        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });
        
    });

});
