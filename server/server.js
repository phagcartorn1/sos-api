var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {user} = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.get('/login',(req,res)=>{

    var userName = req.userName;
    var password = req.password;

    res.send({status:"ok"});

});



app.listen(port,()=>{

    console.log("server start on port ",port);

});
