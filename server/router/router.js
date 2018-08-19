// var { User } = require('.././models/user');
// var { Room } = require('.././models/room');
// var { opentok } = require('.././openTox/opentox');
var express = require('express')
var router = express.Router()

// router.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
// });

// authen middele ware ใช้แค่บางตัว

router.get("/", (req, res) => {
    res.send("Connected to toxbox POC");
});

router.post('/login',require('./post/login'));
router.post('/client/call',require('./post/call'));
router.post('/agent/setOnlineStatus',require('./post/setOnlineStatus'));
router.post('/agent/receiveCall',require('./post/reciveCall'));
router.post('/client/setRate',require('./post/setRate'));
// for create dummy data
router.post('/createData',require('./post/createData'));




module.exports = router;


