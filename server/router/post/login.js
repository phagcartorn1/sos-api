var express = require('express')
var login = express.Router()
var  {User}  = require('../.././models/user')

login.post('/login', (req, res) => {

    var userName = req.body.username;
    var password = req.body.password;
    User.find({userName:userName,password:password }).then((u) => {

        if (u.length > 0) {
            var xUser = u[0];

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
        res.send({
            status: 400,
            data: null,
            message: "Exception error, please check error filed",
            error: e
        });
    })


});

module.exports = login;
