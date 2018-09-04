var express = require('express')
var clientEndCall = express.Router()
var { User } = require('../../models/user');
var { Room } = require('../../models/room');
var { sendSignal } = require('../../openTox/opentox')

clientEndCall.post('/client/endCall', (req, res) => {

    var userId = req.body.userId;
    var roomId = req.body.roomId

    Room.findById(roomId).then((selectedRoom) => {


        if (userId != selectedRoom.clientId) {

            res.send({
                status: 400,
                data: null,
                message: "Not found userId in this room , Please check your userId",
                error: e
            });
        }
        else {

            // Found user in this room 
            // update room status
            selectedRoom.dateTimeEnd = new Date();
            selectedRoom.endBy = "C";
            selectedRoom.activeStatus = false;

            selectedRoom.save().then((r) => {

                // Send signal
                var signalPayload = { "type": "clientEndCall", "data": "clientEndCall" }
                sendSignal(signalPayload, selectedRoom.sessionId, (result, err) => {

                    if (result) {

                        res.send({
                            status: response.status,
                            data: doc,
                            message: "end call success",
                            error: null
                        })
                    }
                    else {

                        res.send({
                            status: err.response.status,
                            data: null,
                            message: 'Exception error, please check error filed',
                            error: err.response.data
                        })
                    }

                });



            }, (e) => {

                res.send({
                    status: 400,
                    data: null,
                    message: 'Exception error, please check error filed',
                    error: e
                })
            });











        }




    }).catch((e) => {

        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });

    })



})

module.exports = clientEndCall;
