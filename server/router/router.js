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


// client api
router.post('/login',require('./post/login'));
router.post('/client/call',require('./post/call'));
router.post('/client/setRate',require('./post/setRate'));

// agent api
router.post('/agent/setOnlineStatus',require('./post/setOnlineStatus'));
router.post('/agent/receiveCall',require('./post/receiveCall'));

// for create dummy data
router.post('/createData',require('./post/createData'));




module.exports = router;


