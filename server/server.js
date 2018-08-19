var express = require('express');
var bodyParser = require('body-parser');
const SocketIO = require('socket.io');
const http = require('http');
const router = require('./router/router');
var {mongoose} = require('./db/mongoose');

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


server.listen(port, () => {
    console.log("server start on port ", port);
});

module.exports  = server;


