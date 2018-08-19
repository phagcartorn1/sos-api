var express = require('express')
var setOnlineStatus = express.Router()
var {User} = require('../../models/user');


setOnlineStatus.post('/agent/setOnlineStatus', (req, res) => {
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

module.exports = setOnlineStatus;