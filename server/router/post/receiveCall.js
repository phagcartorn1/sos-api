var express = require('express')
var receiveCall = express.Router()
var {User} = require('../../models/user');
var {Room} = require('../../models/room');

console.log('hey');

receiveCall.post('/agent/receiveCall', (req, res) => {
    


    var userID = req.body.userId;
    var receive = req.body.receive;
    var roomId = req.body.roomId;

    User.findById(userID).then((a) => {


        if (a == null) {

            res.send({
                status: 400,
                data: null,
                message: 'User id not found, Please check userID',
                error: null
            });
        }
        else {


            Room.findById(roomId).then((r) => {

                if (r == null) {
                    // not found room
                    res.send({
                        status: 400,
                        data: null,
                        message: 'Room not found, Please check roomId',
                        error: null
                    });
                }

                r.agentId = userID

                if (receive == false) {
                    // Decline
                    r.dateTimeEnd = new Date();
                    r.endBy = 'A';
                    r.activeStatus = false;
                }
                else
                {
                   // receive
                   r.dateTimeEnd = null;
                   r.endBy = null;
                   r.activeStatus = true;
                }


                r.save().then((doc) => {


                    var message = 'receive call success'
                    if (receive == false) {
                        message = 'Decline call success'
                    }


                    res.send({
                        status: 200,
                        data: doc,
                        message: message,
                        error: null
                    })



                }, (e) => {

                    res.send({
                        status: 400,
                        data: null,
                        message: "Exception error, please check error filed",
                        error: e
                    });

                })


            }, (e) => {
                res.send({
                    status: 400,
                    data: null,
                    message: "Exception error, please check error filed",
                    error: e
                });

            })
        }


    }, (e) => {

        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });
    });
});

module.exports = receiveCall;