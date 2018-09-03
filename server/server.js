var express = require('express');
var bodyParser = require('body-parser');
const SocketIO = require('socket.io');
const http = require('http');
const router = require('./router/router');
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
app.use('/', router);

// Create web socket
var server = http.createServer(app);
var io = SocketIO(server);

app.post('/client/joinRoom', (req, res) => {

    var userId = req.body.userId;
    var roomId = req.body.roomId;



    User.findById(userId).then((result) => {

        if (result == null) {

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
                    console.log('4');

                    // not found room
                    res.send({
                        status: 400,
                        data: null,
                        message: 'Room not found, Please check roomId',
                        error: null
                    });
                }
                else {
                    r.clientId = userId
                    r.save().then((result) => {

                        res.send({
                            status: 200,
                            data: null,
                            message: "Join room success",
                            error: null
                        });


                        // Call to agent   
                        io.emit('call', {
                            token: r.token,
                            sessionId: r.sessionId,
                            message: 'In coming call form client',
                            roomId: r._id
                        });


                    }, (e) => {
                        console.log('3');


                        res.send({
                            status: 400,
                            data: null,
                            message: "Exception error, please check error filed",
                            error: e
                        });

                    })
                }

            }).catch((e) => {
                console.log('2');

                res.send({
                    status: 400,
                    data: null,
                    message: "Exception error, please check error filed",
                    error: e
                });


            })


        }

    },(e)=>{


        console.log('1');
        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });


    } )

});



server.listen(port, () => {
    console.log("server start on port ", port);
});



module.exports = server;


