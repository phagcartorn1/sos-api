var express = require('express')
const jwt = require('jsonwebtoken')
const axios = require('axios')


var receiveCall = express.Router()
var {User} = require('../../models/user');
var {Room} = require('../../models/room');



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

                    // Signal
                    var today = Math.floor(Date.now() / 1000);
                    var tomorow = Math.floor(Date.now() / 1000) +    (60 * 60);
                    var API_KEY = '46165962';
                    var SESSION_ID = r.sessionId;
                    var API_SECRET = '29949ed67984643123a5223cabd47a8fb90e36ff'
                
                    
                   // Generate token toxbox here 
                   var data = { "iss": API_KEY,
                                "ist": 'account',
                                "iat": today,
                                "exp": tomorow,
                                "jti": "jwt_nonce"};
                   var token = jwt.sign(data,'tox');


                   // Signal
                   axios.post(`https://api.opentok.com/v2/project/${API_KEY}/session/${SESSION_ID}/signal`,
                   {
                    SESSION_ID:SESSION_ID,
                    API_KEY:API_KEY,
                    API_SECRET:API_SECRET,
                    DATA:'{"type":"agentAccepted"}'
                    
                   },{ headers: {'X-TB-PARTNER-AUTH': API_KEY + ":" + API_SECRET  ,'Content-Type':'application/json'}}).then((response)=>{
                
                         console.log('signal success')


                        res.send({
                            status: 200,
                            data: doc,
                            message: message,
                            error: null
                        })

                   }).catch((e)=>{


                    res.send({
                        status: e.response.status,
                        data: null,
                        message: 'Exception error, please check error filed',
                        error: e.response.data
                    })

                    
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