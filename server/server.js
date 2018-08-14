var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {user} = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/login',(req,res)=>{

    var userName = req.userName;
    var password = req.password;

});



app.listen(port,()=>{

    console.log("server start on port ",port);

});
