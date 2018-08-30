var express = require('express');
var bodyParser = require('body-parser');
const SocketIO = require('socket.io');
const http = require('http');
const router = require('./router/router');
var {User} = require('./models/user');
var {Room} = require('./models/room');
var {opentok} = require('./openTox/opentox');

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
app.use('/', router);

// Create web socket
var server = http.createServer(app);
var io = SocketIO(server);


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
                            activeStatus: true,
                            sessionId:session.sessionId
                        })

                        room.save().then((d) => {
                            // 3 open socket
                            io.emit('call', {
                                token: toxToken,
                                sessionId: session.sessionId,
                                message: 'In coming call form client',
                                roomId: d._id
                            });

                            res.send({
                                status: 200,
                                data: { token: toxToken, sessionId: session.sessionId ,roomId:d.id},
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


server.listen(port, () => {
    console.log("server start on port ", port);
});



module.exports  = server;


