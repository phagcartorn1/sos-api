var express = require('express');
var bodyParser = require('body-parser');
const SocketIO = require('socket.io');
const http = require('http');
var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
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

    console.log("crated name  : ", name);


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

                res.status(200).send({
                    status: 200,
                    data: doc,
                    message: "Create new user success",
                    error: null
                });


            }, (e) => {

                res.status(400).send({
                    status: 400,
                    data: null,
                    message: "Exception error, please check error filed",
                    error: e
                });

            })


        }
        else {
            res.status(400).send({
                status: 400,
                data: null,
                message: "This username already exits, Please try another userName",
                error: null
            });


        }

    }, (e) => {


        res.status(400).send({
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

                res.status(200).send({
                    status: 200,
                    data: {
                        onlineStatus: doc.onlineStatus,
                        _id: doc._id,
                        type: doc.type,
                        name: doc.name,
                        socketName: listenSocket
                    },
                    message: "Login success !!",
                    error: null
                });



            }, (e) => {


                res.status(400).send({
                    status: 400,
                    data: null,
                    message: "can not update status , please check the error ",
                    error: e
                });

            })


        }
        else {
            res.status(400).send({
                status: 400,
                data: null,
                message: "User not found! , Please check userName or password",
                error: null
            });


        }

    }, (e) => {

        console.log('failed :', e);

        res.status(400).send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });

    })


});

app.post('/call', (req, res) => {

    var userID = req.body.userID;
    var topicId = req.body.topicId;
    var languageId = req.body.languageId;

    User.findById(userID).then((u) => {

        if (u == null) {
            res.status(400).send({
                stauts: '400',
                data: null,
                message: 'userid not found, please check your userid or login again',
                error: null
            });
            return;
        }

        if (u.type == "A") {
            res.status(400).send({
                stauts: '400',
                data: null,
                message: 'user type A (Agent) can not call , Please check user type must be C (Client)',
                error: null
            });
            return;
        }


        opentok.createSession((err, session) => {

            if (err) {
                res.status(400).send({
                    stauts: '400',
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
                        // 2 open socket
                        io.emit('call', {
                            token: toxToken,
                            sessionID: session.sessionId,
                            message: 'In coming call form client'
                        });

                        res.status(200).send({
                            stauts: '200',
                            data: { token: toxToken, sessionID: session.sessionId },
                            message: 'open tox generate token success',
                            error: null
                        })

                    }
                    else {


                        // No agent avaliable
                        res.status(400).send({
                            status: 400,
                            data: null,
                            message: "No agent avaliable or match with your options , Please try other topic and language",
                            error: null
                        });

                    }


                }, (e) => {
                    res.status(400).send({
                        status: 400,
                        data: null,
                        message: "Exception error, please check error filed",
                        error: e
                    });

                });


            }

        });

    }, (e) => {

        res.status(400).send({
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


