var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {user} = require('./models/user');
//var {opentox} = require('./openTox/opentox');

var OpenTok = require('opentok');
const apiKey = '46165962';
const apiSecret = '29949ed67984643123a5223cabd47a8fb90e36ff';
var opentok = new OpenTok(apiKey, apiSecret);

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.get('/login',(req,res)=>{

    var userName = req.userName;
    var password = req.password;

    res.send({status:"ok"});

});


app.post('/call',(req,res)=>{
    

    
    
    opentok.createSession((err, session)=>{

        if(err){
            res.status(400).send({
                stauts : '400',
                data : null,
                message: 'open tox can not generate session',
                error : err
            })
        }
        else
        {
            var toxToken = session.generateToken();
            res.status(200).send({
                stauts : '200',
                data : {token:toxToken,sessionID:session.sessionId},
                message: 'open tox generate token success',
                error : null
            })
        }


    });



});






app.listen(port,()=>{

    console.log("server start on port ",port);

});
