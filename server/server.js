var express = require('express');
var bodyParser = require('body-parser');
const SocketIO = require('socket.io');
const http = require('http');
var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Room } = require('./models/room');
var { opentok } = require('./openTox/opentox');

const port = process.env.PORT || 3000;

var app = express();
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);
app.use(bodyParser.json());

app.use(express.static(__dirname));

var server = http.createServer(app);
var io = SocketIO(server);


app.get("/", (req, res) => {

    res.send("ok");

});

app.post('/createUser', (req, res) => {

    var userName = req.body.userName;
    var password = req.body.password;
    var type = req.body.type;
    var name = req.body.name;


    User.find({ userName: userName, password: password }).then((u) => {


        if (u.length == 0) {

            // can add
            var newUser = new User({
                userName: userName,
                password, password,
                type: type,
                onlineStatus: false,
                name: name
            })

            newUser.save().then((doc) => {

                res.send({
                    status: 200,
                    data: doc,
                    message: "Create new user success",
                    error: null
                });


            }, (e) => {

                res.send({
                    status: 400,
                    data: null,
                    message: "Exception error, please check error filed",
                    error: e
                });

            })


        }
        else {
            res.send({
                status: 400,
                data: null,
                message: "This username already exits, Please try another userName",
                error: null
            });


        }

    }, (e) => {


        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });

    })

});

app.post('/login', (req, res) => {

    var userName = req.body.username;
    var password = req.body.password;


    User.find({ userName: userName, password: password }).then((u) => {


        if (u.length > 0) {
            var xUser = u[0];

            // update online statue : true
            xUser.onlineStatus = true;
            var listenSocket = "call";
            if (xUser.type == "C") {
                listenSocket = null;
            }
            xUser.save().then((doc) => {

                res.send({
                    status: 200,
                    data: {
                        onlineStatus: doc.onlineStatus,
                        _id: doc._id,
                        type: doc.type,
                        name: doc.name,
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        socketName: listenSocket
                    },
                    message: "Login success !!",
                    error: null
                });



            }, (e) => {


                res.send({
                    status: 400,
                    data: null,
                    message: "can not update status , please check the error ",
                    error: e
                });

            })


        }
        else {
            res.send({
                status: 400,
                data: null,
                message: "User not found! , Please check userName or password",
                error: null
            });


        }

    }, (e) => {

        console.log('failed :', e);

        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });

    })


});

app.post('/client/call', (req, res) => {

    var userID = req.body.userId;
    var topicId = req.body.topicId;
    var languageId = req.body.languageId;

    User.findById(userID).then((u) => {

        if (u == null) {
            res.send({
                status: 400,
                data: null,
                message: 'userid not found, please check your userid or login again',
                error: null
            });
            return;
        }

        if (u.type == "A") {
            res.send({
                status: 400,
                data: null,
                message: 'user type A (Agent) can not call , Please check user type must be C (Client)',
                error: null
            });
            return;
        }


        opentok.createSession((err, session) => {

            if (err) {
                res.send({
                    status: 400,
                    data: null,
                    message: 'open tox can not generate session',
                    error: err
                })
            }
            else {

                var toxToken = session.generateToken();

                // Todo 
                // 1 find agent to call match with topic and language
                User.find({ languageId: languageId, topicId: topicId }).then((agents) => {

                    // Found the agent 
                    if (agents.length > 0) {


                        // 2 create room 
                        var agent = agents[0];
                        var room = new Room({
                            agentId: null,
                            clientId: userID,
                            dateTimeStart: new Date(),
                            dateTimeEnd: null,
                            endBy: null,
                            activeStatus: true
                        })

                        room.save().then((d) => {


                            // 3 open socket
                            io.emit('call', {
                                token: toxToken,
                                sessionID: session.sessionId,
                                message: 'In coming call form client',
                                roomId: d._id
                            });


                            res.send({
                                status: 200,
                                data: { token: toxToken, sessionID: session.sessionId },
                                message: 'open tox generate token success',
                                error: null
                            })


                        }, (e) => {

                            res.send({
                                status: 400,
                                data: null,
                                message: "Can not create room , Please check the error",
                                error: e
                            });

                        })


                    }
                    else {


                        // No agent avaliable
                        res.send({
                            status: 400,
                            data: null,
                            message: "No agent avaliable or match with your options , Please try other topic and language",
                            error: null
                        });

                    }


                }, (e) => {
                    res.send({
                        status: 400,
                        data: null,
                        message: "Exception error, please check error filed",
                        error: e
                    });

                });


            }

        });

    }, (e) => {

        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });

    })

});

app.post('/agent/setOnlineStatus', (req, res) => {
    var userID = req.body.userId;
    var onlineStatus = req.body.onlineStatus;

    // Todo
    // check onlinestatus != null user Schemar 

    User.findById(userID).then((u) => {

        if (u == null) {
            res.send({
                status: 400,
                data: null,
                message: 'userid not found, please check your userid or login again',
                error: null
            });
            return;
        }
        if (u.type == 'C') {
            res.send({
                status: 400,
                data: null,
                message: 'User type C (Client) can not update online status, please check your type must be A(Agent)',
                error: null
            });
            return;

        }




        u.onlineStatus = onlineStatus;
        u.save().then((doc) => {
            res.send({
                status: 200,
                data: {
                    onlineStatus: doc.onlineStatus,
                    _id: doc._id,
                    type: doc.type,
                    name: doc.name,
                    firstName: doc.firstName,
                    lastName: doc.lastName,
                },
                message: `Set online status success, now your status is ${onlineStatus} `,
                error: null
            });

        }, (e) => {

            res.send({
                status: 400,
                data: null,
                message: "Exception error, please check error filed",
                error: e
            });

        });



    }, (e) => {

        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });

    })


});

app.post('/agent/reciveCall', (req, res) => {

    var userID = req.body.userId;
    var recive = req.body.recive;
    var roomId = req.body.roomId;

    // find agent if not found return error

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

                if (recive == false) {
                    // Decline
                    r.dateTimeEnd = new Date();
                    r.endBy = 'A';
                    r.activeStatus = false;
                }
                else
                {
                   // Recive
                   r.dateTimeEnd = null;
                   r.endBy = null;
                   r.activeStatus = true;
                }


                r.save().then((doc) => {


                    var message = 'Recive call success'
                    if (recive == false) {
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

app.post('/client/setRate',(req,res)=>{



    
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




server.listen(port, () => {
    console.log("server start on port ", port);
});


