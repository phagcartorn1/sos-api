var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { opentok } = require('./openTox/opentox');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());


app.post('/createUser', (req, res) => {

    var userName = req.body.userName;
    var password = req.body.password;
    var type = req.body.type;


    User.find({ userName: userName, password: password }).then((u) => {


        if (u.length == 0) {

            // can add
            var newUser = new User({
                userName: userName,
                password, password,
                type: type,
                onlineStatus: false
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

})

app.post('/login', (req, res) => {

    var userName = req.body.userName;
    var password = req.body.password;


    User.find({ userName: userName, password: password }).then((u) => {


        if (u.length > 0) {
            var xUser = u[0];
            res.status(200).send({
                status: 200,
                data: {
                    onlineStatus: xUser.onlineStatus,
                    _id: xUser._id,
                    type: xUser.type
                },
                message: "Login success !",
                error: null
            });
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

    User.findById(userID).then((u) => {

        if(u == null){
            res.status(400).send({
                stauts: '400',
                data: null,
                message: 'userid not found, please check your userid or login again',
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
                res.status(200).send({
                    stauts: '200',
                    data: { token: toxToken, sessionID: session.sessionId },
                    message: 'open tox generate token success',
                    error: null
                })
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






app.listen(port, () => {

    console.log("server start on port ", port);

});
